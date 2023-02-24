/* eslint-disable camelcase */
import type { PredicateJSON } from '../predicate'
import type { DistanceCriterion, EffectCriterion } from './basic_criteria'
import type { ItemCriterion } from './ItemCriterion'
import type { LocationCriterion } from './LocationCriterion'
import type { PlayerCriterion } from './PlayerCriterion'
import type { CAT_VARIANTS, ENTITY_TYPES, MOB_EFFECTS } from '#arguments/generated'
import type { PredicateClass, TagClass } from '#core'
import type { LiteralUnion } from '#utils'

export type EntityCriterion = (PredicateClass | PredicateJSON)[] | Partial<{
  /** The distance of the entity */
  distance: DistanceCriterion & LocationCriterion

  /** A list of status effects. The key is the effect type. */
  effects: Record<MOB_EFFECTS, EffectCriterion>

  /** A list of equipment the entity must match. */
  equipment: Partial<Record<'mainhand' | 'offhand' | 'head' | 'chest' | 'legs' | 'feet', ItemCriterion>>

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

  /** The team the entity belongs to. */
  team: string

  /** An entity ID. */
  type: LiteralUnion<ENTITY_TYPES> | TagClass<'entity_types'>

  /** The entity which this entity is targeting for attacks. */
  targeted_entity: EntityCriterion

  /** The vehicle that the entity is riding on. */
  vehicle: EntityCriterion

  type_specific: TypeSpecific
}>

type TypeSpecificKind<TYPE extends string, VALUES extends Record<string, unknown>> = {
  condition: LiteralUnion<TYPE>
} & VALUES

type TypeSpecific = (
  TypeSpecificKind<'player', PlayerCriterion> |
  TypeSpecificKind<'fishing_hook', {
    in_open_water?: boolean
  }> |
  TypeSpecificKind<'lightning', {
    blocks_set_on_fire: number | {
      /** The maximum value. */
      max?: number
      /** The minimum value. */
      min?: number
    },
    entity_struck: EntityCriterion
  }> |
  TypeSpecificKind<'cat', {
    variant: LiteralUnion<CAT_VARIANTS>
  }> |
  TypeSpecificKind<'slime', {
    size: number | {
      /** The maximum value. */
      max?: number
      /** The minimum value. */
      min?: number
    },
  }> |
  TypeSpecificKind<'frog', {
    variant: LiteralUnion<'cold' | 'temperate' | 'warm'>
  }>
)
