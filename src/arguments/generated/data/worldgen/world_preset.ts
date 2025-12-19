import type { FlatGeneratorSettings } from 'sandstone/generated/data/worldgen/dimension/chunk_generator'
import type { Dimension } from 'sandstone/generated/data/worldgen/dimension'
import type { Registry } from 'sandstone/generated/registry'

export type FlatGeneratorPreset = {
    display: Registry['minecraft:item']
    settings: FlatGeneratorSettings
}

export type WorldPreset = {
    dimensions: ({
        [Key in Extract<Registry['minecraft:dimension'], string>]?: Dimension;
    })
}
