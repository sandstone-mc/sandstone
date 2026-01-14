import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'

export type Cow = (Breedable & {
  variant?: Registry['minecraft:cow_variant']
})
