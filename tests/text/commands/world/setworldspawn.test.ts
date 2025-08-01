import { abs, setworldspawn } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Setworldspawn Command', () => {
  it('should generate setworldspawn command correctly', async () => {
    await compareSingleOutputText(() => {
      setworldspawn(abs(0, 64, 0))
    }, ['setworldspawn 0 64 0'])
  })
})
