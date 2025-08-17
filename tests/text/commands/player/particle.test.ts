import { particle, rel } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Particle Command', () => {
  it('should generate particle command correctly', async () => {
    await compareSingleOutputText(() => {
      particle('minecraft:block', 'stone', rel(0, 0, 0))
    }, ['particle minecraft:block stone ~ ~ ~'])
  })
})
