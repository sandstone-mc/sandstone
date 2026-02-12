import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'
import type { VariantClass } from 'sandstone'

export type Cow = (Breedable & {
  variant?: (Registry['minecraft:cow_variant'] | VariantClass<'cow'>),
  sound_variant?: (`${string}:${string}` | VariantClass<'cow_sound'>),
})
