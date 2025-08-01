import { functionCmd } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Function Command', () => {
  it('should generate function command correctly', async () => {
    await compareSingleOutputText(() => {
      functionCmd('minecraft:test')
    }, ['function minecraft:test'])
  })
})