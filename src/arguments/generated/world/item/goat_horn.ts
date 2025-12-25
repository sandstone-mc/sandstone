import type { Registry } from 'sandstone/arguments/generated/registry'
import type { ItemBase } from 'sandstone/arguments/generated/world/item'

export type GoatHorn = (ItemBase & {
  instrument?: Registry['minecraft:instrument']
})
