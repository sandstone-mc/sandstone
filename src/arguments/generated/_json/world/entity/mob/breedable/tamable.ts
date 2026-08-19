import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonDyeColorByte } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { JsonNeutralMob } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTIntArray, VariantClass } from 'sandstone'

export type JsonCat = (JsonTamable & {
  /**
   * Collar color, present for stray cats. Defaults to 14 (red).
   *
   * Value:
   *
   *  - White(`0`)
   *  - Orange(`1`)
   *  - Magenta(`2`)
   *  - LightBlue(`3`)
   *  - Yellow(`4`)
   *  - Lime(`5`)
   *  - Pink(`6`)
   *  - Gray(`7`)
   *  - LightGray(`8`)
   *  - Cyan(`9`)
   *  - Purple(`10`)
   *  - Blue(`11`)
   *  - Brown(`12`)
   *  - Green(`13`)
   *  - Red(`14`)
   *  - Black(`15`)
   */
  CollarColor?: JsonDyeColorByte,
  variant?: (JsonRegistry['minecraft:cat_variant'] | VariantClass<'cat'>),
  sound_variant?: (JsonRegistry['minecraft:cat_sound_variant'] | VariantClass<'cat_sound'>),
})

export type JsonCatType = (-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)

export type JsonParrot = (JsonTamable & {
  /**
   * Value:
   *
   *  - RedBlue(`0`)
   *  - Blue(`1`)
   *  - Green(`2`)
   *  - YellowBlue(`3`)
   *  - Gray(`4`)
   */
  Variant?: JsonParrotVariantInt,
})

export type JsonParrotVariantInt = (0 | 1 | 2 | 3 | 4)

export type JsonTamable = (JsonBreedable & {
  /**
   * Value:
   * Array length range: 4
   */
  Owner?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Whether the mob is sitting.
   */
  Sitting?: boolean,
})

export type JsonWolf = (JsonTamable & JsonNeutralMob & {
  /**
   * Collar color, present for wild wolfs. Defaults to 14 (red).
   *
   * Value:
   *
   *  - White(`0`)
   *  - Orange(`1`)
   *  - Magenta(`2`)
   *  - LightBlue(`3`)
   *  - Yellow(`4`)
   *  - Lime(`5`)
   *  - Pink(`6`)
   *  - Gray(`7`)
   *  - LightGray(`8`)
   *  - Cyan(`9`)
   *  - Purple(`10`)
   *  - Blue(`11`)
   *  - Brown(`12`)
   *  - Green(`13`)
   *  - Red(`14`)
   *  - Black(`15`)
   */
  CollarColor?: JsonDyeColorByte,
  variant?: (JsonRegistry['minecraft:wolf_variant'] | VariantClass<'wolf'>),
  sound_variant?: (JsonRegistry['minecraft:wolf_sound_variant'] | VariantClass<'wolf_sound'>),
})
