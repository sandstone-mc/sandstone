import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { RGB, RGBA } from 'sandstone/arguments/generated/util/color.ts'
import type { SingleItem } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTDouble, NBTFloat, NBTInt, NBTList } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'

export type BlockParticle = {
  block_state: (Registry['minecraft:block'] | BlockState)
}

export type DragonBreathParticle = {
  /**
     * Multiplier of initial velocity.
     * Defaults to 1.0
     */
  power?: NBTFloat
}

export type DustColor = RGB

export type DustColorTransitionParticle = {
  from_color: DustColor
  to_color: DustColor
  /**
     * Value:
     * Range: 0.01..4
     */
  scale: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
  }>
}

export type DustParticle = {
  color: DustColor
  /**
     * Value:
     * Range: 0.01..4
     */
  scale: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
  }>
}

export type EffectParticle = {
  /**
     * Multiplier of initial velocity.
     * Defaults to 1.0
     */
  power?: NBTFloat
  color?: RGB
}

export type EntityEffectParticle = {
  color: TranslucentParticle
}

export type FlashParticle = {
  color: TranslucentParticle
}

export type ItemParticle = {
  item: (Registry['minecraft:item'] | SingleItem)
}

/**
 * List length range: 3
 */
export type LegacyDustColor = NBTList<NBTFloat, {
  leftExclusive: false
  rightExclusive: false
  min: 3
  max: 3
}>

/**
 * List length range: 4
 */
export type LegacyTranslucentParticle = NBTList<NBTFloat, {
  leftExclusive: false
  rightExclusive: false
  min: 4
  max: 4
}>

export type Particle = ({
  [S in Extract<Registry['minecraft:particle_type'], string>]?: ({
    type: S
  } & (S extends undefined
    ? SymbolParticle<'%none'> :
    (S extends keyof SymbolParticle ? SymbolParticle[S] : RootNBT)));
}[Registry['minecraft:particle_type']])

export type SafePositionSource = {
  type: 'block'
  /**
     * Value:
     * List length range: 3
     */
  pos: NBTList<NBTInt, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
}

export type SculkChargeParticle = {
  /**
     * Angle the particle texture is rotated to, measured in radians (π ~ 3.14 for 180° clockwise, negative for counter clockwise).
     */
  roll: NBTFloat
}

export type ShriekParticle = {
  /**
     * Ticks until the particle renders.
     *
     * Value:
     * Range: 0..
     */
  delay: NBTInt<{
    min: 0
  }>
}

export type TintedLeavesParticle = {
  color: RGBA
}

export type TrailParticle = {
  /**
     * Value:
     * List length range: 3
     */
  target: NBTList<(NBTDouble | number), {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  color: RGB
  /**
     * Value:
     * Range: 1..
     */
  duration: NBTInt<{
    min: 1
  }>
}

export type TranslucentParticle = RGBA

export type VibrationParticle = VibrationParticleData

export type VibrationParticleData = {
  /**
     * Ticks in which to interpolate the particle's initial position to the destination.
     */
  arrival_in_ticks: NBTInt
  destination: SafePositionSource
}
type ParticleDispatcherMap = {
  'block': ParticleBlock
  'minecraft:block': ParticleBlock
  'block_crumble': ParticleBlockCrumble
  'minecraft:block_crumble': ParticleBlockCrumble
  'block_marker': ParticleBlockMarker
  'minecraft:block_marker': ParticleBlockMarker
  'dragon_breath': ParticleDragonBreath
  'minecraft:dragon_breath': ParticleDragonBreath
  'dust': ParticleDust
  'minecraft:dust': ParticleDust
  'dust_color_transition': ParticleDustColorTransition
  'minecraft:dust_color_transition': ParticleDustColorTransition
  'dust_pillar': ParticleDustPillar
  'minecraft:dust_pillar': ParticleDustPillar
  'effect': ParticleEffect
  'minecraft:effect': ParticleEffect
  'entity_effect': ParticleEntityEffect
  'minecraft:entity_effect': ParticleEntityEffect
  'falling_dust': ParticleFallingDust
  'minecraft:falling_dust': ParticleFallingDust
  'flash': ParticleFlash
  'minecraft:flash': ParticleFlash
  'instant_effect': ParticleInstantEffect
  'minecraft:instant_effect': ParticleInstantEffect
  'item': ParticleItem
  'minecraft:item': ParticleItem
  'sculk_charge': ParticleSculkCharge
  'minecraft:sculk_charge': ParticleSculkCharge
  'shriek': ParticleShriek
  'minecraft:shriek': ParticleShriek
  'tinted_leaves': ParticleTintedLeaves
  'minecraft:tinted_leaves': ParticleTintedLeaves
  'trail': ParticleTrail
  'minecraft:trail': ParticleTrail
  'vibration': ParticleVibration
  'minecraft:vibration': ParticleVibration
}
type ParticleKeys = keyof ParticleDispatcherMap
type ParticleFallback = (
  | ParticleBlock
  | ParticleBlockCrumble
  | ParticleBlockMarker
  | ParticleDragonBreath
  | ParticleDust
  | ParticleDustColorTransition
  | ParticleDustPillar
  | ParticleEffect
  | ParticleEntityEffect
  | ParticleFallingDust
  | ParticleFlash
  | ParticleInstantEffect
  | ParticleItem
  | ParticleSculkCharge
  | ParticleShriek
  | ParticleTintedLeaves
  | ParticleTrail
  | ParticleVibration
  | ParticleFallbackType)
export type ParticleFallbackType = Record<string, never>
type ParticleNoneType = unknown
type ParticleBlock = BlockParticle
type ParticleBlockCrumble = BlockParticle
type ParticleBlockMarker = BlockParticle
type ParticleDragonBreath = DragonBreathParticle
type ParticleDust = DustParticle
type ParticleDustColorTransition = DustColorTransitionParticle
type ParticleDustPillar = BlockParticle
type ParticleEffect = EffectParticle
type ParticleEntityEffect = EntityEffectParticle
type ParticleFallingDust = BlockParticle
type ParticleFlash = FlashParticle
type ParticleInstantEffect = EffectParticle
type ParticleItem = ItemParticle
type ParticleSculkCharge = SculkChargeParticle
type ParticleShriek = ShriekParticle
type ParticleTintedLeaves = TintedLeavesParticle
type ParticleTrail = TrailParticle
type ParticleVibration = VibrationParticle
export type SymbolParticle<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? ParticleDispatcherMap
  : CASE extends 'keys'
    ? ParticleKeys
    : CASE extends '%fallback' ? ParticleFallback : CASE extends '%none' ? ParticleNoneType : never
