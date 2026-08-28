import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

// ============================================================================
// Enchantment
// ============================================================================

/**
 * A node representing a Minecraft enchantment.
 */
export class EnchantmentNode extends ContainerNode implements ResourceNode<EnchantmentClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: EnchantmentClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type EnchantmentClassArguments = {
  /**
   * The enchantment's JSON.
   */
  json: JsonSymbolResource[(typeof EnchantmentClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class EnchantmentClass extends ResourceClass<EnchantmentNode> implements JsonResource {
  static readonly resourceType = 'enchantment' as const

  public json: NonNullable<EnchantmentClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: EnchantmentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      EnchantmentNode,
      EnchantmentClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[EnchantmentClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}

// ============================================================================
// Enchantment Provider
// ============================================================================

/**
 * A node representing a Minecraft enchantment provider.
 */
export class EnchantmentProviderNode extends ContainerNode implements ResourceNode<EnchantmentProviderClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: EnchantmentProviderClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type EnchantmentProviderClassArguments = {
  /**
   * The enchantment provider's JSON.
   */
  json: JsonSymbolResource[(typeof EnchantmentProviderClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class EnchantmentProviderClass extends ResourceClass<EnchantmentProviderNode> implements JsonResource {
  static readonly resourceType = 'enchantment_provider' as const

  public json: NonNullable<EnchantmentProviderClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: EnchantmentProviderClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      EnchantmentProviderNode,
      EnchantmentProviderClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[EnchantmentProviderClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
