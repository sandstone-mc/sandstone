import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'
import type { VariantClass } from 'sandstone'

export type Pig = (Saddled & {
  variant?: (Registry['minecraft:pig_variant'] | VariantClass<'pig'>),
})

export type Saddled = Breedable
