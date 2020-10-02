import type { LiteralUnion } from '@/generalTypes'
import type {
  BLOCKS, ENTITY_TYPES, FLUIDS, ITEMS, TAG_TYPES,
} from '@arguments'
import type { Datapack } from '@datapack'
import type { TagObjectValue } from '@datapack/resourcesTree'

type HintedTagStringType<T extends TAG_TYPES> = (
  T extends 'blocks' ? BLOCKS :
  T extends 'fluids' ? FLUIDS :
  T extends 'entity_types' ? ENTITY_TYPES :
  T extends 'functions' ? string :
  T extends 'items' ? ITEMS :
  string
)

export type HintedTagValues<T extends TAG_TYPES> = (
  LiteralUnion<HintedTagStringType<T>> |
  TagObjectValue<
    LiteralUnion<HintedTagStringType<T>>
  >
)[]

export class Tag {
  readonly type

  readonly values

  readonly name

  readonly datapack

  constructor(datapack: Datapack, type: TAG_TYPES, name: string, values: TagObjectValue[], replace?: boolean) {
    this.type = type
    this.values = values
    this.name = name
    this.datapack = datapack

    const { namespace, fullPath } = datapack.getResourcePath(name)

    datapack.resources.addResource('tags', {
      children: new Map(),
      isResource: true,
      path: [namespace, type, ...fullPath],
      values,
      replace,
    })
  }
}
