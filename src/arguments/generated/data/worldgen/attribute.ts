import type { AttributeTrackBase } from 'sandstone/arguments/generated/data/timeline.ts'
import type { MoonPhase, SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type {
  BooleanAttributeModifier,
  BooleanModifierType,
  ColorAttributeModifier,
  ColorModifierType,
  FloatAttributeModifier,
  FloatModifierType,
  ListModifier,
  ListModifierType,
  MergeableModifier,
  MergeableModifierType,
  OverrideModifier,
  TranslucentColorAttributeModifier,
} from 'sandstone/arguments/generated/data/worldgen/attribute/modifier.ts'
import type {
  BiomeMusic,
  BiomeSoundAdditions,
  MoodSound,
  NaturalMobSpawns,
} from 'sandstone/arguments/generated/data/worldgen/biome.ts'
import type {
  SymbolEnvironmentAttributeArgbColorModifier,
  SymbolEnvironmentAttributeColorModifier,
  SymbolEnvironmentAttributeFloatModifier,
} from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { StringARGB, StringRGB } from 'sandstone/arguments/generated/util/color.ts'
import type { Particle } from 'sandstone/arguments/generated/util/particle.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { NBTObject, RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type AmbientParticle = {
  particle: Particle,
  /**
   * Value:
   * Range: 0..1
   */
  probability: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type AmbientSounds = {
  loop?: SoundEventRef,
  mood?: MoodSound,
  additions?: (BiomeSoundAdditions | Array<BiomeSoundAdditions>),
}

export type ARGBColorAttribute = {
  value: StringARGB,
  modifier: TranslucentColorAttributeModifier,
  attribute_track: ({
    [S in Extract<Extract<ColorModifierType, string>, string>]?: (AttributeTrackBase & {
      /**
       * Value:
       *
       *  - Override(`override`)
       *  - Add(`add`)
       *  - Subtract(`subtract`)
       *  - Multiply(`multiply`)
       *  - AlphaBlend(`alpha_blend`)
       *  - BlendToGray(`blend_to_gray`)
       */
      modifier?: S,
      /**
       * Value:
       * List length range: 1..
       */
      keyframes: NBTList<{
        /**
         * Value:
         * Range: 0..
         */
        ticks: NBTInt<{
          min: 0,
        }>,
        value: (S extends undefined
          ? SymbolEnvironmentAttributeArgbColorModifier<'%none'> :
          (S extends keyof SymbolEnvironmentAttributeArgbColorModifier
            ? SymbolEnvironmentAttributeArgbColorModifier[S]
            : RootNBT)),
      }, {
        leftExclusive: false,
        min: 1,
      }>,
    })
  }[Extract<ColorModifierType, string>]),
}

export type BackgroundMusic = {
  /**
   * Default music to play
   */
  default?: BiomeMusic,
  /**
   * Overrides default music when underwater
   */
  underwater?: BiomeMusic,
  /**
   * Overrides default music when in creative mode
   */
  creative?: BiomeMusic,
}

export type BedRule = {
  /**
   * Value:
   *
   *  - Always(`always`)
   *  - WhenDark(`when_dark`)
   *  - Never(`never`)
   */
  can_sleep: BedRuleType,
  /**
   * Value:
   *
   *  - Always(`always`)
   *  - WhenDark(`when_dark`)
   *  - Never(`never`)
   */
  can_set_spawn: BedRuleType,
  destroy_on_use?: boolean,
  destroy_on_leave?: boolean,
  error_message?: Text,
}

export type BedRuleType = ('always' | 'when_dark' | 'never')

export type BooleanAttribute = {
  value: boolean,
  modifier: BooleanAttributeModifier,
  attribute_track: (AttributeTrackBase & {
    /**
     * Value:
     *
     *  - Override(`override`)
     *  - And(`and`)
     *  - Nand(`nand`)
     *  - Or(`or`)
     *  - Nor(`nor`)
     *  - Xor(`xor`)
     *  - Xnor(`xnor`)
     */
    modifier?: BooleanModifierType,
    /**
     * Value:
     * List length range: 1..
     */
    keyframes: NBTList<{
      /**
       * Value:
       * Range: 0..
       */
      ticks: NBTInt<{
        min: 0,
      }>,
      value: boolean,
    }, {
      leftExclusive: false,
      min: 1,
    }>,
  }),
}

export type DiscreteAttribute<T extends NBTObject> = {
  value: T,
  modifier: OverrideModifier<T>,
  attribute_track: (AttributeTrackBase & {
    modifier?: 'override',
    /**
     * Value:
     * List length range: 1..
     */
    keyframes: NBTList<{
      /**
       * Value:
       * Range: 0..
       */
      ticks: NBTInt<{
        min: 0,
      }>,
      value: T,
    }, {
      leftExclusive: false,
      min: 1,
    }>,
  }),
}

export type EnvironmentAttributeMap<K extends NBTObject> = ({
  [Key in Extract<K, string>]?: ((
      | Key extends keyof SymbolEnvironmentAttribute ?
        ('value' extends keyof SymbolEnvironmentAttribute[Key]
          ? SymbolEnvironmentAttribute[Key]['value']
          : SymbolEnvironmentAttribute<'%unknown'>)
        : SymbolEnvironmentAttribute<'%unknown'>) | (
      Key extends keyof SymbolEnvironmentAttribute ?
        ('modifier' extends keyof SymbolEnvironmentAttribute[Key]
          ? SymbolEnvironmentAttribute[Key]['modifier']
          : SymbolEnvironmentAttribute<'%unknown'>)
        : SymbolEnvironmentAttribute<'%unknown'>))
})

export type FloatAttribute<T extends NBTObject> = {
  value: T,
  modifier: FloatAttributeModifier<T>,
  attribute_track: ({
    [S in Extract<Extract<FloatModifierType, string>, string>]?: (AttributeTrackBase & {
      /**
       * Value:
       *
       *  - Override(`override`)
       *  - Add(`add`)
       *  - Subtract(`subtract`)
       *  - Multiply(`multiply`)
       *  - Minimum(`minimum`)
       *  - Maximum(`maximum`)
       *  - AlphaBlend(`alpha_blend`)
       */
      modifier?: S,
      /**
       * Value:
       * List length range: 1..
       */
      keyframes: NBTList<{
        /**
         * Value:
         * Range: 0..
         */
        ticks: NBTInt<{
          min: 0,
        }>,
        value: (S extends undefined
          ? SymbolEnvironmentAttributeFloatModifier<T, '%none'> :
          (S extends keyof SymbolEnvironmentAttributeFloatModifier<T>
            ? SymbolEnvironmentAttributeFloatModifier<T>[S]
            : SymbolEnvironmentAttributeFloatModifier<T, '%unknown'>)),
      }, {
        leftExclusive: false,
        min: 1,
      }>,
    })
  }[Extract<FloatModifierType, string>]),
}

export type GlobalEnvironmentAttributeMap = EnvironmentAttributeMap<Registry['minecraft:environment_attribute']>

export type ListAttribute<E extends NBTObject> = {
  value: Array<E>,
  modifier: ListModifier<E>,
  attribute_track: (AttributeTrackBase & {
    /**
     * Value:
     *
     *  - Override(`override`)
     *  - Append(`append`)
     */
    modifier?: ListModifierType,
    /**
     * Value:
     * List length range: 1..
     */
    keyframes: NBTList<{
      /**
       * Value:
       * Range: 0..
       */
      ticks: NBTInt<{
        min: 0,
      }>,
      value: Array<E>,
    }, {
      leftExclusive: false,
      min: 1,
    }>,
  }),
}

export type MergeableAttribute<T extends NBTObject> = {
  value: T,
  modifier: MergeableModifier<T>,
  attribute_track: (AttributeTrackBase & {
    /**
     * Value:
     *
     *  - Override(`override`)
     *  - Overlay(`overlay`)
     */
    modifier?: MergeableModifierType,
    /**
     * Value:
     * List length range: 1..
     */
    keyframes: NBTList<{
      /**
       * Value:
       * Range: 0..
       */
      ticks: NBTInt<{
        min: 0,
      }>,
      value: T,
    }, {
      leftExclusive: false,
      min: 1,
    }>,
  }),
}

export type NumericalEnvironmentAttribute = (
  | 'visual/cloud_height'
  | 'visual/fog_start_distance'
  | 'visual/moon_angle'
  | 'visual/star_angle'
  | 'visual/sun_angle'
  | 'visual/water_fog_start_distance'
  | 'visual/cloud_fog_end_distance'
  | 'visual/fog_end_distance'
  | 'visual/sky_fog_end_distance'
  | 'visual/water_fog_end_distance'
  | 'visual/sky_light_factor'
  | 'visual/star_brightness'
  | 'audio/music_volume'
  | 'gameplay/cat_waking_up_gift_chance'
  | 'gameplay/creature_world_gen_spawn_probability'
  | 'gameplay/surface_slime_spawn_chance'
  | 'gameplay/turtle_egg_hatch_chance'
  | 'gameplay/sky_light_level')

export type PositionalEnvironmentAttribute = Registry['minecraft:environment_attribute']

export type PositionalEnvironmentAttributeMap = EnvironmentAttributeMap<PositionalEnvironmentAttribute>

export type RGBColorAttribute = {
  value: StringRGB,
  modifier: ColorAttributeModifier,
  attribute_track: ({
    [S in Extract<Extract<ColorModifierType, string>, string>]?: (AttributeTrackBase & {
      /**
       * Value:
       *
       *  - Override(`override`)
       *  - Add(`add`)
       *  - Subtract(`subtract`)
       *  - Multiply(`multiply`)
       *  - AlphaBlend(`alpha_blend`)
       *  - BlendToGray(`blend_to_gray`)
       */
      modifier?: S,
      /**
       * Value:
       * List length range: 1..
       */
      keyframes: NBTList<{
        /**
         * Value:
         * Range: 0..
         */
        ticks: NBTInt<{
          min: 0,
        }>,
        value: (S extends undefined
          ? SymbolEnvironmentAttributeColorModifier<'%none'> :
          (S extends keyof SymbolEnvironmentAttributeColorModifier
            ? SymbolEnvironmentAttributeColorModifier[S]
            : SymbolEnvironmentAttributeColorModifier<'%unknown'>)),
      }, {
        leftExclusive: false,
        min: 1,
      }>,
    })
  }[Extract<ColorModifierType, string>]),
}

export type TriState = (boolean | 'default')
type EnvironmentAttributeDispatcherMap = {
  'audio/ambient_sounds': EnvironmentAttributeAudioAmbientSounds,
  'minecraft:audio/ambient_sounds': EnvironmentAttributeAudioAmbientSounds,
  'audio/background_music': EnvironmentAttributeAudioBackgroundMusic,
  'minecraft:audio/background_music': EnvironmentAttributeAudioBackgroundMusic,
  'audio/firefly_bush_sounds': EnvironmentAttributeAudioFireflyBushSounds,
  'minecraft:audio/firefly_bush_sounds': EnvironmentAttributeAudioFireflyBushSounds,
  'audio/music_volume': EnvironmentAttributeAudioMusicVolume,
  'minecraft:audio/music_volume': EnvironmentAttributeAudioMusicVolume,
  'gameplay/baby_villager_activity': EnvironmentAttributeGameplayBabyVillagerActivity,
  'minecraft:gameplay/baby_villager_activity': EnvironmentAttributeGameplayBabyVillagerActivity,
  'gameplay/bed_rule': EnvironmentAttributeGameplayBedRule,
  'minecraft:gameplay/bed_rule': EnvironmentAttributeGameplayBedRule,
  'gameplay/bees_stay_in_hive': EnvironmentAttributeGameplayBeesStayInHive,
  'minecraft:gameplay/bees_stay_in_hive': EnvironmentAttributeGameplayBeesStayInHive,
  'gameplay/can_pillager_patrol_spawn': EnvironmentAttributeGameplayCanPillagerPatrolSpawn,
  'minecraft:gameplay/can_pillager_patrol_spawn': EnvironmentAttributeGameplayCanPillagerPatrolSpawn,
  'gameplay/can_start_raid': EnvironmentAttributeGameplayCanStartRaid,
  'minecraft:gameplay/can_start_raid': EnvironmentAttributeGameplayCanStartRaid,
  'gameplay/cat_waking_up_gift_chance': EnvironmentAttributeGameplayCatWakingUpGiftChance,
  'minecraft:gameplay/cat_waking_up_gift_chance': EnvironmentAttributeGameplayCatWakingUpGiftChance,
  'gameplay/creaking_active': EnvironmentAttributeGameplayCreakingActive,
  'minecraft:gameplay/creaking_active': EnvironmentAttributeGameplayCreakingActive,
  'gameplay/creature_world_gen_spawn_probability': EnvironmentAttributeGameplayCreatureWorldGenSpawnProbability,
  'minecraft:gameplay/creature_world_gen_spawn_probability': EnvironmentAttributeGameplayCreatureWorldGenSpawnProbability,
  'gameplay/eyeblossom_open': EnvironmentAttributeGameplayEyeblossomOpen,
  'minecraft:gameplay/eyeblossom_open': EnvironmentAttributeGameplayEyeblossomOpen,
  'gameplay/fast_lava': EnvironmentAttributeGameplayFastLava,
  'minecraft:gameplay/fast_lava': EnvironmentAttributeGameplayFastLava,
  'gameplay/increased_fire_burnout': EnvironmentAttributeGameplayIncreasedFireBurnout,
  'minecraft:gameplay/increased_fire_burnout': EnvironmentAttributeGameplayIncreasedFireBurnout,
  'gameplay/monsters_burn': EnvironmentAttributeGameplayMonstersBurn,
  'minecraft:gameplay/monsters_burn': EnvironmentAttributeGameplayMonstersBurn,
  'gameplay/natural_mob_spawns': EnvironmentAttributeGameplayNaturalMobSpawns,
  'minecraft:gameplay/natural_mob_spawns': EnvironmentAttributeGameplayNaturalMobSpawns,
  'gameplay/nether_portal_spawns_piglin': EnvironmentAttributeGameplayNetherPortalSpawnsPiglin,
  'minecraft:gameplay/nether_portal_spawns_piglin': EnvironmentAttributeGameplayNetherPortalSpawnsPiglin,
  'gameplay/piglins_zombify': EnvironmentAttributeGameplayPiglinsZombify,
  'minecraft:gameplay/piglins_zombify': EnvironmentAttributeGameplayPiglinsZombify,
  'gameplay/respawn_anchor_works': EnvironmentAttributeGameplayRespawnAnchorWorks,
  'minecraft:gameplay/respawn_anchor_works': EnvironmentAttributeGameplayRespawnAnchorWorks,
  'gameplay/sky_light_level': EnvironmentAttributeGameplaySkyLightLevel,
  'minecraft:gameplay/sky_light_level': EnvironmentAttributeGameplaySkyLightLevel,
  'gameplay/snow_golem_melts': EnvironmentAttributeGameplaySnowGolemMelts,
  'minecraft:gameplay/snow_golem_melts': EnvironmentAttributeGameplaySnowGolemMelts,
  'gameplay/straw_bed_rule': EnvironmentAttributeGameplayStrawBedRule,
  'minecraft:gameplay/straw_bed_rule': EnvironmentAttributeGameplayStrawBedRule,
  'gameplay/surface_slime_spawn_chance': EnvironmentAttributeGameplaySurfaceSlimeSpawnChance,
  'minecraft:gameplay/surface_slime_spawn_chance': EnvironmentAttributeGameplaySurfaceSlimeSpawnChance,
  'gameplay/turtle_egg_hatch_chance': EnvironmentAttributeGameplayTurtleEggHatchChance,
  'minecraft:gameplay/turtle_egg_hatch_chance': EnvironmentAttributeGameplayTurtleEggHatchChance,
  'gameplay/villager_activity': EnvironmentAttributeGameplayVillagerActivity,
  'minecraft:gameplay/villager_activity': EnvironmentAttributeGameplayVillagerActivity,
  'gameplay/water_evaporates': EnvironmentAttributeGameplayWaterEvaporates,
  'minecraft:gameplay/water_evaporates': EnvironmentAttributeGameplayWaterEvaporates,
  'visual/ambient_light_color': EnvironmentAttributeVisualAmbientLightColor,
  'minecraft:visual/ambient_light_color': EnvironmentAttributeVisualAmbientLightColor,
  'visual/ambient_particles': EnvironmentAttributeVisualAmbientParticles,
  'minecraft:visual/ambient_particles': EnvironmentAttributeVisualAmbientParticles,
  'visual/block_light_tint': EnvironmentAttributeVisualBlockLightTint,
  'minecraft:visual/block_light_tint': EnvironmentAttributeVisualBlockLightTint,
  'visual/cloud_color': EnvironmentAttributeVisualCloudColor,
  'minecraft:visual/cloud_color': EnvironmentAttributeVisualCloudColor,
  'visual/cloud_fog_end_distance': EnvironmentAttributeVisualCloudFogEndDistance,
  'minecraft:visual/cloud_fog_end_distance': EnvironmentAttributeVisualCloudFogEndDistance,
  'visual/cloud_height': EnvironmentAttributeVisualCloudHeight,
  'minecraft:visual/cloud_height': EnvironmentAttributeVisualCloudHeight,
  'visual/default_dripstone_particle': EnvironmentAttributeVisualDefaultDripstoneParticle,
  'minecraft:visual/default_dripstone_particle': EnvironmentAttributeVisualDefaultDripstoneParticle,
  'visual/fog_color': EnvironmentAttributeVisualFogColor,
  'minecraft:visual/fog_color': EnvironmentAttributeVisualFogColor,
  'visual/fog_end_distance': EnvironmentAttributeVisualFogEndDistance,
  'minecraft:visual/fog_end_distance': EnvironmentAttributeVisualFogEndDistance,
  'visual/fog_start_distance': EnvironmentAttributeVisualFogStartDistance,
  'minecraft:visual/fog_start_distance': EnvironmentAttributeVisualFogStartDistance,
  'visual/moon_angle': EnvironmentAttributeVisualMoonAngle,
  'minecraft:visual/moon_angle': EnvironmentAttributeVisualMoonAngle,
  'visual/moon_phase': EnvironmentAttributeVisualMoonPhase,
  'minecraft:visual/moon_phase': EnvironmentAttributeVisualMoonPhase,
  'visual/night_vision_color': EnvironmentAttributeVisualNightVisionColor,
  'minecraft:visual/night_vision_color': EnvironmentAttributeVisualNightVisionColor,
  'visual/sky_color': EnvironmentAttributeVisualSkyColor,
  'minecraft:visual/sky_color': EnvironmentAttributeVisualSkyColor,
  'visual/sky_fog_end_distance': EnvironmentAttributeVisualSkyFogEndDistance,
  'minecraft:visual/sky_fog_end_distance': EnvironmentAttributeVisualSkyFogEndDistance,
  'visual/sky_light_color': EnvironmentAttributeVisualSkyLightColor,
  'minecraft:visual/sky_light_color': EnvironmentAttributeVisualSkyLightColor,
  'visual/sky_light_factor': EnvironmentAttributeVisualSkyLightFactor,
  'minecraft:visual/sky_light_factor': EnvironmentAttributeVisualSkyLightFactor,
  'visual/star_angle': EnvironmentAttributeVisualStarAngle,
  'minecraft:visual/star_angle': EnvironmentAttributeVisualStarAngle,
  'visual/star_brightness': EnvironmentAttributeVisualStarBrightness,
  'minecraft:visual/star_brightness': EnvironmentAttributeVisualStarBrightness,
  'visual/sun_angle': EnvironmentAttributeVisualSunAngle,
  'minecraft:visual/sun_angle': EnvironmentAttributeVisualSunAngle,
  'visual/sunrise_sunset_color': EnvironmentAttributeVisualSunriseSunsetColor,
  'minecraft:visual/sunrise_sunset_color': EnvironmentAttributeVisualSunriseSunsetColor,
  'visual/water_fog_color': EnvironmentAttributeVisualWaterFogColor,
  'minecraft:visual/water_fog_color': EnvironmentAttributeVisualWaterFogColor,
  'visual/water_fog_end_distance': EnvironmentAttributeVisualWaterFogEndDistance,
  'minecraft:visual/water_fog_end_distance': EnvironmentAttributeVisualWaterFogEndDistance,
  'visual/water_fog_start_distance': EnvironmentAttributeVisualWaterFogStartDistance,
  'minecraft:visual/water_fog_start_distance': EnvironmentAttributeVisualWaterFogStartDistance,
}
type EnvironmentAttributeKeys = keyof EnvironmentAttributeDispatcherMap
type EnvironmentAttributeFallback = (
  | EnvironmentAttributeAudioAmbientSounds
  | EnvironmentAttributeAudioBackgroundMusic
  | EnvironmentAttributeAudioFireflyBushSounds
  | EnvironmentAttributeAudioMusicVolume
  | EnvironmentAttributeGameplayBabyVillagerActivity
  | EnvironmentAttributeGameplayBedRule
  | EnvironmentAttributeGameplayBeesStayInHive
  | EnvironmentAttributeGameplayCanPillagerPatrolSpawn
  | EnvironmentAttributeGameplayCanStartRaid
  | EnvironmentAttributeGameplayCatWakingUpGiftChance
  | EnvironmentAttributeGameplayCreakingActive
  | EnvironmentAttributeGameplayCreatureWorldGenSpawnProbability
  | EnvironmentAttributeGameplayEyeblossomOpen
  | EnvironmentAttributeGameplayFastLava
  | EnvironmentAttributeGameplayIncreasedFireBurnout
  | EnvironmentAttributeGameplayMonstersBurn
  | EnvironmentAttributeGameplayNaturalMobSpawns
  | EnvironmentAttributeGameplayNetherPortalSpawnsPiglin
  | EnvironmentAttributeGameplayPiglinsZombify
  | EnvironmentAttributeGameplayRespawnAnchorWorks
  | EnvironmentAttributeGameplaySkyLightLevel
  | EnvironmentAttributeGameplaySnowGolemMelts
  | EnvironmentAttributeGameplayStrawBedRule
  | EnvironmentAttributeGameplaySurfaceSlimeSpawnChance
  | EnvironmentAttributeGameplayTurtleEggHatchChance
  | EnvironmentAttributeGameplayVillagerActivity
  | EnvironmentAttributeGameplayWaterEvaporates
  | EnvironmentAttributeVisualAmbientLightColor
  | EnvironmentAttributeVisualAmbientParticles
  | EnvironmentAttributeVisualBlockLightTint
  | EnvironmentAttributeVisualCloudColor
  | EnvironmentAttributeVisualCloudFogEndDistance
  | EnvironmentAttributeVisualCloudHeight
  | EnvironmentAttributeVisualDefaultDripstoneParticle
  | EnvironmentAttributeVisualFogColor
  | EnvironmentAttributeVisualFogEndDistance
  | EnvironmentAttributeVisualFogStartDistance
  | EnvironmentAttributeVisualMoonAngle
  | EnvironmentAttributeVisualMoonPhase
  | EnvironmentAttributeVisualNightVisionColor
  | EnvironmentAttributeVisualSkyColor
  | EnvironmentAttributeVisualSkyFogEndDistance
  | EnvironmentAttributeVisualSkyLightColor
  | EnvironmentAttributeVisualSkyLightFactor
  | EnvironmentAttributeVisualStarAngle
  | EnvironmentAttributeVisualStarBrightness
  | EnvironmentAttributeVisualSunAngle
  | EnvironmentAttributeVisualSunriseSunsetColor
  | EnvironmentAttributeVisualWaterFogColor
  | EnvironmentAttributeVisualWaterFogEndDistance
  | EnvironmentAttributeVisualWaterFogStartDistance
  | EnvironmentAttributeFallbackType)
export type EnvironmentAttributeFallbackType = DiscreteAttribute<NBTObject>
type EnvironmentAttributeAudioAmbientSounds = DiscreteAttribute<AmbientSounds>
type EnvironmentAttributeAudioBackgroundMusic = DiscreteAttribute<BackgroundMusic>
type EnvironmentAttributeAudioFireflyBushSounds = BooleanAttribute
type EnvironmentAttributeAudioMusicVolume = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}>>
type EnvironmentAttributeGameplayBabyVillagerActivity = DiscreteAttribute<Registry['minecraft:activity']>
type EnvironmentAttributeGameplayBedRule = DiscreteAttribute<BedRule>
type EnvironmentAttributeGameplayBeesStayInHive = BooleanAttribute
type EnvironmentAttributeGameplayCanPillagerPatrolSpawn = BooleanAttribute
type EnvironmentAttributeGameplayCanStartRaid = BooleanAttribute
type EnvironmentAttributeGameplayCatWakingUpGiftChance = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}>>
type EnvironmentAttributeGameplayCreakingActive = BooleanAttribute
type EnvironmentAttributeGameplayCreatureWorldGenSpawnProbability = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
}>>
type EnvironmentAttributeGameplayEyeblossomOpen = DiscreteAttribute<TriState>
type EnvironmentAttributeGameplayFastLava = BooleanAttribute
type EnvironmentAttributeGameplayIncreasedFireBurnout = BooleanAttribute
type EnvironmentAttributeGameplayMonstersBurn = BooleanAttribute
type EnvironmentAttributeGameplayNaturalMobSpawns = MergeableAttribute<NaturalMobSpawns>
type EnvironmentAttributeGameplayNetherPortalSpawnsPiglin = BooleanAttribute
type EnvironmentAttributeGameplayPiglinsZombify = BooleanAttribute
type EnvironmentAttributeGameplayRespawnAnchorWorks = BooleanAttribute
type EnvironmentAttributeGameplaySkyLightLevel = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
}>>
type EnvironmentAttributeGameplaySnowGolemMelts = BooleanAttribute
type EnvironmentAttributeGameplayStrawBedRule = DiscreteAttribute<BedRule>
type EnvironmentAttributeGameplaySurfaceSlimeSpawnChance = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}>>
type EnvironmentAttributeGameplayTurtleEggHatchChance = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}>>
type EnvironmentAttributeGameplayVillagerActivity = DiscreteAttribute<Registry['minecraft:activity']>
type EnvironmentAttributeGameplayWaterEvaporates = BooleanAttribute
type EnvironmentAttributeVisualAmbientLightColor = RGBColorAttribute
type EnvironmentAttributeVisualAmbientParticles = ListAttribute<AmbientParticle>
type EnvironmentAttributeVisualBlockLightTint = RGBColorAttribute
type EnvironmentAttributeVisualCloudColor = ARGBColorAttribute
type EnvironmentAttributeVisualCloudFogEndDistance = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  min: 0,
}>>
type EnvironmentAttributeVisualCloudHeight = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualDefaultDripstoneParticle = DiscreteAttribute<Particle>
type EnvironmentAttributeVisualFogColor = RGBColorAttribute
type EnvironmentAttributeVisualFogEndDistance = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  min: 0,
}>>
type EnvironmentAttributeVisualFogStartDistance = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualMoonAngle = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualMoonPhase = DiscreteAttribute<MoonPhase>
type EnvironmentAttributeVisualNightVisionColor = RGBColorAttribute
type EnvironmentAttributeVisualSkyColor = RGBColorAttribute
type EnvironmentAttributeVisualSkyFogEndDistance = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  min: 0,
}>>
type EnvironmentAttributeVisualSkyLightColor = RGBColorAttribute
type EnvironmentAttributeVisualSkyLightFactor = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}>>
type EnvironmentAttributeVisualStarAngle = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualStarBrightness = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}>>
type EnvironmentAttributeVisualSunAngle = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualSunriseSunsetColor = ARGBColorAttribute
type EnvironmentAttributeVisualWaterFogColor = RGBColorAttribute
type EnvironmentAttributeVisualWaterFogEndDistance = FloatAttribute<NBTFloat<{
  leftExclusive: false,
  min: 0,
}>>
type EnvironmentAttributeVisualWaterFogStartDistance = FloatAttribute<NBTFloat>
export type SymbolEnvironmentAttribute<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? EnvironmentAttributeDispatcherMap
  : CASE extends 'keys'
    ? EnvironmentAttributeKeys
    : CASE extends '%fallback'
      ? EnvironmentAttributeFallback
      : CASE extends '%unknown' ? EnvironmentAttributeFallbackType : never
