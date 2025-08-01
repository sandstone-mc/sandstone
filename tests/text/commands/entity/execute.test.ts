import { execute, say } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Execute Command', () => {
  it('should generate execute as command correctly', async () => {
    await compareSingleOutputText(() => {
      execute.as('@p').run.say('Hello from player!')
    }, ['execute as @p run say Hello from player!'])
  })
})
