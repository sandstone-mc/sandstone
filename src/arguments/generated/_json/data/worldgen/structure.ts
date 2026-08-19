import type { JsonMobCategory, JsonSpawnerData } from 'sandstone/arguments/generated/_json/data/worldgen/biome.ts'
import type {
  JsonDecorationStep,
  JsonHeightmapType,
  JsonHeightProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonFlatWeightedList, JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonNBTObject, JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NamespacedString, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonBiomeTemperature = ('cold' | 'warm')

export type JsonBoundingBox = ('piece' | 'full')

export type JsonBuriedTreasure = Record<string, never>

export type JsonDimensionPaddingConfig = {
  /**
   * Value:
   * Range: 0..
   */
  bottom?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  top?: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonDirectPoolAlias = {
  alias: NamespacedString,
  target: JsonRegistry['minecraft:worldgen/template_pool'],
}

export type JsonJigsaw<S = undefined> = ({
  start_pool: JsonRegistry['minecraft:worldgen/template_pool'],
  /**
   * Value:
   * Range: 1..20
   */
  size: (NBTInt<{
    min: 1,
    max: 20,
  }> | number),
  pool_aliases?: Array<JsonPoolAlias>,
} & {
  start_height: JsonHeightProvider,
  start_jigsaw_name?: NamespacedString,
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
  project_start_to_heightmap?: JsonHeightmapType,
  max_distance_from_center: (S extends undefined
    ? JsonSymbolJigsawMaxDistanceFromCenter<'%none'> :
    (S extends keyof JsonSymbolJigsawMaxDistanceFromCenter
      ? JsonSymbolJigsawMaxDistanceFromCenter[S]
      : JsonSymbolJigsawMaxDistanceFromCenter<'%unknown'>)),
  use_expansion_hack: boolean,
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
  dimension_padding?: ((NBTInt<{
    min: 0,
  }> | number) | {
    /**
     * Value:
     * Range: 0..
     */
    bottom?: (NBTInt<{
      min: 0,
    }> | number),
    /**
     * Value:
     * Range: 0..
     */
    top?: (NBTInt<{
      min: 0,
    }> | number),
  }),
  /**
   * Value:
   *
   *  - ApplyWaterlogging(`apply_waterlogging`)
   *  - IgnoreWaterlogging(`ignore_waterlogging`)
   */
  liquid_settings?: JsonLiquidSettings,
})

export type JsonJigsawDistanceLimits<T extends JsonNBTObject> = {
  horizontal: T,
  /**
   * Defaults to 4064
   *
   * Value:
   * Range: 1..4064
   */
  vertical?: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonLiquidSettings = ('apply_waterlogging' | 'ignore_waterlogging')

export type JsonMineshaft = {
  /**
   * Value:
   *
   *  - Normal(`normal`)
   *  - Mesa(`mesa`)
   */
  mineshaft_type: JsonMineshaftType,
}

export type JsonMineshaftType = ('normal' | 'mesa')

export type JsonNetherFossil = {
  height: JsonHeightProvider,
}

export type JsonOceanRuin = {
  /**
   * Value:
   *
   *  - Cold(`cold`)
   *  - Warm(`warm`)
   */
  biome_temp: JsonBiomeTemperature,
  /**
   * Value:
   * Range: 0..1
   */
  large_probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  cluster_probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonPoolAlias = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/pool_alias_binding'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolWorldgenPoolAliasBinding ? JsonSymbolWorldgenPoolAliasBinding[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/pool_alias_binding'], string>])>

export type JsonRandomGroupPoolAlias = {
  groups: JsonNonEmptyWeightedList<Array<JsonPoolAlias>>,
}

export type JsonRandomPoolAlias = {
  alias: NamespacedString,
  targets: JsonNonEmptyWeightedList<JsonRegistry['minecraft:worldgen/template_pool']>,
}

export type JsonRuinedPortal = {
  setups: Array<JsonRuinedPortalSetup>,
}

export type JsonRuinedPortalPlacement = (
  | 'on_land_surface'
  | 'partly_buried'
  | 'on_ocean_floor'
  | 'in_mountain'
  | 'underground'
  | 'in_nether')

export type JsonRuinedPortalSetup = {
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
  placement: JsonRuinedPortalPlacement,
  /**
   * Value:
   * Range: 0..1
   */
  air_pocket_probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  mossiness: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  overgrown: boolean,
  vines: boolean,
  can_be_cold: boolean,
  replace_with_blackstone: boolean,
  /**
   * Value:
   * Range: 0..
   */
  weight: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
}

export type JsonRuinedPortalType = ('standard' | 'desert' | 'jungle' | 'mountain' | 'nether' | 'ocean' | 'swamp')

export type JsonShipwreck = {
  is_beached?: boolean,
}

export type JsonSpawnOverride = {
  /**
   * Value:
   *
   *  - Piece(`piece`)
   *  - Full(`full`)
   */
  bounding_box: JsonBoundingBox,
  spawns: JsonFlatWeightedList<JsonSpawnerData>,
}

export type JsonStructure = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/structure_type'], string>, string>]?: ({
    type: S,
    biomes: (
          | Array<JsonRegistry['minecraft:worldgen/biome']> | (
            | JsonRegistry['minecraft:worldgen/biome']
            | `#${JsonRegistry['minecraft:tag/worldgen/biome']}`
            | TagClass<'worldgen/biome'>)),
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
    step: JsonDecorationStep,
    /**
     * Value:
     *
     *  - None(`none`)
     *  - BeardThin(`beard_thin`)
     *  - BeardBox(`beard_box`)
     *  - Bury(`bury`)
     *  - Encapsulate(`encapsulate`)
     */
    terrain_adaptation?: JsonTerrainAdaptation,
    spawn_overrides: ({
      [Key in Extract<JsonMobCategory, string>]?: JsonSpawnOverride
    }),
  } & (S extends keyof JsonSymbolStructureConfig ? JsonSymbolStructureConfig[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/structure_type'], string>])>

export type JsonStructureRef = (JsonRegistry['minecraft:worldgen/structure'] | JsonStructure)

export type JsonTerrainAdaptation = ('none' | 'beard_thin' | 'beard_box' | 'bury' | 'encapsulate')

export type JsonTrickyTrialsStructureConfig = {
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
  dimension_padding?: ((NBTInt<{
    min: 0,
  }> | number) | {
    /**
     * Value:
     * Range: 0..
     */
    bottom?: (NBTInt<{
      min: 0,
    }> | number),
    /**
     * Value:
     * Range: 0..
     */
    top?: (NBTInt<{
      min: 0,
    }> | number),
  }),
  /**
   * Value:
   *
   *  - ApplyWaterlogging(`apply_waterlogging`)
   *  - IgnoreWaterlogging(`ignore_waterlogging`)
   */
  liquid_settings?: JsonLiquidSettings,
}

export type JsonWildUpdateStructureConfig<S = undefined> = {
  start_height: JsonHeightProvider,
  start_jigsaw_name?: NamespacedString,
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
  project_start_to_heightmap?: JsonHeightmapType,
  max_distance_from_center: (S extends undefined
    ? JsonSymbolJigsawMaxDistanceFromCenter<'%none'> :
    (S extends keyof JsonSymbolJigsawMaxDistanceFromCenter
      ? JsonSymbolJigsawMaxDistanceFromCenter[S]
      : JsonSymbolJigsawMaxDistanceFromCenter<'%unknown'>)),
  use_expansion_hack: boolean,
}
type JsonJigsawMaxDistanceFromCenterDispatcherMap = {
  'beard_box': JsonJigsawMaxDistanceFromCenterBeardBox,
  'minecraft:beard_box': JsonJigsawMaxDistanceFromCenterBeardBox,
  'beard_thin': JsonJigsawMaxDistanceFromCenterBeardThin,
  'minecraft:beard_thin': JsonJigsawMaxDistanceFromCenterBeardThin,
  'bury': JsonJigsawMaxDistanceFromCenterBury,
  'minecraft:bury': JsonJigsawMaxDistanceFromCenterBury,
}
type JsonJigsawMaxDistanceFromCenterKeys = keyof JsonJigsawMaxDistanceFromCenterDispatcherMap
type JsonJigsawMaxDistanceFromCenterFallback = (
  | JsonJigsawMaxDistanceFromCenterBeardBox
  | JsonJigsawMaxDistanceFromCenterBeardThin
  | JsonJigsawMaxDistanceFromCenterBury
  | JsonJigsawMaxDistanceFromCenterFallbackType)
export type JsonJigsawMaxDistanceFromCenterFallbackType = ((NBTInt<{
  min: 1,
}> | number) | JsonJigsawDistanceLimits<(NBTInt<{
  min: 1,
}> | number)>)
type JsonJigsawMaxDistanceFromCenterNoneType = ((NBTInt<{
  min: 1,
}> | number) | JsonJigsawDistanceLimits<(NBTInt<{
  min: 1,
}> | number)>)
type JsonJigsawMaxDistanceFromCenterBeardBox = ((NBTInt<{
  min: 1,
}> | number) | JsonJigsawDistanceLimits<(NBTInt<{
  min: 1,
}> | number)>)
type JsonJigsawMaxDistanceFromCenterBeardThin = ((NBTInt<{
  min: 1,
}> | number) | JsonJigsawDistanceLimits<(NBTInt<{
  min: 1,
}> | number)>)
type JsonJigsawMaxDistanceFromCenterBury = ((NBTInt<{
  min: 1,
}> | number) | JsonJigsawDistanceLimits<(NBTInt<{
  min: 1,
}> | number)>)
export type JsonSymbolJigsawMaxDistanceFromCenter<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonJigsawMaxDistanceFromCenterDispatcherMap
  : CASE extends 'keys'
    ? JsonJigsawMaxDistanceFromCenterKeys
    : CASE extends '%fallback'
      ? JsonJigsawMaxDistanceFromCenterFallback
      : CASE extends '%none'
        ? JsonJigsawMaxDistanceFromCenterNoneType
        : CASE extends '%unknown' ? JsonJigsawMaxDistanceFromCenterFallbackType : never
type JsonStructureConfigDispatcherMap = {
  'bastion_remnant': JsonStructureConfigBastionRemnant,
  'minecraft:bastion_remnant': JsonStructureConfigBastionRemnant,
  'buried_treasure': JsonStructureConfigBuriedTreasure,
  'minecraft:buried_treasure': JsonStructureConfigBuriedTreasure,
  'desert_pyramid': JsonStructureConfigDesertPyramid,
  'minecraft:desert_pyramid': JsonStructureConfigDesertPyramid,
  'end_city': JsonStructureConfigEndCity,
  'minecraft:end_city': JsonStructureConfigEndCity,
  'fortress': JsonStructureConfigFortress,
  'minecraft:fortress': JsonStructureConfigFortress,
  'igloo': JsonStructureConfigIgloo,
  'minecraft:igloo': JsonStructureConfigIgloo,
  'jigsaw': JsonStructureConfigJigsaw,
  'minecraft:jigsaw': JsonStructureConfigJigsaw,
  'jungle_temple': JsonStructureConfigJungleTemple,
  'minecraft:jungle_temple': JsonStructureConfigJungleTemple,
  'mineshaft': JsonStructureConfigMineshaft,
  'minecraft:mineshaft': JsonStructureConfigMineshaft,
  'nether_fossil': JsonStructureConfigNetherFossil,
  'minecraft:nether_fossil': JsonStructureConfigNetherFossil,
  'ocean_monument': JsonStructureConfigOceanMonument,
  'minecraft:ocean_monument': JsonStructureConfigOceanMonument,
  'ocean_ruin': JsonStructureConfigOceanRuin,
  'minecraft:ocean_ruin': JsonStructureConfigOceanRuin,
  'pillager_outpost': JsonStructureConfigPillagerOutpost,
  'minecraft:pillager_outpost': JsonStructureConfigPillagerOutpost,
  'ruined_portal': JsonStructureConfigRuinedPortal,
  'minecraft:ruined_portal': JsonStructureConfigRuinedPortal,
  'shipwreck': JsonStructureConfigShipwreck,
  'minecraft:shipwreck': JsonStructureConfigShipwreck,
  'stronghold': JsonStructureConfigStronghold,
  'minecraft:stronghold': JsonStructureConfigStronghold,
  'swamp_hut': JsonStructureConfigSwampHut,
  'minecraft:swamp_hut': JsonStructureConfigSwampHut,
  'village': JsonStructureConfigVillage,
  'minecraft:village': JsonStructureConfigVillage,
  'woodland_mansion': JsonStructureConfigWoodlandMansion,
  'minecraft:woodland_mansion': JsonStructureConfigWoodlandMansion,
}
type JsonStructureConfigKeys = keyof JsonStructureConfigDispatcherMap
type JsonStructureConfigFallback = (
  | JsonStructureConfigBastionRemnant
  | JsonStructureConfigBuriedTreasure
  | JsonStructureConfigDesertPyramid
  | JsonStructureConfigEndCity
  | JsonStructureConfigFortress
  | JsonStructureConfigIgloo
  | JsonStructureConfigJigsaw
  | JsonStructureConfigJungleTemple
  | JsonStructureConfigMineshaft
  | JsonStructureConfigNetherFossil
  | JsonStructureConfigOceanMonument
  | JsonStructureConfigOceanRuin
  | JsonStructureConfigPillagerOutpost
  | JsonStructureConfigRuinedPortal
  | JsonStructureConfigShipwreck
  | JsonStructureConfigStronghold
  | JsonStructureConfigSwampHut
  | JsonStructureConfigVillage
  | JsonStructureConfigWoodlandMansion)
type JsonStructureConfigBastionRemnant = JsonJigsaw
type JsonStructureConfigBuriedTreasure = JsonBuriedTreasure
type JsonStructureConfigDesertPyramid = Record<string, never>
type JsonStructureConfigEndCity = Record<string, never>
type JsonStructureConfigFortress = Record<string, never>
type JsonStructureConfigIgloo = Record<string, never>
type JsonStructureConfigJigsaw = JsonJigsaw
type JsonStructureConfigJungleTemple = Record<string, never>
type JsonStructureConfigMineshaft = JsonMineshaft
type JsonStructureConfigNetherFossil = JsonNetherFossil
type JsonStructureConfigOceanMonument = Record<string, never>
type JsonStructureConfigOceanRuin = JsonOceanRuin
type JsonStructureConfigPillagerOutpost = JsonJigsaw
type JsonStructureConfigRuinedPortal = JsonRuinedPortal
type JsonStructureConfigShipwreck = JsonShipwreck
type JsonStructureConfigStronghold = Record<string, never>
type JsonStructureConfigSwampHut = Record<string, never>
type JsonStructureConfigVillage = JsonJigsaw
type JsonStructureConfigWoodlandMansion = Record<string, never>
export type JsonSymbolStructureConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonStructureConfigDispatcherMap
  : CASE extends 'keys' ? JsonStructureConfigKeys : CASE extends '%fallback' ? JsonStructureConfigFallback : never
type JsonWorldgenPoolAliasBindingDispatcherMap = {
  'direct': JsonWorldgenPoolAliasBindingDirect,
  'minecraft:direct': JsonWorldgenPoolAliasBindingDirect,
  'random': JsonWorldgenPoolAliasBindingRandom,
  'minecraft:random': JsonWorldgenPoolAliasBindingRandom,
  'random_group': JsonWorldgenPoolAliasBindingRandomGroup,
  'minecraft:random_group': JsonWorldgenPoolAliasBindingRandomGroup,
}
type JsonWorldgenPoolAliasBindingKeys = keyof JsonWorldgenPoolAliasBindingDispatcherMap
type JsonWorldgenPoolAliasBindingFallback = (
  | JsonWorldgenPoolAliasBindingDirect
  | JsonWorldgenPoolAliasBindingRandom
  | JsonWorldgenPoolAliasBindingRandomGroup)
type JsonWorldgenPoolAliasBindingDirect = JsonDirectPoolAlias
type JsonWorldgenPoolAliasBindingRandom = JsonRandomPoolAlias
type JsonWorldgenPoolAliasBindingRandomGroup = JsonRandomGroupPoolAlias
export type JsonSymbolWorldgenPoolAliasBinding<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonWorldgenPoolAliasBindingDispatcherMap
  : CASE extends 'keys'
    ? JsonWorldgenPoolAliasBindingKeys
    : CASE extends '%fallback' ? JsonWorldgenPoolAliasBindingFallback : never
