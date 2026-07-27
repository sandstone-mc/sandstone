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
 * Each pair adds a line. Multiple symbols in one invocation reuse a single
 * tarball install; separate CLI runs re-tarball whenever tracked content
 * has changed since the last build (detected via git fingerprint).
 */

import { resolveSymbol } from './resolve-type-lib'

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

  for (const { importPath, name } of pairs) {
    try {
      const formatted = await resolveSymbol(importPath, name, { tsconfigPath })
      const label = `${importPath}#${name}`
      process.stdout.write(`${label}\n  ${formatted.replace(/\n/g, '\n  ')}\n`)
    } catch (err) {
      const label = `${importPath}#${name}`
      process.stdout.write(
        `${label}\n  ERROR: ${err instanceof Error ? err.message : String(err)}\n`,
      )
    }
  }
}

try {
  await main()
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
}