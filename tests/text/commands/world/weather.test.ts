import { weather } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Weather Command', () => {
  it('should generate weather rain command correctly', async () => {
    await compareSingleOutputText(() => {
      weather.rain()
    }, ['weather rain'])
  })
})