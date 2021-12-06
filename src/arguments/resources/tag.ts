import type { LiteralUnion } from '@/generalTypes'
import type {
  BLOCKS, ENTITY_TYPES, FLUIDS, ITEMS,
} from '@arguments'
import type { TAG_TYPES } from '@arguments/basics'
import type { MCFunctionInstance } from '@datapack/Datapack'
import type { TagInstance } from '@resources'

export type HintedTagStringType<T extends TAG_TYPES> = (
  T extends 'blocks' ? LiteralUnion<BLOCKS> :
  T extends 'fluids' ? LiteralUnion<FLUIDS> :
  T extends 'entity_types' ? LiteralUnion<ENTITY_TYPES> :
  T extends 'functions' ? (LiteralUnion<string> | MCFunctionInstance) :
  T extends 'items' ? LiteralUnion<ITEMS> :
  string
)

export type TagSingleValue<T> = T | { id: T, required: boolean }

export type TagJSON<TAG_TYPE extends TAG_TYPES> = readonly TagSingleValue<HintedTagStringType<TAG_TYPE> | TagInstance<TAG_TYPE>>[]
