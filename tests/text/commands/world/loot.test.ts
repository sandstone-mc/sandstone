import { loot, rel } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Loot Command', () => {
  it('should generate loot spawn command correctly', async () => {
    await compareSingleOutputText(() => {
      loot.spawn(rel(0, 0, 0)).loot('minecraft:chests/simple_dungeon')
    }, ['loot spawn ~ ~ ~ loot minecraft:chests/simple_dungeon'])
  })
})
