import { describe, expect, test } from 'bun:test'
import type { DataPointClass } from '../dist/exports/index.js'
import { compile, mcfunctionBody, snapshotAll } from './utils/index.js'

describe('OptimizeMacroTemporariesVisitor', () => {
  // Distinct 8-char packUid (matching CLI nanoid(8) format) so auto-generated
  // macro storage paths stay stable across test runs.
  const opts = { packUid: 'qR8pL2nX', description: 'test' }

  test('stores one-use temporaries directly in macro parameters', () => {
    const out = compile('find_one_use', (pack) => {
      const target = pack.MCFunction(
        'target',
        (_self: unknown, x: DataPointClass, z: DataPointClass) => {
          pack.Macro.say(pack.Macro`${x}:${z}`)
        },
      )

      pack.MCFunction('find', () => {
        const x = pack.DataVariable()
        pack.commands.execute.store.result(x).run.random.value([1, 2])
        const z = pack.DataVariable()
        pack.commands.execute.store.result(z).run.random.value([3, 4])

        target(x, z)
      })
    }, opts)

    snapshotAll(out)

    // Spot-check the inlined body for the optimization we're locking down.
    const body = mcfunctionBody(out, 'find')
    expect(body).toContain(
      'execute store result storage __sandstone:variable anon_qR8pL2nX_0.param_0 int 1 run random value 1..2',
    )
    expect(body).toContain(
      'execute store result storage __sandstone:variable anon_qR8pL2nX_0.param_1 int 1 run random value 3..4',
    )
    expect(body).not.toContain('data modify storage __sandstone:variable anon_qR8pL2nX_0')
  })

  test('preserves temporaries that are reused after the macro call', () => {
    const out = compile('find_reused', (pack) => {
      const target = pack.MCFunction(
        'target',
        (_self: unknown, x: DataPointClass, z: DataPointClass) => {
          pack.Macro.say(pack.Macro`${x}:${z}`)
        },
      )

      pack.MCFunction('find', () => {
        const x = pack.DataVariable()
        pack.commands.execute.store.result(x).run.random.value([1, 2])
        const z = pack.DataVariable()
        pack.commands.execute.store.result(z).run.random.value([3, 4])

        target(x, z)

        // Reuse `x` after the macro call — must NOT be folded into a parameter.
        pack.commands.data.get(x)
      })
    }, opts)

    snapshotAll(out)

    const body = mcfunctionBody(out, 'find')
    expect(body).toContain('data get storage __sandstone:variable anon_qR8pL2nX_1')
  })

  test('macro function call snapshot — full output', () => {
    // Same setup as the one-use test, but verified purely via snapshot so any
    // visitor-driven changes to the surrounding init/tag/objective JSON files
    // are also locked down.
    const out = compile('find_full', (pack) => {
      const target = pack.MCFunction(
        'target',
        (_self: unknown, x: DataPointClass, z: DataPointClass) => {
          pack.Macro.say(pack.Macro`${x}:${z}`)
        },
      )

      pack.MCFunction('find', () => {
        const x = pack.DataVariable()
        pack.commands.execute.store.result(x).run.random.value([1, 2])
        const z = pack.DataVariable()
        pack.commands.execute.store.result(z).run.random.value([3, 4])

        target(x, z)
      })
    }, opts)

    snapshotAll(out)
  })
})
