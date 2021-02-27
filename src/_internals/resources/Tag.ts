import { toMCFunctionName } from '@datapack/minecraft'

import { ResourceClass } from './Resource'

import type { LiteralUnion } from '@/generalTypes'
import type {
  BLOCKS, ENTITY_TYPES, FLUIDS, ITEMS, TAG_TYPES,
} from '@arguments'
import type { Datapack } from '@datapack'
import type { MCFunctionInstance } from '@datapack/Datapack'
import type { TagSingleValue } from '@datapack/resourcesTree'

export type HintedTagStringType<T extends TAG_TYPES> = (
  T extends 'blocks' ? LiteralUnion<BLOCKS> :
  T extends 'fluids' ? LiteralUnion<FLUIDS> :
  T extends 'entity_types' ? LiteralUnion<ENTITY_TYPES> :
  T extends 'functions' ? (LiteralUnion<string> | MCFunctionInstance) :
  T extends 'items' ? LiteralUnion<ITEMS> :
  string
)

function isMCFunctionInstance(v: unknown): v is MCFunctionInstance {
  return typeof v === 'function'
}

function isTagObject<T>(v: TagSingleValue<T>): v is Exclude<TagSingleValue<T>, T> {
  return typeof v === 'object'
}

function objectToString<TYPE extends TAG_TYPES>(value: TagSingleValue<HintedTagStringType<TYPE>>): TagSingleValue<string> {
  if (isMCFunctionInstance(value)) {
    return value.name
  }
  if (isTagObject(value) && isMCFunctionInstance(value.id)) {
    return {
      id: value.id.name,
      required: value.required,
    }
  }
  return value as string | TagSingleValue<string>
}

export class TagClass<TYPE extends TAG_TYPES> extends ResourceClass {
  readonly type

  readonly values: TagSingleValue<string>[]

  constructor(datapack: Datapack, type: TYPE, name: string, values: readonly TagSingleValue<HintedTagStringType<TYPE>>[] = [], replace?: boolean) {
    super(datapack, name)

    this.type = type

    this.values = values.map(objectToString)

    this.datapack = datapack

    datapack.resources.addResource('tags', {
      children: new Map(),
      isResource: true,
      path: [this.path.namespace, type, ...this.path.fullPath],
      values: this.values,
      replace,
    })
  }

  get name() {
    return `#${toMCFunctionName(this.path.fullPathWithNamespace)}`
  }

  /** Adds a new value to this tag. */
  add(value: TagSingleValue<HintedTagStringType<TYPE>>) {
    this.values.push(objectToString(value))
  }

  toString() {
    return this.name
  }
}
