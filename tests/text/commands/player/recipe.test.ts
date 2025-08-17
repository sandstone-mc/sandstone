import { recipe } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Recipe Command', () => {
  it('should generate recipe give command correctly', async () => {
    await compareSingleOutputText(() => {
      recipe.give('@p', 'minecraft:crafting_table')
    }, ['recipe give @p minecraft:crafting_table'])
  })
})