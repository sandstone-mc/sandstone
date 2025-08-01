import { place } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Place Command', () => {
  it('should generate place feature command correctly', async () => {
    await compareSingleOutputText(() => {
      place.feature('minecraft:ore_coal_upper')
    }, ['place feature minecraft:ore_coal_upper ~ ~ ~'])
  })

  it('should generate place feature command with position', async () => {
    await compareSingleOutputText(() => {
      place.feature('minecraft:ore_coal_upper', '10 20 30')
    }, ['place feature minecraft:ore_coal_upper 10 20 30'])
  })

  it('should generate place jigsaw command correctly', async () => {
    await compareSingleOutputText(() => {
      place.jigsaw('minecraft:village/plains/houses', 'minecraft:bottom', 3)
    }, ['place jigsaw minecraft:village/plains/houses minecraft:bottom 3 ~ ~ ~'])
  })

  it('should generate place structure command correctly', async () => {
    await compareSingleOutputText(() => {
      place.structure('minecraft:village_plains')
    }, ['place structure minecraft:village_plains ~ ~ ~'])
  })

  it('should generate place template command correctly', async () => {
    await compareSingleOutputText(() => {
      place.template('minecraft:igloo/top')
    }, ['place template minecraft:igloo/top ~ ~ ~ none none 1 0'])
  })

  it('should generate place template command with all options', async () => {
    await compareSingleOutputText(() => {
      place.template('minecraft:igloo/top', '0 64 0', 'clockwise_90', 'left_right', 0.8, 42)
    }, ['place template minecraft:igloo/top 0 64 0 clockwise_90 left_right 0.8 42'])
  })
})