import type { LiteralUnion } from '@/generalTypes'
import type { ITEMS } from '@arguments'

export interface ItemCriterion {
  item: LiteralUnion<ITEMS>
}
