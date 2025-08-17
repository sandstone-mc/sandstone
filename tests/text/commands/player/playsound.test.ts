import { playsound } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Playsound Command', () => {
  it('should generate playsound command correctly', async () => {
    await compareSingleOutputText(() => {
      playsound('minecraft:entity.experience_orb.pickup', 'master', '@p')
    }, ['playsound minecraft:entity.experience_orb.pickup master @p'])
  })
})