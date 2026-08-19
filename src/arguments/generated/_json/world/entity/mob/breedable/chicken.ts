import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { NBTInt, VariantClass } from 'sandstone'

export type JsonChicken = (JsonBreedable & {
  /**
   * Whether it is from a chicken jockey.
   * If true it will despawn and will drop more experience.
   */
  IsChickenJockey?: boolean,
  /**
   * Time until it lays another egg.
   */
  EggLayTime?: (NBTInt | number),
  variant?: (JsonRegistry['minecraft:chicken_variant'] | VariantClass<'chicken'>),
  sound_variant?: (JsonRegistry['minecraft:chicken_sound_variant'] | VariantClass<'chicken_sound'>),
})
