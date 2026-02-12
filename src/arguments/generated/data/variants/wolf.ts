import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { TextureClass } from 'sandstone'

export type WolfSounds = {
  ambient_sound: SoundEventRef,
  death_sound: SoundEventRef,
  growl_sound: SoundEventRef,
  hurt_sound: SoundEventRef,
  pant_sound: SoundEventRef,
  whine_sound: SoundEventRef,
}

export type WolfVariant = ({
  /**
   * The texture set to use for this wolf variant.
   */
  assets: WolfVariantAssetInfo,
  /**
   * The baby texture set to use for this wolf variant.
   */
  baby_assets: WolfVariantAssetInfo,
} & SpawnPrioritySelectors)

export type WolfVariantAssetInfo = {
  wild: (Registry['minecraft:texture'] | TextureClass),
  tame: (Registry['minecraft:texture'] | TextureClass),
  angry: (Registry['minecraft:texture'] | TextureClass),
}
