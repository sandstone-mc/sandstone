import { seed } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Seed Command', () => {
  it('should generate seed command correctly', async () => {
    await compareSingleOutputText(() => {
      seed()
    }, ['seed'])
  })
})