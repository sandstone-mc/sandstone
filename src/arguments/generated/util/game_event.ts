import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type BlockPositionSource = {
  /**
   * Block position
   *
   * Value:
   * List length range: 3
   */
  pos: NBTList<NBTInt, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type EntityPositionSource = {
  /**
   * Value:
   * List length range: 4
   */
  source_entity: NBTList<NBTInt, {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * offset from the entity's feet to the source position
   */
  y_offset?: NBTFloat,
}

export type PositionSource = NonNullable<({
  [S in Extract<Registry['minecraft:position_source_type'], string>]?: ({
    type: S,
  } & (S extends keyof SymbolPositionSource ? SymbolPositionSource[S] : RootNBT))
}[Registry['minecraft:position_source_type']])>

export type ReceivingEvent = {
  game_event: Registry['minecraft:game_event'],
  /**
   * Distance in blocks to the source
   *
   * Value:
   * Range: 0..
   */
  distance: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Origin of the event
   *
   * Value:
   * List length range: 3
   */
  pos: NBTList<NBTFloat, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * UUID of the source entity of the event, if one exists
   *
   * Value:
   * List length range: 4
   */
  source?: NBTList<NBTInt, {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * UUID of the owner of the projectile, if one exists
   *
   * Value:
   * List length range: 4
   */
  projectile_owner?: NBTList<NBTInt, {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
}

export type VibrationListener = {
  source: PositionSource,
  /**
   * Range in blocks where vibrations can be detected
   *
   * Value:
   * Range: 1..
   */
  range: NBTInt<{
    min: 1,
  }>,
  /**
   * Event that is being received, if any
   */
  event?: ReceivingEvent,
  /**
   * Distance in blocks to the event that is being received
   *
   * Value:
   * Range: 0..
   */
  event_distance?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Delay in ticks until the event reaches this listener
   *
   * Value:
   * Range: 1..
   */
  event_delay?: NBTInt<{
    min: 1,
  }>,
}
type PositionSourceDispatcherMap = {
  'block': PositionSourceBlock,
  'minecraft:block': PositionSourceBlock,
  'entity': PositionSourceEntity,
  'minecraft:entity': PositionSourceEntity,
}
type PositionSourceKeys = keyof PositionSourceDispatcherMap
type PositionSourceFallback = (PositionSourceBlock | PositionSourceEntity)
type PositionSourceBlock = BlockPositionSource
type PositionSourceEntity = EntityPositionSource
export type SymbolPositionSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? PositionSourceDispatcherMap
  : CASE extends 'keys' ? PositionSourceKeys : CASE extends '%fallback' ? PositionSourceFallback : never
