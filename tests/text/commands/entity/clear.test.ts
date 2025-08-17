import { clear } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Clear Command', () => {
  it('should generate clear command correctly', async () => {
    await compareSingleOutputText(() => {
      clear('@p', 'minecraft:dirt')
    }, ['clear @p minecraft:dirt'])
  })
})