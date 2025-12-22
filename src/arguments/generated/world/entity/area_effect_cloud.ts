import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Particle } from 'sandstone/arguments/generated/util/particle.js'
import type { EntityBase } from 'sandstone/arguments/generated/world/entity.js'
import type { NBTFloat, NBTInt, NBTIntArray } from 'sandstone'

export type AreaEffectCloud = (EntityBase & {
  /**
     * Number of ticks it has existed.
     * Controls when it will despawn; when greater than `Duration + WaitTime`.
     */
  Age?: NBTInt
  /**
     * Color of the particles.
     * calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive
     */
  Color?: NBTInt
  /**
     * Maximum number of ticks until it will disappear after `WaitTime` is done
     */
  Duration?: NBTInt
  /**
     * Number of ticks until the effects are reapplied.
     */
  ReapplicationDelay?: NBTInt
  /**
     * Number of ticks until it appears.
     */
  WaitTime?: NBTInt
  /**
     * Amount the duration changes when it is active.
     */
  DurationOnUse?: NBTInt
  /**
     * Value:
     * Array length range: 4
     */
  Owner?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  /**
     * Radius of the particles & effect applications.
     */
  Radius?: NBTFloat
  /**
     * Change in the radius when it is used.
     */
  RadiusOnUse?: NBTFloat
  /**
     * Change in the radius per tick.
     */
  RadiusPerTick?: NBTFloat
  /**
     * If present, the particle that the area effect cloud displays instead of the default `entity_effect` particle based on the potion contents.
     */
  custom_particle?: Particle
  potion_contents?: Dispatcher<'minecraft:data_component'>['potion_contents']
  /**
     * The duration of the potion effect applied is scaled by this factor. Defaults to `1`.
     * Will be `0.25` when throwing lingering potions.
     */
  potion_duration_scale?: NBTFloat
})
