import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Debug extends Command {
  @command(['debug', 'start'], { isRoot: true })
  start = () => {}

  @command(['debug', 'stop'], { isRoot: true })
  stop = () => {}

  @command(['debug', 'report'], { isRoot: true })
  report = () => {}
}
