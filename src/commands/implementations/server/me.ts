import type { MultipleEntitiesArgument } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class MeCommandNode extends CommandNode<[string[]]> {
  command = 'me' as const

  getValue() {
    return this.args[0].join(' ')
  }
}

export class MeCommand extends CommandArguments {
  protected NodeType = MeCommandNode

  /**
   * Displays a message about yourself.
   *
   * @param actions Specifies the messages to display. They will be joined with a whitespace.
   *
   * Each action can be a message or a selector.
   * The game replaces entity selectors in the message with the list of selected entities' names,
   * which is formatted as "name1 and name2" for two entities, or "name1, name2, ... and namen" for n entities.
   */
  me = (...actions: (string | MultipleEntitiesArgument<false>)[]) => this.finalCommand([actions.map(targetParser)])
}
