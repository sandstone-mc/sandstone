import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

// ============================================================================
// Test Environment
// ============================================================================

/**
 * A node representing a Minecraft test environment.
 */
export class TestEnvironmentNode extends ContainerNode implements ResourceNode<TestEnvironmentClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TestEnvironmentClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type TestEnvironmentClassArguments = {
  /**
   * The test environment's JSON.
   */
  json: JsonSymbolResource[(typeof TestEnvironmentClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TestEnvironmentClass extends ResourceClass<TestEnvironmentNode> implements JsonResource {
  static readonly resourceType = 'test_environment' as const

  public json: NonNullable<TestEnvironmentClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TestEnvironmentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TestEnvironmentNode,
      TestEnvironmentClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TestEnvironmentClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}

// ============================================================================
// Test Instance
// ============================================================================

/**
 * A node representing a Minecraft test instance.
 */
export class TestInstanceNode extends ContainerNode implements ResourceNode<TestInstanceClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TestInstanceClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type TestInstanceClassArguments = {
  /**
   * The test instance's JSON.
   */
  json: JsonSymbolResource[(typeof TestInstanceClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TestInstanceClass extends ResourceClass<TestInstanceNode> implements JsonResource {
  static readonly resourceType = 'test_instance' as const

  public json: NonNullable<TestInstanceClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TestInstanceClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TestInstanceNode,
      TestInstanceClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TestInstanceClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
