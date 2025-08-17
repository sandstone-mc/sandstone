import { data } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Data Command', () => {
  it('should generate data get entity command', async () => {
    await compareSingleOutputText(() => {
      data.get.entity('@p', 'Health')
    }, ['data get entity @p Health'])
  })

  it('should generate data get block command', async () => {
    await compareSingleOutputText(() => {
      data.get.block('~ ~ ~', 'Items')
    }, ['data get block ~ ~ ~ Items'])
  })

  it('should generate data get storage command', async () => {
    await compareSingleOutputText(() => {
      data.get.storage('minecraft:temp', 'data')
    }, ['data get storage minecraft:temp data'])
  })

  it('should generate data merge entity command', async () => {
    await compareSingleOutputText(() => {
      data.merge.entity('@p', { Health: 20 })
    }, ['data merge entity @p {Health:20}'])
  })

  it('should generate data merge block command', async () => {
    await compareSingleOutputText(() => {
      data.merge.block('~ ~ ~', { CustomName: '"Test"' })
    }, [`data merge block ~ ~ ~ {CustomName:'"Test"'}`])
  })

  it('should generate data modify entity set command', async () => {
    await compareSingleOutputText(() => {
      data.modify.entity('@p', 'Health').set.value(20)
    }, ['data modify entity @p Health set value 20'])
  })

  it('should generate data modify entity append command', async () => {
    await compareSingleOutputText(() => {
      data.modify.entity('@p', 'Inventory').append.value({ id: 'minecraft:stone', Count: 1 })
    }, ["data modify entity @p Inventory append value {id:'minecraft:stone',Count:1}"])
  })

  it('should generate data remove entity command', async () => {
    await compareSingleOutputText(() => {
      data.remove.entity('@p', 'Health')
    }, ['data remove entity @p Health'])
  })

  it('should generate data remove block command', async () => {
    await compareSingleOutputText(() => {
      data.remove.block('~ ~ ~', 'Items[0]')
    }, ['data remove block ~ ~ ~ Items[0]'])
  })
})
