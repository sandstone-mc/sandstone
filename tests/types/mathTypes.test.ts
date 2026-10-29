import { expect, test } from 'bun:test'
import fs from 'node:fs'
import path from 'node:path'
import ts from '@typescript/typescript6'

const root = path.resolve(import.meta.dir, '..', '..')
const mathSource = path.join(root, 'src', 'flow', 'math', 'ast', 'MathFunction.ts')
const mathDeclaration = path.join(
  root,
  'dist',
  '_internal',
  'types',
  'flow',
  'math',
  'ast',
  'MathFunction.d.ts',
)
const declarationEntry = path.join(root, 'dist', 'exports', 'index.d.ts')

const assertBuiltDeclarationsAreCurrent = () => {
  if (!fs.existsSync(declarationEntry) || !fs.existsSync(mathDeclaration)) {
    throw new Error('Built declarations are missing. Run `bun dev:build --silent` first.')
  }

  if (fs.statSync(mathDeclaration).mtimeMs < fs.statSync(mathSource).mtimeMs) {
    throw new Error('Built MathFunction declarations are stale. Run `bun dev:build --silent` first.')
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

test('Math.toProvider only exists on singleton math blocks', () => {
  assertBuiltDeclarationsAreCurrent()
  const fixture = path.join(import.meta.dir, 'mathTypes.fixture.ts')
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
