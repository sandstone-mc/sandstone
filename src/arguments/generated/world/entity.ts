import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { Text } from 'sandstone/arguments/generated/util/text.js'
import type { CustomData } from 'sandstone/arguments/generated/world/component.js'
import type { LabelClass, NBTDouble, NBTFloat, NBTInt, NBTIntArray, NBTList, NBTShort } from 'sandstone'

export type AnyEntity = ({
  [S in Extract<Registry['minecraft:entity_type'], string>]?: ({
    /**
         * The ID of this entity. Not present on player entities.
         */
    id: S
  } & (S extends keyof Dispatcher<'minecraft:entity'> ? Dispatcher<'minecraft:entity'>[S] : Record<string, unknown>));
}[Registry['minecraft:entity_type']])

export type BlockAttachedEntity = (EntityBase & {
  /**
     * Value:
     * Array length range: 3
     */
  block_pos?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
})

export type EntityBase = {
  /**
     * Value:
     * List length range: 3
     */
  Pos?: NBTList<(NBTDouble | number), {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Value:
     * List length range: 3
     */
  Motion?: NBTList<(NBTDouble | number), {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Rotation in [y-rotation, x-rotation]
     *
     * Value:
     * List length range: 2
     */
  Rotation?: NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 2
    max: 2
  }>
  /**
     * How far the entity has fallen.
     */
  fall_distance?: (NBTDouble | number)
  /**
     * Ticks of fire left, or if negative, ticks until the entity starts to burn.
     */
  Fire?: NBTShort
  /**
     * Ticks of air left.
     */
  Air?: NBTShort
  /**
     * Whether the entity has visual fire.
     */
  HasVisualFire?: boolean
  /**
     * Whether the entity is on the ground.
     */
  OnGround?: boolean
  /**
     * Whether the entity should be effected by gravity.
     */
  NoGravity?: boolean
  /**
     * Whether the entity should take damage.
     */
  Invulnerable?: boolean
  /**
     * How long until the entity can go through a nether portal.
     */
  PortalCooldown?: NBTInt
  /**
     * Value:
     * Array length range: 4
     */
  UUID?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  CustomName?: Text
  /**
     * Whether the custom name should always be visible.
     */
  CustomNameVisible?: boolean
  /**
     * Whether the entity should make any sound.
     */
  Silent?: boolean
  /**
     * Passengers on the entity.
     */
  Passengers?: Array<AnyEntity>
  /**
     * Whether the entity should glow.
     */
  Glowing?: boolean
  /**
     * Labelling tags on the entity.
     */
  Tags?: Array<`${any}${string}` | LabelClass>
  /**
     * Any stored data
     */
  data?: CustomData
  /**
     * Ticks that this entity has been freezing. Although this tag is defined for all entities,
     * it is actually only used by mobs that are not in the `freeze_immune_entity_types` entity type tag.
     * This increases by one every tick the entity is in powdered snow, and decreases by two when it's out of it.
     */
  TicksFrozen?: NBTInt
}
