import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { TextureClass } from 'sandstone'

export type PigModelType = ('normal' | 'cold')

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
  asset_id: (Registry['minecraft:texture'] | TextureClass),
  /**
   * The baby pig texture to use for this variant.
   */
  baby_asset_id: (Registry['minecraft:texture'] | TextureClass),
} & SpawnPrioritySelectors)
