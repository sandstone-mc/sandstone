import { returnCmd } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Return Command', () => {
  it('should generate return command correctly', async () => {
    await compareSingleOutputText(() => {
      returnCmd('5')
    }, ['return 5'])
  })
})