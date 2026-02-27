import { DataCommandNode, FunctionCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import type { Node } from 'sandstone/core'
import { DataPointPickClass, MCFunctionClass } from 'sandstone/core'
import {
  conditionToNode,
  ConditionCaseNode,
  DefaultCaseNode,
  ElseNode,
  IfNode,
  StaticCaseNode,
  SwitchNode,
} from 'sandstone/flow'
import { DataPointClass, NBT, Score } from 'sandstone/variables'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Transforms SwitchNode AST into MCFunctions.
 *
 * **Score-based static switches:**
 * - Case functions are named by their value: `case_0`, `case_5`, `case_100`
 * - Score is converted to NBT and used directly as macro: `function case_$(value)`
 * - Uses `execute store success` to detect if the function exists
 * - Falls through to condition cases / default if no match
 *
 * **Data-based static switches (NBT objects):**
 * - Uses O(1) NBT storage lookup to map values to sequential indices
 * - Case functions are named by index: `case_0`, `case_1`, `case_2`
 * - Falls through to condition cases / default if no match
 *
 * **Condition-based cases:**
 * - Transformed into if/else chains
 * - Checked sequentially after static cases fail
 *
 * This visitor runs before OrTransformationVisitor and IfElseTransformationVisitor
 * since it creates IfNodes that need to be processed by those visitors.
 */
export class SwitchTransformationVisitor extends GenericSandstoneVisitor {
  visitSwitchNode = (node: SwitchNode): Node | Node[] => {
    const { value, staticCases, conditionCases, defaultCase, parentMCFunction } = node
    const { Data, initMCFunction, Macro, commands } = this.pack
    const { functionCmd } = commands

    const parentName = parentMCFunction?.resource.name ?? '__sandstone:switch'

    const hasStaticCases = staticCases.length > 0

    // Create the switch MCFunction (onConflict: 'rename' handles multiple switches)
    const switchMCFunction = new MCFunctionClass(
      this.core,
      `${parentName}/switch`,
      {
        addToSandstoneCore: true,
        creator: 'sandstone',
        onConflict: 'rename',
      },
      hasStaticCases ? [value] : undefined,
    )

    // Storage key uses resolved name (after rename if needed)
    const storageKey = `__sandstone:${switchMCFunction.name.replace(/[:/]/g, '_')}`
    const values = Data('storage', storageKey, 'Values')

    if (hasStaticCases) {
      const isScoreSwitch = value instanceof Score

      // Register the value as env_0 macro variable (mimics __call__ behavior)
      if (typeof (value as any).local?.set === 'function') {
        (value as any).local.set(switchMCFunction.name, 'env_0')
      }

      this.core.enterMCFunction(switchMCFunction)

      if (isScoreSwitch) {
        // Score-based switch: use score value directly as function name suffix
        // Create case functions named by their value: case_0, case_5, case_100, etc.
        for (const caseNode of staticCases) {
          const caseMCFunction = new MCFunctionClass(
            this.core,
            `${switchMCFunction.name}/case_${caseNode.value}`,
            {
              addToSandstoneCore: true,
              creator: 'sandstone',
              onConflict: 'rename',
            },
          )

          // Transfer body from StaticCaseNode and visit each node
          caseMCFunction.node.body = caseNode.body.flatMap((n) => this.visit(n))
        }

        const hasFallback = conditionCases.length > 0 || defaultCase !== undefined

        if (hasFallback) {
          // Create a child function that attempts the macro call
          // This isolates the macro so if it fails, the parent can continue
          const tryCaseMCFunction = new MCFunctionClass(
            this.core,
            `${switchMCFunction.name}/try_case`,
            {
              addToSandstoneCore: true,
              creator: 'sandstone',
              onConflict: 'rename',
            },
          )

          // Child function body: $return run function .../case_$(env_0)
          this.core.enterMCFunction(tryCaseMCFunction)
          Macro.returnCmd.run.functionCmd(Macro`${switchMCFunction.name}/case_${value}`)
          this.core.exitMCFunction()

          // Store success and result of the macro call
          const successScore = this.pack.rootObjective('$switch_success')
          const resultScore = this.pack.rootObjective('$switch_result')

          // execute store success score $success store result score $result run function .../try_case with storage ...
          commands.execute
            .store.success(successScore)
            .store.result(resultScore)
            .run.functionCmd(tryCaseMCFunction.name, 'with', switchMCFunction.macroPoint!)

          // If success == 1, return the result and exit
          commands.execute
            .if.score(successScore, 'matches', 1)
            .run.returnCmd.run.scoreboard.players.get(resultScore)

          // Fallback code runs if we didn't return
          this.buildFallback(undefined, value, conditionCases, defaultCase, switchMCFunction)
        } else {
          // No fallback - create a child function for the macro call
          // (macros can't use values set in the same function)
          const dispatchMCFunction = new MCFunctionClass(
            this.core,
            `${switchMCFunction.name}/dispatch`,
            {
              addToSandstoneCore: true,
              creator: 'sandstone',
              onConflict: 'rename',
            },
          )

          // Child function body: $return run function .../case_$(env_0)
          this.core.enterMCFunction(dispatchMCFunction)
          Macro.returnCmd.run.functionCmd(Macro`${switchMCFunction.name}/case_${value}`)
          this.core.exitMCFunction()

          // Call dispatch with macro storage, propagating return value
          commands.returnCmd.run.functionCmd(dispatchMCFunction.name, 'with', switchMCFunction.macroPoint!)
        }

        // Copy the score to macro storage inside the switch function
        // This is needed because child functions use macros but switchMCFunction is called without `with storage`
        const macroPoint = switchMCFunction.macroPoint!
        const env0Point = macroPoint.select('env_0')

        // execute store result storage <target> <path>.env_0 int 1 run scoreboard players get <score>
        commands.execute
          .store.result.storage(env0Point.currentTarget, env0Point.path, 'int')
          .run.scoreboard.players.get(value as Score)

        // Move the copy command to the front of the body
        const copyNode = switchMCFunction.node.body.pop()!
        switchMCFunction.node.body.unshift(copyNode)

        // Check if we can inline (switch is last node in parent)
        const canInline = parentMCFunction && node === parentMCFunction.body.at(-1)

        if (canInline) {
          this.core.exitMCFunction()

          // Remove the switchMCFunction from resources since we're inlining
          this.core.resourceNodes.delete(switchMCFunction.node)

          // Return the switch body directly
          return switchMCFunction.node.body
        }
      } else {
        // Data-based switch: use NBT storage lookup with index mapping
        const index = switchMCFunction.macroPoint!.select('Index')
        index.local.set(switchMCFunction.name, 'Index')

        // Remove any existing index value
        index.remove()

        // Look up the index from storage based on value
        Macro.data.modify
          .storage(index.currentTarget, index.path)
          .set.from.storage(values.currentTarget, Macro`Values[{Value:${value}}].Index`)

        // Create case_N MCFunctions for each static case (indexed)
        const caseData: { Value: unknown; Index: unknown }[] = []

        for (let i = 0; i < staticCases.length; i++) {
          const caseNode = staticCases[i]
          const caseMCFunction = new MCFunctionClass(
            this.core,
            `${switchMCFunction.name}/case_${i}`,
            {
              addToSandstoneCore: true,
              creator: 'sandstone',
              onConflict: 'rename',
            },
          )

          // Transfer body from StaticCaseNode and visit each node
          caseMCFunction.node.body = caseNode.body.flatMap((n) => this.visit(n))

          caseData.push({
            Value: caseNode.value,
            Index: NBT.int(i),
          })
        }

        // Add NBT storage initialization to initMCFunction
        initMCFunction.push(() => values.set(caseData as any))

        // Create the inner dispatch MCFunction that uses macro to call the correct case
        const innerMCFunction = new MCFunctionClass(
          this.core,
          `${switchMCFunction.name}/inner`,
          {
            addToSandstoneCore: true,
            creator: 'sandstone',
            onConflict: 'rename',
          },
        )

        // Inner function body: return run function with macro-based name
        this.core.enterMCFunction(innerMCFunction)
        Macro.returnCmd.run.functionCmd(Macro`${switchMCFunction.name}/case_${index}`)
        this.core.exitMCFunction()

        const hasFallback = conditionCases.length > 0 || defaultCase !== undefined

        if (hasFallback) {
          // Create if/else chain: if static lookup succeeds, call inner; else try conditions/default
          const ifNode = new IfNode(
            this.core,
            index._toMinecraftCondition(),
            undefined,
            switchMCFunction.node,
          )

          // Generate the if body
          // Pass false to enterContext to not auto-add ifNode to body - we push it manually below
          switchMCFunction.node.enterContext(ifNode, false)
          functionCmd(innerMCFunction.name, 'with', switchMCFunction.macroPoint!)
          switchMCFunction.node.exitContext()

          // Add ifNode to body BEFORE buildFallback so that ElseNode (auto-added by its
          // constructor via enterContext) comes after IfNode in the correct order
          switchMCFunction.node.body.push(ifNode)

          // Build fallback chain: condition cases -> default
          this.buildFallback(ifNode, value, conditionCases, defaultCase, switchMCFunction)
        } else {
          // No fallback - just use inline execute with return run
          this.pack.commands.execute.if.data
            .storage(index.currentTarget, index.path)
            .run.returnCmd.run.functionCmd(innerMCFunction.name, 'with', switchMCFunction.macroPoint!)
        }
      }

      this.core.exitMCFunction()
    } else {
      // No static cases - just condition chain
      this.core.enterMCFunction(switchMCFunction)
      this.buildFallback(undefined, value, conditionCases, defaultCase, switchMCFunction)
      this.core.exitMCFunction()

      // Check if we can inline (switch is last node in parent, similar to IfElseTransformationVisitor step 3)
      const canInline = parentMCFunction && node === parentMCFunction.body.at(-1)

      if (canInline) {
        // Inline: return the switch function's body directly instead of a function call
        // Remove the switchMCFunction from the core since we're inlining
        this.core.resourceNodes.delete(switchMCFunction.node)

        // Update the IfNode's parentMCFunction to point to the actual parent
        // so that IfElseTransformationVisitor can correctly determine if it's at the tail
        for (const bodyNode of switchMCFunction.node.body) {
          if (bodyNode instanceof IfNode) {
            bodyNode.parentMCFunction = parentMCFunction

            // Find the last IfNode in the chain and add it to the body
            // This is needed because IfElseTransformationVisitor checks:
            //   nodes.at(-1) === parentMCFunction.body.at(-1)
            // where nodes is the flattened chain. By adding the last node to the body,
            // we ensure this check passes for inlined condition-based switches.
            let lastIfNode: IfNode = bodyNode
            while (lastIfNode.nextFlowNode instanceof IfNode) {
              lastIfNode.nextFlowNode.parentMCFunction = parentMCFunction
              lastIfNode = lastIfNode.nextFlowNode
            }
            if (lastIfNode !== bodyNode) {
              switchMCFunction.node.body.push(lastIfNode)
            }
          }
        }

        return switchMCFunction.node.body
      }
    }

    // Return a function call node to the switch function
    // This replaces the SwitchNode in the parent MCFunction's body
    // Use `return run function` only when there's no tail (switch is last node)
    const isLastNode = parentMCFunction && node === parentMCFunction.body.at(-1)

    if (hasStaticCases && !(value instanceof Score)) {
      // Data-based switches need macro storage for the lookup
      // First, copy the value to env_0 in macro storage
      const macroPoint = switchMCFunction.macroPoint!

      // Resolve DataPointPickClass to DataPointClass if needed
      const resolvedValue: DataPointClass = value instanceof DataPointPickClass
        ? value._toDataPoint()
        : value

      // Use macroPoint.select('env_0') to get the correct full path
      const env0Point = macroPoint.select('env_0')
      const copyNode = new DataCommandNode(this.pack)
      copyNode.args = [
        'modify', 'storage', env0Point.currentTarget, env0Point.path,
        'set', 'from', resolvedValue.type, resolvedValue.currentTarget, resolvedValue.path,
      ]

      const funcNode = new FunctionCommandNode(this.pack, switchMCFunction.name)
      funcNode.args.push('with', macroPoint.type, macroPoint.currentTarget, macroPoint.path)

      if (isLastNode) {
        const callNode = new ReturnRunCommandNode(this.pack, ['run'])
        callNode.body = [funcNode]
        return [copyNode, callNode].flatMap((n) => this.visit(n))
      }
      return [copyNode, funcNode].flatMap((n) => this.visit(n))
    }

    // Score-based switches handle the copy internally, no `with storage` needed
    const funcNode = new FunctionCommandNode(this.pack, switchMCFunction.name)
    if (isLastNode) {
      const callNode = new ReturnRunCommandNode(this.pack, ['run'])
      callNode.body = [funcNode]
      return this.visit(callNode)
    }
    return this.visit(funcNode)
  }

  private buildFallback(
    _if: IfNode | undefined,
    value: any,
    conditionCases: ConditionCaseNode[],
    defaultCase: DefaultCaseNode | undefined,
    switchMCFunction: MCFunctionClass<any, any>,
    targetBody?: Node[],
  ): void {
    if (conditionCases.length === 0 && !defaultCase) return

    // Default to switchMCFunction.node.body if no target specified
    const body = targetBody ?? switchMCFunction.node.body

    if (conditionCases.length > 0) {
      const firstCondition = conditionCases[0].condition(value)
      const firstConditionNode = conditionToNode(firstCondition)

      let currentIfNode: IfNode

      if (_if === undefined) {
        // No static case lookup, start fresh if chain
        currentIfNode = new IfNode(
          this.core,
          firstConditionNode,
          undefined,
          switchMCFunction.node,
        )

        // Transfer body from case node
        currentIfNode.body = conditionCases[0].body.flatMap((n: Node) => this.visit(n))

        // Add the root IfNode to the target body
        body.push(currentIfNode)
      } else {
        // Chain as elseIf
        currentIfNode = new IfNode(
          this.core,
          firstConditionNode,
          undefined,
          switchMCFunction.node,
        )
        currentIfNode._isElseIf = true
        _if.nextFlowNode = currentIfNode

        // Transfer body from case node
        currentIfNode.body = conditionCases[0].body.flatMap((n: Node) => this.visit(n))
      }

      // Process remaining condition cases
      for (let i = 1; i < conditionCases.length; i++) {
        const condition = conditionCases[i].condition(value)
        const conditionNode = conditionToNode(condition)

        const nextIfNode = new IfNode(
          this.core,
          conditionNode,
          undefined,
          switchMCFunction.node,
        )
        nextIfNode._isElseIf = true
        currentIfNode.nextFlowNode = nextIfNode

        // Transfer body from case node
        nextIfNode.body = conditionCases[i].body.flatMap((n: Node) => this.visit(n))

        currentIfNode = nextIfNode
      }

      // Add default case as else
      if (defaultCase) {
        const elseNode = new ElseNode(this.core, () => {})
        elseNode._body = defaultCase.body.flatMap((n: Node) => this.visit(n))
        currentIfNode.nextFlowNode = elseNode
      }
    } else if (defaultCase) {
      // Only default case, no conditions
      if (_if === undefined) {
        // Just execute the default body directly, adding to target body
        const visitedNodes = defaultCase.body.flatMap((n: Node) => this.visit(n))
        body.push(...visitedNodes)
      } else {
        // Add as else to the static lookup if
        const elseNode = new ElseNode(this.core, () => {})
        elseNode._body = defaultCase.body.flatMap((n: Node) => this.visit(n))
        _if.nextFlowNode = elseNode
      }
    }
  }

  // Also handle the case nodes when encountered during generic visit
  visitStaticCaseNode = (_node: StaticCaseNode): Node | Node[] => {
    // Static case nodes are handled by visitSwitchNode, should not appear standalone
    return []
  }

  visitConditionCaseNode = (_node: ConditionCaseNode): Node | Node[] => {
    // Condition case nodes are handled by visitSwitchNode, should not appear standalone
    return []
  }

  visitDefaultCaseNode = (_node: DefaultCaseNode): Node | Node[] => {
    // Default case nodes are handled by visitSwitchNode, should not appear standalone
    return []
  }
}
