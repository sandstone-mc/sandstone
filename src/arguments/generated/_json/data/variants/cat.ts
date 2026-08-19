import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonSpawnPrioritySelectors } from 'sandstone/arguments/generated/_json/data/variants.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { TextureType } from 'sandstone/arguments'
import type { TextureClass } from 'sandstone'

export type JsonCatSounds = {
  ambient_sound: JsonSoundEventRef,
  stray_sound: JsonSoundEventRef,
  hiss_sound: JsonSoundEventRef,
  hurt_sound: JsonSoundEventRef,
  death_sound: JsonSoundEventRef,
  eat_sound: JsonSoundEventRef,
  beg_for_food_sound: JsonSoundEventRef,
  purr_sound: JsonSoundEventRef,
  purreow_sound: JsonSoundEventRef,
}

export type JsonCatVariant = ({
  /**
   * The cat texture to use for this variant.
   */
  asset_id: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * The baby cat texture to use for this variant.
   */
  baby_asset_id: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
} & JsonSpawnPrioritySelectors)
