import { CONFLICT_STRATEGIES } from '@/env'
import { toMCFunctionName } from '@datapack/minecraft'

import { ResourceInstance } from './Resource'

import type {
  HintedTagStringType, TAG_TYPES,
  TagJSON, TagSingleValue,
} from 'src/arguments'
import type { BASIC_CONFLICT_STRATEGIES } from '@/generalTypes'
import type { Datapack } from '@datapack'
import type { MCFunctionInstance } from '@datapack/Datapack'

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

export type TagOptions = {
  /**
   * What to do if another Tag has the same name.
   *
   * - `throw`: Throw an error.
   * - `replace`: Replace silently the old Tag with the new one.
   * - `ignore`: Keep silently the old Tag, discarding the new one.
   */
  onConflict?: BASIC_CONFLICT_STRATEGIES
}

export class TagInstance<TYPE extends TAG_TYPES> extends ResourceInstance {
  readonly type

  readonly values: TagSingleValue<string>[]

  constructor(datapack: Datapack, type: TYPE, name: string, values: TagJSON<TYPE> = [], replace?: boolean, options?: TagOptions) {
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
    }, options?.onConflict ?? CONFLICT_STRATEGIES.TAG)
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
