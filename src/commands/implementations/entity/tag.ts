import { targetParser } from 'sandstone/variables/parsers'
import { CommandNode } from 'sandstone/core'

import { CommandArguments } from '../../helpers.js'

import type { MultipleEntitiesArgument } from 'sandstone/arguments'

function checkTagName(tag: string) {
  if (!tag.match(/[A-Za-z0-9\-_+.]/g)) {
    throw new Error(`Invalid tag name "${tag}": Valid characters are uppercase and lowercase letters, numbers, hyphen, underscore, plus sign and period.`)
  }

  return tag
}

export class TagCommandNode extends CommandNode {
  command = 'tag' as const
}

export class TagArgumentsCommand extends CommandArguments {
  /**
   * Adds a tag to the targets.
   *
   * @param name Specifies the name of the tag to be added into the targets.
   * Valid characters are uppercase and lowercase letters, numbers, hyphen, underscore, plus sign and period.
   */
  add = (name: string) => this.finalCommand(['add', checkTagName(name)])

  /**
   * Lists all tags on the targets.
   */
  list = () => this.finalCommand(['list'])

  /**
   * Removes a tag from the targets.
   *
   * @param name Specifies the name of the tag to be removed from the targets.
   * Valid characters are uppercase and lowercase letters, numbers, hyphen, underscore, plus sign and period.
   */
  remove = (name: string) => this.finalCommand(['remove', checkTagName(name)])
}

export class TagCommand extends CommandArguments {
  protected NodeType = TagCommandNode

  /**
   * Controls scoreboard tags on individual entities.
   *
   * In Java Edition, the number of tags owned by an entity cannot exceed 1024.
   *
   * @param targets Specifies the command's target.
   */
  tag = (targets: MultipleEntitiesArgument) => this.subCommand([targetParser(targets)], TagArgumentsCommand, false)
}
