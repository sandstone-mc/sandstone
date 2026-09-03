import type { JsonAttributeTrackBase } from 'sandstone/arguments/generated/_json/data/timeline.ts'
import type { JsonMoonPhase, JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type {
  JsonBooleanAttributeModifier,
  JsonBooleanModifierType,
  JsonColorAttributeModifier,
  JsonColorModifierType,
  JsonFloatAttributeModifier,
  JsonFloatModifierType,
  JsonListModifier,
  JsonListModifierType,
  JsonMergeableModifier,
  JsonMergeableModifierType,
  JsonOverrideModifier,
  JsonTranslucentColorAttributeModifier,
} from 'sandstone/arguments/generated/_json/data/worldgen/attribute/modifier.ts'
import type {
  JsonBiomeMusic,
  JsonBiomeSoundAdditions,
  JsonMoodSound,
  JsonNaturalMobSpawns,
} from 'sandstone/arguments/generated/_json/data/worldgen/biome.ts'
import type {
  JsonSymbolEnvironmentAttributeArgbColorModifier,
  JsonSymbolEnvironmentAttributeColorModifier,
  JsonSymbolEnvironmentAttributeFloatModifier,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonStringARGB, JsonStringRGB } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonParticle } from 'sandstone/arguments/generated/_json/util/particle.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonNBTObject, JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTFloat, NBTInt } from 'sandstone'

export type JsonAmbientParticle = {
  particle: JsonParticle,
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonAmbientSounds = {
  loop?: JsonSoundEventRef,
  mood?: JsonMoodSound,
  additions?: (JsonBiomeSoundAdditions | Array<JsonBiomeSoundAdditions>),
}

export type JsonARGBColorAttribute = {
  value: JsonStringARGB,
  modifier: JsonTranslucentColorAttributeModifier,
  attribute_track: ({
    [S in Extract<Extract<JsonColorModifierType, string>, string>]?: (JsonAttributeTrackBase & {
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
      keyframes: JsonNBTList<{
        /**
         * Value:
         * Range: 0..
         */
        ticks: (NBTInt<{
          min: 0,
        }> | number),
        value: (S extends undefined
          ? JsonSymbolEnvironmentAttributeArgbColorModifier<'%none'> :
          (S extends keyof JsonSymbolEnvironmentAttributeArgbColorModifier
            ? JsonSymbolEnvironmentAttributeArgbColorModifier[S]
            : JsonRootNBT)),
      }, {
        leftExclusive: false,
        min: 1,
      }>,
    })
  }[Extract<JsonColorModifierType, string>]),
}

export type JsonBackgroundMusic = {
  /**
   * Default music to play
   */
  default?: JsonBiomeMusic,
  /**
   * Overrides default music when underwater
   */
  underwater?: JsonBiomeMusic,
  /**
   * Overrides default music when in creative mode
   */
  creative?: JsonBiomeMusic,
}

export type JsonBedRule = {
  /**
   * Value:
   *
   *  - Always(`always`)
   *  - WhenDark(`when_dark`)
   *  - Never(`never`)
   */
  can_sleep: JsonBedRuleType,
  /**
   * Value:
   *
   *  - Always(`always`)
   *  - WhenDark(`when_dark`)
   *  - Never(`never`)
   */
  can_set_spawn: JsonBedRuleType,
  destroy_on_use?: boolean,
  destroy_on_leave?: boolean,
  error_message?: JsonText,
}

export type JsonBedRuleType = ('always' | 'when_dark' | 'never')

export type JsonBooleanAttribute = {
  value: boolean,
  modifier: JsonBooleanAttributeModifier,
  attribute_track: (JsonAttributeTrackBase & {
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
    modifier?: JsonBooleanModifierType,
    /**
     * Value:
     * List length range: 1..
     */
    keyframes: JsonNBTList<{
      /**
       * Value:
       * Range: 0..
       */
      ticks: (NBTInt<{
        min: 0,
      }> | number),
      value: boolean,
    }, {
      leftExclusive: false,
      min: 1,
    }>,
  }),
}

export type JsonDiscreteAttribute<T extends JsonNBTObject> = {
  value: T,
  modifier: JsonOverrideModifier<T>,
  attribute_track: (JsonAttributeTrackBase & {
    modifier?: 'override',
    /**
     * Value:
     * List length range: 1..
     */
    keyframes: JsonNBTList<{
      /**
       * Value:
       * Range: 0..
       */
      ticks: (NBTInt<{
        min: 0,
      }> | number),
      value: T,
    }, {
      leftExclusive: false,
      min: 1,
    }>,
  }),
}

export type JsonEnvironmentAttributeMap<K extends JsonNBTObject> = ({
  [Key in Extract<K, string>]?: ((
      | Key extends keyof JsonSymbolEnvironmentAttribute ?
        ('value' extends keyof JsonSymbolEnvironmentAttribute[Key]
          ? JsonSymbolEnvironmentAttribute[Key]['value']
          : JsonSymbolEnvironmentAttribute<'%unknown'>)
        : JsonSymbolEnvironmentAttribute<'%unknown'>) | (
      Key extends keyof JsonSymbolEnvironmentAttribute ?
        ('modifier' extends keyof JsonSymbolEnvironmentAttribute[Key]
          ? JsonSymbolEnvironmentAttribute[Key]['modifier']
          : JsonSymbolEnvironmentAttribute<'%unknown'>)
        : JsonSymbolEnvironmentAttribute<'%unknown'>))
})

export type JsonFloatAttribute<T extends JsonNBTObject> = {
  value: T,
  modifier: JsonFloatAttributeModifier<T>,
  attribute_track: ({
    [S in Extract<Extract<JsonFloatModifierType, string>, string>]?: (JsonAttributeTrackBase & {
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
      keyframes: JsonNBTList<{
        /**
         * Value:
         * Range: 0..
         */
        ticks: (NBTInt<{
          min: 0,
        }> | number),
        value: (S extends undefined
          ? JsonSymbolEnvironmentAttributeFloatModifier<T, '%none'> :
          (S extends keyof JsonSymbolEnvironmentAttributeFloatModifier<T>
            ? JsonSymbolEnvironmentAttributeFloatModifier<T>[S]
            : JsonSymbolEnvironmentAttributeFloatModifier<T, '%unknown'>)),
      }, {
        leftExclusive: false,
        min: 1,
      }>,
    })
  }[Extract<JsonFloatModifierType, string>]),
}

export type JsonGlobalEnvironmentAttributeMap = JsonEnvironmentAttributeMap<JsonRegistry['minecraft:environment_attribute']>

export type JsonIntegerEnvironmentAttribute = never

export type JsonListAttribute<E extends JsonNBTObject> = {
  value: Array<E>,
  modifier: JsonListModifier<E>,
  attribute_track: (JsonAttributeTrackBase & {
    /**
     * Value:
     *
     *  - Override(`override`)
     *  - Append(`append`)
     */
    modifier?: JsonListModifierType,
    /**
     * Value:
     * List length range: 1..
     */
    keyframes: JsonNBTList<{
      /**
       * Value:
       * Range: 0..
       */
      ticks: (NBTInt<{
        min: 0,
      }> | number),
      value: Array<E>,
    }, {
      leftExclusive: false,
      min: 1,
    }>,
  }),
}

export type JsonMergeableAttribute<T extends JsonNBTObject> = {
  value: T,
  modifier: JsonMergeableModifier<T>,
  attribute_track: (JsonAttributeTrackBase & {
    /**
     * Value:
     *
     *  - Override(`override`)
     *  - Overlay(`overlay`)
     */
    modifier?: JsonMergeableModifierType,
    /**
     * Value:
     * List length range: 1..
     */
    keyframes: JsonNBTList<{
      /**
       * Value:
       * Range: 0..
       */
      ticks: (NBTInt<{
        min: 0,
      }> | number),
      value: T,
    }, {
      leftExclusive: false,
      min: 1,
    }>,
  }),
}

export type JsonNumericalEnvironmentAttribute = (
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

export type JsonPositionalEnvironmentAttribute = JsonRegistry['minecraft:environment_attribute']

export type JsonPositionalEnvironmentAttributeMap = JsonEnvironmentAttributeMap<JsonPositionalEnvironmentAttribute>

export type JsonRGBColorAttribute = {
  value: JsonStringRGB,
  modifier: JsonColorAttributeModifier,
  attribute_track: ({
    [S in Extract<Extract<JsonColorModifierType, string>, string>]?: (JsonAttributeTrackBase & {
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
      keyframes: JsonNBTList<{
        /**
         * Value:
         * Range: 0..
         */
        ticks: (NBTInt<{
          min: 0,
        }> | number),
        value: (S extends undefined
          ? JsonSymbolEnvironmentAttributeColorModifier<'%none'> :
          (S extends keyof JsonSymbolEnvironmentAttributeColorModifier
            ? JsonSymbolEnvironmentAttributeColorModifier[S]
            : JsonSymbolEnvironmentAttributeColorModifier<'%unknown'>)),
      }, {
        leftExclusive: false,
        min: 1,
      }>,
    })
  }[Extract<JsonColorModifierType, string>]),
}

export type JsonTriState = (boolean | 'default')
type JsonEnvironmentAttributeDispatcherMap = {
  'audio/ambient_sounds': JsonEnvironmentAttributeAudioAmbientSounds,
  'minecraft:audio/ambient_sounds': JsonEnvironmentAttributeAudioAmbientSounds,
  'audio/background_music': JsonEnvironmentAttributeAudioBackgroundMusic,
  'minecraft:audio/background_music': JsonEnvironmentAttributeAudioBackgroundMusic,
  'audio/firefly_bush_sounds': JsonEnvironmentAttributeAudioFireflyBushSounds,
  'minecraft:audio/firefly_bush_sounds': JsonEnvironmentAttributeAudioFireflyBushSounds,
  'audio/music_volume': JsonEnvironmentAttributeAudioMusicVolume,
  'minecraft:audio/music_volume': JsonEnvironmentAttributeAudioMusicVolume,
  'gameplay/baby_villager_activity': JsonEnvironmentAttributeGameplayBabyVillagerActivity,
  'minecraft:gameplay/baby_villager_activity': JsonEnvironmentAttributeGameplayBabyVillagerActivity,
  'gameplay/bed_rule': JsonEnvironmentAttributeGameplayBedRule,
  'minecraft:gameplay/bed_rule': JsonEnvironmentAttributeGameplayBedRule,
  'gameplay/bees_stay_in_hive': JsonEnvironmentAttributeGameplayBeesStayInHive,
  'minecraft:gameplay/bees_stay_in_hive': JsonEnvironmentAttributeGameplayBeesStayInHive,
  'gameplay/can_pillager_patrol_spawn': JsonEnvironmentAttributeGameplayCanPillagerPatrolSpawn,
  'minecraft:gameplay/can_pillager_patrol_spawn': JsonEnvironmentAttributeGameplayCanPillagerPatrolSpawn,
  'gameplay/can_start_raid': JsonEnvironmentAttributeGameplayCanStartRaid,
  'minecraft:gameplay/can_start_raid': JsonEnvironmentAttributeGameplayCanStartRaid,
  'gameplay/cat_waking_up_gift_chance': JsonEnvironmentAttributeGameplayCatWakingUpGiftChance,
  'minecraft:gameplay/cat_waking_up_gift_chance': JsonEnvironmentAttributeGameplayCatWakingUpGiftChance,
  'gameplay/creaking_active': JsonEnvironmentAttributeGameplayCreakingActive,
  'minecraft:gameplay/creaking_active': JsonEnvironmentAttributeGameplayCreakingActive,
  'gameplay/creature_world_gen_spawn_probability': JsonEnvironmentAttributeGameplayCreatureWorldGenSpawnProbability,
  'minecraft:gameplay/creature_world_gen_spawn_probability': JsonEnvironmentAttributeGameplayCreatureWorldGenSpawnProbability,
  'gameplay/eyeblossom_open': JsonEnvironmentAttributeGameplayEyeblossomOpen,
  'minecraft:gameplay/eyeblossom_open': JsonEnvironmentAttributeGameplayEyeblossomOpen,
  'gameplay/fast_lava': JsonEnvironmentAttributeGameplayFastLava,
  'minecraft:gameplay/fast_lava': JsonEnvironmentAttributeGameplayFastLava,
  'gameplay/increased_fire_burnout': JsonEnvironmentAttributeGameplayIncreasedFireBurnout,
  'minecraft:gameplay/increased_fire_burnout': JsonEnvironmentAttributeGameplayIncreasedFireBurnout,
  'gameplay/monsters_burn': JsonEnvironmentAttributeGameplayMonstersBurn,
  'minecraft:gameplay/monsters_burn': JsonEnvironmentAttributeGameplayMonstersBurn,
  'gameplay/natural_mob_spawns': JsonEnvironmentAttributeGameplayNaturalMobSpawns,
  'minecraft:gameplay/natural_mob_spawns': JsonEnvironmentAttributeGameplayNaturalMobSpawns,
  'gameplay/nether_portal_spawns_piglin': JsonEnvironmentAttributeGameplayNetherPortalSpawnsPiglin,
  'minecraft:gameplay/nether_portal_spawns_piglin': JsonEnvironmentAttributeGameplayNetherPortalSpawnsPiglin,
  'gameplay/piglins_zombify': JsonEnvironmentAttributeGameplayPiglinsZombify,
  'minecraft:gameplay/piglins_zombify': JsonEnvironmentAttributeGameplayPiglinsZombify,
  'gameplay/respawn_anchor_works': JsonEnvironmentAttributeGameplayRespawnAnchorWorks,
  'minecraft:gameplay/respawn_anchor_works': JsonEnvironmentAttributeGameplayRespawnAnchorWorks,
  'gameplay/sky_light_level': JsonEnvironmentAttributeGameplaySkyLightLevel,
  'minecraft:gameplay/sky_light_level': JsonEnvironmentAttributeGameplaySkyLightLevel,
  'gameplay/snow_golem_melts': JsonEnvironmentAttributeGameplaySnowGolemMelts,
  'minecraft:gameplay/snow_golem_melts': JsonEnvironmentAttributeGameplaySnowGolemMelts,
  'gameplay/straw_bed_rule': JsonEnvironmentAttributeGameplayStrawBedRule,
  'minecraft:gameplay/straw_bed_rule': JsonEnvironmentAttributeGameplayStrawBedRule,
  'gameplay/surface_slime_spawn_chance': JsonEnvironmentAttributeGameplaySurfaceSlimeSpawnChance,
  'minecraft:gameplay/surface_slime_spawn_chance': JsonEnvironmentAttributeGameplaySurfaceSlimeSpawnChance,
  'gameplay/turtle_egg_hatch_chance': JsonEnvironmentAttributeGameplayTurtleEggHatchChance,
  'minecraft:gameplay/turtle_egg_hatch_chance': JsonEnvironmentAttributeGameplayTurtleEggHatchChance,
  'gameplay/villager_activity': JsonEnvironmentAttributeGameplayVillagerActivity,
  'minecraft:gameplay/villager_activity': JsonEnvironmentAttributeGameplayVillagerActivity,
  'gameplay/water_evaporates': JsonEnvironmentAttributeGameplayWaterEvaporates,
  'minecraft:gameplay/water_evaporates': JsonEnvironmentAttributeGameplayWaterEvaporates,
  'visual/ambient_light_color': JsonEnvironmentAttributeVisualAmbientLightColor,
  'minecraft:visual/ambient_light_color': JsonEnvironmentAttributeVisualAmbientLightColor,
  'visual/ambient_particles': JsonEnvironmentAttributeVisualAmbientParticles,
  'minecraft:visual/ambient_particles': JsonEnvironmentAttributeVisualAmbientParticles,
  'visual/block_light_tint': JsonEnvironmentAttributeVisualBlockLightTint,
  'minecraft:visual/block_light_tint': JsonEnvironmentAttributeVisualBlockLightTint,
  'visual/cloud_color': JsonEnvironmentAttributeVisualCloudColor,
  'minecraft:visual/cloud_color': JsonEnvironmentAttributeVisualCloudColor,
  'visual/cloud_fog_end_distance': JsonEnvironmentAttributeVisualCloudFogEndDistance,
  'minecraft:visual/cloud_fog_end_distance': JsonEnvironmentAttributeVisualCloudFogEndDistance,
  'visual/cloud_height': JsonEnvironmentAttributeVisualCloudHeight,
  'minecraft:visual/cloud_height': JsonEnvironmentAttributeVisualCloudHeight,
  'visual/default_dripstone_particle': JsonEnvironmentAttributeVisualDefaultDripstoneParticle,
  'minecraft:visual/default_dripstone_particle': JsonEnvironmentAttributeVisualDefaultDripstoneParticle,
  'visual/fog_color': JsonEnvironmentAttributeVisualFogColor,
  'minecraft:visual/fog_color': JsonEnvironmentAttributeVisualFogColor,
  'visual/fog_end_distance': JsonEnvironmentAttributeVisualFogEndDistance,
  'minecraft:visual/fog_end_distance': JsonEnvironmentAttributeVisualFogEndDistance,
  'visual/fog_start_distance': JsonEnvironmentAttributeVisualFogStartDistance,
  'minecraft:visual/fog_start_distance': JsonEnvironmentAttributeVisualFogStartDistance,
  'visual/moon_angle': JsonEnvironmentAttributeVisualMoonAngle,
  'minecraft:visual/moon_angle': JsonEnvironmentAttributeVisualMoonAngle,
  'visual/moon_phase': JsonEnvironmentAttributeVisualMoonPhase,
  'minecraft:visual/moon_phase': JsonEnvironmentAttributeVisualMoonPhase,
  'visual/night_vision_color': JsonEnvironmentAttributeVisualNightVisionColor,
  'minecraft:visual/night_vision_color': JsonEnvironmentAttributeVisualNightVisionColor,
  'visual/sky_color': JsonEnvironmentAttributeVisualSkyColor,
  'minecraft:visual/sky_color': JsonEnvironmentAttributeVisualSkyColor,
  'visual/sky_fog_end_distance': JsonEnvironmentAttributeVisualSkyFogEndDistance,
  'minecraft:visual/sky_fog_end_distance': JsonEnvironmentAttributeVisualSkyFogEndDistance,
  'visual/sky_light_color': JsonEnvironmentAttributeVisualSkyLightColor,
  'minecraft:visual/sky_light_color': JsonEnvironmentAttributeVisualSkyLightColor,
  'visual/sky_light_factor': JsonEnvironmentAttributeVisualSkyLightFactor,
  'minecraft:visual/sky_light_factor': JsonEnvironmentAttributeVisualSkyLightFactor,
  'visual/star_angle': JsonEnvironmentAttributeVisualStarAngle,
  'minecraft:visual/star_angle': JsonEnvironmentAttributeVisualStarAngle,
  'visual/star_brightness': JsonEnvironmentAttributeVisualStarBrightness,
  'minecraft:visual/star_brightness': JsonEnvironmentAttributeVisualStarBrightness,
  'visual/sun_angle': JsonEnvironmentAttributeVisualSunAngle,
  'minecraft:visual/sun_angle': JsonEnvironmentAttributeVisualSunAngle,
  'visual/sunrise_sunset_color': JsonEnvironmentAttributeVisualSunriseSunsetColor,
  'minecraft:visual/sunrise_sunset_color': JsonEnvironmentAttributeVisualSunriseSunsetColor,
  'visual/water_fog_color': JsonEnvironmentAttributeVisualWaterFogColor,
  'minecraft:visual/water_fog_color': JsonEnvironmentAttributeVisualWaterFogColor,
  'visual/water_fog_end_distance': JsonEnvironmentAttributeVisualWaterFogEndDistance,
  'minecraft:visual/water_fog_end_distance': JsonEnvironmentAttributeVisualWaterFogEndDistance,
  'visual/water_fog_start_distance': JsonEnvironmentAttributeVisualWaterFogStartDistance,
  'minecraft:visual/water_fog_start_distance': JsonEnvironmentAttributeVisualWaterFogStartDistance,
}
type JsonEnvironmentAttributeKeys = keyof JsonEnvironmentAttributeDispatcherMap
type JsonEnvironmentAttributeFallback = (
  | JsonEnvironmentAttributeAudioAmbientSounds
  | JsonEnvironmentAttributeAudioBackgroundMusic
  | JsonEnvironmentAttributeAudioFireflyBushSounds
  | JsonEnvironmentAttributeAudioMusicVolume
  | JsonEnvironmentAttributeGameplayBabyVillagerActivity
  | JsonEnvironmentAttributeGameplayBedRule
  | JsonEnvironmentAttributeGameplayBeesStayInHive
  | JsonEnvironmentAttributeGameplayCanPillagerPatrolSpawn
  | JsonEnvironmentAttributeGameplayCanStartRaid
  | JsonEnvironmentAttributeGameplayCatWakingUpGiftChance
  | JsonEnvironmentAttributeGameplayCreakingActive
  | JsonEnvironmentAttributeGameplayCreatureWorldGenSpawnProbability
  | JsonEnvironmentAttributeGameplayEyeblossomOpen
  | JsonEnvironmentAttributeGameplayFastLava
  | JsonEnvironmentAttributeGameplayIncreasedFireBurnout
  | JsonEnvironmentAttributeGameplayMonstersBurn
  | JsonEnvironmentAttributeGameplayNaturalMobSpawns
  | JsonEnvironmentAttributeGameplayNetherPortalSpawnsPiglin
  | JsonEnvironmentAttributeGameplayPiglinsZombify
  | JsonEnvironmentAttributeGameplayRespawnAnchorWorks
  | JsonEnvironmentAttributeGameplaySkyLightLevel
  | JsonEnvironmentAttributeGameplaySnowGolemMelts
  | JsonEnvironmentAttributeGameplayStrawBedRule
  | JsonEnvironmentAttributeGameplaySurfaceSlimeSpawnChance
  | JsonEnvironmentAttributeGameplayTurtleEggHatchChance
  | JsonEnvironmentAttributeGameplayVillagerActivity
  | JsonEnvironmentAttributeGameplayWaterEvaporates
  | JsonEnvironmentAttributeVisualAmbientLightColor
  | JsonEnvironmentAttributeVisualAmbientParticles
  | JsonEnvironmentAttributeVisualBlockLightTint
  | JsonEnvironmentAttributeVisualCloudColor
  | JsonEnvironmentAttributeVisualCloudFogEndDistance
  | JsonEnvironmentAttributeVisualCloudHeight
  | JsonEnvironmentAttributeVisualDefaultDripstoneParticle
  | JsonEnvironmentAttributeVisualFogColor
  | JsonEnvironmentAttributeVisualFogEndDistance
  | JsonEnvironmentAttributeVisualFogStartDistance
  | JsonEnvironmentAttributeVisualMoonAngle
  | JsonEnvironmentAttributeVisualMoonPhase
  | JsonEnvironmentAttributeVisualNightVisionColor
  | JsonEnvironmentAttributeVisualSkyColor
  | JsonEnvironmentAttributeVisualSkyFogEndDistance
  | JsonEnvironmentAttributeVisualSkyLightColor
  | JsonEnvironmentAttributeVisualSkyLightFactor
  | JsonEnvironmentAttributeVisualStarAngle
  | JsonEnvironmentAttributeVisualStarBrightness
  | JsonEnvironmentAttributeVisualSunAngle
  | JsonEnvironmentAttributeVisualSunriseSunsetColor
  | JsonEnvironmentAttributeVisualWaterFogColor
  | JsonEnvironmentAttributeVisualWaterFogEndDistance
  | JsonEnvironmentAttributeVisualWaterFogStartDistance
  | JsonEnvironmentAttributeFallbackType)
export type JsonEnvironmentAttributeFallbackType = JsonDiscreteAttribute<JsonNBTObject>
type JsonEnvironmentAttributeAudioAmbientSounds = JsonDiscreteAttribute<JsonAmbientSounds>
type JsonEnvironmentAttributeAudioBackgroundMusic = JsonDiscreteAttribute<JsonBackgroundMusic>
type JsonEnvironmentAttributeAudioFireflyBushSounds = JsonBooleanAttribute
type JsonEnvironmentAttributeAudioMusicVolume = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number)>
type JsonEnvironmentAttributeGameplayBabyVillagerActivity = JsonDiscreteAttribute<JsonRegistry['minecraft:activity']>
type JsonEnvironmentAttributeGameplayBedRule = JsonDiscreteAttribute<JsonBedRule>
type JsonEnvironmentAttributeGameplayBeesStayInHive = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayCanPillagerPatrolSpawn = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayCanStartRaid = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayCatWakingUpGiftChance = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number)>
type JsonEnvironmentAttributeGameplayCreakingActive = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayCreatureWorldGenSpawnProbability = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
}> | number)>
type JsonEnvironmentAttributeGameplayEyeblossomOpen = JsonDiscreteAttribute<JsonTriState>
type JsonEnvironmentAttributeGameplayFastLava = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayIncreasedFireBurnout = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayMonstersBurn = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayNaturalMobSpawns = JsonMergeableAttribute<JsonNaturalMobSpawns>
type JsonEnvironmentAttributeGameplayNetherPortalSpawnsPiglin = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayPiglinsZombify = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayRespawnAnchorWorks = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplaySkyLightLevel = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
}> | number)>
type JsonEnvironmentAttributeGameplaySnowGolemMelts = JsonBooleanAttribute
type JsonEnvironmentAttributeGameplayStrawBedRule = JsonDiscreteAttribute<JsonBedRule>
type JsonEnvironmentAttributeGameplaySurfaceSlimeSpawnChance = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number)>
type JsonEnvironmentAttributeGameplayTurtleEggHatchChance = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number)>
type JsonEnvironmentAttributeGameplayVillagerActivity = JsonDiscreteAttribute<JsonRegistry['minecraft:activity']>
type JsonEnvironmentAttributeGameplayWaterEvaporates = JsonBooleanAttribute
type JsonEnvironmentAttributeVisualAmbientLightColor = JsonRGBColorAttribute
type JsonEnvironmentAttributeVisualAmbientParticles = JsonListAttribute<JsonAmbientParticle>
type JsonEnvironmentAttributeVisualBlockLightTint = JsonRGBColorAttribute
type JsonEnvironmentAttributeVisualCloudColor = JsonARGBColorAttribute
type JsonEnvironmentAttributeVisualCloudFogEndDistance = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  min: 0,
}> | number)>
type JsonEnvironmentAttributeVisualCloudHeight = JsonFloatAttribute<(NBTFloat | number)>
type JsonEnvironmentAttributeVisualDefaultDripstoneParticle = JsonDiscreteAttribute<JsonParticle>
type JsonEnvironmentAttributeVisualFogColor = JsonRGBColorAttribute
type JsonEnvironmentAttributeVisualFogEndDistance = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  min: 0,
}> | number)>
type JsonEnvironmentAttributeVisualFogStartDistance = JsonFloatAttribute<(NBTFloat | number)>
type JsonEnvironmentAttributeVisualMoonAngle = JsonFloatAttribute<(NBTFloat | number)>
type JsonEnvironmentAttributeVisualMoonPhase = JsonDiscreteAttribute<JsonMoonPhase>
type JsonEnvironmentAttributeVisualNightVisionColor = JsonRGBColorAttribute
type JsonEnvironmentAttributeVisualSkyColor = JsonRGBColorAttribute
type JsonEnvironmentAttributeVisualSkyFogEndDistance = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  min: 0,
}> | number)>
type JsonEnvironmentAttributeVisualSkyLightColor = JsonRGBColorAttribute
type JsonEnvironmentAttributeVisualSkyLightFactor = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number)>
type JsonEnvironmentAttributeVisualStarAngle = JsonFloatAttribute<(NBTFloat | number)>
type JsonEnvironmentAttributeVisualStarBrightness = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number)>
type JsonEnvironmentAttributeVisualSunAngle = JsonFloatAttribute<(NBTFloat | number)>
type JsonEnvironmentAttributeVisualSunriseSunsetColor = JsonARGBColorAttribute
type JsonEnvironmentAttributeVisualWaterFogColor = JsonRGBColorAttribute
type JsonEnvironmentAttributeVisualWaterFogEndDistance = JsonFloatAttribute<(NBTFloat<{
  leftExclusive: false,
  min: 0,
}> | number)>
type JsonEnvironmentAttributeVisualWaterFogStartDistance = JsonFloatAttribute<(NBTFloat | number)>
export type JsonSymbolEnvironmentAttribute<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEnvironmentAttributeDispatcherMap
  : CASE extends 'keys'
    ? JsonEnvironmentAttributeKeys
    : CASE extends '%fallback'
      ? JsonEnvironmentAttributeFallback
      : CASE extends '%unknown' ? JsonEnvironmentAttributeFallbackType : never
