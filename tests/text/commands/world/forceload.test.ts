import { abs, forceload } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Forceload Command', () => {
  it('should generate forceload add command', async () => {
    await compareSingleOutputText(() => {
      forceload.add('0 0')
    }, ['forceload add 0 0'])
  })

  it('should generate forceload add with range command', async () => {
    await compareSingleOutputText(() => {
      forceload.add('0 0', '16 16')
    }, ['forceload add 0 0 16 16'])
  })

  it('should generate forceload remove command', async () => {
    await compareSingleOutputText(() => {
      forceload.remove('0 0')
    }, ['forceload remove 0 0'])
  })

  it('should generate forceload remove with range command', async () => {
    await compareSingleOutputText(() => {
      forceload.remove(abs(0, 0), abs(16, 16))
    }, ['forceload remove 0 0 16 16'])
  })

  it('should generate forceload remove all command', async () => {
    await compareSingleOutputText(() => {
      forceload.removeAll()
    }, ['forceload remove all'])
  })

  it('should generate forceload query command', async () => {
    await compareSingleOutputText(() => {
      forceload.query()
    }, ['forceload query'])
  })

  it('should generate forceload query with position command', async () => {
    await compareSingleOutputText(() => {
      forceload.query('0 0')
    }, ['forceload query 0 0'])
  })
})
