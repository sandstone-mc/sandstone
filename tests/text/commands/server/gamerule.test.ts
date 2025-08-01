import { gamerule } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Gamerule Command', () => {
  it('should generate gamerule command correctly', async () => {
    await compareSingleOutputText(() => {
      gamerule('keepInventory', true)
    }, ['gamerule keepInventory true'])
  })
})