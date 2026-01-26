import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.ts'

export type GoatHorn = (ItemBase & {
  instrument?: Registry['minecraft:instrument'],
})
