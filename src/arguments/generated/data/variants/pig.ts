import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { TextureType } from 'sandstone/arguments'
import type { TextureClass } from 'sandstone'

export type PigModelType = ('normal' | 'cold')

export type PigSounds = {
  ambient_sound: SoundEventRef,
  hurt_sound: SoundEventRef,
  death_sound: SoundEventRef,
  step_sound: SoundEventRef,
  eat_sound: SoundEventRef,
}

export type PigVariant = ({
  /**
   * Value:
   *
   *  - Normal(`normal`)
   *  - Cold(`cold`)
   */
  model?: PigModelType,
  /**
   * The pig texture to use for this variant.
   */
  asset_id: (Registry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * The baby pig texture to use for this variant.
   */
  baby_asset_id: (Registry['minecraft:texture'] | TextureClass<TextureType>),
} & SpawnPrioritySelectors)
