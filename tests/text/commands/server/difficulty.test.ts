import { difficulty } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Difficulty Command', () => {
  it('should generate difficulty command correctly', async () => {
    await compareSingleOutputText(() => {
      difficulty('hard')
    }, ['difficulty hard'])
  })
})