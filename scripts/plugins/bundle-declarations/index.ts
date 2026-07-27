/**
 * Entry point for the `bundleDeclarations` build step.
 *
 * Copies `types/*.d.ts` into `dist/_internal/types/` (with imports
 * rewritten so the bundle has no self-references and every relative
 * path resolves without relying on bundler resolution), then generates
 * `dist/_internal/index.d.ts` from `types/sandstone.d.ts`.
 */

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

import { copyDtsFiles } from './copy'
import { findIndexDirs } from './walk'
import { generateMainIndexDts } from './generate-main'
import { generateMainIndexMap } from './source-maps'

const { join } = path

export async function bundleDeclarations(
  typesDir: string,
  distDir: string,
  srcDir: string,
): Promise<void> {
  const indexDirs = await findIndexDirs(srcDir)
  const bundleDir = join(distDir, '_internal')
  const typesDestDir = join(bundleDir, 'types')

  await mkdir(typesDestDir, { recursive: true })
  await copyDtsFiles(typesDir, typesDestDir, typesDir, bundleDir, indexDirs)

  await writeFile(
    join(typesDestDir, 'package.json'),
    JSON.stringify({ private: true }, null, 2),
  )

  const mainIndexContent = await generateMainIndexDts(typesDir, bundleDir, indexDirs)
  await writeFile(join(bundleDir, 'index.d.ts'), mainIndexContent)

  const map = await generateMainIndexMap(
    join(bundleDir, 'index.d.ts'),
    join(srcDir, 'sandstone.ts'),
    '../../src/sandstone.ts',
  )
  await writeFile(join(bundleDir, 'index.d.ts.map'), map)
}