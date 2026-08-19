import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonSpawnPrioritySelectors } from 'sandstone/arguments/generated/_json/data/variants.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { TextureType } from 'sandstone/arguments'
import type { TextureClass } from 'sandstone'

export type JsonCowModelType = ('normal' | 'cold' | 'warm')

export type JsonCowSounds = {
  ambient_sound: JsonSoundEventRef,
  hurt_sound: JsonSoundEventRef,
  death_sound: JsonSoundEventRef,
  step_sound: JsonSoundEventRef,
}

export type JsonCowVariant = ({
  /**
   * Value:
   *
   *  - Normal(`normal`)
   *  - Cold(`cold`)
   *  - Warm(`warm`)
   */
  model?: JsonCowModelType,
  /**
   * The cow texture to use for this variant.
   */
  asset_id: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * The baby cow texture to use for this variant.
   */
  baby_asset_id: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
} & JsonSpawnPrioritySelectors)
