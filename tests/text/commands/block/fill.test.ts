import { fill } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Fill Command', () => {
  it('should generate fill command correctly', async () => {
    await compareSingleOutputText(() => {
      fill('0 0 0', '10 5 10', 'minecraft:air')
    }, ['fill 0 0 0 10 5 10 minecraft:air'])
  })
})