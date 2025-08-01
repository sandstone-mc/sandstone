import { schedule } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Schedule Command', () => {
  it('should generate schedule function command correctly', async () => {
    await compareSingleOutputText(() => {
      schedule.function('minecraft:test', '20t')
    }, ['schedule function minecraft:test 20t'])
  })
})