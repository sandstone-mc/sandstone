import { enchant } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Enchant Command', () => {
  it('should generate enchant command correctly', async () => {
    await compareSingleOutputText(() => {
      enchant('@p', 'minecraft:sharpness', 3)
    }, ['enchant @p minecraft:sharpness 3'])
  })
})
