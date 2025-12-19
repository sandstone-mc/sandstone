import type { MobCategory, SpawnerData } from 'sandstone/arguments/generated/data/worldgen/biome.js'
import type { DecorationStep, HeightmapType, HeightProvider } from 'sandstone/arguments/generated/data/worldgen.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { NonEmptyWeightedList } from 'sandstone/arguments/generated/util.js'
import type { NBTFloat, NBTInt, TagClass } from 'sandstone'

export type BiomeTemperature = ('cold' | 'warm')

export type BoundingBox = ('piece' | 'full')

export type BuriedTreasure = Record<string, never>

export type DirectPoolAlias = {
    alias: `${string}:${string}`
    target: Registry['minecraft:worldgen/template_pool']
}

export type Jigsaw<S = undefined> = ({
    start_pool: Registry['minecraft:worldgen/template_pool']
    /**
     * Value:
     * Range: 1..20
     */
    size: NBTInt<{
        min: 1
        max: 20
    }>
    pool_aliases?: Array<PoolAlias>
} & {
    start_height: HeightProvider
    start_jigsaw_name?: `${string}:${string}`
    /**
     * Value:
     *
     *  - MotionBlocking(`MOTION_BLOCKING`)
     *  - MotionBlockingNoLeaves(`MOTION_BLOCKING_NO_LEAVES`)
     *  - OceanFloor(`OCEAN_FLOOR`)
     *  - OceanFloorWorldgen(`OCEAN_FLOOR_WG`)
     *  - WorldSurface(`WORLD_SURFACE`)
     *  - WorldSurfaceWorldgen(`WORLD_SURFACE_WG`)
     */
    project_start_to_heightmap?: HeightmapType
    max_distance_from_center: (S extends undefined ? Dispatcher<'minecraft:jigsaw_max_distance_from_center', [
        '%none',
    ]> : (S extends keyof Dispatcher<'minecraft:jigsaw_max_distance_from_center'>
        ? Dispatcher<'minecraft:jigsaw_max_distance_from_center'>[S]
        : Record<string, unknown>))
    use_expansion_hack: boolean
} & {
    /**
     * Value:
     * *either*
     *
     * Range: 0..
     *
     * *or*
     *
     * *item 1*
     */
    dimension_padding?: (NBTInt<{
        min: 0
    }> | {
        /**
         * Value:
         * Range: 0..
         */
        bottom?: NBTInt<{
            min: 0
        }>
        /**
         * Value:
         * Range: 0..
         */
        top?: NBTInt<{
            min: 0
        }>
    })
    /**
     * Value:
     *
     *  - ApplyWaterlogging(`apply_waterlogging`)
     *  - IgnoreWaterlogging(`ignore_waterlogging`)
     */
    liquid_settings?: LiquidSettings
})

export type JigsawDistanceLimits<T> = {
    horizontal: T
    /**
     * Defaults to 4096
     *
     * Value:
     * Range: 1..4096
     */
    vertical?: NBTInt<{
        min: 1
    }>
}

export type LiquidSettings = ('apply_waterlogging' | 'ignore_waterlogging')

export type Mineshaft = {
    /**
     * Value:
     *
     *  - Normal(`normal`)
     *  - Mesa(`mesa`)
     */
    mineshaft_type: MineshaftType
}

export type MineshaftType = ('normal' | 'mesa')

export type NetherFossil = {
    height: HeightProvider
}

export type OceanRuin = {
    /**
     * Value:
     *
     *  - Cold(`cold`)
     *  - Warm(`warm`)
     */
    biome_temp: BiomeTemperature
    /**
     * Value:
     * Range: 0..1
     */
    large_probability: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
    }>
    /**
     * Value:
     * Range: 0..1
     */
    cluster_probability: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
    }>
}

export type PoolAlias = ({
    [S in Extract<Registry['minecraft:worldgen/pool_alias_binding'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:worldgen/pool_alias_binding'>
        ? Dispatcher<'minecraft:worldgen/pool_alias_binding'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:worldgen/pool_alias_binding']])

export type RandomGroupPoolAlias = {
    groups: NonEmptyWeightedList<Array<PoolAlias>>
}

export type RandomPoolAlias = {
    alias: `${string}:${string}`
    targets: NonEmptyWeightedList<Registry['minecraft:worldgen/template_pool']>
}

export type RuinedPortal = {
    setups: Array<RuinedPortalSetup>
}

export type RuinedPortalPlacement = (
  | 'on_land_surface'
  | 'partly_buried'
  | 'on_ocean_floor'
  | 'in_mountain'
  | 'underground'
  | 'in_nether')

export type RuinedPortalSetup = {
    /**
     * Value:
     *
     *  - OnLandSurface(`on_land_surface`)
     *  - PartlyBuried(`partly_buried`)
     *  - OnOceanFloor(`on_ocean_floor`)
     *  - InMountain(`in_mountain`)
     *  - Underground(`underground`)
     *  - InNether(`in_nether`)
     */
    placement: RuinedPortalPlacement
    /**
     * Value:
     * Range: 0..1
     */
    air_pocket_probability: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
    }>
    /**
     * Value:
     * Range: 0..1
     */
    mossiness: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
    }>
    overgrown: boolean
    vines: boolean
    can_be_cold: boolean
    replace_with_blackstone: boolean
    /**
     * Value:
     * Range: 0..
     */
    weight: NBTFloat<{
        leftExclusive: false
        min: 0
    }>
}

export type RuinedPortalType = ('standard' | 'desert' | 'jungle' | 'mountain' | 'nether' | 'ocean' | 'swamp')

export type Shipwreck = {
    is_beached?: boolean
}

export type SpawnOverride = {
    /**
     * Value:
     *
     *  - Piece(`piece`)
     *  - Full(`full`)
     */
    bounding_box: BoundingBox
    spawns: Array<SpawnerData>
}

export type Structure = ({
    [S in Extract<Registry['minecraft:worldgen/structure_type'], string>]?: ({
        type: S
        biomes: (
          | Array<Registry['minecraft:worldgen/biome']> | (
            | Registry['minecraft:worldgen/biome']
            | `#${Registry['minecraft:tag/worldgen/biome']}`
            | TagClass<'worldgen/biome'>))
        /**
         * The step when the structure generates.
         *
         * Value:
         *
         *  - RawGeneration(`raw_generation`)
         *  - Lakes(`lakes`)
         *  - LocalModifications(`local_modifications`)
         *  - UndergroundStructures(`underground_structures`)
         *  - SurfaceStructures(`surface_structures`)
         *  - Strongholds(`strongholds`)
         *  - UndergroundOres(`underground_ores`)
         *  - UndergroundDecoration(`underground_decoration`)
         *  - FluidSprings(`fluid_springs`)
         *  - VegetalDecoration(`vegetal_decoration`)
         *  - TopLayerModification(`top_layer_modification`)
         */
        step: DecorationStep
        /**
         * Value:
         *
         *  - None(`none`)
         *  - BeardThin(`beard_thin`)
         *  - BeardBox(`beard_box`)
         *  - Bury(`bury`)
         *  - Encapsulate(`encapsulate`)
         */
        terrain_adaptation?: TerrainAdaptation
        spawn_overrides: ({
            [Key in Extract<MobCategory, string>]?: SpawnOverride;
        })
    } & (S extends keyof Dispatcher<'minecraft:structure_config'>
        ? Dispatcher<'minecraft:structure_config'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:worldgen/structure_type']])

export type StructureRef = (Registry['minecraft:worldgen/structure'] | Structure)

export type TerrainAdaptation = ('none' | 'beard_thin' | 'beard_box' | 'bury' | 'encapsulate')
type JigsawMaxDistanceFromCenterDispatcherMap = {
    'beard_box': JigsawMaxDistanceFromCenterBeardBox
    'minecraft:beard_box': JigsawMaxDistanceFromCenterBeardBox
    'beard_thin': JigsawMaxDistanceFromCenterBeardThin
    'minecraft:beard_thin': JigsawMaxDistanceFromCenterBeardThin
    'bury': JigsawMaxDistanceFromCenterBury
    'minecraft:bury': JigsawMaxDistanceFromCenterBury
}
type JigsawMaxDistanceFromCenterKeys = keyof JigsawMaxDistanceFromCenterDispatcherMap
type JigsawMaxDistanceFromCenterFallback = (
  | JigsawMaxDistanceFromCenterBeardBox
  | JigsawMaxDistanceFromCenterBeardThin
  | JigsawMaxDistanceFromCenterBury
  | JigsawMaxDistanceFromCenterFallbackType)
type JigsawMaxDistanceFromCenterFallbackType = (NBTInt<{
    min: 1
}> | JigsawDistanceLimits<NBTInt<{
    min: 1
}>>)
type JigsawMaxDistanceFromCenterNoneType = (NBTInt<{
    min: 1
}> | JigsawDistanceLimits<NBTInt<{
    min: 1
}>>)
type JigsawMaxDistanceFromCenterBeardBox = (NBTInt<{
    min: 1
}> | JigsawDistanceLimits<NBTInt<{
    min: 1
}>>)
type JigsawMaxDistanceFromCenterBeardThin = (NBTInt<{
    min: 1
}> | JigsawDistanceLimits<NBTInt<{
    min: 1
}>>)
type JigsawMaxDistanceFromCenterBury = (NBTInt<{
    min: 1
}> | JigsawDistanceLimits<NBTInt<{
    min: 1
}>>)
export type SymbolJigsawMaxDistanceFromCenter<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? JigsawMaxDistanceFromCenterDispatcherMap
    : CASE extends 'keys'
        ? JigsawMaxDistanceFromCenterKeys
        : CASE extends '%fallback'
            ? JigsawMaxDistanceFromCenterFallback
            : CASE extends '%none' ? JigsawMaxDistanceFromCenterNoneType : never
type StructureConfigDispatcherMap = {
    'bastion_remnant': StructureConfigBastionRemnant
    'minecraft:bastion_remnant': StructureConfigBastionRemnant
    'buried_treasure': StructureConfigBuriedTreasure
    'minecraft:buried_treasure': StructureConfigBuriedTreasure
    'desert_pyramid': StructureConfigDesertPyramid
    'minecraft:desert_pyramid': StructureConfigDesertPyramid
    'end_city': StructureConfigEndCity
    'minecraft:end_city': StructureConfigEndCity
    'fortress': StructureConfigFortress
    'minecraft:fortress': StructureConfigFortress
    'igloo': StructureConfigIgloo
    'minecraft:igloo': StructureConfigIgloo
    'jigsaw': StructureConfigJigsaw
    'minecraft:jigsaw': StructureConfigJigsaw
    'jungle_temple': StructureConfigJungleTemple
    'minecraft:jungle_temple': StructureConfigJungleTemple
    'mineshaft': StructureConfigMineshaft
    'minecraft:mineshaft': StructureConfigMineshaft
    'nether_fossil': StructureConfigNetherFossil
    'minecraft:nether_fossil': StructureConfigNetherFossil
    'ocean_monument': StructureConfigOceanMonument
    'minecraft:ocean_monument': StructureConfigOceanMonument
    'ocean_ruin': StructureConfigOceanRuin
    'minecraft:ocean_ruin': StructureConfigOceanRuin
    'pillager_outpost': StructureConfigPillagerOutpost
    'minecraft:pillager_outpost': StructureConfigPillagerOutpost
    'ruined_portal': StructureConfigRuinedPortal
    'minecraft:ruined_portal': StructureConfigRuinedPortal
    'shipwreck': StructureConfigShipwreck
    'minecraft:shipwreck': StructureConfigShipwreck
    'stronghold': StructureConfigStronghold
    'minecraft:stronghold': StructureConfigStronghold
    'swamp_hut': StructureConfigSwampHut
    'minecraft:swamp_hut': StructureConfigSwampHut
    'village': StructureConfigVillage
    'minecraft:village': StructureConfigVillage
    'woodland_mansion': StructureConfigWoodlandMansion
    'minecraft:woodland_mansion': StructureConfigWoodlandMansion
}
type StructureConfigKeys = keyof StructureConfigDispatcherMap
type StructureConfigFallback = (
  | StructureConfigBastionRemnant
  | StructureConfigBuriedTreasure
  | StructureConfigDesertPyramid
  | StructureConfigEndCity
  | StructureConfigFortress
  | StructureConfigIgloo
  | StructureConfigJigsaw
  | StructureConfigJungleTemple
  | StructureConfigMineshaft
  | StructureConfigNetherFossil
  | StructureConfigOceanMonument
  | StructureConfigOceanRuin
  | StructureConfigPillagerOutpost
  | StructureConfigRuinedPortal
  | StructureConfigShipwreck
  | StructureConfigStronghold
  | StructureConfigSwampHut
  | StructureConfigVillage
  | StructureConfigWoodlandMansion)
type StructureConfigBastionRemnant = Jigsaw
type StructureConfigBuriedTreasure = BuriedTreasure
type StructureConfigDesertPyramid = Record<string, never>
type StructureConfigEndCity = Record<string, never>
type StructureConfigFortress = Record<string, never>
type StructureConfigIgloo = Record<string, never>
type StructureConfigJigsaw = Jigsaw
type StructureConfigJungleTemple = Record<string, never>
type StructureConfigMineshaft = Mineshaft
type StructureConfigNetherFossil = NetherFossil
type StructureConfigOceanMonument = Record<string, never>
type StructureConfigOceanRuin = OceanRuin
type StructureConfigPillagerOutpost = Jigsaw
type StructureConfigRuinedPortal = RuinedPortal
type StructureConfigShipwreck = Shipwreck
type StructureConfigStronghold = Record<string, never>
type StructureConfigSwampHut = Record<string, never>
type StructureConfigVillage = Jigsaw
type StructureConfigWoodlandMansion = Record<string, never>
export type SymbolStructureConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? StructureConfigDispatcherMap
    : CASE extends 'keys' ? StructureConfigKeys : CASE extends '%fallback' ? StructureConfigFallback : never
type WorldgenPoolAliasBindingDispatcherMap = {
    'direct': WorldgenPoolAliasBindingDirect
    'minecraft:direct': WorldgenPoolAliasBindingDirect
    'random': WorldgenPoolAliasBindingRandom
    'minecraft:random': WorldgenPoolAliasBindingRandom
    'random_group': WorldgenPoolAliasBindingRandomGroup
    'minecraft:random_group': WorldgenPoolAliasBindingRandomGroup
}
type WorldgenPoolAliasBindingKeys = keyof WorldgenPoolAliasBindingDispatcherMap
type WorldgenPoolAliasBindingFallback = (
  | WorldgenPoolAliasBindingDirect
  | WorldgenPoolAliasBindingRandom
  | WorldgenPoolAliasBindingRandomGroup)
type WorldgenPoolAliasBindingDirect = DirectPoolAlias
type WorldgenPoolAliasBindingRandom = RandomPoolAlias
type WorldgenPoolAliasBindingRandomGroup = RandomGroupPoolAlias
export type SymbolWorldgenPoolAliasBinding<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? WorldgenPoolAliasBindingDispatcherMap
    : CASE extends 'keys'
        ? WorldgenPoolAliasBindingKeys
        : CASE extends '%fallback' ? WorldgenPoolAliasBindingFallback : never
