/**
 * Recursive `.d.ts` copy: walks the `types/` tree, copies each file into
 * `dist/_internal/types/` while running the per-file transforms
 * (sibling-specifier rewrite + inline-import rewrite + import-grouping).
 */
import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

import { fixDtsImports } from '../fix-dts-imports'

import { rewriteSiblingSpecifiers } from './sibling-specifiers'
import { rewriteInlineImports } from './inline-imports'
import { groupImportsForSibling, printImportDeclarations } from './import-grouping'
import { rewriteSourcePathsInMap, shiftMappingsByLines } from './source-maps'

const { join, dirname } = path

export async function copyDtsFiles(
  srcDir: string,
  destDir: string,
  rootSrcDir: string,
  rootDestDir: string,
  indexDirs: Set<string>,
): Promise<void> {
  const entries = await readdir(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name)
    const destPath = join(destDir, entry.name)

    if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true })
      await copyDtsFiles(srcPath, destPath, rootSrcDir, rootDestDir, indexDirs)
      continue
    }

    if (!entry.name.endsWith('.d.ts')) continue
    if (entry.name === 'sandstone.d.ts') continue // merged into the main index
    if (entry.name.endsWith('.d.ts.map')) continue

    const content = await readFile(srcPath, 'utf8')
    const fixed = fixDtsImports(content, dirname(destPath), rootDestDir, indexDirs)
    const rewrittenSpecifiers = rewriteSiblingSpecifiers(fixed.content, destPath)
    const collected = new Set<{ name: string; module: string }>()
    const rewritten = rewriteInlineImports(rewrittenSpecifiers, collected)
    const importStmts = printImportDeclarations(
      groupImportsForSibling(collected, dirname(destPath)),
    )
    const withImports = importStmts + rewritten

    // Copy the source map, shifting mappings by however many lines we
    // added/removed relative to the original `.d.ts`. The original map
    // was produced by `tsc` against the un-transformed file, so without
    // this shift every declaration would resolve `lineDelta` lines below
    // its real position in the source.
    const lineShift = withImports.split('\n').length - content.split('\n').length
    try {
      const mapContent = await readFile(srcPath + '.map', 'utf8')
      const pathShifted = rewriteSourcePathsInMap(mapContent)
      const lineShifted = shiftMappingsByLines(pathShifted, lineShift)
      await writeFile(destPath + '.map', lineShifted)
    } catch {
      // No source map
    }

    await writeFile(destPath, withImports)
  }
}