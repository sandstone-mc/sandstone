import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { NamespacedString } from 'sandstone'

export type JsonConfig = {
  top_material: JsonBlockState,
  under_material: JsonBlockState,
  underwater_material: JsonBlockState,
}

export type JsonConfiguredSurfaceBuilder = {
  type: NamespacedString,
  config: {
    top_material: JsonBlockState,
    under_material: JsonBlockState,
    underwater_material: JsonBlockState,
  },
}

export type JsonConfiguredSurfaceBuilderRef = (NamespacedString | JsonConfiguredSurfaceBuilder)
