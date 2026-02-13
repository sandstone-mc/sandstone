import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers'

export class PerfCommandNode extends CommandNode {
  command = 'perf' as const
}

export class PerfCommand extends CommandArguments {
  protected NodeType = PerfCommandNode

  /**
   * Start a 10 second performance profiling session.
   *
   * @example
   * ```ts
   * perf.start()    // Begin profiling
   * ```
   */
  start = () => this.finalCommand(['start'])

  /**
   * Stop performance profiling session before 10 seconds have passed.
   *
   * @example
   * ```ts
   * perf.stop()     // End profiling and save results
   * ```
   */
  stop = () => this.finalCommand(['stop'])
}

export class JFRCommandNode extends CommandNode {
  command = 'jfr' as const
}

export class JFRCommand extends CommandArguments {
  protected NodeType = JFRCommandNode

  /**
   * Start a Java Flight Recorder performance profiling session.
   *
   * @example
   * ```ts
   * jfr.start()    // Begin profiling
   * ```
   */
  start = () => this.finalCommand(['start'])

  /**
   * Stop a Java Flight Recorder performance profiling session.
   *
   * @example
   * ```ts
   * jfr.stop()     // End profiling and save results
   * ```
   */
  stop = () => this.finalCommand(['stop'])
}
