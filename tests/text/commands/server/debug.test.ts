import { debug } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Debug Command', () => {
  it('should generate debug start command correctly', async () => {
    await compareSingleOutputText(() => {
      debug.start()
    }, ['debug start'])
  })
})