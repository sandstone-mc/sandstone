import type { JsonSymbolDataComponent } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonParticle } from 'sandstone/arguments/generated/_json/util/particle.ts'
import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { NBTFloat, NBTInt, NBTIntArray } from 'sandstone'

export type JsonAreaEffectCloud = (JsonEntityBase & {
  /**
   * Number of ticks it has existed.
   * Controls when it will despawn; when greater than `Duration + WaitTime`.
   */
  Age?: (NBTInt | number),
  /**
   * Color of the particles.
   * calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive
   */
  Color?: (NBTInt | number),
  /**
   * Maximum number of ticks until it will disappear after `WaitTime` is done
   */
  Duration?: (NBTInt | number),
  /**
   * Number of ticks until the effects are reapplied.
   */
  ReapplicationDelay?: (NBTInt | number),
  /**
   * Number of ticks until it appears.
   */
  WaitTime?: (NBTInt | number),
  /**
   * Amount the duration changes when it is active.
   */
  DurationOnUse?: (NBTInt | number),
  /**
   * Value:
   * Array length range: 4
   */
  Owner?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Radius of the particles & effect applications.
   */
  Radius?: (NBTFloat | number),
  /**
   * Change in the radius when it is used.
   */
  RadiusOnUse?: (NBTFloat | number),
  /**
   * Change in the radius per tick.
   */
  RadiusPerTick?: (NBTFloat | number),
  /**
   * If present, the particle that the area effect cloud displays instead of the default `entity_effect` particle based on the potion contents.
   */
  custom_particle?: JsonParticle,
  potion_contents?: JsonSymbolDataComponent['potion_contents'],
  /**
   * The duration of the potion effect applied is scaled by this factor. Defaults to `1`.
   * Will be `0.25` when throwing lingering potions.
   */
  potion_duration_scale?: (NBTFloat | number),
})
