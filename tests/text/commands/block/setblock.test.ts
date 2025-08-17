import { setblock } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Setblock Command', () => {
  it('should generate setblock command correctly', async () => {
    await compareSingleOutputText(() => {
      setblock('~ ~ ~', 'minecraft:stone')
    }, ['setblock ~ ~ ~ minecraft:stone'])
  })
})