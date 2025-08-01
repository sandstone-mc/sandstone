import { reload } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Reload Command', () => {
  it('should generate reload command correctly', async () => {
    await compareSingleOutputText(() => {
      reload()
    }, ['reload'])
  })
})