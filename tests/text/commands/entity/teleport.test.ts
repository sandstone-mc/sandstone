import { rel, teleport } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Teleport Command', () => {
  it('should generate teleport command correctly', async () => {
    await compareSingleOutputText(() => {
      teleport('@p', rel(0, 5, 0))
    }, ['tp @p ~ ~5 ~'])
  })
})
