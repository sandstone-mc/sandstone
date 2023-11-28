import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { MultiplePlayersArgument, SOUND_EVENTS, SOUND_SOURCES } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'
import type { Macroable } from 'sandstone/core'

export class StopSoundCommandNode extends CommandNode {
  command = 'stopsound' as const
}

export class StopSoundCommand<MACRO extends boolean> extends CommandArguments {
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
  stopsound = (
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    source?: Macroable<SOUND_SOURCES | '*', MACRO>,
    sound?: Macroable<LiteralUnion<SOUND_EVENTS>, MACRO>,
  ) => this.finalCommand([targetParser(targets), source, sound])
}
