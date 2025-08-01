import { rel, summon } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Summon Command', () => {
  it('should generate summon command correctly', async () => {
    await compareSingleOutputText(() => {
      summon('minecraft:zombie', rel(0, 0, 0))
    }, ['summon minecraft:zombie ~ ~ ~'])
  })
})
