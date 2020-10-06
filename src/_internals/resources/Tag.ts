import type { LiteralUnion } from '@/generalTypes'
import type {
  BLOCKS, ENTITY_TYPES, FLUIDS, ITEMS, TAG_TYPES,
} from '@arguments'
import type { Datapack } from '@datapack'
import type { McFunctionReturn } from '@datapack/Datapack'
import type { TagSingleValue } from '@datapack/resourcesTree'

export type HintedTagStringType<T extends TAG_TYPES> = (
  T extends 'blocks' ? LiteralUnion<BLOCKS> :
  T extends 'fluids' ? LiteralUnion<FLUIDS> :
  T extends 'entity_types' ? LiteralUnion<ENTITY_TYPES> :
  T extends 'functions' ? (LiteralUnion<string> | McFunctionReturn<[]>) :
  T extends 'items' ? LiteralUnion<ITEMS> :
  string
)

function isMcFunctionReturn(v: unknown): v is McFunctionReturn<[]> {
  return typeof v === 'function'
}

function isTagObject<T>(v: TagSingleValue<T>): v is Exclude<TagSingleValue<T>, T> {
  return typeof v === 'object'
}

export class Tag<TYPE extends TAG_TYPES> {
  readonly type

  readonly values: TagSingleValue<string>[]

  readonly name

  readonly datapack

  constructor(datapack: Datapack, type: TYPE, name: string, values: readonly TagSingleValue<HintedTagStringType<TYPE>>[], replace?: boolean) {
    this.type = type

    this.values = values.map((v) => {
      if (isMcFunctionReturn(v)) {
        return v.getName()
      }
      if (isTagObject(v) && isMcFunctionReturn(v.id)) {
        return {
          id: v.id.getName(),
          required: v.required,
        }
      }
      return v as string | TagSingleValue<string>
    })

    this.name = name
    this.datapack = datapack

    const { namespace, fullPath } = datapack.getResourcePath(name)

    datapack.resources.addResource('tags', {
      children: new Map(),
      isResource: true,
      path: [namespace, type, ...fullPath],
      values: this.values,
      replace,
    })
  }
}
