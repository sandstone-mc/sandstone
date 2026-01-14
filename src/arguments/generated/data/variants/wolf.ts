import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type WolfSoundVariant = {
  ambient_sound: SoundEventRef
  death_sound: SoundEventRef
  growl_sound: SoundEventRef
  hurt_sound: SoundEventRef
  pant_sound: SoundEventRef
  whine_sound: SoundEventRef
}

export type WolfVariant = ({
  /**
     * The texture set to use for this wolf variant.
     */
  assets: WolfVariantAssetInfo
} & SpawnPrioritySelectors)

export type WolfVariantAssetInfo = {
  wild: Registry['minecraft:texture']
  tame: Registry['minecraft:texture']
  angry: Registry['minecraft:texture']
}
