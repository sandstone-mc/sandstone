import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JSONRGB, JSONRGBA } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonItemStackTemplate } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTDouble, NBTFloat, NBTInt } from 'sandstone'

export type JsonBlockParticle = {
  block_state: (JsonRegistry['minecraft:block'] | JsonBlockState),
}

export type JsonDragonBreathParticle = {
  /**
   * Multiplier of initial velocity.
   * Defaults to 1.0
   */
  power?: (NBTFloat | number),
}

export type JsonDustColor = JSONRGB

export type JsonDustColorTransitionParticle = {
  from_color: JsonDustColor,
  to_color: JsonDustColor,
  /**
   * Value:
   * Range: 0.01..4
   */
  scale: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
}

export type JsonDustParticle = {
  color: JsonDustColor,
  /**
   * Value:
   * Range: 0.01..4
   */
  scale: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
}

export type JsonEffectParticle = {
  /**
   * Multiplier of initial velocity.
   * Defaults to 1.0
   */
  power?: (NBTFloat | number),
  color?: JSONRGB,
}

export type JsonEntityEffectParticle = {
  color: JsonTranslucentParticle,
}

export type JsonFlashParticle = {
  color: JsonTranslucentParticle,
}

export type JsonGeyserBaseParticle = {
  /**
   * Scales the particle size and its burst impulse.
   *
   * Value:
   * Range: 1..
   */
  water_blocks: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Scales the initial burst impulse
   */
  burst_impulse_base: (NBTFloat | number),
}

export type JsonGeyserParticle = {
  /**
   * Scales the particle size and its burst impulse.
   *
   * Value:
   * Range: 1..
   */
  water_blocks: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonItemParticle = {
  item: JsonItemStackTemplate,
}

/**
 * List length range: 3
 */
export type JsonLegacyDustColor = JsonNBTList<(NBTFloat | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 3,
  max: 3,
}>

/**
 * List length range: 4
 */
export type JsonLegacyTranslucentParticle = JsonNBTList<(NBTFloat | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 4,
  max: 4,
}>

export type JsonOldDustParticle = {
  r: (NBTFloat | number),
  g: (NBTFloat | number),
  b: (NBTFloat | number),
  /**
   * Value:
   * Range: 0.01..4
   */
  scale: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
}

export type JsonOldDustTransition = {
  fromColor: JsonDustColor,
  toColor: JsonDustColor,
  /**
   * Value:
   * Range: 0.01..4
   */
  scale: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
}

export type JsonOldEntityEffect = {
  r: (NBTFloat | number),
  g: (NBTFloat | number),
  b: (NBTFloat | number),
  a: (NBTFloat | number),
}

export type JsonParticle = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:particle_type'], string>, string>]?: ({
    type: S,
  } & (S extends undefined
    ? JsonSymbolParticle<'%none'> :
    (S extends keyof JsonSymbolParticle ? JsonSymbolParticle[S] : JsonSymbolParticle<'%unknown'>)))
}[Extract<JsonRegistry['minecraft:particle_type'], string>])>

export type JsonSafePositionSource = {
  type: 'block',
  /**
   * Value:
   * List length range: 3
   */
  pos: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type JsonSculkChargeParticle = {
  /**
   * Angle the particle texture is rotated to, measured in radians (π ~ 3.14 for 180° clockwise, negative for counter clockwise).
   */
  roll: (NBTFloat | number),
}

export type JsonShriekParticle = {
  /**
   * Ticks until the particle renders.
   *
   * Value:
   * Range: 0..
   */
  delay: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonTintedLeavesParticle = {
  color: JSONRGBA,
}

export type JsonTrailParticle = {
  /**
   * Value:
   * List length range: 3
   */
  target: JsonNBTList<(NBTDouble | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  color: JSONRGB,
  /**
   * Value:
   * Range: 1..
   */
  duration: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonTranslucentParticle = JSONRGBA

export type JsonVibrationParticle = JsonVibrationParticleData

export type JsonVibrationParticleData = {
  /**
   * Ticks in which to interpolate the particle's initial position to the destination.
   */
  arrival_in_ticks: (NBTInt | number),
  destination: JsonSafePositionSource,
}
type JsonParticleDispatcherMap = {
  'block': JsonParticleBlock,
  'minecraft:block': JsonParticleBlock,
  'block_crumble': JsonParticleBlockCrumble,
  'minecraft:block_crumble': JsonParticleBlockCrumble,
  'block_marker': JsonParticleBlockMarker,
  'minecraft:block_marker': JsonParticleBlockMarker,
  'dragon_breath': JsonParticleDragonBreath,
  'minecraft:dragon_breath': JsonParticleDragonBreath,
  'dust': JsonParticleDust,
  'minecraft:dust': JsonParticleDust,
  'dust_color_transition': JsonParticleDustColorTransition,
  'minecraft:dust_color_transition': JsonParticleDustColorTransition,
  'dust_pillar': JsonParticleDustPillar,
  'minecraft:dust_pillar': JsonParticleDustPillar,
  'effect': JsonParticleEffect,
  'minecraft:effect': JsonParticleEffect,
  'entity_effect': JsonParticleEntityEffect,
  'minecraft:entity_effect': JsonParticleEntityEffect,
  'falling_dust': JsonParticleFallingDust,
  'minecraft:falling_dust': JsonParticleFallingDust,
  'flash': JsonParticleFlash,
  'minecraft:flash': JsonParticleFlash,
  'geyser': JsonParticleGeyser,
  'minecraft:geyser': JsonParticleGeyser,
  'geyser_base': JsonParticleGeyserBase,
  'minecraft:geyser_base': JsonParticleGeyserBase,
  'geyser_plume': JsonParticleGeyserPlume,
  'minecraft:geyser_plume': JsonParticleGeyserPlume,
  'geyser_poof': JsonParticleGeyserPoof,
  'minecraft:geyser_poof': JsonParticleGeyserPoof,
  'instant_effect': JsonParticleInstantEffect,
  'minecraft:instant_effect': JsonParticleInstantEffect,
  'item': JsonParticleItem,
  'minecraft:item': JsonParticleItem,
  'sculk_charge': JsonParticleSculkCharge,
  'minecraft:sculk_charge': JsonParticleSculkCharge,
  'shriek': JsonParticleShriek,
  'minecraft:shriek': JsonParticleShriek,
  'tinted_leaves': JsonParticleTintedLeaves,
  'minecraft:tinted_leaves': JsonParticleTintedLeaves,
  'trail': JsonParticleTrail,
  'minecraft:trail': JsonParticleTrail,
  'vibration': JsonParticleVibration,
  'minecraft:vibration': JsonParticleVibration,
}
type JsonParticleKeys = keyof JsonParticleDispatcherMap
type JsonParticleFallback = (
  | JsonParticleBlock
  | JsonParticleBlockCrumble
  | JsonParticleBlockMarker
  | JsonParticleDragonBreath
  | JsonParticleDust
  | JsonParticleDustColorTransition
  | JsonParticleDustPillar
  | JsonParticleEffect
  | JsonParticleEntityEffect
  | JsonParticleFallingDust
  | JsonParticleFlash
  | JsonParticleGeyser
  | JsonParticleGeyserBase
  | JsonParticleGeyserPlume
  | JsonParticleGeyserPoof
  | JsonParticleInstantEffect
  | JsonParticleItem
  | JsonParticleSculkCharge
  | JsonParticleShriek
  | JsonParticleTintedLeaves
  | JsonParticleTrail
  | JsonParticleVibration
  | JsonParticleFallbackType)
export type JsonParticleFallbackType = Record<string, never>
type JsonParticleNoneType = JsonNBTObject
type JsonParticleBlock = JsonBlockParticle
type JsonParticleBlockCrumble = JsonBlockParticle
type JsonParticleBlockMarker = JsonBlockParticle
type JsonParticleDragonBreath = JsonDragonBreathParticle
type JsonParticleDust = JsonDustParticle
type JsonParticleDustColorTransition = JsonDustColorTransitionParticle
type JsonParticleDustPillar = JsonBlockParticle
type JsonParticleEffect = JsonEffectParticle
type JsonParticleEntityEffect = JsonEntityEffectParticle
type JsonParticleFallingDust = JsonBlockParticle
type JsonParticleFlash = JsonFlashParticle
type JsonParticleGeyser = JsonGeyserParticle
type JsonParticleGeyserBase = JsonGeyserBaseParticle
type JsonParticleGeyserPlume = JsonGeyserParticle
type JsonParticleGeyserPoof = JsonGeyserBaseParticle
type JsonParticleInstantEffect = JsonEffectParticle
type JsonParticleItem = JsonItemParticle
type JsonParticleSculkCharge = JsonSculkChargeParticle
type JsonParticleShriek = JsonShriekParticle
type JsonParticleTintedLeaves = JsonTintedLeavesParticle
type JsonParticleTrail = JsonTrailParticle
type JsonParticleVibration = JsonVibrationParticle
export type JsonSymbolParticle<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonParticleDispatcherMap
  : CASE extends 'keys'
    ? JsonParticleKeys
    : CASE extends '%fallback'
      ? JsonParticleFallback
      : CASE extends '%none' ? JsonParticleNoneType : CASE extends '%unknown' ? JsonParticleFallbackType : never
