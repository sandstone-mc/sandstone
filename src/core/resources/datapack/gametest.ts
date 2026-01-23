import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.testEnvironmentJSON)
}

export type TestEnvironmentClassArguments = {
  /**
   * The test environment's JSON.
   */
  testEnvironment: SymbolResource['test_environment']
} & ResourceClassArguments<'default'>

export class TestEnvironmentClass extends ResourceClass<TestEnvironmentNode> {
  public testEnvironmentJSON: NonNullable<TestEnvironmentClassArguments['testEnvironment']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TestEnvironmentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TestEnvironmentNode,
      sandstoneCore.pack.resourceToPath(name, ['test_environment']),
      args,
    )

    this.testEnvironmentJSON = args.testEnvironment

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

  getValue = () => JSON.stringify(this.resource.testInstanceJSON)
}

export type TestInstanceClassArguments = {
  /**
   * The test instance's JSON.
   */
  testInstance: SymbolResource['test_instance']
} & ResourceClassArguments<'default'>

export class TestInstanceClass extends ResourceClass<TestInstanceNode> {
  public testInstanceJSON: NonNullable<TestInstanceClassArguments['testInstance']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TestInstanceClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TestInstanceNode,
      sandstoneCore.pack.resourceToPath(name, ['test_instance']),
      args,
    )

    this.testInstanceJSON = args.testInstance

    this.handleConflicts()
  }
}
