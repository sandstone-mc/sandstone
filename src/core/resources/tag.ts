import { toMinecraftResourceName } from 'sandstone/utils'

import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type {
  HintedTagStringType, REGISTRIES, TagSingleValue, TagValuesJSON,
} from 'sandstone/arguments/index'
import type { BASIC_CONFLICT_STRATEGIES } from 'sandstone/utils'
import type { SandstoneCore } from '../sandstoneCore'
import type { MCFunctionClass } from './mcfunction'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type { ResourcePath } from '#pack'

function isMCFunctionClass(v: unknown): v is MCFunctionClass {
  return typeof v === 'function'
}

function isTagClass(v: unknown): v is TagClass<any> {
  return v instanceof TagClass
}

function isTagObject<T>(v: TagSingleValue<T>): v is Exclude<TagSingleValue<T>, T> {
  return typeof v === 'object'
}

function objectToString<REGISTRY extends REGISTRIES>(value: TagSingleValue<HintedTagStringType<REGISTRY> | TagClass<REGISTRY>>): TagSingleValue<string> {
  if (isMCFunctionClass(value) || isTagClass(value)) {
    /** @ts-ignore */
    return value.name
  }

  if (isTagObject(value) && (
    isMCFunctionClass(value.id) || isTagClass(value.id)
  )) {
    return {
      /** @ts-ignore */
      id: value.id.name,
      required: value.required,
    }
  }
  return value as string | TagSingleValue<string>
}

type TagJSON<REGISTRY extends REGISTRIES> = {
  replace: boolean
  values: TagValuesJSON<REGISTRY>
}

/**
 * A node representing a Minecraft tag.
 */
export class TagNode extends ContainerNode implements ResourceNode<TagClass<REGISTRIES>> {
  constructor(sandstoneCore: SandstoneCore, public resource: TagClass<REGISTRIES>) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.tagJSON)
}

export type TagClassArguments<REGISTRY extends REGISTRIES> = {
  /**
   * The tag's entry list.
   */
  values: TagValuesJSON<REGISTRY>

} & ResourceClassArguments & ({
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
} & REGISTRY extends 'functions' ? ({
  /**
   * Whether the tag should run on load
   */
  runOnLoad?: boolean

  /**
   * Whether the function should run each tick.
   */
  runEveryTick?: boolean
}) : unknown)

export class TagClass<REGISTRY extends REGISTRIES> extends ResourceClass {
  readonly type: REGISTRY

  readonly tagJSON: NonNullable<TagJSON<REGISTRY>>

  constructor(sandstoneCore: SandstoneCore, type: REGISTRY, path: ResourcePath, args: TagClassArguments<REGISTRY>) {
    super(sandstoneCore, TagNode, path, args)

    this.type = type

    this.tagJSON = {
      replace: false,
      values: [],
    }

    this.tagJSON.values = Array.from(args.values, objectToString) as unknown as TagValuesJSON<REGISTRY>
  }

  get name(): `#${string}` {
    return `#${toMinecraftResourceName(this.path)}`
  }

  /** Adds a new resource to the end of this tag. */
  push(resource: TagSingleValue<HintedTagStringType<REGISTRY>>) {
    this.tagJSON.values.push(objectToString(resource) as HintedTagStringType<REGISTRY>)
  }

  /** Adds a new resource to the start of this tag. */
  unshift(resource: TagSingleValue<HintedTagStringType<REGISTRY>>) {
    this.tagJSON.values.push(objectToString(resource) as HintedTagStringType<REGISTRY>)
  }

  /** Checks whether a given resource is in this tag. */
  has(resource: string | MCFunctionClass | TagClass<REGISTRY>) {
    this.tagJSON.values.some((tagValue) => (typeof tagValue !== 'string' ? (tagValue as {id: string}).id : tagValue) === objectToString(resource as HintedTagStringType<REGISTRY>))
  }

  toString() {
    return this.name
  }

  toJSON() {
    return toMinecraftResourceName(this.path)
  }
}