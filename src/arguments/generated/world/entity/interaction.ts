import type { EntityBase } from 'sandstone/arguments/generated/world/entity.ts'
import type { NBTFloat, NBTIntArray, NBTLong } from 'sandstone'

export type Action = {
  /**
   * Value:
   * Array length range: 4
   */
  player?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  /**
   * Game tick of when the event occured.
   *
   * Value:
   * Range: 0..
   */
  timestamp?: NBTLong<{
    min: 0
  }>
}

export type Interaction = (EntityBase & {
  /**
   * Cube hitbox width centered on the entity. Negative values are effectively `| x |`.
   */
  width?: NBTFloat
  /**
   * Cube hitbox height stretching up from the entity position. Negative values stretch the hitbox down.
   */
  height?: NBTFloat
  /**
   * Whether an action should trigger a response. Defaults to false.
   * Response:
   * Attack - When true, the default attack sound is played.
   * Interaction - When true, the player's arm swings.
   */
  response?: boolean
  /**
   * Record of last attack (left click) event, can be updated every tick (no invulnerability frames).
   */
  attack?: Action
  /**
   * Record of last interaction (use; right click) event, can be updated every tick, if the player is holding the key it updates every 3 ticks.
   */
  interaction?: Action
})
