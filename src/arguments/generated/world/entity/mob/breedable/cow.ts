import type { Registry } from 'sandstone/arguments/generated/registry'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable'

export type Cow = (Breedable & {
  variant?: Registry['minecraft:cow_variant']
})
