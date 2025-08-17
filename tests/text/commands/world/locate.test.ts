import { locate } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Locate Command', () => {
  it('should generate locate structure command correctly', async () => {
    await compareSingleOutputText(() => {
      locate.structure('minecraft:village')
    }, ['locate structure minecraft:village'])
  })
})