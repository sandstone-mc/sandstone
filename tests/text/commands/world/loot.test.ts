import { loot } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Loot Command', () => {
  it('should generate loot give loot command', async () => {
    await compareSingleOutputText(() => {
      loot.give('@p').loot('minecraft:blocks/stone')
    }, ['loot give @p loot minecraft:blocks/stone'])
  })

  it('should generate loot give kill command', async () => {
    await compareSingleOutputText(() => {
      loot.give('@p').kill('@e[type=cow,limit=1]')
    }, ['loot give @p kill @e[type=cow,limit=1]'])
  })

  it('should generate loot give mine command', async () => {
    await compareSingleOutputText(() => {
      loot.give('@p').mine('~ ~ ~')
    }, ['loot give @p mine ~ ~ ~'])
  })

  it('should generate loot spawn loot command', async () => {
    await compareSingleOutputText(() => {
      loot.spawn('~ ~ ~').loot('minecraft:chests/simple_dungeon')
    }, ['loot spawn ~ ~ ~ loot minecraft:chests/simple_dungeon'])
  })

  it('should generate loot insert loot command', async () => {
    await compareSingleOutputText(() => {
      loot.insert('~ ~ ~').loot('minecraft:blocks/stone')
    }, ['loot insert ~ ~ ~ loot minecraft:blocks/stone'])
  })

  it('should generate loot replace entity loot command', async () => {
    await compareSingleOutputText(() => {
      loot.replace.entity('@p', 'weapon.mainhand').loot('minecraft:blocks/stone')
    }, ['loot replace entity @p weapon.mainhand loot minecraft:blocks/stone'])
  })

  it('should generate loot replace block loot command', async () => {
    await compareSingleOutputText(() => {
      loot.replace.block('~ ~ ~', 'container.0').loot('minecraft:blocks/stone')
    }, ['loot replace block ~ ~ ~ container.0 loot minecraft:blocks/stone'])
  })

  it('should generate loot replace entity with count command', async () => {
    await compareSingleOutputText(() => {
      loot.replace.entity('@p', 'weapon.mainhand', 1).loot('minecraft:blocks/stone')
    }, ['loot replace entity @p weapon.mainhand 1 loot minecraft:blocks/stone'])
  })
})
