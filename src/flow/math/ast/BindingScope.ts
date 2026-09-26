import type { Float, Integer } from './handles'

/**
 * Tracks let-bindings inside a Math DSL callback.
 *
 * Mutable handles: each `define(name, handle)` links the handle back to
 * this scope so subsequent `handle.add(5).multiply(2)`-style mutations
 * propagate to the binding. The handle's `setNode()` updates its wrapped
 * expression node AND tells the scope to refresh the binding's stored
 * reference. Both moves are needed — the scope holds the canonical
 * "current value of `name`" pointer, and the handle holds the live
 * expression that operators will compose onto next.
 *
 * `define` is the only entry point that establishes the back-link.
 * Handles created without a scope (e.g. `_.float(literal)` returned but
 * not yet assigned) have `binding === null` and are silent on mutation —
 * useful for throwaway intermediates.
 *
 * The scope forms its own subtree — it does NOT participate in
 * `sandstoneCore.mathStack`. Snapshots/restore support nested scopes
 * for future control-flow blocks; for v1 the function-level scope is
 * enough.
 */
export class BindingScope {
  private bindings = new Map<string, Float | Integer>()

  /** Create or overwrite a binding. Links the handle back to this scope. */
  define(name: string, handle: Float | Integer): Float | Integer {
    handle._link(this, name)
    this.bindings.set(name, handle)
    return handle
  }

  /** Read a binding or `undefined` if not defined. */
  lookup(name: string): Float | Integer | undefined {
    return this.bindings.get(name)
  }

  /** True if `name` is currently bound. */
  has(name: string): boolean {
    return this.bindings.has(name)
  }

  /**
   * Internal — called by `handle.setNode()` after a mutation. Refreshes
   * the scope's stored pointer so subsequent `scope.lookup(name)` reads
   * return the up-to-date handle.
   */
  _update(name: string, handle: Float | Integer): void {
    this.bindings.set(name, handle)
  }

  /**
   * Drop a binding. Used at scope exit (control-flow blocks) so lets
   * declared inside a block do not leak to the surrounding scope.
   */
  undefine(name: string): void {
    this.bindings.delete(name)
  }

  /**
   * Take a snapshot of the current bindings (for nested-scope entry).
   * Callers can `restore()` to pop back. Cheap: shallow-clones the map.
   */
  snapshot(): Map<string, Float | Integer> {
    return new Map(this.bindings)
  }

  restore(snapshot: Map<string, Float | Integer>): void {
    this.bindings = new Map(snapshot)
  }

  /** All current binding names. Read-only view. */
  names(): string[] {
    return [...this.bindings.keys()]
  }

  /**
   * All currently bound handles. Read-only view. Used by the compiler
   * to discover every handle's `startNode` so derived handles
   * (e.g. `const funny = _.modulo(rx, val)`) are recognised as
   * distinct chain roots instead of being mis-classified as
   * extensions of their source handle's chain.
   */
  handles(): IterableIterator<Float | Integer> {
    return this.bindings.values()
  }
}