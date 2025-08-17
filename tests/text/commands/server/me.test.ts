import { me } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Me Command', () => {
  it('should generate me command correctly', async () => {
    await compareSingleOutputText(() => {
      me('is testing commands')
    }, ['me is testing commands'])
  })
})