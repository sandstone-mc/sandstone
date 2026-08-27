import { describe, test } from 'bun:test'
import { compute } from '../dist/exports/index.js'
import { compile, snapshotAll } from './utils/index.js'

/**
 * Snapshot tests for `/compute` (JE 26.3+).
 *
 * `compute` evaluates a `minecraft:number_provider` in one of three contexts:
 *   - `default` — common arguments only
 *   - `block <pos>` — `command_compute_position` context, block state at `<pos>`
 *   - `entity <target>` — `command_compute_entity` context, `target_entity` set
 *
 * The trailing `scaleOrInteger` parameter doubles as either a scale multiplier
 * (default `1.0`) or the literal `integer` marker for integer-mode evaluation.
 */
describe('Commands: /compute snapshots', () => {
  test('default: inline constant provider', () => {
    const out = compile('compute_default_inline', () => {
      compute.default({ type: 'minecraft:constant', value: 42 })
    })
    snapshotAll(out)
  })

  test('default: registry reference provider + integer mode', () => {
    const out = compile('compute_default_registry_integer', () => {
      compute.default('minecraft:my_pack:dmg_mult', 'integer')
    })
    snapshotAll(out)
  })

  test('default: storage provider + scale', () => {
    const out = compile('compute_default_storage_scaled', () => {
      compute.default(
        { type: 'minecraft:storage', storage: 'minecraft:gameplay/foo', path: 'difficulty' },
        100,
      )
    })
    snapshotAll(out)
  })

  test('block: pos + inline provider', () => {
    const out = compile('compute_block_inline', () => {
      compute.block([0, 64, 0], { type: 'minecraft:constant', value: 1 })
    })
    snapshotAll(out)
  })

  test('block: relative pos + registry provider + float scale', () => {
    const out = compile('compute_block_registry_scaled', () => {
      compute.block('~ ~ ~', 'minecraft:my_pack:redstone_strength', 2.5)
    })
    snapshotAll(out)
  })

  test('entity: inline score provider', () => {
    const out = compile('compute_entity_inline', () => {
      compute.entity('@p', { type: 'minecraft:score', target: '@s', score: 'health' })
    })
    snapshotAll(out)
  })

  test('entity: registry provider, no scale', () => {
    const out = compile('compute_entity_registry', () => {
      compute.entity('@e[type=zombie,limit=1]', 'minecraft:my_pack:boss_damage')
    })
    snapshotAll(out)
  })

  test('default: NumberProviderClass resource handle', () => {
    const out = compile('compute_default_class', (pack) => {
      const np = pack.NumberProvider('my_pack:dmg_mult', { type: 'minecraft:uniform', min: 1, max: 6 })
      compute.default(np)
    })
    snapshotAll(out)
  })

  test('compute(...) calls default directly (callable alias)', () => {
    const out = compile('compute_callable_alias', () => {
      compute('minecraft:my_pack:dmg_mult')
      compute({ type: 'minecraft:constant', value: 42 }, 'integer')
    })
    snapshotAll(out)
  })
})
