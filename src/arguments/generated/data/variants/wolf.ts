import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type WolfSounds = {
  ambient_sound: SoundEventRef
  death_sound: SoundEventRef
  growl_sound: SoundEventRef
  hurt_sound: SoundEventRef
  pant_sound: SoundEventRef
  whine_sound: SoundEventRef
}

export type WolfSoundVariant = {
  adult_sounds: WolfSounds
  baby_sounds: WolfSounds
}

export type WolfVariant = ({
  /**
   * The texture set to use for this wolf variant.
   */
  assets: WolfVariantAssetInfo
  /**
   * The baby texture set to use for this wolf variant.
   */
  baby_assets: WolfVariantAssetInfo
} & SpawnPrioritySelectors)

export type WolfVariantAssetInfo = {
  wild: Registry['minecraft:texture']
  tame: Registry['minecraft:texture']
  angry: Registry['minecraft:texture']
}
