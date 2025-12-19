import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'

export type GoatHorn = (ItemBase & {
    instrument?: Registry['minecraft:instrument']
})
