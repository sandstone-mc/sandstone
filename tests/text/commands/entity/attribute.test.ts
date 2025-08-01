import { attribute } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Attribute Command', () => {
  it('should generate attribute command correctly', async () => {
    await compareSingleOutputText(() => {
      attribute('@p', 'generic.max_health').get()
    }, ['attribute @p generic.max_health get'])
  })
})
