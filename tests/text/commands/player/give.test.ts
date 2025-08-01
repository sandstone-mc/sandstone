import { give } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Give Command', () => {
  it('should generate give command correctly', async () => {
    await compareSingleOutputText(() => {
      give('@p', 'minecraft:diamond', '5')
    }, ['give @p minecraft:diamond 5'])
  })
})