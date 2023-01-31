import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*{.ts,.json}'],
  bundle: false,
  sourcemap: true,
  format: ['cjs'],
  dts: false,
  outDir: 'dist',
  platform: 'node',
  target: 'ES2019',
  tsconfig: './tsconfig.json',
  silent: true,
  splitting: false,
})