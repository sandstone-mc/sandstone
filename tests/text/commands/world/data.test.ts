import { data } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Data Command', () => {
  it('should generate data get command correctly', async () => {
    await compareSingleOutputText(() => {
      data.get.entity('@p', 'Health')
    }, ['data get entity @p Health'])
  })
})