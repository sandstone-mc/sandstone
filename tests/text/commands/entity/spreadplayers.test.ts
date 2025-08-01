import { abs, spreadplayers } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Spreadplayers Command', () => {
  it('should generate spreadplayers command correctly', async () => {
    await compareSingleOutputText(() => {
      spreadplayers(abs(0, 0), 10, 50, false, '@a')
    }, ['spreadplayers 0 0 10 50 false @a'])
  })
})
