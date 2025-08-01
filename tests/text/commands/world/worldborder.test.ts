import { worldborder } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Worldborder Command', () => {
  it('should generate worldborder set command correctly', async () => {
    await compareSingleOutputText(() => {
      worldborder.set('100')
    }, ['worldborder set 100'])
  })
})