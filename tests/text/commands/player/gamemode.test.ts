import { gamemode } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Gamemode Command', () => {
  it('should generate gamemode command correctly', async () => {
    await compareSingleOutputText(() => {
      gamemode('creative', '@p')
    }, ['gamemode creative @p'])
  })
})