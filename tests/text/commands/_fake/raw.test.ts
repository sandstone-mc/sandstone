import { raw } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Raw Command', () => {
  it('should generate raw command correctly', async () => {
    await compareSingleOutputText(() => {
      raw('execute as @p run say hello')
    }, [' execute as @p run say hello'])
  })
})