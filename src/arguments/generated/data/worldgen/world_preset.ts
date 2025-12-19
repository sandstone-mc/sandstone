import type { FlatGeneratorSettings } from 'sandstone/arguments/generated/data/worldgen/dimension/chunk_generator.js'
import type { Dimension } from 'sandstone/arguments/generated/data/worldgen/dimension.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'

export type FlatGeneratorPreset = {
    display: Registry['minecraft:item']
    settings: FlatGeneratorSettings
}

export type WorldPreset = {
    dimensions: ({
        [Key in Extract<Registry['minecraft:dimension'], string>]?: Dimension;
    })
}
