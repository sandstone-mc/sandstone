import { time } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Time Command', () => {
  it('should generate time set command correctly', async () => {
    await compareSingleOutputText(() => {
      time.set('day')
    }, ['time set day'])
  })
})