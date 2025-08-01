import { forceload } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Forceload Command', () => {
  it('should generate forceload add command correctly', async () => {
    await compareSingleOutputText(() => {
      forceload.add('0 0')
    }, ['forceload add 0 0'])
  })
})