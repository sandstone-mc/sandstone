import * as util from 'util'

import type { Coordinates, Registry, TimeArgument } from 'sandstone/arguments'
import { timeArgumentToTicks } from 'sandstone/arguments'
import type { CommandStackFrame, StructureClass, TestEnvironmentClass } from 'sandstone/core'
import { _RawMCFunctionClass, CallableResourceClass, ContainerCommandNode, ContainerNode, MCFunctionNode, Node, ResourceNode, type MCFunctionClassArguments, type SandstoneCore, captureCommandStackTrace } from 'sandstone/core'
import { formatDebugString, makeClassCallable, MakeInstanceCallable, objectEntries } from 'sandstone/utils'
import type { FinalCommandOutput } from 'sandstone/commands'
import { coordinatesParser } from 'sandstone/variables/parsers'

export class TestMCFunctionNode extends ContainerNode implements ResourceNode {
  contextStack: (ContainerNode | ContainerCommandNode)[]

  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TestMCFunctionClass,
  ) {
    super(sandstoneCore)
    this.contextStack = [this]
  }

  /**
   * Sandstone-created child MCFunctions extracted from this MCFunction's
   * body by `ContainerCommandsToMCFunctionVisitor`. Populated lazily as
   * the visitor walks the tree and extracts execute bodies whose contents
   * exceed the 1-child constraint. Lets visitors iterate transient
   * helpers in O(n) over the children of a single MCFunction instead of
   * O(n²) over `core.resourceNodes`.
   * 
   * @internal
   */
  transientChildMCFunctions: Set<TestMCFunctionNode | MCFunctionNode> = new Set()

  /**
   * The currently active context.
   *
   * For example, the current context is the function body if the function is not in a loop.
   * If the function is in a loop, the current context is the loop body.
   * 
   * @internal
   */
  get currentContext() {
    return this.contextStack[this.contextStack.length - 1]
  }

  /**
   * Sequentially add node(s) to the end of the body of the function.
   *
   * @param node The node(s) to add.
   * 
   * @internal
   */
  appendNode = (node: Node | Node[]) => {
    if (Array.isArray(node)) {
      for (const _node of node) {
        this.currentContext.append(_node)
      }
    } else {
      this.currentContext.append(node)
    }
  }

  /**
   * Sequentially add node(s) to the beginning of the body of the function.
   *
   * @param node The node(s) to add.
   * 
   * @internal
   */
  prependNode = (node: Node | Node[]) => {
    if (Array.isArray(node)) {
      for (const _node of node) {
        this.currentContext.prepend(_node)
      }
    } else {
      this.currentContext.prepend(node)
    }
  }

  /**
   * Switch the current context to the given node.
   * Also adds the node to the body of the current context, except if addNode is False.
   *
   * @param node The node to switch to.
   * @param addNode Whether to add the node to the body of the current context.
   * 
   * @internal
   */
  enterContext = (node: ContainerNode | ContainerCommandNode, addNode: boolean = true) => {
    if (addNode) {
      this.currentContext.append(node)
    }

    this.contextStack.push(node)
  }

  /**
   * Switch the current context to the given node, run the given function, and switch back to the original context.
   * Also adds the node to the body of the current context, except if addNode is False.
   *
   * @param node The node to switch to.
   * @param callback The function to run.
   * @param addNode Whether to add the node to the body of the current context.
   *
   * @return The previously active context.
   * @throws Error if there is no previous context.
   * 
   * @internal
   */
  insideContext = (node: ContainerNode | ContainerCommandNode, callback: () => void, addNode: boolean = true) => {
    this.enterContext(node, addNode)
    callback()
    return this.exitContext()
  }

  /**
   * Enters `node`'s context, runs `callback`, then pops the entire stack
   * back to the pre-enter depth (not just one level).
   *
   * Use this when the callback may contain awaits — `_.await.until(...)`
   * inside the callback calls `enterContext(this=UntilClass)` and never
   * pops itself, so a single `exitContext()` here would leave the await's
   * `UntilClass` (or the wrapper `ExecuteCommandNode` it was nested
   * inside) on the stack, causing subsequent commands to commit to the
   * wrong body.
   *
   * Mirrors the `while (length > preDepth) exit()` pattern that
   * `FlowClauseNode.append` and the various flow-node constructors
   * already use for the same reason (see CLAUDE.md "MCFunction Context
   * System"). Prefer calling this over open-coding the while-loop.
   * 
   * @internal
   */
  balanceContext = (node: ContainerNode | ContainerCommandNode, callback: () => void, addNode: boolean = true) => {
    const beforeIn = this.contextStack.length
    this.enterContext(node, addNode)
    callback()
    this.popToDepth(beforeIn)
    return this.contextStack[this.contextStack.length - 1]
  }

  /**
   * Pop the context stack until its length equals `depth`. No-op if the
   * stack is already at or below `depth`. Used by `balanceContext` and by
   * split enter/exit patterns (e.g. `FlowClauseNode.append`) where the
   * "exit" happens in a different method than the "enter".
   * 
   * @internal
   */
  popToDepth = (depth: number) => {
    while (this.contextStack.length > depth) {
      this.exitContext()
    }
  }

  /**
   * Leave the current context, and return to the previous one.
   *
   * @return The previously active context.
   * @throws Error if there is no previous context.
   * 
   * @internal
   */
  exitContext = () => {
    if (this.contextStack.length === 0) {
      throw new Error('No previous context to return to.')
    }

    if (this.contextStack.length === 1) {
      throw new Error(
        'It is forbidden for a MCFunction to exit its latest context, since the MCFunction itself must be in the context stack.',
      )
    }

    return this.contextStack.pop()
  }

  /**
   * Output line cursor — the line number (1-based, after the comment
   * header) that the next serialized command will land on. Bumped after
   * each non-null `getValue()` result by the number of newlines it
   * contained, plus one for the terminating `\n` we append in this
   * method's `body` accumulator.
   *
   * Renamed from `currentOutputLine` so `ThrowableCommandNode.getValue`
   * can use a single name (`currentIndex`) for both the throwable key
   * and the position it lands at.
   *
   * Reset on each `getValue` pass.
   */
  currentIndex: number = 0

  throwableStack: Map<string, { trace: CommandStackFrame, command: string, line: number}> = new Map()

  getValue = () => {
    this.sandstoneCore.currentNode = this.resource.name
    const header = this.resource.buildHeader()
    const headerLength = header === '' ? 0 : ((header.match(/\n/g)?.length ?? 0) + 1)
    this.currentIndex = headerLength
    let body = headerLength === 0 ? '' : `${header}\n`
    for (const node of this.body) {
      const value = node.getValue()
      if (value === null) continue
      body += `${value}\n`
      this.currentIndex = this.currentIndex + (value.match(/\n/g)?.length ?? 0) + 1
    }
    return body.slice(0, -1)
  }

  [util.inspect.custom](_depth: number, options: any) {
    return formatDebugString(
      this.constructor.name,
      {
        name: this.resource.name,
      },
      this.body,
      options.indent,
    )
  }
}

export interface TestDirectives {
  environment?: TestEnvironmentClass | Registry['minecraft:test_environment']

  /**
   * Defaults to `100` ticks.
   */
  timeout?: TimeArgument

  /**
   * Defaults to an empty 1x1x1 structure.
   */
  structure?: StructureClass | Registry['minecraft:structure']

  /**
   * Whether the test is allowed to fail. Defaults to `false`.
   */
  optional?: boolean

  /**
   * Whether the test needs sky access. When `false` (the default), PackTest
   * places barrier blocks above the test bounds.
   */
  skyAccess?: boolean

  /**
   * Whether and where to spawn the a dummy player at the start of the test, with `@s` set to the dummy.
   * 
   * If set to `true` will spawn the dummy at `~0.5 ~ ~0.5`
   */
  dummyPlayer?: Coordinates | boolean
}

export interface TestMCFunctionClassArguments extends Omit<MCFunctionClassArguments, 'asyncContext' | 'tags' | 'runOnLoad' | 'lazy' | 'runEvery' | 'runEveryTick'> {
  /**
   * Description of the test, used by PackTest for logging & command response.
   */
  description?: string,

  /**
   * @see https://github.com/misode/packtest#directives
   */
  directives?: TestDirectives,

  callback?: () => void,
}

export class _RawTestMCFunctionClass extends CallableResourceClass<TestMCFunctionNode> {
  static readonly resourceType = 'test_function'

  /* @internal */
  public callback: NonNullable<TestMCFunctionClassArguments['callback']>

  readonly description: string | undefined

  /**
   * File where `Test.create(...)` was invoked. Captured at construction
   * via a stack trace so the CLI's `sand test` can render an accurate
   * "Ran M tests across N files" count — every test belongs to one
   * source file, regardless of whether it registered any throwables.
   */
  readonly sourceFile: string | undefined

  readonly directives: TestDirectives | undefined

  /* @internal */
  nested = 0

  constructor(core: SandstoneCore, name: string, args: TestMCFunctionClassArguments) {
    if (name.startsWith('./')) {
      // We have a relative name.
      const currentMCFunction = core.currentMCFunction
      if (!currentMCFunction) {
        throw new Error('Cannot use relative paths outside of an existing TestMCFunction.')
      }
      if (currentMCFunction instanceof _RawMCFunctionClass) {
        throw new Error('Cannot create a TestMCFunction relative to a normal MCFunction.')
      }

      name = `${currentMCFunction.resource.name}/${name.slice(2)}`
    }

    super(
      core,
      { packType: core.pack.dataPack(), extension: 'mcfunction' },
      TestMCFunctionNode,
      _RawTestMCFunctionClass.resourceType,
      core.pack.resourceToPath(name, ['test']),
      args,
    )

    this.callback = args.callback ?? (() => {})
    this.description = args.description
    this.sourceFile = captureCommandStackTrace()[0]?.file
    this.directives = args.directives

    if (this.nested !== 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.nested; i++) {
        this.node.exitContext()
      }
    }

    this.addToSandstoneCore = !!args.addToSandstoneCore

    // Gate: when the build wasn't invoked with `--test`, skip
    // registration with `core.resourceNodes`. The callback never runs,
    // no file is written, and incremental builds correctly prune any
    // previously-generated `data/<ns>/test/*.mcfunction`.
    if (!core.testsEnabled) {
      this.addToSandstoneCore = false
    }

    this.handleConflicts()
  }

  private generated = false

  /** @internal */
  generate = () => {
    if (this.generated) {
      return
    }
    this.generated = true

    this.push(this.callback.bind(this))
  }

  /**
   * @internal
   */
  buildHeader = (): string => {
    const lines: string[] = []

    if (this.description !== undefined) {
      lines.push(`#> ${this.description}`)
    }

    if (this.directives) {
      const keyMap: Partial<Record<keyof TestDirectives, string | undefined>> = {
        structure: 'template',
        skyAccess: 'skyaccess',
        dummyPlayer: 'dummy'
      }

      for (const { key, value } of objectEntries(this.directives)) {
        if (typeof value === 'undefined') continue
        if (key === 'dummyPlayer' && value === false) continue
        let serialized: string

        switch (key) {
          case 'timeout': {
            serialized = `${timeArgumentToTicks(value)}`
          } break
          case 'dummyPlayer': {
            serialized = value === true ? '~0.5 ~ ~0.5' : `${coordinatesParser(value)}`
          } break
          default: {
            serialized = `${value}`
          } break
        }

        lines.push(`# @${keyMap[key] ?? key} ${serialized}`)
      }
    }

    return lines.join('\n')
  }

  __call__ = (): FinalCommandOutput => {
    return this.commands.test.run(this.name)
  }

  push(...contents: _RawTestMCFunctionClass[] | [() => any]) {
    this.generate()

    if (contents[0] instanceof _RawTestMCFunctionClass) {
      for (const mcfunction of contents as _RawTestMCFunctionClass[]) {
        mcfunction.generate()

        this.node.body.push(...mcfunction.node.body)
      }
    } else {
      this.core.enterMCFunction(this)
      this.core.insideContext(this.node, contents[0], false)
      this.core.exitMCFunction()
    }
  }

  unshift(...contents: _RawTestMCFunctionClass[] | [() => any]) {
    this.generate()

    const fake = new TestMCFunctionClass(this.core, 'fake', {
      addToSandstoneCore: false,
      creator: 'sandstone',
      onConflict: 'ignore',
    })

    if (contents[0] instanceof _RawTestMCFunctionClass) {
      for (const mcfunction of contents as _RawTestMCFunctionClass[]) {
        mcfunction.generate()

        this.node.body.unshift(...mcfunction.node.body)
      }
    } else {
      this.core.enterMCFunction(fake)
      this.core.insideContext(fake.node, contents[0], false)
      this.core.exitMCFunction()
      fake.generate()
      this.node.body.unshift(...fake.node.body)
    }
  }

  splice(start: number, removeItems: number | 'auto', ...contents: _RawTestMCFunctionClass[] | [() => void]) {
    const fake = new TestMCFunctionClass(this.core, 'fake', {
      addToSandstoneCore: false,
      creator: 'sandstone',
      onConflict: 'ignore',
    })

    const fullBody: Node[] = []

    if (contents[0] instanceof _RawTestMCFunctionClass) {
      for (const mcfunction of contents as _RawTestMCFunctionClass[]) {
        mcfunction.generate()

        fullBody.push(...mcfunction.node.body)
      }
    } else {
      this.core.enterMCFunction(fake)
      this.core.insideContext(fake.node, contents[0], false)
      this.core.exitMCFunction()
      fake.generate()
      fullBody.push(...fake.node.body)
    }

    this.node.body.splice(start, removeItems === 'auto' ? fullBody.length : removeItems, ...fullBody)
  }
}

export const TestMCFunctionClass = makeClassCallable(_RawTestMCFunctionClass)
export type TestMCFunctionClass = MakeInstanceCallable<_RawTestMCFunctionClass>

