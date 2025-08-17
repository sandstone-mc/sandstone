import { defaultgamemode } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Defaultgamemode Command', () => {
  it('should generate defaultgamemode command correctly', async () => {
    await compareSingleOutputText(() => {
      defaultgamemode('survival')
    }, ['defaultgamemode survival'])
  })
})