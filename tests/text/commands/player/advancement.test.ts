import { advancement } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Advancement Command', () => {
  it('should generate advancement grant command correctly', async () => {
    await compareSingleOutputText(() => {
      advancement.grant('@p').only('minecraft:story/mine_stone')
    }, ['advancement grant @p only minecraft:story/mine_stone'])
  })
})
