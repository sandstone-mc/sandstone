import type { JSONTextComponent, MultiplePlayersArgument, MultiplePlayersArgumentOf } from 'sandstone/arguments'
import type { SandstoneCore } from 'sandstone/core'
import { Node } from 'sandstone/core'
import type { DataPointClass, JSONTextComponentClass } from 'sandstone/variables'

/**
 * Marker node emitted by `Flow#throw()`.
 *
 * Holds all the data needed by `ThrowTransformationVisitor` to materialize the
 * actual tellraw / data modify / return 1 commands — and to wire propagation up
 * through enclosing executes.
 *
 * Never serialized directly: `getValue()` returns `null`, so the node is filtered
 * out of the output. The visitor removes it from the AST and inserts the real
 * commands in its place.
 */
export class ThrowNode extends Node {
  constructor(
    sandstoneCore: SandstoneCore,
    /** The fully-built error component (including the yellow header + function/node footer). */
    public fullError: JSONTextComponent,
    /** Selector to broadcast to (`@a` default), or `false` to skip the broadcast entirely. */
    public broadcast: MultiplePlayersArgumentOf<false, any> | false | undefined,
    /**
     * Storage target. `undefined` → allocate a fresh anonymous `DataVariable`.
     * `false` → don't store at all (return value is the `JSONTextComponentClass`).
     * `DataPointClass` → set this point with the serialized error.
     */
    public dataPoint: DataPointClass | JSONTextComponentClass | false | undefined,
  ) {
    super(sandstoneCore)

    // Push into the current context so the visitor can find it later.
    const mcfunction = this.sandstoneCore.getCurrentMCFunctionOrThrow()
    mcfunction.appendNode(this)
  }

  getValue(): null {
    return null
  }
}