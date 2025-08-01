import { scoreboard } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Scoreboard Command', () => {
  it('should generate scoreboard objectives add command correctly', async () => {
    await compareSingleOutputText(() => {
      scoreboard.objectives.add('test', 'dummy')
    }, ['scoreboard objectives add test dummy'])
  })
})
