import type {
  BANNER_PATTERNS, BIOMES, BLOCKS, CAT_VARIANTS, DIMENSIONS, ENTITY_TYPES, FLUIDS, GAME_EVENTS, ITEMS, PAINTING_VARIANTS, POINT_OF_INTEREST_TYPES, REGISTRIES,
} from '#arguments'
import type { MCFunctionClass, TagClass } from '#core'
import type { LiteralUnion } from '#utils'

export type HintedTagStringType<T extends LiteralUnion<REGISTRIES>> = (
  T extends 'blocks' ? LiteralUnion<BLOCKS> :
  T extends 'fluids' ? LiteralUnion<FLUIDS> :
  T extends 'entity_types' ? LiteralUnion<ENTITY_TYPES> :
  T extends 'functions' ? (LiteralUnion<string> | MCFunctionClass) :
  T extends 'items' ? LiteralUnion<ITEMS> :
  T extends 'dimensions' ? LiteralUnion<DIMENSIONS> :
  T extends 'game_events' ? LiteralUnion<GAME_EVENTS> :
  T extends 'cat_variant' ? LiteralUnion<CAT_VARIANTS> :
  T extends 'painting_variant' ? LiteralUnion<PAINTING_VARIANTS> :
  T extends 'point_of_interest_type' ? LiteralUnion<POINT_OF_INTEREST_TYPES> :
  T extends 'banner_pattern' ? LiteralUnion<BANNER_PATTERNS> :
  T extends 'worldgen/biome' ? LiteralUnion<BIOMES> :
  string
)

export type TagSingleValue<T> = T | { id: T, required: boolean }

export type TagValuesJSON<REGISTRY extends LiteralUnion<REGISTRIES>> = TagSingleValue<HintedTagStringType<REGISTRY> | TagClass<LiteralUnion<REGISTRIES>> >[]
