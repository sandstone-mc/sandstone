import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.enchantmentJSON)
}

export type EnchantmentClassArguments = {
  /**
   * The enchantment's JSON.
   */
  enchantment: SymbolResource['enchantment']
} & ResourceClassArguments<'default'>

export class EnchantmentClass extends ResourceClass<EnchantmentNode> {
  public enchantmentJSON: NonNullable<EnchantmentClassArguments['enchantment']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: EnchantmentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      EnchantmentNode,
      sandstoneCore.pack.resourceToPath(name, ['enchantment']),
      args,
    )

    this.enchantmentJSON = args.enchantment

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

  getValue = () => jsonStringify(this.resource.enchantmentProviderJSON)
}

export type EnchantmentProviderClassArguments = {
  /**
   * The enchantment provider's JSON.
   */
  enchantmentProvider: SymbolResource['enchantment_provider']
} & ResourceClassArguments<'default'>

export class EnchantmentProviderClass extends ResourceClass<EnchantmentProviderNode> {
  public enchantmentProviderJSON: NonNullable<EnchantmentProviderClassArguments['enchantmentProvider']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: EnchantmentProviderClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      EnchantmentProviderNode,
      sandstoneCore.pack.resourceToPath(name, ['enchantment_provider']),
      args,
    )

    this.enchantmentProviderJSON = args.enchantmentProvider

    this.handleConflicts()
  }
}
