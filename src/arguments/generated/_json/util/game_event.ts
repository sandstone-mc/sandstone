import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTFloat, NBTInt } from 'sandstone'

export type JsonBlockPositionSource = {
  /**
   * Block position
   *
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

export type JsonEntityPositionSource = {
  /**
   * Value:
   * List length range: 4
   */
  source_entity: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * offset from the entity's feet to the source position
   */
  y_offset?: (NBTFloat | number),
}

export type JsonPositionSource = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:position_source_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolPositionSource ? JsonSymbolPositionSource[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:position_source_type'], string>])>

export type JsonReceivingEvent = {
  game_event: JsonRegistry['minecraft:game_event'],
  /**
   * Distance in blocks to the source
   *
   * Value:
   * Range: 0..
   */
  distance: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
  /**
   * Origin of the event
   *
   * Value:
   * List length range: 3
   */
  pos: JsonNBTList<(NBTFloat | number), {
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
  source?: JsonNBTList<(NBTInt | number), {
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
  projectile_owner?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
}

export type JsonVibrationListener = {
  source: JsonPositionSource,
  /**
   * Range in blocks where vibrations can be detected
   *
   * Value:
   * Range: 1..
   */
  range: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Event that is being received, if any
   */
  event?: JsonReceivingEvent,
  /**
   * Distance in blocks to the event that is being received
   *
   * Value:
   * Range: 0..
   */
  event_distance?: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
  /**
   * Delay in ticks until the event reaches this listener
   *
   * Value:
   * Range: 1..
   */
  event_delay?: (NBTInt<{
    min: 1,
  }> | number),
}
type JsonPositionSourceDispatcherMap = {
  'block': JsonPositionSourceBlock,
  'minecraft:block': JsonPositionSourceBlock,
  'entity': JsonPositionSourceEntity,
  'minecraft:entity': JsonPositionSourceEntity,
}
type JsonPositionSourceKeys = keyof JsonPositionSourceDispatcherMap
type JsonPositionSourceFallback = (JsonPositionSourceBlock | JsonPositionSourceEntity)
type JsonPositionSourceBlock = JsonBlockPositionSource
type JsonPositionSourceEntity = JsonEntityPositionSource
export type JsonSymbolPositionSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonPositionSourceDispatcherMap
  : CASE extends 'keys' ? JsonPositionSourceKeys : CASE extends '%fallback' ? JsonPositionSourceFallback : never
