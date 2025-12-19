import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'

export type Pig = (Saddled & {
    variant?: Registry['minecraft:pig_variant']
})

export type Saddled = Breedable
