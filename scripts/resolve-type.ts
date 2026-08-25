/**
 * CLI: print the fully-expanded TypeScript type of one or more named exports.
 *
 * Usage:
 *   bun scripts/resolve-type.ts <import-path> <export-name>...
 *   bun scripts/resolve-type.ts <import-path> <name> <import-path> <name> ...
 *
 * Examples:
 *   bun scripts/resolve-type.ts sandstone MCFunction sandstone say
 *   bun scripts/resolve-type.ts sandstone/arguments TimeArgument
 *
 * Each pair adds a line. Multiple symbols in one invocation share a single
 * LSP session (one `tsc --lsp --stdio` subprocess) via a single
 * `getHoverEnv` call; the subprocess is disposed before the CLI exits.
 */

import { getHoverEnv, ensureTarball, resolvePackageRoot, type HoverEnv } from './resolve-type-lib'

const main = async () => {
  const args = process.argv.slice(2)
  if (args.length < 2 || args[0] === '--help' || args[0] === '-h') {
    console.error(
      `Usage: bun scripts/resolve-type.ts <import-path> <export-name> [<import-path> <export-name> ...]`,
    )
    process.exit(args.length === 0 ? 1 : 0)
  }

  // Strip --tsconfig pairs up front.
  const pairs: { importPath: string; name: string }[] = []
  let tsconfigPath: string | undefined
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tsconfig') {
      tsconfigPath = args[i + 1]
      i++
      continue
    }
    const importPath = args[i]
    const name = args[i + 1]
    if (!importPath || !name) {
      console.error(`Incomplete pair at argument ${i}. Need <import-path> <export-name>.`)
      process.exit(1)
    }
    pairs.push({ importPath, name })
    i++
  }
  if (pairs.length === 0) {
    console.error('No symbol pairs provided.')
    process.exit(1)
  }

  // Resolve all pairs through a single HoverEnv (one LSP subprocess). The
  // first pair's `importPath` decides which package gets tarballed + staged;
  // subsequent pairs for subpaths of the same package reuse it.
  const firstImport = pairs[0].importPath
  const packageRoot = resolvePackageRoot(firstImport)
  if (!packageRoot) {
    console.error(`Cannot resolve package root for "${firstImport}"`)
    process.exit(1)
  }
  const resolved = await ensureTarball(packageRoot)
  const tsconfig = tsconfigPath ?? '__default__'
  let env: HoverEnv | null = null
  try {
    env = await getHoverEnv({ resolved, tsconfigPath: tsconfig })
    for (const { importPath, name } of pairs) {
      try {
        const formatted = await env.resolve(importPath, name)
        const label = `${importPath}#${name}`
        process.stdout.write(`${label}\n  ${formatted.replace(/\n/g, '\n  ')}\n`)
      } catch (err) {
        const label = `${importPath}#${name}`
        process.stdout.write(
          `${label}\n  ERROR: ${err instanceof Error ? err.message : String(err)}\n`,
        )
      }
    }
  } finally {
    // Dispose the LSP subprocess — without this, the child keeps the event
    // loop alive after `main()` resolves.
    if (env) await env.session.dispose()
  }
}

try {
  await main()
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
}