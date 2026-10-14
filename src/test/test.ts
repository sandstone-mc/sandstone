import type { SandstoneCore } from 'sandstone/core'
import { ResourceNodesMap } from 'sandstone/core/resources'
import { LogExtra, SandstoneTestCommands, TestLogCommand } from './commands'
import { TestMCFunctionClass, TestMCFunctionClassArguments, TestMCFunctionNode } from './mcfunction'
import { add } from 'sandstone/utils'
import { getSandstoneContext, hasContext } from '../context'
import { Score } from '../variables/Score'
import { DataPointClass } from '../variables/Data'
import { DataPointPickClass } from '../core/Macro'

const conflictDefaults = (resourceType: string) => {
  if (!hasContext()) return undefined
  const strategies = getSandstoneContext().conflictStrategies
  return (strategies?.[resourceType] || strategies?.default) as string | undefined
}

export type TestLogLevel = 'info' | 'warning' | 'error' | 'debug'

export interface TestLogTrace {
  blame?: string
  file?: string
  line?: number
  column?: number
  name?: string
}

/**
 * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
 */
export class SandstoneTest {
  readonly tests: ResourceNodesMap<TestMCFunctionNode>

  readonly commands: SandstoneTestCommands

  private logTraceCounter = 0

  readonly logTraces = new Map<string, { server_trace: TestLogTrace; build_trace?: TestLogTrace; extras?: LogExtra[] }>()

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

    // Override Minecraft's vanilla `minecraft:always_pass` test instance
    // (which always passes and does nothing useful) with a sandstone variant
    // pointing at a non-existent structure. The missing structure makes
    // the game skip the test entirely instead of reporting a vacuous pass.
    if (this.tests.size === 1 && this.core.testsEnabled) {
      this.core.pack.TestInstance('minecraft:always_pass', {
        type: 'function',
        environment: 'default',
        function: 'always_pass',
        max_ticks: 1,
        required: false,
        setup_ticks: 1,
        structure: 'sandstone:disabled_this_useless_test_on_purpose',
      }, {
        creator: 'sandstone'
      })
    }

    return test
  }

  allocateLogTraceID(): string {
    return String(this.logTraceCounter++)
  }

  registerLogTrace(id: string, trace: { server_trace: TestLogTrace; build_trace?: TestLogTrace; extras?: LogExtra[] }): void {
    this.logTraces.set(id, trace)
  }

  log(message: string, level: TestLogLevel = 'info', extras: Record<string, Score | DataPointClass | DataPointPickClass> = {}) {
    return new TestLogCommand(this.core.pack).log({ message, level }, extras)
  }
}