import { tell } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Tell Command', () => {
  it('should generate tell command correctly', async () => {
    await compareSingleOutputText(() => {
      tell('@p', 'Private message')
    }, ['w @p Private message'])
  })
})
