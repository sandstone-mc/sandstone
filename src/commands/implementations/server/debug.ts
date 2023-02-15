import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../../helpers'

export class DebugCommandNode extends CommandNode {
  command = 'debug' as const
}

/**
 * Starts or stops a debugging session.
 * While active, includes notifications about potential performance bottlenecks in the console.
 * When stopped, creates a profiler results file in the folder `debug`.
 */
export class DebugCommand extends CommandArguments {
  protected NodeType = DebugCommandNode

  /** Starts a new debug profiling session. */
  start = () => this.finalCommand(['start'])

  /** Stops the active debug profiling session. */
  stop = () => this.finalCommand(['stop'])

  /**
   * Used to get more detailed information while debugging performance.
   * Saves information in the `.minecraft\debug` folder in the form of a zip file.
   */
  report = () => this.finalCommand(['report'])
}
