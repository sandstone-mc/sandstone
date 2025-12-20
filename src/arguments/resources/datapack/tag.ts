import type { MCFunctionClass, TagClass } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { Registry, REGISTRIES } from 'sandstone/arguments'

/** biome-ignore format: excessive formatting */
export type HintedTagStringType<T extends LiteralUnion<REGISTRIES>> = (
  T extends 'function' ? (MCFunctionClass<undefined, undefined> | `${string}:${string}`) :
  `minecraft:${T}` extends keyof Registry ? Registry[`minecraft:${T}`] :
  string
)

export type TagSingleValue<T> = T | { id: T; required: boolean }

export type TagValuesJSON<REGISTRY extends LiteralUnion<REGISTRIES>> = TagSingleValue<
  HintedTagStringType<REGISTRY> | TagClass<LiteralUnion<REGISTRIES>>
>[]
