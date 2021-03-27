import type {
  BLOCKS, ENTITY_TYPES, FLUIDS, ITEMS,
} from 'src/arguments'
import type { TAG_TYPES } from 'src/arguments/basics'
import type { LiteralUnion } from '@/generalTypes'
import type { MCFunctionInstance } from '@datapack/Datapack'

export type HintedTagStringType<T extends TAG_TYPES> = (
  T extends 'blocks' ? LiteralUnion<BLOCKS> :
  T extends 'fluids' ? LiteralUnion<FLUIDS> :
  T extends 'entity_types' ? LiteralUnion<ENTITY_TYPES> :
  T extends 'functions' ? (LiteralUnion<string> | MCFunctionInstance) :
  T extends 'items' ? LiteralUnion<ITEMS> :
  string
)

export type TagSingleValue<T> = T | { id: T, required: boolean }

export type TagJSON<TAG_TYPE extends TAG_TYPES> = readonly TagSingleValue<HintedTagStringType<TAG_TYPE>>[]
