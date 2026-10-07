import path from 'path'
import type { MCFunctionNode, Node } from 'sandstone/core'
import { ContainerCommandNode } from 'sandstone/core/nodes'
import { DebugCommandNode } from 'sandstone/commands/implementations/server/debug'
import { CommandArguments } from '../../commands/helpers'
import { setParentTestMCFunction } from './_throwable'
import type { TestMCFunctionNode } from '../mcfunction'
import type { TestLogLevel } from '../test'
import { Score } from '../../variables/Score'
import { DataPointClass } from '../../variables/Data'
import { DataPointPickClass } from '../../core/Macro'

export interface LogExtra {
  name: string
  type: 'score' | 'data'
  /** Human-readable location the IDE / surfaces link back to.
   *  For scores: the objective name (e.g. `__sandstone`). For data:
   *  `<type> <target>` (e.g. `storage __sandstone:variable`). */
  source: string
  /** The player name for scores (e.g. `anon_kZZpDK67_0`), the NBT path
   *  for data (e.g. `anon_kZZpDK67_0`). Used by the CLI to match parsed 
   *  debug-trace commands against this extra. */
  target: string
}

export class TestLogCommandNode extends ContainerCommandNode {
  command = 'say'

  readonly testExclusive: boolean = true

  parentTestMCFunction?: TestMCFunctionNode

  userPayload: Record<string, unknown> = {}

  extras: LogExtra[] = []

  testID: string = ''

  childMCFunction?: MCFunctionNode

  getValue() {
    const parentSegments = this.parentTestMCFunction!.resource.path

    const traceSegments = this.childMCFunction
      ? this.childMCFunction.resource.path
      : parentSegments
    const traceFile = path.join(
      process.cwd(),
      '.sandstone',
      'output',
      'datapack',
      'data',
      traceSegments[0],
      path.sep,
      traceSegments.slice(1).join(path.sep) + '.mcfunction',
    )
    const traceLine = this.childMCFunction ? 1 : this.parentTestMCFunction!.currentIndex + 1

    const serverTrace = {
      blame: 'say',
      file: traceFile,
      line: traceLine,
      column: 0,
    }
    const stack = this.commandStackTrace?.[0]
    const buildTrace = stack
      ? { blame: 'Test#log', file: stack.file, line: stack.line, column: stack.column }
      : undefined

    this.userPayload.trace = this.testID
    this.sandstoneCore.pack.Test.registerLogTrace(
      this.testID,
      {
        server_trace: serverTrace,
        ...(buildTrace !== undefined ? { build_trace: buildTrace } : {}),
        extras: this.extras,
      },
    )
    this.userPayload.debug = this.extras.length !== 0
    this.args[0] = `%test-log%${JSON.stringify(this.userPayload)}%/test-log%`
    return super.getValue()
  }

  createMCFunction: (currentMCFunction: TestMCFunctionNode | MCFunctionNode | null) => { node: Node | Node[]; mcFunction?: MCFunctionNode } =
    (currentMCFunction) => {
      if (this.body.length === 0 || !currentMCFunction || !this.parentTestMCFunction) {
        return { node: this }
      }
      const segments = this.parentTestMCFunction.resource.path
      const namespace = segments[0]
      const helper = this.sandstonePack.MCFunction(
        `${namespace}:__tests/${segments.slice(2).join('/')}/${this.testID}`,
        {
          addToSandstoneCore: false,
          creator: 'sandstone',
          onConflict: 'rename',
        },
      )
      const helperNode = helper.node
      helperNode.body = [this, ...this.body]
      this.body = []
      this.childMCFunction = helperNode

      const debugNode = new DebugCommandNode(this.sandstonePack)
      debugNode.args = ['function', helper.name]
      return { node: debugNode, mcFunction: helperNode }
    }
}

export class TestLogCommand extends CommandArguments<typeof TestLogCommandNode> {
  protected NodeType = TestLogCommandNode

  log = (
    payload: { message: string, level: TestLogLevel },
    extras: Record<string, Score | DataPointClass | DataPointPickClass> = {},
  ) => {
    const command = this.finalCommandWithStackTrace([''])
    command.node.testID = this.sandstoneCore.pack.Test.allocateLogTraceID()
    command.node.userPayload = payload
    setParentTestMCFunction(this.sandstoneCore, command.node)

    const entries = Object.entries(extras)
    if (entries.length !== 0) {
      const { commands: { data, scoreboard } } = this.sandstonePack
      this.sandstoneCore.insideContext(command.node, () => {
        for (const [name, value] of entries) {
          if (value instanceof Score) {
            command.node.extras.push({
              name,
              type: 'score',
              source: value.objective.name,
              target: value.target.toString(),
            })
            scoreboard.players.get(value)
            continue
          }
          let dataPoint: DataPointClass
          if (value instanceof DataPointClass) {
            dataPoint = value
          } else {
            try {
              dataPoint = (value as DataPointPickClass)._toDataPoint()
            } catch {
              dataPoint = value as unknown as DataPointClass
            }
          }
          command.node.extras.push({
            name,
            type: 'data',
            source: `${dataPoint.type} ${dataPoint.currentTarget}`,
            target: dataPoint.path,
          })
          data.get(dataPoint)
        }
      }, false)
    }
    return command
  }
}