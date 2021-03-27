import { SelectorArgument } from 'src/arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { MultipleEntitiesArgument } from 'src/arguments'

function checkTagName(tag: string) {
  if (!tag.match(/[A-Za-z0-9\-_+.]/g)) {
    throw new Error(`Invalid tag name "${tag}": Valid characters are uppercase and lowercase letters, numbers, hyphen, underscore, plus sign and period.`)
  }
}

export class TagArguments extends Command {
  /**
   * Adds a tag to the targets.
   *
   * @param name Specifies the name of the tag to be added into the targets.
   * Valid characters are uppercase and lowercase letters, numbers, hyphen, underscore, plus sign and period.
   */
  @command('add')
  add = (name: string) => {
    checkTagName(name)
  }

  /**
   * Lists all tags on the targets.
   */
  @command('list')
  list = () => {}

  /**
   * Removes a tag from the targets.
   *
   * @param name Specifies the name of the tag to be removed from the targets.
   * Valid characters are uppercase and lowercase letters, numbers, hyphen, underscore, plus sign and period.
   */
  @command('remove')
  remove = (name: string) => {
    checkTagName(name)
  }
}

export class TagCommand extends Command {
  /**
   * Controls scoreboard tags on individual entities.
   *
   * In Java Edition, the number of tags owned by an entity cannot exceed 1024.
   *
   * @param targets Specifies the command's target.
   */
  @command('tag', { isRoot: true, executable: false, hasSubcommands: true })
  tag = (targets: MultipleEntitiesArgument) => new TagArguments(this.commandsRoot)
}
