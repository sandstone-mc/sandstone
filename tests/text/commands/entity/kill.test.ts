import { kill } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Kill Command', () => {
  it('should generate kill command correctly', async () => {
    await compareSingleOutputText(() => {
      kill('@e[type=zombie]')
    }, ['kill @e[type=zombie]'])
  })
})