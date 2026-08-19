import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { VariantClass } from 'sandstone'

export type JsonFrog = (JsonBreedable & {
  variant?: (JsonRegistry['minecraft:frog_variant'] | VariantClass<'frog'>),
})
