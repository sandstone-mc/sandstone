import { RESOURCE_PATHS, type NBTSerializable, type REGISTRIES, type Registry } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'
import type { ConditionClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import type { MCFunctionClass } from './mcfunction'
import type { DamageTypeClass } from './damageType'

function isMCFunctionClass(v: unknown): v is MCFunctionClass<any, any> {
  return typeof v === 'function'
}

function isResource(v: unknown): v is ResourceClass<ResourceNode> {
  return v instanceof ResourceClass
}

function isTagClass(v: unknown): v is TagClass<any> {
  return v instanceof TagClass
}

function objectToString<REGISTRY extends LiteralUnion<REGISTRIES>>(
  value: Resource<REGISTRY>,
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
    return value.toJSON()
  }
  if (isResource(value)) {
    return value.name
  }
  if (typeof value === 'object') {
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
        id: value.id.toJSON(),
        required: value.required,
      }
    }
    if (isResource(value.id)) {
      return value.id.name
    }
  }
  return value as string | TagSingleValue<string>
}

// Tag uses hardcoded types because its a simple base schema with lots of sandstone-related customization

type TagJSON<REGISTRY extends LiteralUnion<REGISTRIES>> = {
  replace: boolean
  values: TagValuesJSON<REGISTRY>
}

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

  getValue = () => jsonStringify(this.resource.tagJSON)
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

type Add<T, K> = K extends undefined ? T : (T | K)

type Resource<T extends LiteralUnion<REGISTRIES>> = Add<
  (TagSingleValue<HintedTagStringType<T>> | TagClass<T>),
  T extends 'function' ? MCFunctionClass<any, any> :
  T extends 'damage_type' ? DamageTypeClass :
  undefined
>

export class TagClass<REGISTRY extends LiteralUnion<REGISTRIES>>
  extends ResourceClass
  implements ListResource, ConditionClass, NBTSerializable {
  static readonly resourceType = 'tag' as const

  readonly type: REGISTRY

  readonly tagJSON: NonNullable<TagJSON<REGISTRY>>

  constructor(sandstoneCore: SandstoneCore, type: REGISTRY, name: string, args: TagClassArguments<REGISTRY>) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TagNode,
      TagClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, [RESOURCE_PATHS[TagClass.resourceType].path[0], type]),
      args,
    )

    this.type = type

    this.tagJSON = {
      replace: args.replace || false,
      values: [],
    }

    this.tagJSON.values = Array.from(
      args.values as Resource<REGISTRY>[],
      objectToString,
    ) as unknown as TagValuesJSON<REGISTRY>

    this.handleConflicts()
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
  has(resource: Resource<REGISTRY>) {
    this.tagJSON.values.some(
      (tagValue) =>
        (typeof tagValue !== 'string' ? (tagValue as { id: string }).id : tagValue) ===
        objectToString(resource),
    )
  }

  toString() {
    return this.name
  }

  toJSON() {
    return this.name
  }

  toNBT() {
    return this.name
  }

  /**
   * @internal
   */
  _toMinecraftCondition = () => {
    if (this.type === 'block' || this.type === 'entity_type') {
      return new this.pack.conditions.Tag(this.core, this.type as 'block' | 'entity_type', this.name)
    }
    throw new Error(`Cannot use a ${this.type} group tag as a condition. Only supports 'blocks' or 'entity_types'.`)
  }
}
