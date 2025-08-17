import { teammsg } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Teammsg Command', () => {
  it('should generate teammsg command correctly', async () => {
    await compareSingleOutputText(() => {
      teammsg('Team message here')
    }, ['tm Team message here'])
  })
})
