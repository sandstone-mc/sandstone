import { clone } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Clone Command', () => {
  it('should generate clone command correctly', async () => {
    await compareSingleOutputText(() => {
      clone('0 0 0', '10 10 10', '20 0 0')
    }, ['clone 0 0 0 10 10 10 20 0 0'])
  })
})