import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { TextureClass } from 'sandstone'

export type CatSounds = {
  ambient_sound: SoundEventRef,
  stray_sound: SoundEventRef,
  hiss_sound: SoundEventRef,
  hurt_sound: SoundEventRef,
  death_sound: SoundEventRef,
  eat_sound: SoundEventRef,
  beg_for_food_sound: SoundEventRef,
  purr_sound: SoundEventRef,
  purreow_sound: SoundEventRef,
}

export type CatVariant = ({
  /**
   * The cat texture to use for this variant.
   */
  asset_id: (Registry['minecraft:texture'] | TextureClass),
  /**
   * The baby cat texture to use for this variant.
   */
  baby_asset_id: (Registry['minecraft:texture'] | TextureClass),
} & SpawnPrioritySelectors)
