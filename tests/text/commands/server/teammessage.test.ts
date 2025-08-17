import { teammsg } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Team Message Command', () => {
  it('should generate teammessage command correctly', async () => {
    await compareSingleOutputText(() => {
      teammsg('Hello team!')
    }, ['tm Hello team!'])
  })

  it('should generate teammessage command with multiple messages', async () => {
    await compareSingleOutputText(() => {
      teammsg('Hello', 'team', 'members!')
    }, ['tm Hello team members!'])
  })

  it('should generate teammessage command with selector', async () => {
    await compareSingleOutputText(() => {
      teammsg('Player', '@p', 'joined the team!')
    }, ['tm Player @p joined the team!'])
  })
})