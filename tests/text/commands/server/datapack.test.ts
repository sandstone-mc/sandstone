import { datapack } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Datapack Command', () => {
  it('should generate datapack list command correctly', async () => {
    await compareSingleOutputText(() => {
      datapack.list()
    }, ['datapack list'])
  })
})
