import type { SandstoneCore } from 'sandstone/core'
import { ResourceNodesMap } from 'sandstone/core/resources'
import { SandstoneTestCommands } from './commands'
import { TestMCFunctionClass, TestMCFunctionClassArguments, TestMCFunctionNode } from './mcfunction'
import { add } from 'sandstone/utils'
import { getSandstoneContext, hasContext } from '../context'

const conflictDefaults = (resourceType: string) => {
  if (!hasContext()) return undefined
  const strategies = getSandstoneContext().conflictStrategies
  return (strategies?.[resourceType] || strategies?.default) as string | undefined
}

/**
 * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
 */
export class SandstoneTest {
  readonly tests: ResourceNodesMap<TestMCFunctionNode>

  readonly commands: SandstoneTestCommands

  constructor(public core: SandstoneCore) {
    this.tests = new ResourceNodesMap()
    this.commands = new SandstoneTestCommands(this.core.pack)
  }

  create(name: string, callback: () => void, options?: Omit<Partial<TestMCFunctionClassArguments>, 'callback'>) {
    const test = new TestMCFunctionClass(
      this.core,
      name,
      {
        callback,
        creator: 'user',
        addToSandstoneCore: true,
        onConflict: conflictDefaults('test_function') as TestMCFunctionClassArguments['onConflict'],
        ...add(options ?? {}),
      },
    )
    this.tests.add(test.node)

    return test
  }
}