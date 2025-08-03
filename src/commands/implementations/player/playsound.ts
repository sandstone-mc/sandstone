import type { Coordinates, MultiplePlayersArgument, SOUND_EVENTS, SOUND_SOURCES } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class PlaySoundCommandNode extends CommandNode {
  command = 'playsound' as const
}

export class PlaySoundCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = PlaySoundCommandNode

  /**
   * Play sounds for players.
   *
   * @param sound Sound event to play.
   *             Examples: 'minecraft:entity.pig.ambient', 'minecraft:block.note_block.harp'
   *
   * @param source Sound category for volume control.
   *              Examples: 'master', 'music', 'ambient', 'block', 'player'
   *
   * @param targets Player selector to play sound for.
   *               Examples: '@p', '@a', 'PlayerName'
   *
   * @param sourcePosition Optional position where sound originates from.
   *                      Defaults to target's position if not specified.
   *
   * @param volume Optional volume level (0.0+). Default is 1.0.
   * @param pitch Optional pitch (0.5-2.0). Default is 1.0.
   * @param minVolume Optional minimum volume for distant players.
   *
   * @example
   * ```ts
   * playsound('minecraft:entity.pig.ambient', 'neutral', '@a')  // Play pig sound
   * playsound('minecraft:block.note_block.harp', 'block', '@p', abs(100, 70, 200))
   * playsound('minecraft:entity.experience_orb.pickup', 'player', '@a', rel(0, 0, 0), 1.0, 2.0)
   * ```
   */
  playsound = (
    sound: Macroable<LiteralUnion<SOUND_EVENTS>, MACRO>,
    source: Macroable<SOUND_SOURCES, MACRO>,
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    sourcePosition?: Macroable<Coordinates<MACRO>, MACRO>,
    volume?: Macroable<number, MACRO>,
    pitch?: Macroable<number, MACRO>,
    minVolume?: Macroable<number, MACRO>,
  ) =>
    this.finalCommand([
      sound,
      source,
      targetParser(targets),
      coordinatesParser(sourcePosition),
      volume,
      pitch,
      minVolume,
    ])
}
