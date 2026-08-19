import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonSpawnPrioritySelectors } from 'sandstone/arguments/generated/_json/data/variants.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { TextureType } from 'sandstone/arguments'
import type { TextureClass } from 'sandstone'

export type JsonWolfSounds = {
  ambient_sound: JsonSoundEventRef,
  death_sound: JsonSoundEventRef,
  growl_sound: JsonSoundEventRef,
  hurt_sound: JsonSoundEventRef,
  pant_sound: JsonSoundEventRef,
  whine_sound: JsonSoundEventRef,
}

export type JsonWolfVariant = ({
  /**
   * The texture set to use for this wolf variant.
   */
  assets: JsonWolfVariantAssetInfo,
  /**
   * The baby texture set to use for this wolf variant.
   */
  baby_assets: JsonWolfVariantAssetInfo,
} & JsonSpawnPrioritySelectors)

export type JsonWolfVariantAssetInfo = {
  wild: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  tame: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  angry: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
}
