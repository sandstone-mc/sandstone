import { FunctionCommandNode } from 'sandstone/commands'
import type { MCFunctionNode, Node } from 'sandstone/core'
import { ContainerNode, MCFunctionClass } from 'sandstone/core'
import type { TestMCFunctionClass, TestMCFunctionNode } from 'sandstone/test/mcfunction'
import { GenericSandstoneVisitor } from './visitor'

// TODO: Add support for macros

type AnyFunctionResource = MCFunctionClass<any, any> | TestMCFunctionClass

/**
 * Initialize the objectives of the pack.
 */
export class InlineFunctionCallVisitor extends GenericSandstoneVisitor {
  deletedMCFunction: [deleted: AnyFunctionResource, _new: AnyFunctionResource] | null = null

  visitFunctionCommandNode = (node: FunctionCommandNode) => {
    if (!this.deletedMCFunction) {
      return node
    }

    const [deleted, newOne] = this.deletedMCFunction
    if (node.args[0] === deleted) {
      // Test MCFunctions can't appear in a `function …` command target,
      // so only rewrite when the replacement is an MCFunctionClass.
      if (newOne instanceof MCFunctionClass) {
        node.args[0] = newOne
      }
    }

    return node
  }

  visitMCFunctionNode = (functionNode: MCFunctionNode) => {
    this.inlineSingleCall(functionNode)
    return functionNode
  }

  /**
   * Mirror of `visitMCFunctionNode` for test mcfunctions — without this,
   * test bodies never get the single-call inlining pass and the helper
   * MCFunctions they reference survive even when they're trivially
   * collapsible.
   */
  visitTestMCFunctionNode = (functionNode: TestMCFunctionNode) => {
    this.inlineSingleCall(functionNode)
    return functionNode
  }

  /**
   * Shared body for `visitMCFunctionNode` / `visitTestMCFunctionNode`.
   * Both mcfunction kinds extend `ContainerNode` and share a `body:
   * Node[]` plus a resource with a `.creator` field, so the logic is
   * identical; the entry points only differ in return-type.
   */
  private inlineSingleCall = (functionNode: { body: Node[]; resource: AnyFunctionResource }) => {
    if (functionNode.body.length > 1) {
      return
    }

    const node = functionNode.body[0]

    if (
      node instanceof FunctionCommandNode &&
      node.args[0] instanceof MCFunctionClass &&
      node.args[0].creator === 'sandstone'
    ) {
      /*
       * The current function has the following body:
       * /function FOO
       * where `FOO` has been created by Sandstone.
       *
       * Now, we can delete the Sandstone-created function
       */
      const sandstoneCreatedFunction = node.args[0]
      this.core.resourceNodes.delete(sandstoneCreatedFunction.node)

      this.deletedMCFunction = [sandstoneCreatedFunction, functionNode.resource]

      // Copy the body of the Sandstone function to the current one
      functionNode.body = sandstoneCreatedFunction.node.body
    }

    // genericVisit needs a real ContainerNode — narrow by structural
    // check, since the entry points' union type erased it.
    if (functionNode instanceof ContainerNode) {
      this.genericVisit(functionNode)
    }

    this.deletedMCFunction = null
  }
}
