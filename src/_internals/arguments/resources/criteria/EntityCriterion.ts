/* eslint-disable camelcase */
import type { LiteralUnion } from '@/generalTypes'
import type { ENTITY_TYPES, MOB_EFFECTS } from '@arguments/generated'
import type { TagClass } from '@resources'
import type { DistanceCriterion, EffectCriterion } from './basic_criteria'
import type { ItemCriterion } from './ItemCriterion'
import type { LocationCriterion } from './LocationCriterion'
import type { PlayerCriterion } from './PlayerCriterion'

export type EntityCriterion = Partial<{
  /** The distance of the entity */
  distance: DistanceCriterion & LocationCriterion

  /** A list of status effects. The key is the effect type. */
  effects: Record<MOB_EFFECTS, EffectCriterion>

  /** A list of equipment the entity must match. */
  equipment: Record<'mainhand' | 'offhand' | 'head' | 'chest' | 'legs' | 'feet', ItemCriterion>

  /** Predicate Flags to be checked. */
  flags: Partial<{
    /** Test whether the entity is or is not on fire. */
    is_on_fire: boolean

    /** Test whether the entity is or is not sneaking. */
    is_sneaking: boolean

    /** Test whether the entity is or is not sprinting. */
    is_sprinting: boolean

    /** Test whether the entity is or is not swimming. */
    is_swimming: boolean

    /** Test whether the entity is or is not a baby variant. */
    is_baby: boolean
  }>

  /** Test the location of the entity. */
  location: LocationCriterion

  /** A NBT string the entity must match */
  nbt: string

  /** Player properties to be checked. Fails when entity is not a player. */
  player: PlayerCriterion

  /** The team the entity belongs to. */
  team: string

  /** An entity ID. */
  type: LiteralUnion<ENTITY_TYPES> | TagClass<'entity_types'>

  /** The entity which this entity is targeting for attacks. */
  targeted_entity: EntityCriterion

  /** The vehicle that the entity is riding on. */
  vehicle: EntityCriterion
}>
