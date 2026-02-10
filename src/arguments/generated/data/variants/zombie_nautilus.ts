import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { TextureClass } from 'sandstone'

export type ZombieNautilusModelType = ('normal' | 'warm')

export type ZombieNautilusVariant = ({
  /**
   * Value:
   *
   *  - Normal(`normal`)
   *  - Warm(`warm`)
   */
  model?: ZombieNautilusModelType,
  /**
   * The zombie nautilus texture to use for this variant.
   */
  asset_id: (Registry['minecraft:texture'] | TextureClass),
} & SpawnPrioritySelectors)
