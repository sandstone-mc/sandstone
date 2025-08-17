import { experience } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Experience Command', () => {
  it('should generate experience add command', async () => {
    await compareSingleOutputText(() => {
      experience.add('@p', 10, 'levels')
    }, ['xp add @p 10 levels'])
  })

  it('should generate experience add points command', async () => {
    await compareSingleOutputText(() => {
      experience.add('@p', 100, 'points')
    }, ['xp add @p 100 points'])
  })

  it('should generate experience set command', async () => {
    await compareSingleOutputText(() => {
      experience.set('@p', 5, 'levels')
    }, ['xp set @p 5 levels'])
  })

  it('should generate experience set points command', async () => {
    await compareSingleOutputText(() => {
      experience.set('@p', 50, 'points')
    }, ['xp set @p 50 points'])
  })

  it('should generate experience query levels command', async () => {
    await compareSingleOutputText(() => {
      experience.query('@p', 'levels')
    }, ['xp query @p levels'])
  })

  it('should generate experience query points command', async () => {
    await compareSingleOutputText(() => {
      experience.query('@p', 'points')
    }, ['xp query @p points'])
  })
})
