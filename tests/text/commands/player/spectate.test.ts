import { spectate } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Spectate Command', () => {
  it('should generate spectate command correctly', async () => {
    await compareSingleOutputText(() => {
      spectate('@p[name=Target]', '@s')
    }, ['spectate @p[name=Target] @s'])
  })
})