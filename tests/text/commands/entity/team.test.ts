import { team } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Team Command', () => {
  it('should generate team add command', async () => {
    await compareSingleOutputText(() => {
      team.add('red', 'Red Team')
    }, ['team add red "Red Team"'])
  })

  it('should generate team remove command', async () => {
    await compareSingleOutputText(() => {
      team.remove('red')
    }, ['team remove red'])
  })

  it('should generate team list command', async () => {
    await compareSingleOutputText(() => {
      team.list()
    }, ['team list'])
  })

  it('should generate team empty command', async () => {
    await compareSingleOutputText(() => {
      team.empty('red')
    }, ['team empty red'])
  })

  it('should generate team join command', async () => {
    await compareSingleOutputText(() => {
      team.join('red', '@p')
    }, ['team join red @p'])
  })

  it('should generate team leave command', async () => {
    await compareSingleOutputText(() => {
      team.leave('@p')
    }, ['team leave @p'])
  })

  it('should generate team modify color command', async () => {
    await compareSingleOutputText(() => {
      team.modify('teamred', 'color', 'red')
    }, ['team modify teamred color red'])
  })

  it('should generate team modify displayName command', async () => {
    await compareSingleOutputText(() => {
      team.modify('teamred', 'displayName', 'Red Team Display')
    }, ['team modify teamred displayName "Red Team Display"'])
  })
})
