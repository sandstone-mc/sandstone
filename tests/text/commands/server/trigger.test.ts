import { trigger } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Trigger Command', () => {
  it('should generate trigger command correctly', async () => {
    await compareSingleOutputText(() => {
      trigger('test_trigger').set(1)
    }, ['trigger test_trigger set 1'])
  })
})
