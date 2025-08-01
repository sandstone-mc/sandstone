import { effect } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Effect Command', () => {
  it('should generate effect give command correctly', async () => {
    await compareSingleOutputText(() => {
      effect.give('@p', 'minecraft:speed', '30', '1')
    }, ['effect give @p minecraft:speed 30 1'])
  })
})