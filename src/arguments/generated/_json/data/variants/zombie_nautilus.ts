import type { JsonSpawnPrioritySelectors } from 'sandstone/arguments/generated/_json/data/variants.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { TextureType } from 'sandstone/arguments'
import type { TextureClass } from 'sandstone'

export type JsonZombieNautilusModelType = ('normal' | 'warm')

export type JsonZombieNautilusVariant = ({
  /**
   * Value:
   *
   *  - Normal(`normal`)
   *  - Warm(`warm`)
   */
  model?: JsonZombieNautilusModelType,
  /**
   * The zombie nautilus texture to use for this variant.
   */
  asset_id: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
} & JsonSpawnPrioritySelectors)
