import { describe, expect, test } from 'bun:test'
import {
  createSandstonePack,
  type DataPointClass,
} from '../dist/exports/index.js'
import { OptimizeMacroTemporariesVisitor } from '../dist/_internal/index.js'

const compile = async (reuseTemporary = false) => {
  const pack = createSandstonePack({
    workingDir: process.cwd(),
    namespace: 'test',
    packUid: 'macro_optimization',
    packOptions: {
      datapack: {
        packFormat: 80,
        description: 'test',
      },
    },
  })

  const target = pack.MCFunction(
    'target',
    (_self: unknown, x: DataPointClass, z: DataPointClass) => {
      pack.Macro.say(pack.Macro`${x}:${z}`)
    },
  )

  const find = pack.MCFunction('find', () => {
    const x = pack.DataVariable()
    pack.commands.execute.store.result(x).run.random.value([1, 2])
    const z = pack.DataVariable()
    pack.commands.execute.store.result(z).run.random.value([3, 4])

    target(x, z)

    if (reuseTemporary) {
      pack.commands.data.get(x)
    }
  })

  find.generate()
  target.generate()
  new OptimizeMacroTemporariesVisitor(pack).visit(find.node)

  return find.node.getValue()
}

describe('OptimizeMacroTemporariesVisitor', () => {
  test('stores one-use temporaries directly in macro parameters', async () => {
    const output = await compile()

    expect(output).toContain(
      'execute store result storage __sandstone:variable anon_macro_optimization_0.param_0 int 1 run random value 1..2',
    )
    expect(output).toContain(
      'execute store result storage __sandstone:variable anon_macro_optimization_0.param_1 int 1 run random value 3..4',
    )
    expect(output).not.toContain('data modify storage __sandstone:variable anon_macro_optimization_0')
    expect(output).not.toContain('anon_macro_optimization_1')
    expect(output).not.toContain('anon_macro_optimization_2')
  })

  test('preserves temporaries that are reused after the macro call', async () => {
    const output = await compile(true)

    expect(output).toContain(
      'execute store result storage __sandstone:variable anon_macro_optimization_1 int 1 run random value 1..2',
    )
    expect(output).toContain(
      'data modify storage __sandstone:variable anon_macro_optimization_0.param_0 set from storage __sandstone:variable anon_macro_optimization_1',
    )
    expect(output).toContain('data get storage __sandstone:variable anon_macro_optimization_1')
  })
})
