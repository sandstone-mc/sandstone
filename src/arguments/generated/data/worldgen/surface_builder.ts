import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.js'

export type Config = {
  top_material: BlockState
  under_material: BlockState
  underwater_material: BlockState
}

export type ConfiguredSurfaceBuilder = {
  type: `${string}:${string}`
  config: {
    top_material: BlockState
    under_material: BlockState
    underwater_material: BlockState
  }
}

export type ConfiguredSurfaceBuilderRef = (`${string}:${string}` | ConfiguredSurfaceBuilder)
