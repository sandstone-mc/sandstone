import { stopsound } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Stopsound Command', () => {
  it('should generate stopsound command correctly', async () => {
    await compareSingleOutputText(() => {
      stopsound('@p', 'master')
    }, ['stopsound @p master'])
  })
})