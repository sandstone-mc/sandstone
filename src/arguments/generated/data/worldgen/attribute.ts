import type { AttributeTrackBase } from 'sandstone/arguments/generated/data/timeline.js'
import type { MoonPhase, SoundEventRef } from 'sandstone/arguments/generated/data/util.js'
import type {
  BooleanAttributeModifier,
  BooleanModifierType,
  ColorAttributeModifier,
  ColorModifierType,
  FloatAttributeModifier,
  FloatModifierType,
  OverrideModifier,
  TranslucentColorAttributeModifier,
} from 'sandstone/arguments/generated/data/worldgen/attribute/modifier.js'
import type { BiomeMusic, BiomeSoundAdditions, MoodSound } from 'sandstone/arguments/generated/data/worldgen/biome.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { StringARGB, StringRGB } from 'sandstone/arguments/generated/util/color.js'
import type { Particle } from 'sandstone/arguments/generated/util/particle.js'
import type { Text } from 'sandstone/arguments/generated/util/text.js'
import type { NBTFloat, NBTInt } from 'sandstone'

export type AmbientParticle = {
  particle: Particle
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type AmbientSounds = {
  loop?: SoundEventRef
  mood?: MoodSound
  additions?: (BiomeSoundAdditions | Array<BiomeSoundAdditions>)
}

export type ARGBColorAttribute = {
  value: StringARGB
  modifier: TranslucentColorAttributeModifier
  attribute_track: ({
    [S in Extract<ColorModifierType, string>]?: (AttributeTrackBase & {
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
      modifier?: S
      keyframes: Array<{
        /**
                 * Value:
                 * Range: 0..
                 */
        ticks: NBTInt<{
          min: 0
        }>
        value: (S extends undefined ? Dispatcher<'minecraft:environment_attribute_argb_color_modifier', [
          '%none',
        ]> : (S extends keyof Dispatcher<'minecraft:environment_attribute_argb_color_modifier'>
          ? Dispatcher<'minecraft:environment_attribute_argb_color_modifier'>[S]
          : Record<string, unknown>))
      }>
    });
  }[ColorModifierType])
}

export type BackgroundMusic = {
  /**
     * Default music to play
     */
  default?: BiomeMusic
  /**
     * Overrides default music when underwater
     */
  underwater?: BiomeMusic
  /**
     * Overrides default music when in creative mode
     */
  creative?: BiomeMusic
}

export type BedRule = {
  /**
     * Value:
     *
     *  - Always(`always`)
     *  - WhenDark(`when_dark`)
     *  - Never(`never`)
     */
  can_sleep: BedRuleType
  /**
     * Value:
     *
     *  - Always(`always`)
     *  - WhenDark(`when_dark`)
     *  - Never(`never`)
     */
  can_set_spawn: BedRuleType
  explodes?: boolean
  error_message?: Text
}

export type BedRuleType = ('always' | 'when_dark' | 'never')

export type BooleanAttribute = {
  value: boolean
  modifier: BooleanAttributeModifier
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
    modifier?: BooleanModifierType
    keyframes: Array<{
      /**
             * Value:
             * Range: 0..
             */
      ticks: NBTInt<{
        min: 0
      }>
      value: boolean
    }>
  })
}

export type DiscreteAttribute<T> = {
  value: T
  modifier: OverrideModifier<T>
  attribute_track: (AttributeTrackBase & {
    modifier?: 'override'
    keyframes: Array<{
      /**
             * Value:
             * Range: 0..
             */
      ticks: NBTInt<{
        min: 0
      }>
      value: T
    }>
  })
}

export type EnvironmentAttributeMap<K> = ({
  [Key in Extract<K, string>]?: ((
      | Key extends keyof Dispatcher<'minecraft:environment_attribute'> ?
        ('value' extends keyof Dispatcher<'minecraft:environment_attribute'>[Key]
          ? Dispatcher<'minecraft:environment_attribute'>[Key]['value']
          : Record<string, unknown>)
        : Record<string, unknown>) | (
      Key extends keyof Dispatcher<'minecraft:environment_attribute'> ?
        ('modifier' extends keyof Dispatcher<'minecraft:environment_attribute'>[Key]
          ? Dispatcher<'minecraft:environment_attribute'>[Key]['modifier']
          : Record<string, unknown>)
        : Record<string, unknown>));
})

export type FloatAttribute<T> = {
  value: T
  modifier: FloatAttributeModifier<T>
  attribute_track: ({
    [S in Extract<FloatModifierType, string>]?: (AttributeTrackBase & {
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
      modifier?: S
      keyframes: Array<{
        /**
                 * Value:
                 * Range: 0..
                 */
        ticks: NBTInt<{
          min: 0
        }>
        value: (S extends undefined ? Dispatcher<'minecraft:environment_attribute_float_modifier', [
          T,
          '%none',
        ]> : (S extends keyof Dispatcher<'minecraft:environment_attribute_float_modifier', [
          T,
        ]> ? Dispatcher<'minecraft:environment_attribute_float_modifier', [
            T,
          ]>[S] : Record<string, unknown>))
      }>
    });
  }[FloatModifierType])
}

export type GlobalEnvironmentAttributeMap = EnvironmentAttributeMap<Registry['minecraft:environment_attribute']>

export type PositionalEnvironmentAttribute = Registry['minecraft:environment_attribute']

export type PositionalEnvironmentAttributeMap = EnvironmentAttributeMap<PositionalEnvironmentAttribute>

export type RGBColorAttribute = {
  value: StringRGB
  modifier: ColorAttributeModifier
  attribute_track: ({
    [S in Extract<ColorModifierType, string>]?: (AttributeTrackBase & {
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
      modifier?: S
      keyframes: Array<{
        /**
                 * Value:
                 * Range: 0..
                 */
        ticks: NBTInt<{
          min: 0
        }>
        value: (S extends undefined ? Dispatcher<'minecraft:environment_attribute_color_modifier', [
          '%none',
        ]> : (S extends keyof Dispatcher<'minecraft:environment_attribute_color_modifier'>
          ? Dispatcher<'minecraft:environment_attribute_color_modifier'>[S]
          : Record<string, unknown>))
      }>
    });
  }[ColorModifierType])
}

export type TriState = (boolean | 'default')
type EnvironmentAttributeDispatcherMap = {
  'audio/ambient_sounds': EnvironmentAttributeAudioAmbientSounds
  'minecraft:audio/ambient_sounds': EnvironmentAttributeAudioAmbientSounds
  'audio/background_music': EnvironmentAttributeAudioBackgroundMusic
  'minecraft:audio/background_music': EnvironmentAttributeAudioBackgroundMusic
  'audio/firefly_bush_sounds': EnvironmentAttributeAudioFireflyBushSounds
  'minecraft:audio/firefly_bush_sounds': EnvironmentAttributeAudioFireflyBushSounds
  'audio/music_volume': EnvironmentAttributeAudioMusicVolume
  'minecraft:audio/music_volume': EnvironmentAttributeAudioMusicVolume
  'gameplay/baby_villager_activity': EnvironmentAttributeGameplayBabyVillagerActivity
  'minecraft:gameplay/baby_villager_activity': EnvironmentAttributeGameplayBabyVillagerActivity
  'gameplay/bed_rule': EnvironmentAttributeGameplayBedRule
  'minecraft:gameplay/bed_rule': EnvironmentAttributeGameplayBedRule
  'gameplay/bees_stay_in_hive': EnvironmentAttributeGameplayBeesStayInHive
  'minecraft:gameplay/bees_stay_in_hive': EnvironmentAttributeGameplayBeesStayInHive
  'gameplay/can_pillager_patrol_spawn': EnvironmentAttributeGameplayCanPillagerPatrolSpawn
  'minecraft:gameplay/can_pillager_patrol_spawn': EnvironmentAttributeGameplayCanPillagerPatrolSpawn
  'gameplay/can_start_raid': EnvironmentAttributeGameplayCanStartRaid
  'minecraft:gameplay/can_start_raid': EnvironmentAttributeGameplayCanStartRaid
  'gameplay/cat_waking_up_gift_chance': EnvironmentAttributeGameplayCatWakingUpGiftChance
  'minecraft:gameplay/cat_waking_up_gift_chance': EnvironmentAttributeGameplayCatWakingUpGiftChance
  'gameplay/creaking_active': EnvironmentAttributeGameplayCreakingActive
  'minecraft:gameplay/creaking_active': EnvironmentAttributeGameplayCreakingActive
  'gameplay/eyeblossom_open': EnvironmentAttributeGameplayEyeblossomOpen
  'minecraft:gameplay/eyeblossom_open': EnvironmentAttributeGameplayEyeblossomOpen
  'gameplay/fast_lava': EnvironmentAttributeGameplayFastLava
  'minecraft:gameplay/fast_lava': EnvironmentAttributeGameplayFastLava
  'gameplay/increased_fire_burnout': EnvironmentAttributeGameplayIncreasedFireBurnout
  'minecraft:gameplay/increased_fire_burnout': EnvironmentAttributeGameplayIncreasedFireBurnout
  'gameplay/monsters_burn': EnvironmentAttributeGameplayMonstersBurn
  'minecraft:gameplay/monsters_burn': EnvironmentAttributeGameplayMonstersBurn
  'gameplay/nether_portal_spawns_piglin': EnvironmentAttributeGameplayNetherPortalSpawnsPiglin
  'minecraft:gameplay/nether_portal_spawns_piglin': EnvironmentAttributeGameplayNetherPortalSpawnsPiglin
  'gameplay/piglins_zombify': EnvironmentAttributeGameplayPiglinsZombify
  'minecraft:gameplay/piglins_zombify': EnvironmentAttributeGameplayPiglinsZombify
  'gameplay/respawn_anchor_works': EnvironmentAttributeGameplayRespawnAnchorWorks
  'minecraft:gameplay/respawn_anchor_works': EnvironmentAttributeGameplayRespawnAnchorWorks
  'gameplay/sky_light_level': EnvironmentAttributeGameplaySkyLightLevel
  'minecraft:gameplay/sky_light_level': EnvironmentAttributeGameplaySkyLightLevel
  'gameplay/snow_golem_melts': EnvironmentAttributeGameplaySnowGolemMelts
  'minecraft:gameplay/snow_golem_melts': EnvironmentAttributeGameplaySnowGolemMelts
  'gameplay/surface_slime_spawn_chance': EnvironmentAttributeGameplaySurfaceSlimeSpawnChance
  'minecraft:gameplay/surface_slime_spawn_chance': EnvironmentAttributeGameplaySurfaceSlimeSpawnChance
  'gameplay/turtle_egg_hatch_chance': EnvironmentAttributeGameplayTurtleEggHatchChance
  'minecraft:gameplay/turtle_egg_hatch_chance': EnvironmentAttributeGameplayTurtleEggHatchChance
  'gameplay/villager_activity': EnvironmentAttributeGameplayVillagerActivity
  'minecraft:gameplay/villager_activity': EnvironmentAttributeGameplayVillagerActivity
  'gameplay/water_evaporates': EnvironmentAttributeGameplayWaterEvaporates
  'minecraft:gameplay/water_evaporates': EnvironmentAttributeGameplayWaterEvaporates
  'visual/ambient_light_color': EnvironmentAttributeVisualAmbientLightColor
  'minecraft:visual/ambient_light_color': EnvironmentAttributeVisualAmbientLightColor
  'visual/ambient_particles': EnvironmentAttributeVisualAmbientParticles
  'minecraft:visual/ambient_particles': EnvironmentAttributeVisualAmbientParticles
  'visual/block_light_tint': EnvironmentAttributeVisualBlockLightTint
  'minecraft:visual/block_light_tint': EnvironmentAttributeVisualBlockLightTint
  'visual/cloud_color': EnvironmentAttributeVisualCloudColor
  'minecraft:visual/cloud_color': EnvironmentAttributeVisualCloudColor
  'visual/cloud_fog_end_distance': EnvironmentAttributeVisualCloudFogEndDistance
  'minecraft:visual/cloud_fog_end_distance': EnvironmentAttributeVisualCloudFogEndDistance
  'visual/cloud_height': EnvironmentAttributeVisualCloudHeight
  'minecraft:visual/cloud_height': EnvironmentAttributeVisualCloudHeight
  'visual/default_dripstone_particle': EnvironmentAttributeVisualDefaultDripstoneParticle
  'minecraft:visual/default_dripstone_particle': EnvironmentAttributeVisualDefaultDripstoneParticle
  'visual/fog_color': EnvironmentAttributeVisualFogColor
  'minecraft:visual/fog_color': EnvironmentAttributeVisualFogColor
  'visual/fog_end_distance': EnvironmentAttributeVisualFogEndDistance
  'minecraft:visual/fog_end_distance': EnvironmentAttributeVisualFogEndDistance
  'visual/fog_start_distance': EnvironmentAttributeVisualFogStartDistance
  'minecraft:visual/fog_start_distance': EnvironmentAttributeVisualFogStartDistance
  'visual/moon_angle': EnvironmentAttributeVisualMoonAngle
  'minecraft:visual/moon_angle': EnvironmentAttributeVisualMoonAngle
  'visual/moon_phase': EnvironmentAttributeVisualMoonPhase
  'minecraft:visual/moon_phase': EnvironmentAttributeVisualMoonPhase
  'visual/night_vision_color': EnvironmentAttributeVisualNightVisionColor
  'minecraft:visual/night_vision_color': EnvironmentAttributeVisualNightVisionColor
  'visual/sky_color': EnvironmentAttributeVisualSkyColor
  'minecraft:visual/sky_color': EnvironmentAttributeVisualSkyColor
  'visual/sky_fog_end_distance': EnvironmentAttributeVisualSkyFogEndDistance
  'minecraft:visual/sky_fog_end_distance': EnvironmentAttributeVisualSkyFogEndDistance
  'visual/sky_light_color': EnvironmentAttributeVisualSkyLightColor
  'minecraft:visual/sky_light_color': EnvironmentAttributeVisualSkyLightColor
  'visual/sky_light_factor': EnvironmentAttributeVisualSkyLightFactor
  'minecraft:visual/sky_light_factor': EnvironmentAttributeVisualSkyLightFactor
  'visual/star_angle': EnvironmentAttributeVisualStarAngle
  'minecraft:visual/star_angle': EnvironmentAttributeVisualStarAngle
  'visual/star_brightness': EnvironmentAttributeVisualStarBrightness
  'minecraft:visual/star_brightness': EnvironmentAttributeVisualStarBrightness
  'visual/sun_angle': EnvironmentAttributeVisualSunAngle
  'minecraft:visual/sun_angle': EnvironmentAttributeVisualSunAngle
  'visual/sunrise_sunset_color': EnvironmentAttributeVisualSunriseSunsetColor
  'minecraft:visual/sunrise_sunset_color': EnvironmentAttributeVisualSunriseSunsetColor
  'visual/water_fog_color': EnvironmentAttributeVisualWaterFogColor
  'minecraft:visual/water_fog_color': EnvironmentAttributeVisualWaterFogColor
  'visual/water_fog_end_distance': EnvironmentAttributeVisualWaterFogEndDistance
  'minecraft:visual/water_fog_end_distance': EnvironmentAttributeVisualWaterFogEndDistance
  'visual/water_fog_start_distance': EnvironmentAttributeVisualWaterFogStartDistance
  'minecraft:visual/water_fog_start_distance': EnvironmentAttributeVisualWaterFogStartDistance
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
  | EnvironmentAttributeGameplayEyeblossomOpen
  | EnvironmentAttributeGameplayFastLava
  | EnvironmentAttributeGameplayIncreasedFireBurnout
  | EnvironmentAttributeGameplayMonstersBurn
  | EnvironmentAttributeGameplayNetherPortalSpawnsPiglin
  | EnvironmentAttributeGameplayPiglinsZombify
  | EnvironmentAttributeGameplayRespawnAnchorWorks
  | EnvironmentAttributeGameplaySkyLightLevel
  | EnvironmentAttributeGameplaySnowGolemMelts
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
type EnvironmentAttributeFallbackType = DiscreteAttribute<unknown>
type EnvironmentAttributeAudioAmbientSounds = DiscreteAttribute<AmbientSounds>
type EnvironmentAttributeAudioBackgroundMusic = DiscreteAttribute<BackgroundMusic>
type EnvironmentAttributeAudioFireflyBushSounds = BooleanAttribute
type EnvironmentAttributeAudioMusicVolume = FloatAttribute<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>>
type EnvironmentAttributeGameplayBabyVillagerActivity = DiscreteAttribute<Registry['minecraft:activity']>
type EnvironmentAttributeGameplayBedRule = DiscreteAttribute<BedRule>
type EnvironmentAttributeGameplayBeesStayInHive = BooleanAttribute
type EnvironmentAttributeGameplayCanPillagerPatrolSpawn = BooleanAttribute
type EnvironmentAttributeGameplayCanStartRaid = BooleanAttribute
type EnvironmentAttributeGameplayCatWakingUpGiftChance = FloatAttribute<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>>
type EnvironmentAttributeGameplayCreakingActive = BooleanAttribute
type EnvironmentAttributeGameplayEyeblossomOpen = DiscreteAttribute<TriState>
type EnvironmentAttributeGameplayFastLava = BooleanAttribute
type EnvironmentAttributeGameplayIncreasedFireBurnout = BooleanAttribute
type EnvironmentAttributeGameplayMonstersBurn = BooleanAttribute
type EnvironmentAttributeGameplayNetherPortalSpawnsPiglin = BooleanAttribute
type EnvironmentAttributeGameplayPiglinsZombify = BooleanAttribute
type EnvironmentAttributeGameplayRespawnAnchorWorks = BooleanAttribute
type EnvironmentAttributeGameplaySkyLightLevel = FloatAttribute<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
}>>
type EnvironmentAttributeGameplaySnowGolemMelts = BooleanAttribute
type EnvironmentAttributeGameplaySurfaceSlimeSpawnChance = FloatAttribute<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>>
type EnvironmentAttributeGameplayTurtleEggHatchChance = FloatAttribute<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>>
type EnvironmentAttributeGameplayVillagerActivity = DiscreteAttribute<Registry['minecraft:activity']>
type EnvironmentAttributeGameplayWaterEvaporates = BooleanAttribute
type EnvironmentAttributeVisualAmbientLightColor = RGBColorAttribute
type EnvironmentAttributeVisualAmbientParticles = DiscreteAttribute<Array<AmbientParticle>>
type EnvironmentAttributeVisualBlockLightTint = RGBColorAttribute
type EnvironmentAttributeVisualCloudColor = ARGBColorAttribute
type EnvironmentAttributeVisualCloudFogEndDistance = FloatAttribute<NBTFloat<{
  leftExclusive: false
  min: 0
}>>
type EnvironmentAttributeVisualCloudHeight = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualDefaultDripstoneParticle = DiscreteAttribute<Particle>
type EnvironmentAttributeVisualFogColor = RGBColorAttribute
type EnvironmentAttributeVisualFogEndDistance = FloatAttribute<NBTFloat<{
  leftExclusive: false
  min: 0
}>>
type EnvironmentAttributeVisualFogStartDistance = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualMoonAngle = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualMoonPhase = DiscreteAttribute<MoonPhase>
type EnvironmentAttributeVisualNightVisionColor = RGBColorAttribute
type EnvironmentAttributeVisualSkyColor = RGBColorAttribute
type EnvironmentAttributeVisualSkyFogEndDistance = FloatAttribute<NBTFloat<{
  leftExclusive: false
  min: 0
}>>
type EnvironmentAttributeVisualSkyLightColor = RGBColorAttribute
type EnvironmentAttributeVisualSkyLightFactor = FloatAttribute<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>>
type EnvironmentAttributeVisualStarAngle = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualStarBrightness = FloatAttribute<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>>
type EnvironmentAttributeVisualSunAngle = FloatAttribute<NBTFloat>
type EnvironmentAttributeVisualSunriseSunsetColor = ARGBColorAttribute
type EnvironmentAttributeVisualWaterFogColor = RGBColorAttribute
type EnvironmentAttributeVisualWaterFogEndDistance = FloatAttribute<NBTFloat<{
  leftExclusive: false
  min: 0
}>>
type EnvironmentAttributeVisualWaterFogStartDistance = FloatAttribute<NBTFloat>
export type SymbolEnvironmentAttribute<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? EnvironmentAttributeDispatcherMap
  : CASE extends 'keys' ? EnvironmentAttributeKeys : CASE extends '%fallback' ? EnvironmentAttributeFallback : never
