import type { Registry } from 'sandstone/arguments/generated/registry'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable'

export type Frog = (Breedable & {
  variant?: Registry['minecraft:frog_variant']
})
