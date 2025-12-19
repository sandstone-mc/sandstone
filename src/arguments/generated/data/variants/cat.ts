import type { SpawnPrioritySelectors } from 'sandstone/generated/data/variants'
import type { Registry } from 'sandstone/generated/registry'

export type CatVariant = ({
    /**
     * The cat texture to use for this variant.
     */
    asset_id: Registry['minecraft:texture']
} & SpawnPrioritySelectors)
