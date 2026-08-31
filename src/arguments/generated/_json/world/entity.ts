import type { JsonSymbolEntity } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonCustomData } from 'sandstone/arguments/generated/_json/world/component.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  JsonNBTList,
  LabelClass,
  NBTDouble,
  NBTFloat,
  NBTInt,
  NBTIntArray,
  NBTShort,
  NonEmptyString,
} from 'sandstone'

export type JsonAnyEntity = NonNullable<(({
  [S in Extract<Extract<keyof JsonSymbolEntity, string>, string>]?: ({
    id: S,
  } & (S extends keyof JsonSymbolEntity ? JsonSymbolEntity[S] : JsonRootNBT))
})[Extract<keyof JsonSymbolEntity, string>])>

export type JsonBlockAttachedEntity = (JsonEntityBase & {
  /**
   * Value:
   * Array length range: 3
   */
  block_pos?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
})

export type JsonEntityBase = {
  /**
   * Value:
   * List length range: 3
   */
  Pos?: JsonNBTList<(NBTDouble | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  Motion?: JsonNBTList<(NBTDouble | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Rotation in [y-rotation, x-rotation]
   *
   * Value:
   * List length range: 2
   */
  Rotation?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 2,
    max: 2,
  }>,
  /**
   * How far the entity has fallen.
   */
  fall_distance?: (NBTDouble | number),
  /**
   * Ticks of fire left, or if negative, ticks until the entity starts to burn.
   */
  Fire?: (NBTShort | number),
  /**
   * Ticks of air left.
   */
  Air?: (NBTShort | number),
  /**
   * Whether the entity has visual fire.
   */
  HasVisualFire?: boolean,
  /**
   * Whether the entity is on the ground.
   */
  OnGround?: boolean,
  /**
   * Whether the entity should be effected by gravity.
   */
  NoGravity?: boolean,
  /**
   * Whether the entity is immune to damage.
   */
  Invulnerable?: boolean,
  /**
   * Temporary immunity duration of the entity, in ticks. \
   * The entity is immune to damage if `invulnerable_time` > 0 **or** `Invulnerable` is `true`.
   *
   * Value:
   * Range: 0..
   */
  invulnerable_time?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * How long until the entity can go through a nether portal.
   */
  PortalCooldown?: (NBTInt | number),
  /**
   * Value:
   * Array length range: 4
   */
  UUID?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  CustomName?: JsonText,
  /**
   * Whether the custom name should always be visible.
   */
  CustomNameVisible?: boolean,
  /**
   * Whether the entity should make any sound.
   */
  Silent?: boolean,
  /**
   * Passengers on the entity.
   */
  Passengers?: Array<JsonAnyEntity>,
  /**
   * Whether the entity should glow.
   */
  Glowing?: boolean,
  /**
   * Labelling tags on the entity.
   */
  Tags?: Array<NonEmptyString | LabelClass>,
  /**
   * Team to join when it is spawned.
   */
  Team?: NonEmptyString,
  /**
   * Any stored data
   */
  data?: JsonCustomData,
  /**
   * Ticks that this entity has been freezing. Although this tag is defined for all entities,
   * it is actually only used by mobs that are not in the `freeze_immune_entity_types` entity type tag.
   * This increases by one every tick the entity is in powdered snow, and decreases by two when it's out of it.
   */
  TicksFrozen?: (NBTInt | number),
}
