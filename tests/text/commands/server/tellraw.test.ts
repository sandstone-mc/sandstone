import { tellraw } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Tellraw Command', () => {
  it('should generate tellraw command correctly', async () => {
    await compareSingleOutputText(() => {
      tellraw('@a', ['Welcome to the server!'])
    }, ['tellraw @a ["Welcome to the server!"]'])
  })
})
