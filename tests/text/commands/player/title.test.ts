import { title } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Title Command', () => {
  it('should generate title command correctly', async () => {
    await compareSingleOutputText(() => {
      title('@a').title('Game Started!')
    }, ['title @a title "Game Started!"'])
  })
})
