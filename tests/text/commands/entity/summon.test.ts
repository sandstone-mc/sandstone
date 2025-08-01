import { summon } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Summon Command', () => {
  it('should generate summon command correctly', async () => {
    await compareSingleOutputText(() => {
      summon('minecraft:zombie', '~ ~ ~')
    }, ['summon minecraft:zombie ~ ~ ~'])
  })
})