import type { HintedTagStringType, REGISTRIES, TagSingleValue, TagValuesJSON } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'
import { toMinecraftResourceName } from 'sandstone/utils'
import type { ConditionClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes.js'
import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource.js'
import { ResourceClass } from '../resource.js'
import type { MCFunctionClass } from './mcfunction.js'

function isMCFunctionClass(v: unknown): v is MCFunctionClass<undefined, undefined> {
  return typeof v === 'function'
}

function isTagClass(v: unknown): v is TagClass<any> {
  return v instanceof TagClass
}

function isTagObject<T>(v: TagSingleValue<T>): v is Exclude<TagSingleValue<T>, T> {
  return typeof v === 'object'
}

function objectToString<REGISTRY extends LiteralUnion<REGISTRIES>>(
  value: TagSingleValue<HintedTagStringType<REGISTRY> | TagClass<REGISTRY>>,
): TagSingleValue<string> {
  if (isMCFunctionClass(value)) {
    if ((value.node.resource as MCFunctionClass<[], []>).env) {
      return value.node.sandstoneCore.pack.MCFunction(`${value.name}/_env`, () => value(), {
        creator: 'sandstone',
        onConflict: 'rename',
      }).name
    }
    return value.name
  }
  if (isTagClass(value)) {
    return value.name
  }
  if (isTagObject(value)) {
    if (isMCFunctionClass(value.id)) {
      if ((value.id.node.resource as MCFunctionClass<[], []>).env) {
        return {
          id: value.id.node.sandstoneCore.pack.MCFunction(
            `${value.id.name}/_env`,
            () => (value.id as MCFunctionClass<[], []>)(),
            { creator: 'sandstone', onConflict: 'rename' },
          ).name,
          required: value.required,
        }
      }
      return {
        id: value.id.name,
        required: value.required,
      }
    }
    if (isTagClass(value.id)) {
      return {
        id: value.id.name,
        required: value.required,
      }
    }
  }
  return value as string | TagSingleValue<string>
}

type TagJSON<REGISTRY extends LiteralUnion<REGISTRIES>> = {
  replace: boolean
  values: TagValuesJSON<REGISTRY>
}

/**
 * A node representing a Minecraft tag.
 */
export class TagNode extends ContainerNode implements ResourceNode<TagClass<LiteralUnion<REGISTRIES>>> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TagClass<LiteralUnion<REGISTRIES>>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.tagJSON)
}

export type TagClassArguments<REGISTRY extends LiteralUnion<REGISTRIES>> = {
  /**
   * The tag's entry list.
   */
  values?: TagValuesJSON<REGISTRY>

  /**
   * Whether to replace existing Tags with the same name.
   */
  replace?: boolean
} & ResourceClassArguments<'list'> &
  (REGISTRY extends 'functions'
    ? {
        /**
         * Whether the tag should run on load
         */
        runOnLoad?: boolean

        /**
         * Whether the function should run each tick.
         */
        runEveryTick?: boolean
      }
    : unknown)

type Resource<T extends LiteralUnion<REGISTRIES>> = TagSingleValue<HintedTagStringType<T>> | TagClass<T>

export class TagClass<REGISTRY extends LiteralUnion<REGISTRIES>>
  extends ResourceClass
  implements ListResource, ConditionClass
{
  readonly type: REGISTRY

  readonly tagJSON: NonNullable<TagJSON<REGISTRY>>

  constructor(sandstoneCore: SandstoneCore, type: REGISTRY, name: string, args: TagClassArguments<REGISTRY>) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TagNode,
      sandstoneCore.pack.resourceToPath(name, ['tags', type]),
      args,
    )

    this.type = type

    this.tagJSON = {
      replace: args.replace || false,
      values: [],
    }

    this.tagJSON.values = Array.from(
      args.values as TagValuesJSON<REGISTRY>,
      objectToString,
    ) as unknown as TagValuesJSON<REGISTRY>

    this.handleConflicts()
  }

  get name(): `#${string}` {
    return `#${toMinecraftResourceName(this.path, 2)}`
  }

  public push(...resources: Resource<REGISTRY>[]) {
    for (const resource of resources) {
      this.tagJSON.values.push(objectToString(resource) as HintedTagStringType<REGISTRY>)
    }
  }

  public unshift(..._resources: Resource<REGISTRY>[]) {
    // Done this way so the resources you're adding to the beginning of the tag stay in order.
    const resources: (string | TagSingleValue<string>)[] = []
    for (const resource of _resources) {
      resources.push(objectToString(resource))
    }
    this.tagJSON.values.push(...(resources as HintedTagStringType<REGISTRY>[]))
  }

  /** Checks whether a given resource is in this tag. */
  has(resource: string | MCFunctionClass<undefined, undefined> | TagClass<REGISTRY>) {
    this.tagJSON.values.some(
      (tagValue) =>
        (typeof tagValue !== 'string' ? (tagValue as { id: string }).id : tagValue) ===
        objectToString(resource as HintedTagStringType<REGISTRY>),
    )
  }

  toString() {
    return this.name
  }

  toJSON() {
    return toMinecraftResourceName(this.path)
  }

  /**
   * @internal
   */
  _toMinecraftCondition = () => {
    if (this.type === 'blocks' || this.type === 'entity_types') {
      return new this.pack.conditions.Tag(this.core, this.type as 'blocks' | 'entity_types', this.name)
    }
    throw new Error(`Cannot use a ${this.type} group tag as a condition. Only supports 'blocks' or 'entity_types'.`)
  }
}
