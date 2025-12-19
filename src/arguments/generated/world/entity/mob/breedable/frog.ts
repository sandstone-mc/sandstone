import type { Registry } from 'sandstone/generated/registry'
import type { Breedable } from 'sandstone/generated/world/entity/mob/breedable'

export type Frog = (Breedable & {
    variant?: Registry['minecraft:frog_variant']
})
