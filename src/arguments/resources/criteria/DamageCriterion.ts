import type { EntityCriterion } from './EntityCriterion'
import type { NumberOrMinMax } from './utils'

/* eslint-disable camelcase */
export type DamageTypeCriterion = Partial<{
  /** Checks if the damage bypassed the armor of the player (suffocation damage predominantly). */
  bypasses_armor: boolean
  /** Checks if the damage bypassed the invulnerability status of the player (void or `/kill` damage). */
  bypasses_invulnerability: boolean
  /** Checks if the damage was caused by starvation. */
  bypasses_magic: boolean
  /** Checks if the damage originated from an explosion. */
  is_explosion: boolean
  /** Checks if the damage originated from fire. */
  is_fire: boolean
  /** Checks if the damage originated from magic. */
  is_magic: boolean
  /** Checks if the damage originated from a projectile. */
  is_projectile: boolean
  /** Checks if the damage originated from lightning. */
  is_lightning: boolean
  /** The entity that was the direct cause of the damage. */
  direct_entity: EntityCriterion
  /** Checks the entity that was the source of the damage (for example: The skeleton that shot the arrow). */
  source_entity: EntityCriterion
}>

export type DamageCriterion = Partial<{
  /** Checks if the damage was successfully blocked. */
  blocked: boolean

  /** Checks the amount of incoming damage before damage reduction. */
  dealt: NumberOrMinMax

  /** Checks the amount of incoming damage after damage reduction. */
  taken: NumberOrMinMax

  /** Checks the entity that was the source of the damage (for example: The skeleton that shot the arrow). */
  source_entity: EntityCriterion

  /** Checks the type of damage done. */
  type: DamageTypeCriterion
}>
