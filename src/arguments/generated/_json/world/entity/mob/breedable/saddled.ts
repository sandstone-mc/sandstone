import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { VariantClass } from 'sandstone'

export type JsonPig = (JsonSaddled & {
  variant?: (JsonRegistry['minecraft:pig_variant'] | VariantClass<'pig'>),
  sound_variant?: (JsonRegistry['minecraft:pig_sound_variant'] | VariantClass<'pig_sound'>),
})

export type JsonSaddled = JsonBreedable
