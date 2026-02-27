import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.testEnvironmentJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type TestEnvironmentClassArguments = {
  /**
   * The test environment's JSON.
   */
  json: SymbolResource[(typeof TestEnvironmentClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TestEnvironmentClass extends ResourceClass<TestEnvironmentNode> {
  static readonly resourceType = 'test_environment' as const

  public testEnvironmentJSON: NonNullable<TestEnvironmentClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TestEnvironmentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TestEnvironmentNode,
      TestEnvironmentClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TestEnvironmentClass.resourceType].path),
      args,
    )

    this.testEnvironmentJSON = args.json

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

  getValue = () => jsonStringify(this.resource.testInstanceJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type TestInstanceClassArguments = {
  /**
   * The test instance's JSON.
   */
  json: SymbolResource[(typeof TestInstanceClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TestInstanceClass extends ResourceClass<TestInstanceNode> {
  static readonly resourceType = 'test_instance' as const

  public testInstanceJSON: NonNullable<TestInstanceClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TestInstanceClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TestInstanceNode,
      TestInstanceClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TestInstanceClass.resourceType].path),
      args,
    )

    this.testInstanceJSON = args.json

    this.handleConflicts()
  }
}
