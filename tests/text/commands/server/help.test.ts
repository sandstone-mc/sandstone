import { help } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Help Command', () => {
  it('should generate help command correctly', async () => {
    await compareSingleOutputText(() => {
      help()
    }, ['help'])
  })
})