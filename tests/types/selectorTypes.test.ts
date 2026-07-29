import { expect, test } from 'bun:test'
import path from 'node:path'
import ts from 'typescript'

test('Selector overloads preserve their public type shapes', () => {
  const fixture = path.join(import.meta.dir, 'selectorTypes.fixture.ts')
  const failures = [true, false].flatMap((strictFunctionTypes) => {
    const program = ts.createProgram({
      rootNames: [fixture],
      options: {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        strict: true,
        strictFunctionTypes,
        noEmit: true,
        skipLibCheck: true,
      },
    })
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
