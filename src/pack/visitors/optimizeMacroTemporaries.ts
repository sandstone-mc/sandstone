import { DataCommandNode, ExecuteCommandNode, FunctionCommandNode, type SubCommand } from 'sandstone/commands'
import type { MCFunctionNode, Node } from 'sandstone/core'
import { CommandNode, ContainerCommandNode, ContainerNode } from 'sandstone/core'
import { ResolveNBTNode } from 'sandstone/variables/ResolveNBT'
import { GenericSandstoneVisitor } from './visitor'

type StoragePoint = {
  target: string
  path: string
}

type MacroCopy = {
  destination: StoragePoint
  source: StoragePoint
}

type Producer = {
  index: number
  store: SubCommand
  destination: StoragePoint
}

const flattenArgs = (args: unknown[]): unknown[] =>
  args.flatMap((arg) => Array.isArray(arg) ? flattenArgs(arg) : [arg])

const referencesStoragePoint = (node: Node, point: StoragePoint): number => {
  let references = 0

  if (node instanceof CommandNode) {
    const args = flattenArgs(node.args)
    for (let i = 0; i < args.length - 1; i++) {
      if (args[i] === point.target && args[i + 1] === point.path) {
        references++
      }
    }
  }

  if (node instanceof ContainerNode || node instanceof ContainerCommandNode) {
    for (const child of node.body) {
      references += referencesStoragePoint(child, point)
    }
  }

  return references
}

const getMacroCopy = (node: Node, macroPoint: StoragePoint): MacroCopy | undefined => {
  if (!(node instanceof DataCommandNode)) {
    return undefined
  }

  const args = node.args
  if (
    args[0] !== 'modify'
    || args[1] !== 'storage'
    || args[2] !== macroPoint.target
    || args[4] !== 'set'
    || args[5] !== 'from'
    || args[6] !== 'storage'
    || typeof args[3] !== 'string'
    || typeof args[7] !== 'string'
    || typeof args[8] !== 'string'
  ) {
    return undefined
  }

  const parameterPrefix = macroPoint.path ? `${macroPoint.path}.` : ''
  const destinationPath = args[3]
  const localPath = destinationPath.slice(parameterPrefix.length)
  if (
    !destinationPath.startsWith(parameterPrefix)
    || (!localPath.startsWith('param_') && !localPath.startsWith('env_'))
  ) {
    return undefined
  }

  return {
    destination: { target: macroPoint.target, path: destinationPath },
    source: { target: args[7], path: args[8] },
  }
}

const isMacroReset = (node: Node, macroPoint: StoragePoint) => {
  if (!(node instanceof DataCommandNode)) {
    return false
  }

  const args = node.args
  return args[0] === 'modify'
    && args[1] === 'storage'
    && args[2] === macroPoint.target
    && args[3] === macroPoint.path
    && args[4] === 'set'
    && args[5] === 'value'
    && `${args[6]}` === '{}'
}

const getExecuteStore = (node: Node, source: StoragePoint) => {
  if (!(node instanceof ExecuteCommandNode)) {
    return undefined
  }

  const hasStoreResult = node.args.some((arg) => arg[0] === 'store')
    && node.args.some((arg) => arg[0] === 'result')
  if (!hasStoreResult) {
    return undefined
  }

  return node.args.find((arg) =>
    arg[0] === 'storage'
    && arg[1] === source.target
    && arg[2] === source.path
  )
}

/**
 * Writes one-use data temporaries directly into the compound passed to a macro
 * MCFunction, avoiding a second round of `data modify ... set from` commands.
 */
export class OptimizeMacroTemporariesVisitor extends GenericSandstoneVisitor {
  visitMCFunctionNode = (functionNode: MCFunctionNode) => {
    this.genericVisit(functionNode)

    for (let callIndex = 0; callIndex < functionNode.body.length; callIndex++) {
      const call = functionNode.body[callIndex]
      if (!(call instanceof FunctionCommandNode)) continue

      const callArgs = call.args as unknown[]
      if (
        callArgs[1] !== 'with'
        || callArgs[2] !== 'storage'
        || typeof callArgs[3] !== 'string'
        || typeof callArgs[4] !== 'string'
      ) {
        continue
      }

      const macroPoint = { target: callArgs[3], path: callArgs[4] }

      // The macro storage prep block (one `set value {}` + one `set from`
      // per arg) is now emitted as a single `ResolveNBTNode` that sits
      // immediately before the `function ... with storage` call. Read its
      // body for the reset + copies; produce search happens in the parent
      // body before the wrapper.
      const prep = callIndex > 0 ? functionNode.body[callIndex - 1] : undefined
      if (!(prep instanceof ResolveNBTNode)) continue

      const copies: MacroCopy[] = []
      let setupStart = prep._body.length
      while (setupStart > 0) {
        const copy = getMacroCopy(prep._body[setupStart - 1], macroPoint)
        if (!copy) break
        copies.unshift(copy)
        setupStart--
      }

      // When skipReset is in effect, the prep block is just the copies —
      // there's no leading `set value {}` to anchor the pattern. Skip the
      // reset check in that case.
      const resetIndex = setupStart > 0 && isMacroReset(prep._body[setupStart - 1], macroPoint)
        ? setupStart - 1
        : -1

      if (copies.length === 0) continue

      const producers: Producer[] = []
      let canOptimize = true

      for (const copy of copies) {
        const matches: { index: number; store: SubCommand }[] = []
        for (const [index, node] of functionNode.body.slice(0, callIndex - 1).entries()) {
          const store = getExecuteStore(node, copy.source)
          if (store) {
            matches.push({ index, store })
          }
        }

        if (
          matches.length !== 1
          || referencesStoragePoint(functionNode, copy.source) !== 2
        ) {
          canOptimize = false
          break
        }

        producers.push({ ...matches[0], destination: copy.destination })
      }

      if (!canOptimize) continue

      const producerIndexes = new Set(producers.map((producer) => producer.index))
      if (producerIndexes.size !== producers.length) continue

      for (const producer of producers) {
        producer.store[1] = producer.destination.target
        producer.store[2] = producer.destination.path
      }

      // Splice the reset (if any) + copies out of the prep block; if that
      // empties the block, remove it from the parent body entirely.
      const spliceStart = resetIndex === -1 ? 0 : resetIndex
      const spliceCount = resetIndex === -1 ? copies.length : copies.length + 1
      prep._body.splice(spliceStart, spliceCount)
      if (prep._body.length === 0) {
        functionNode.body.splice(callIndex - 1, 1)
        callIndex -= 1
      }
    }

    return functionNode
  }
}
