import { returnCmd } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Return Command', () => {
  it('should generate return command with value', async () => {
    await compareSingleOutputText(() => {
      returnCmd(42)
    }, ['return 42'])
  })

  it('should generate return command with default value', async () => {
    await compareSingleOutputText(() => {
      returnCmd()
    }, ['return 0'])
  })

  it('should generate return run command', async () => {
    await compareSingleOutputText(() => {
      returnCmd.run.say('Hello!')
    }, ['return run say Hello!'])
  })

  it('should generate return fail command', async () => {
    await compareSingleOutputText(() => {
      returnCmd.fail()
    }, ['return fail'])
  })
})
