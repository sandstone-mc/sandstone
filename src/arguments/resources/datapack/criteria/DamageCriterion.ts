import type { DAMAGE_TYPES } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'
import type { EntityCriterion } from './EntityCriterion.js'
import type { NumberProvider } from './utils.js'

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
    id: LiteralUnion<DAMAGE_TYPES>
    expected: boolean
  }[]
}>
