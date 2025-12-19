import type { Registry } from 'sandstone/generated/registry'
import type { Breedable } from 'sandstone/generated/world/entity/mob/breedable'

export type Cow = (Breedable & {
    variant?: Registry['minecraft:cow_variant']
})
