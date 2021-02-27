import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

/**
 * Starts or stops a debugging session.
 * While active, includes notifications about potential performance bottlenecks in the console.
 * When stopped, creates a profiler results file in the folder `debug`.
 */
export class Debug extends Command {
  /** Starts a new debug profiling session. */
  @command(['debug', 'start'], { isRoot: true })
  start = () => {}

  /** Stops the active debug profiling session. */
  @command(['debug', 'stop'], { isRoot: true })
  stop = () => {}

  /**
   * Used to get more detailed information while debugging performance.
   * Saves information in the `.minecraft\debug` folder in the form of a zip file.
   */
  @command(['debug', 'report'], { isRoot: true })
  report = () => {}
}
