import { comment } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Comment Command', () => {
  it('should generate comment correctly', async () => {
    await compareSingleOutputText(() => {
      comment('This is a test comment')
    }, ['# This is a test comment'])
  })
})