import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { TextureClass } from 'sandstone'

export type CowModelType = ('normal' | 'cold' | 'warm')

export type CowVariant = ({
  /**
   * Value:
   *
   *  - Normal(`normal`)
   *  - Cold(`cold`)
   *  - Warm(`warm`)
   */
  model?: CowModelType,
  /**
   * The cow texture to use for this variant.
   */
  asset_id: (Registry['minecraft:texture'] | TextureClass),
  /**
   * The baby cow texture to use for this variant.
   */
  baby_asset_id: (Registry['minecraft:texture'] | TextureClass),
} & SpawnPrioritySelectors)
