import type { Registry } from 'sandstone/arguments'
import type { EntityCriterion } from './EntityCriterion'
import type { NumberProvider } from './utils'
import { DamageTypeClass } from 'sandstone/core'

export type DamageCriterion = Partial<{
  /** Checks if the damage was successfully blocked. */
  blocked: boolean

  /** Checks the amount of incoming damage before damage reduction. */
  dealt: NumberProvider

  /** Checks the amount of incoming damage after damage reduction. */
  taken: NumberProvider

  /** Checks the entity that was the source of the damage (for example: The skeleton that shot the arrow). */
  source_entity: EntityCriterion

  /** Checks the type of damage done. */
  tags: {
    id: Registry['minecraft:damage_type'] | DamageTypeClass
    expected: boolean
  }[]
}>
