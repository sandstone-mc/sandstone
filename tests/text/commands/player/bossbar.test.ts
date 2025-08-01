import { bossbar } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Bossbar Command', () => {
  it('should generate bossbar add command correctly', async () => {
    await compareSingleOutputText(() => {
      bossbar.add('test:bar', 'Test Boss Bar')
    }, ['bossbar add test:bar "Test Boss Bar"'])
  })
})
