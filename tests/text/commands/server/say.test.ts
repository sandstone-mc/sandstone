import { say } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Say Command', () => {
  it('should generate say command correctly', async () => {
    await compareSingleOutputText(() => {
      say('Hello, world!')
    }, ['say Hello, world!'])
  })
})