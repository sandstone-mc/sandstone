import { time } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Time Command', () => {
  it('should generate time set day command', async () => {
    await compareSingleOutputText(() => {
      time.set('day')
    }, ['time set day'])
  })

  it('should generate time set night command', async () => {
    await compareSingleOutputText(() => {
      time.set('night')
    }, ['time set night'])
  })

  it('should generate time set specific time command', async () => {
    await compareSingleOutputText(() => {
      time.set(1000)
    }, ['time set 1000'])
  })

  it('should generate time add command', async () => {
    await compareSingleOutputText(() => {
      time.add(100)
    }, ['time add 100'])
  })

  it('should generate time query daytime command', async () => {
    await compareSingleOutputText(() => {
      time.query('daytime')
    }, ['time query daytime'])
  })

  it('should generate time query gametime command', async () => {
    await compareSingleOutputText(() => {
      time.query('gametime')
    }, ['time query gametime'])
  })
})