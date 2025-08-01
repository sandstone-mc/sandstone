import { experience } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Experience Command', () => {
  it('should generate experience add command correctly', async () => {
    await compareSingleOutputText(() => {
      experience.add('@p', 10, 'level')
    }, ['xp @p 10 level'])
  })
})
