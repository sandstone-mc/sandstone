import type { BASIC_CONFLICT_STRATEGIES, LiteralUnion } from './utils'

/**
 * Configuration context passed to SandstonePack.
 * This replaces the old process.env-based configuration.
 */
export interface SandstoneContext {
  /**
   * The working directory for the project (where sandstone.config.ts lives).
   * Used for resolving cache paths and resources.
   */
  workingDir: string

  /**
   * The default namespace for the pack.
   */
  namespace: string

  /**
   * A unique identifier for the pack, used in scoreboard names etc.
   */
  packUid: string

  /**
   * Pack format configurations for datapack and resourcepack.
   */
  packOptions: {
    datapack?: {
      packFormat: number
      description: any
      features?: string[]
      filter?: { namespace?: string; path?: string }[]
      supported_formats?: number | number[] | { min_inclusive: number; max_inclusive: number }
    }
    resourcepack?: {
      packFormat: number
      description: any
      filter?: { namespace?: string; path?: string }[]
      supported_formats?: number | number[] | { min_inclusive: number; max_inclusive: number }
    }
  }

  /**
   * Conflict resolution strategies per resource type.
   */
  conflictStrategies?: Record<string, LiteralUnion<BASIC_CONFLICT_STRATEGIES>>

  /**
   * Version number to set in load.status scoreboard.
   */
  loadVersion?: number
}

/**
 * Global context instance. Set by CLI before importing user code.
 */
let _context: SandstoneContext | undefined

/**
 * Set the global Sandstone context. Called by CLI before build.
 */
export function setSandstoneContext(ctx: SandstoneContext): void {
  _context = ctx
}

/**
 * Get the current Sandstone context.
 * Throws if context hasn't been set.
 */
export function getSandstoneContext(): SandstoneContext {
  if (!_context) {
    throw new Error(
      'Sandstone context not initialized. Make sure you are running through the Sandstone CLI (sand build/watch).',
    )
  }
  return _context
}

/**
 * Check if context has been set.
 */
export function hasContext(): boolean {
  return _context !== undefined
}

/**
 * Reset the context (useful for testing or rebuilds).
 */
export function resetContext(): void {
  _context = undefined
}
