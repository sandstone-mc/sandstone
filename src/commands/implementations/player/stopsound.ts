import type { MultiplePlayersArgumentOf, Registry, SOUND_SOURCES } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class StopSoundCommandNode extends CommandNode {
  command = 'stopsound' as const
}

export class StopSoundCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = StopSoundCommandNode

  /**
   * Stop playing sounds for players.
   *
   * @param targets Player selector to stop sounds for.
   *               Examples: '@p', '@a', 'PlayerName'
   *
   * @param source Optional sound category to stop. Use '*' for all categories.
   *              Examples: 'master', 'music', 'ambient', 'block', '*'
   *
   * @param sound Optional specific sound to stop.
   *             Examples: 'minecraft:entity.pig.ambient', 'minecraft:block.note_block.harp'
   *
   * @example
   * ```ts
   * stopsound('@a')                                    // Stop all sounds for all players
   * stopsound('@p', 'music')                          // Stop music for nearest player
   * stopsound('@a', '*', 'minecraft:entity.pig.ambient') // Stop pig sounds for all
   * ```
   */
  stopsound = <T extends string>(
    targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
    source?: Macroable<SOUND_SOURCES | '*', MACRO>,
    sound?: Macroable<Registry['minecraft:sound_event'], MACRO>,
  ) => this.finalCommand([targetParser(targets), source, sound])
}
