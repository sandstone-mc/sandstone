import { expect, test } from 'bun:test'
import fs from 'node:fs'
import path from 'node:path'
import ts from '@typescript/typescript6'

const root = path.resolve(import.meta.dir, '..', '..')
const selectorSource = path.join(root, 'src', 'variables', 'Selector.ts')
const selectorDeclaration = path.join(
  root,
  'dist',
  '_internal',
  'types',
  'variables',
  'Selector.d.ts',
)
const declarationEntry = path.join(root, 'dist', 'exports', 'index.d.ts')

const assertBuiltDeclarationsAreCurrent = () => {
  if (!fs.existsSync(declarationEntry) || !fs.existsSync(selectorDeclaration)) {
    throw new Error('Built declarations are missing. Run `bun dev:build --silent` first.')
  }

  if (fs.statSync(selectorDeclaration).mtimeMs < fs.statSync(selectorSource).mtimeMs) {
    throw new Error('Built Selector declarations are stale. Run `bun dev:build --silent` first.')
  }
}

const createProgram = (fixture: string, strictFunctionTypes: boolean) => ts.createProgram({
  rootNames: [fixture],
  options: {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    strictFunctionTypes,
    noEmit: true,
    skipLibCheck: true,
    types: [],
  },
})

const formatDiagnostics = (program: ts.Program) => ts.formatDiagnosticsWithColorAndContext(
  ts.getPreEmitDiagnostics(program),
  {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  },
)

test('Selector overloads preserve their public type shapes', () => {
  assertBuiltDeclarationsAreCurrent()
  const fixture = path.join(import.meta.dir, 'selectorTypes.fixture.ts')
  const failures = [true, false].flatMap((strictFunctionTypes) => {
    const program = createProgram(fixture, strictFunctionTypes)
    return ts.getPreEmitDiagnostics(program).map(
      (diagnostic) => ({ diagnostic, strictFunctionTypes }),
    )
  })

  expect(
    failures.map(({ diagnostic, strictFunctionTypes }) => (
      `strictFunctionTypes=${strictFunctionTypes}\n`
        + ts.formatDiagnosticsWithColorAndContext([diagnostic], {
          getCanonicalFileName: (fileName) => fileName,
          getCurrentDirectory: () => process.cwd(),
          getNewLine: () => '\n',
        })
    )).join('\n'),
  ).toBe('')
}, 30_000)

test('Selector type checking avoids recursively expanding the entity graph', () => {
  assertBuiltDeclarationsAreCurrent()
  const fixture = path.join(import.meta.dir, 'selectorPerformance.fixture.ts')
  const program = createProgram(fixture, true)

  expect(formatDiagnostics(program)).toBe('')

  // TS 6 currently needs fewer than 500 instantiations; without the explicit
  // covariance it needs more than 470,000. Keep ample toolchain headroom.
  const programWithCounters = program as ts.Program & {
    getInstantiationCount: () => number
  }
  expect(programWithCounters.getInstantiationCount()).toBeLessThan(10_000)
}, 30_000)
