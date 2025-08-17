import { abs, spawnpoint } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Spawnpoint Command', () => {
  it('should generate spawnpoint command correctly', async () => {
    await compareSingleOutputText(() => {
      spawnpoint('@p', abs(100, 64, 200))
    }, ['spawnpoint @p 100 64 200'])
  })
})
