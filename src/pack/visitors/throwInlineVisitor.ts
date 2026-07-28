import {
  DataCommandNode,
  ReturnCommandNode,
  ScoreboardCommandNode,
  TellRawCommandNode,
} from 'sandstone/commands'
import { parseJSONText } from 'sandstone/variables'
import { ContainerCommandNode, ContainerNode, MCFunctionNode, Node } from 'sandstone/core'
import { ThrowNode } from 'sandstone/flow'
import type { DataPointClass, JSONTextComponentClass } from 'sandstone/variables'
import { GenericSandstoneVisitor } from './visitor'

/**
 * First pass of throw handling — materialises every `ThrowNode` in place with
 * the real throw commands:
 *
 *   1. `tellraw <broadcast> <error>`          (skipped if broadcast === false)
 *   2. `data modify storage ... set value <error-json>` (skipped if dataPoint === false)
 *   3. `scoreboard players set #throw_<id> __sandstone 1`
 *   4. `return 1`
 *
 * Runs BEFORE `ContainerCommandsToMCFunctionVisitor`. After this visitor, the
 * multi-command execute that wrapped the ThrowNode becomes a multi-command
 * body, and container extraction hoists it into a throw MCFunction named
 * `parent/<callbackName>` (e.g. `display_message/loop/if` for a throw inside
 * a `_.if` inside a loop). The throw function returns 1 so its direct caller
 * can use `if function X run return fail` (Pattern A). The score flag is the
 * side-channel signal used by transitive callers (Pattern B) so they don't
 * have to rely on the intermediate function's return value.
 */
export class ThrowInlineVisitor extends GenericSandstoneVisitor {
  /** Resource names of MCFunctions that contain an inlined throw. */
  throwFunctions = new Set<string>()

  /** Sanitised score holder name for each ThrowNode (without `#` prefix). */
  throwScoreName = new WeakMap<ThrowNode, string>()

  /** Unique id counter for the `#throw_*` score holder names. */
  private throwIdCounter = 0

  visitMCFunctionNode = (node: MCFunctionNode) => {
    this.materializeThrowsIn(node)
    return this.genericVisit(node)
  }

  private materializeThrowsIn(node: MCFunctionNode): void {
    const stack: (ContainerNode | ContainerCommandNode)[] = [node]
    let foundThrow = false

    while (stack.length) {
      const current = stack.pop()!

      for (let i = 0; i < current.body.length; i++) {
        const child = current.body[i]

        if (child instanceof ThrowNode) {
          const replacement = this.materializeThrow(child)
          current.body.splice(i, 1, ...replacement)
          i += replacement.length - 1
          foundThrow = true
          continue
        }

        if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
          stack.push(child)
        }
      }
    }

    if (foundThrow) {
      this.throwFunctions.add(node.resource.name)
    }
  }

  private materializeThrow(throwNode: ThrowNode): Node[] {
    const out: Node[] = []

    if (throwNode.broadcast !== false) {
      out.push(this.makeTellRaw(throwNode))
    }

    if (throwNode.dataPoint !== false) {
      out.push(this.makeDataSet(throwNode))
    }

    const scoreName = this.allocateScoreName()
    this.throwScoreName.set(throwNode, scoreName)
    out.push(this.makeThrowFlag(scoreName))
    out.push(this.makeReturn(1))

    return out
  }

  private makeTellRaw(throwNode: ThrowNode): TellRawCommandNode {
    const targets = (throwNode.broadcast ?? '@a') as any
    const message = parseJSONText(this.core, throwNode.fullError)!
    const node = new TellRawCommandNode(this.pack, targets, message)
    node.commited = false
    return node
  }

  private makeDataSet(throwNode: ThrowNode): DataCommandNode {
    const point = throwNode.dataPoint as DataPointClass | JSONTextComponentClass
    const target = (point as DataPointClass).currentTarget as string
    const path = (point as DataPointClass).path as string

    const serializable = parseJSONText(this.core, throwNode.fullError)! as JSONTextComponentClass
    const nbtString = serializable.toString()

    const node = new DataCommandNode(this.pack, 'modify', 'storage', target, path, 'set', 'value', nbtString)
    node.commited = false
    return node
  }

  private makeThrowFlag(scoreHolderName: string): ScoreboardCommandNode {
    const node = new ScoreboardCommandNode(this.pack, 'players', 'set', `#${scoreHolderName}`, '__sandstone', 1)
    node.commited = false
    return node
  }

  private makeReturn(value: number | 'fail'): ReturnCommandNode {
    const node = new ReturnCommandNode(this.pack)
    node.args = [value as any]
    node.commited = false
    return node
  }

  private allocateScoreName(): string {
    return `throw_${this.throwIdCounter++}`
  }
}