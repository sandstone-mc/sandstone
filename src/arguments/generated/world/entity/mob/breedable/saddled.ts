import type { Registry } from 'sandstone/generated/registry'
import type { Breedable } from 'sandstone/generated/world/entity/mob/breedable'

export type Pig = (Saddled & {
    variant?: Registry['minecraft:pig_variant']
})

export type Saddled = Breedable
