import { particle } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Particle Command', () => {
  it('should generate particle command correctly', async () => {
    await compareSingleOutputText(() => {
      particle('minecraft:flame', '~ ~ ~')
    }, ['particle minecraft:flame ~ ~ ~'])
  })
})