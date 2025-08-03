import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  bundle: false,
  sourcemap: true,
  format: ['cjs', 'esm'],
  outExtension: ({ format }) => {
    if (format === 'cjs') {
      return { js: '.cjs' }
    } else if (format === 'esm') {
      return { js: '.mjs' }
    }
    return { js: '.js' }
  },
  dts: true,
  clean: true,
  outDir: 'dist',
  platform: 'node',
  target: 'ESNext',
  tsconfig: './tsconfig.json',
  silent: true,
  splitting: false,
})