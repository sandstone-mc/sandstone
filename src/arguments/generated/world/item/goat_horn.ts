import type { Registry } from 'sandstone/generated/registry'
import type { ItemBase } from 'sandstone/generated/world/item'

export type GoatHorn = (ItemBase & {
    instrument?: Registry['minecraft:instrument']
})
