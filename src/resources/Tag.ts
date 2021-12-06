import { CONFLICT_STRATEGIES } from '@/env'
import { toMCFunctionName } from '@datapack/minecraft'

import { ResourceInstance } from './Resource'

import type { BASIC_CONFLICT_STRATEGIES } from '@/generalTypes'
import type {
  HintedTagStringType, TAG_TYPES,
  TagJSON, TagSingleValue,
} from '@arguments'
import type { Datapack } from '@datapack'
import type { MCFunctionInstance } from '@datapack/Datapack'
import type { ResourceConflictStrategy } from '@datapack/resourcesTree'

function isMCFunctionInstance(v: unknown): v is MCFunctionInstance {
  return typeof v === 'function'
}

function isTagInstance(v: unknown): v is TagInstance<any> {
  return v instanceof TagInstance
}

function isTagObject<T>(v: TagSingleValue<T>): v is Exclude<TagSingleValue<T>, T> {
  return typeof v === 'object'
}

function objectToString<TYPE extends TAG_TYPES>(value: TagSingleValue<HintedTagStringType<TYPE> | TagInstance<TYPE>>): TagSingleValue<string> {
  if (isMCFunctionInstance(value) || isTagInstance(value)) {
    return value.name
  }

  if (isTagObject(value) && (
    isMCFunctionInstance(value.id) || isTagInstance(value.id)
  )) {
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
   * - `append`: Append the new Tag values to the old one.
   * - `prepend`: Prepend the new Tag values to the old one.
   */
  onConflict?: BASIC_CONFLICT_STRATEGIES | 'append' | 'prepend'

  /**
   * Whether to replace previous Tags with the same name.
   */
  replace?: boolean
}

export class TagInstance<TYPE extends TAG_TYPES> extends ResourceInstance {
  readonly type: TYPE

  readonly values: TagSingleValue<string | TagInstance<TYPE>>[]

  constructor(datapack: Datapack, type: TYPE, name: string, values: TagJSON<TYPE> = [], options?: TagOptions) {
    super(datapack, name)

    this.type = type

    this.values = values.map(objectToString)

    this.datapack = datapack

    const conflictStrategyName = options?.onConflict ?? CONFLICT_STRATEGIES.TAG
    let conflictStrategy: ResourceConflictStrategy<'tags'>

    if (conflictStrategyName === 'append') {
      conflictStrategy = (old, new_) => {
        old.values = [...old.values, ...new_.values]
        return old
      }
    } else if (conflictStrategyName === 'prepend') {
      conflictStrategy = (old, new_) => {
        old.values = [...new_.values, ...old.values]
        return old
      }
    } else {
      conflictStrategy = conflictStrategyName
    }

    datapack.resources.addResource('tags', {
      children: new Map(),
      isResource: true,
      path: [this.path.namespace, type, ...this.path.fullPath],
      values: this.values,
      replace: options?.replace,
    }, conflictStrategy)
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

  toJSON() {
    return toMCFunctionName(this.path.fullPathWithNamespace)
  }
}
