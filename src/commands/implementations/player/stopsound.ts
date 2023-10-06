import { targetParser } from 'sandstone/variables/parsers.js'
import { CommandNode } from 'sandstone/core/nodes.js'

import { CommandArguments } from '../../helpers.js'

import type { MultiplePlayersArgument, SOUND_EVENTS, SOUND_SOURCES } from 'sandstone/arguments/index.js'
import type { LiteralUnion } from 'sandstone/utils.js'

export class StopSoundCommandNode extends CommandNode {
  command = 'stopsound' as const
}

export class StopSoundCommand extends CommandArguments {
  protected NodeType = StopSoundCommandNode

  /**
   * Stops a given sound.
   *
   * @param targets Specifies the command's target.
   *
   * @param source Specifies which category in the Music & Sound options the sound falls under. If it is *, stop sound of all category.
   *
   * @param sound Specifies the sound to stop.
   */
  stopsound = (targets: MultiplePlayersArgument, source?: SOUND_SOURCES | '*', sound?: LiteralUnion<SOUND_EVENTS>) => this.finalCommand([targetParser(targets), source, sound])
}
