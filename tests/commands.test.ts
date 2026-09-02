import { describe, test } from 'bun:test'
import { compute } from '../dist/exports/index.js'
import { compile, snapshotAll } from './utils/index.js'

/**
 * Snapshot tests for `/compute` (JE 26.3+).
 *
 * `compute` evaluates a `minecraft:context_int_provider` or
 * `minecraft:context_float_provider` in one of three contexts:
 *   - `default` — common arguments only
 *   - `block <pos>` — `command_compute_position` context, block state at `<pos>`
 *   - `entity <target>` — `command_compute_entity` context, `target_entity` set
 *
 * The integer / float discriminator goes between the context and the
 * provider, mirroring the wire syntax: `compute <target> integer|float
 * <provider> [<scale>]`. Float providers may take an optional scale
 * multiplier; integer providers cannot be scaled.
 */
describe('Commands: /compute snapshots', () => {
  test('default: inline constant float provider', () => {
    const out = compile('compute_default_float_inline', () => {
      compute.default.float({ type: 'minecraft:constant', value: 42 })
    })
    snapshotAll(out)
  })

  test('default: registry reference int provider', () => {
    const out = compile('compute_default_int_registry', () => {
      compute.default.integer('minecraft:my_pack:dmg_mult')
    })
    snapshotAll(out)
  })

  test('default: storage float provider + scale', () => {
    const out = compile('compute_default_float_storage_scaled', () => {
      compute.default.float(
        { type: 'minecraft:storage', storage: 'minecraft:gameplay/foo', path: 'difficulty' },
        100,
      )
    })
    snapshotAll(out)
  })

  test('block: pos + inline float provider', () => {
    const out = compile('compute_block_float_inline', () => {
      compute.block([0, 64, 0]).float({ type: 'minecraft:constant', value: 1 })
    })
    snapshotAll(out)
  })

  test('block: relative pos + registry float provider + float scale', () => {
    const out = compile('compute_block_float_registry_scaled', () => {
      compute.block('~ ~ ~').float('minecraft:my_pack:redstone_strength', 2.5)
    })
    snapshotAll(out)
  })

  test('entity: inline score int provider', () => {
    const out = compile('compute_entity_int_score', () => {
      compute.entity('@p').integer({ type: 'minecraft:score', target: '@s', score: 'health' })
    })
    snapshotAll(out)
  })

  test('entity: registry float provider, no scale', () => {
    const out = compile('compute_entity_float_registry', () => {
      compute.entity('@e[type=zombie,limit=1]').float('minecraft:my_pack:boss_damage')
    })
    snapshotAll(out)
  })

  test('default: FloatNumberProviderClass resource handle', () => {
    const out = compile('compute_default_class', (pack) => {
      const np = pack.NumberProvider('float', 'my_pack:dmg_mult', { type: 'minecraft:uniform', min: 1, max: 6 })
      compute.default.float(np)
    })
    snapshotAll(out)
  })

  test('shortcut: compute.float(provider) emits default-context float', () => {
    const out = compile('compute_shortcut_float', () => {
      compute.float({ type: 'minecraft:constant', value: 1.5 }, 100)
    })
    snapshotAll(out)
  })

  test('shortcut: compute.int(provider) emits default-context integer', () => {
    const out = compile('compute_shortcut_int', () => {
      compute.int('minecraft:my_pack:kill_count')
    })
    snapshotAll(out)
  })
})
