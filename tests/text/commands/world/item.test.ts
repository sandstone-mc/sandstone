import { item } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Item Command', () => {
  it('should generate item replace command correctly', async () => {
    await compareSingleOutputText(() => {
      item.replace.entity('@p', 'weapon.mainhand').with('diamond_sword', 1)
    }, ['item replace entity @p weapon.mainhand with diamond_sword 1'])
  })
})
