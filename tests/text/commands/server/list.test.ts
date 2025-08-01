import { list } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('List Command', () => {
  it('should generate list command correctly', async () => {
    await compareSingleOutputText(() => {
      list()
    }, ['list'])
  })
})
