import { setidletimeout } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Setidletimeout Command', () => {
  it('should generate setidletimeout command correctly', async () => {
    await compareSingleOutputText(() => {
      setidletimeout(300)
    }, ['setidletimeout 300'])
  })
})
