import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers'

export class DebugCommandNode extends CommandNode {
  command = 'debug' as const
}

export class DebugCommand extends CommandArguments {
  protected NodeType = DebugCommandNode

  /**
   * Start debug profiling session.
   *
   * @example
   * ```ts
   * debug.start()    // Begin profiling
   * ```
   */
  start = () => this.finalCommand(['start'])

  /**
   * Stop debug profiling session.
   *
   * @example
   * ```ts
   * debug.stop()     // End profiling and save results
   * ```
   */
  stop = () => this.finalCommand(['stop'])

  /**
   * Generate detailed debug report.
   *
   * @example
   * ```ts
   * debug.report()   // Create performance report
   * ```
   */
  report = () => this.finalCommand(['report'])
}
