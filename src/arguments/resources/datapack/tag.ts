import type {
  BANNER_PATTERNS,
  Registry['minecraft:block'],
  Registry['minecraft:cat_variant'],
  Registry['minecraft:dimension'],
  Registry['minecraft:entity_type'],
  Registry['minecraft:fluid'],
  GAME_EVENTS,
  Registry['minecraft:item'],
  PAINTING_VARIANTS,
  Registry['minecraft:point_of_interest_type'],
  REGISTRIES,
  Registry['minecraft:worldgen/biome'],
} from 'sandstone/arguments'
import type { MCFunctionClass, TagClass } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { Registry } from 'sandstone/arguments/generated/registry'

/** biome-ignore format: excessive formatting */
export type HintedTagStringType<T extends LiteralUnion<REGISTRIES>> = (
  T extends 'blocks' ? Registry['minecraft:block'] :
  T extends 'fluids' ? Registry['minecraft:fluid'] :
  T extends 'entity_types' ? Registry['minecraft:entity_type'] :
  T extends 'functions' ? (LiteralUnion<string> | MCFunctionClass<undefined, undefined>) :
  T extends 'items' ? Registry['minecraft:item'] :
  T extends 'dimensions' ? Registry['minecraft:dimension'] :
  T extends 'game_events' ? LiteralUnion<GAME_EVENTS> :
  T extends 'cat_variant' ? Registry['minecraft:cat_variant'] :
  T extends 'painting_variant' ? LiteralUnion<PAINTING_VARIANTS> :
  T extends 'point_of_interest_type' ? Registry['minecraft:point_of_interest_type'] :
  T extends 'banner_pattern' ? LiteralUnion<BANNER_PATTERNS> :
  T extends 'worldgen/biome' ? Registry['minecraft:worldgen/biome'] :
  string
)

export type TagSingleValue<T> = T | { id: T; required: boolean }

export type TagValuesJSON<REGISTRY extends LiteralUnion<REGISTRIES>> = TagSingleValue<
  HintedTagStringType<REGISTRY> | TagClass<LiteralUnion<REGISTRIES>>
>[]
