import { ride } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Ride Command', () => {
  it('should generate ride mount command correctly', async () => {
    await compareSingleOutputText(() => {
      ride('@p').mount('@e[type=horse,limit=1]')
    }, ['ride @p mount @e[type=horse,limit=1]'])
  })

  it('should generate ride dismount command correctly', async () => {
    await compareSingleOutputText(() => {
      ride('@p').dismount()
    }, ['ride @p dismount'])
  })
})
