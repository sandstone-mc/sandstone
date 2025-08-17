import { weather } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Weather Command', () => {
  it('should generate weather clear command', async () => {
    await compareSingleOutputText(() => {
      weather.clear()
    }, ['weather clear'])
  })

  it('should generate weather clear with duration command', async () => {
    await compareSingleOutputText(() => {
      weather.clear(1000)
    }, ['weather clear 1000'])
  })

  it('should generate weather rain command', async () => {
    await compareSingleOutputText(() => {
      weather.rain()
    }, ['weather rain'])
  })

  it('should generate weather rain with duration command', async () => {
    await compareSingleOutputText(() => {
      weather.rain(500)
    }, ['weather rain 500'])
  })

  it('should generate weather thunder command', async () => {
    await compareSingleOutputText(() => {
      weather.thunder()
    }, ['weather thunder'])
  })

  it('should generate weather thunder with duration command', async () => {
    await compareSingleOutputText(() => {
      weather.thunder(300)
    }, ['weather thunder 300'])
  })
})