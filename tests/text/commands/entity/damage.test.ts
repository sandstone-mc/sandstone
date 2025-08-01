import { damage } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Damage Command', () => {
  it('should generate damage command correctly', async () => {
    await compareSingleOutputText(() => {
      damage('@p', 5).by('@s').from('@s')
    }, ['damage @p 5 by @s from @s'])
  })
})
