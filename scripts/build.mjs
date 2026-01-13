// @ts-check
import { $ } from 'bun'
import { mkdir } from 'fs/promises'

// Ensure dist exists (don't clean - allows incremental builds)
await mkdir('dist', { recursive: true })

// Subpath entry points
const subEntries = [
  'src/arguments/index.ts',
  'src/commands/index.ts',
  'src/core/index.ts',
  'src/flow/index.ts',
  'src/pack/index.ts',
  'src/variables/index.ts',
]

// Build ESM with splitting for shared chunks
console.log('Building ESM with splitting...')
const esmResult = await Bun.build({
  entrypoints: subEntries,
  outdir: 'dist',
  target: 'node',
  format: 'esm',
  splitting: true,
  root: 'src',
  naming: {
    entry: '[dir]/[name].mjs',
    chunk: '[name]-[hash].mjs',
  },
  minify: false,
})
process.exit(0)
if (!esmResult.success) {
  console.error('ESM build failed:', esmResult.logs)
  process.exit(1)
}

// Build CJS
console.log('Building CJS...')
const cjsResult = await Bun.build({
  entrypoints: subEntries,
  outdir: 'dist',
  target: 'node',
  format: 'cjs',
  root: 'src',
  naming: {
    entry: '[dir]/[name].cjs',
    chunk: '[name]-[hash].cjs',
  },
})

if (!cjsResult.success) {
  console.error('CJS build failed:', cjsResult.logs)
  process.exit(1)
}

// Main entry (bundles everything for single import convenience)
console.log('Building main entries...')
const [mainEsm, mainCjs] = await Promise.all([
  Bun.build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    target: 'node',
    format: 'esm',
    naming: '[name].mjs',
  }),
  Bun.build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    target: 'node',
    format: 'cjs',
    naming: '[name].cjs',
  }),
])

if (!mainEsm.success || !mainCjs.success) {
  console.error('Main entry build failed')
  process.exit(1)
}

// Generate declarations with tsgo (fast, incremental) + fix imports for nodenext compatibility
console.log('Generating declarations...')
await $`npx tsgo --emitDeclarationOnly --declaration --outDir dist --project tsconfig.build.json --incremental --tsBuildInfoFile dist/.tsbuildinfo`

console.log('Fixing .d.ts imports for nodenext...')
await $`node scripts/fix-dts-imports.mjs dist`

console.log('Running setup...')
await $`node scripts/setupPackage.mjs`

console.log('✔ Build complete')
