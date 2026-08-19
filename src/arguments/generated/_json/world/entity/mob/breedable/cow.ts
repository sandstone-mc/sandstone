import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { VariantClass } from 'sandstone'

export type JsonCow = (JsonBreedable & {
  variant?: (JsonRegistry['minecraft:cow_variant'] | VariantClass<'cow'>),
  sound_variant?: (JsonRegistry['minecraft:cow_sound_variant'] | VariantClass<'cow_sound'>),
})
