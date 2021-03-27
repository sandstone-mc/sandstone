import { MultipleEntitiesArgument } from 'src/arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { MultiplePlayersArgument } from 'src/arguments'
import type { AdvancementInstance } from '@resources'

class AdvancementArguments extends Command {
  /** Adds or removes all loaded advancements. */
  @command('everything', { isRoot: false, executable: true })
  everything = () => { }

  /**
   * Adds or removes a single advancement or criterion.
   *
   * @param advancement Specifies a valid namespaced id of the advancement to target.
   *
   * @param criterion Specifies a valid criterion of the advancement to manipulate.
   * The command defaults to the entire advancement.
   * If specified, the command refers to merely the criterion and not the entire advancement.
   */
  @command('only', { isRoot: false, executable: true })
  only = (advancement: string | AdvancementInstance, criterion?: string) => { }

  /**
   * Adds or removes an advancement and all its children advancements.
   * Think of specifying everything from that advancement to the end.
   *
   * The exact order the operation is carried out in is:
   *
   *     specified advancement > child > child's child > ...
   *
   * When it operates on a child that branches, it iterates through all its children before continuing.
   *
   * @param advancement Specifies a valid namespaced id of the advancement to target.
   */
  @command('from', { isRoot: false, executable: true })
  from = (advancement: string | AdvancementInstance) => { }

  /**
   * Specifies an advancement, and adds or removes all its parent advancements, and all its children advancements.
   * Think of specifying everything through the specified advancement, going both backwards and forwards.
   *
   * The exact order the operation is as if the command were executed with "until" specified, then with "from" specified:
   *
   *     parent > parent's parent > ... > root > specified advancement > child > child's child > ...
   *
   * @param advancement Specifies a valid namespaced id of the advancement to target.
   */
  @command('through', { isRoot: false, executable: true })
  through = (advancement: string | AdvancementInstance) => { }

  /**
   * Adds or removes an advancement and all its parent advancements until the root for addition/removal.
   * Think of specifying everything from the start until that advancement.
   *
   * The exact order the operation is carried out in is:
   *
   *     parent > parent's parent > ... > root > specified advancement.
   *
   * @param advancement Specifies a valid namespaced id of the advancement to target.
   */
  @command('until', { isRoot: false, executable: true })
  until = (advancement: string | AdvancementInstance) => { }
}

/** Gives or takes an advancement from one or more players. */
export class AdvancementCommand extends Command {
  /**
   * Adds specified advancements.
   *
   * @param targets Specifies one player or more.
   */
  @command(['advancement', 'grant'], { isRoot: true, hasSubcommands: true, executable: false })
  grant = (targets: MultiplePlayersArgument) => new AdvancementArguments(this.commandsRoot)

  /**
   * Removes specified advancements.
   *
   * @param targets Specifies one player or more.
   */
  @command(['advancement', 'revoke'], { isRoot: true, hasSubcommands: true, executable: false })
  revoke = (targets: MultiplePlayersArgument) => new AdvancementArguments(this.commandsRoot)
}
