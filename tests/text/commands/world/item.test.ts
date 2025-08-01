import { item } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Item Command', () => {
  it('should generate item replace entity with command', async () => {
    await compareSingleOutputText(() => {
      item.replace.entity('@p', 'weapon.mainhand').with('diamond_sword', 1)
    }, ['item replace entity @p weapon.mainhand with diamond_sword 1'])
  })

  it('should generate item replace block with command', async () => {
    await compareSingleOutputText(() => {
      item.replace.block('~ ~ ~', 'container.0').with('stone')
    }, ['item replace block ~ ~ ~ container.0 with stone'])
  })

  it('should generate item replace entity from entity command', async () => {
    await compareSingleOutputText(() => {
      item.replace.entity('@p', 'weapon.mainhand').from.entity('@s', 'weapon.offhand')
    }, ['item replace entity @p weapon.mainhand from entity @s weapon.offhand'])
  })

  it('should generate item replace entity from block command', async () => {
    await compareSingleOutputText(() => {
      item.replace.entity('@p', 'weapon.mainhand').from.block('~ ~ ~', 'container.0')
    }, ['item replace entity @p weapon.mainhand from block ~ ~ ~ container.0'])
  })

  it('should generate item modify entity command', async () => {
    await compareSingleOutputText(() => {
      item.modify.entity('@p', 'weapon.mainhand', 'minecraft:enchant_randomly')
    }, ['item modify entity @p weapon.mainhand minecraft:enchant_randomly'])
  })

  it('should generate item modify block command', async () => {
    await compareSingleOutputText(() => {
      item.modify.block('~ ~ ~', 'container.0', 'minecraft:enchant_randomly')
    }, ['item modify block ~ ~ ~ container.0 minecraft:enchant_randomly'])
  })
})
