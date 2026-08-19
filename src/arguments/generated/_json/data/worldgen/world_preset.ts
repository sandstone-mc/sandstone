import type {
  JsonFlatGeneratorSettings,
} from 'sandstone/arguments/generated/_json/data/worldgen/dimension/chunk_generator.ts'
import type { JsonDimension } from 'sandstone/arguments/generated/_json/data/worldgen/dimension.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'

export type JsonFlatGeneratorPreset = {
  display: JsonRegistry['minecraft:item'],
  settings: JsonFlatGeneratorSettings,
}

export type JsonWorldPreset = {
  dimensions: ({
    [Key in Extract<JsonRegistry['minecraft:dimension'], string>]?: JsonDimension
  }),
}
