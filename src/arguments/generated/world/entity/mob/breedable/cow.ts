import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'

export type Cow = (Breedable & {
  variant?: Registry['minecraft:cow_variant']
})
