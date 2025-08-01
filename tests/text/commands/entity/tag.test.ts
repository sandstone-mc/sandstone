import { tag } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Tag Command', () => {
  it('should generate tag add command correctly', async () => {
    await compareSingleOutputText(() => {
      tag('@p').add('foo')
    }, ['tag @p add foo'])
  })
})
