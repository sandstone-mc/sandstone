import { team } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Team Command', () => {
  it('should generate team add command correctly', async () => {
    await compareSingleOutputText(() => {
      team.add('red', 'Red Team')
    }, ['team add red "Red Team"'])
  })
})
