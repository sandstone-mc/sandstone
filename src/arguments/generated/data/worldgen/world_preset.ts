import type { FlatGeneratorSettings } from 'sandstone/arguments/generated/data/worldgen/dimension/chunk_generator.ts'
import type { Dimension } from 'sandstone/arguments/generated/data/worldgen/dimension.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type FlatGeneratorPreset = {
  display: Registry['minecraft:item']
  settings: FlatGeneratorSettings
}

export type WorldPreset = {
  dimensions: ({
    [Key in Extract<Registry['minecraft:dimension'], string>]?: Dimension;
  })
}
