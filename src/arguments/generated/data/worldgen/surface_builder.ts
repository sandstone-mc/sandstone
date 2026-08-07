import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { NamespacedString } from 'sandstone'

export type Config = {
  top_material: BlockState,
  under_material: BlockState,
  underwater_material: BlockState,
}

export type ConfiguredSurfaceBuilder = {
  type: NamespacedString,
  config: {
    top_material: BlockState,
    under_material: BlockState,
    underwater_material: BlockState,
  },
}

export type ConfiguredSurfaceBuilderRef = (NamespacedString | ConfiguredSurfaceBuilder)
