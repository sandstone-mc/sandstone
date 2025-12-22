import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'

export type Frog = (Breedable & {
  variant?: Registry['minecraft:frog_variant']
})
