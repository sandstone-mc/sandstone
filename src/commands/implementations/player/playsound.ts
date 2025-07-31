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
   * Plays a specified sound at a player, in a location, and in a specific volume and pitch.
   *
   * @param sound Specifies the sound to play.
   *
   * A sound event may be affiliated with multiple sounds, and the sound that is actually produced is chosen at random from them,
   * modified by their "weight", just as the game normally would.
   * For example, the `entity.pig.ambient` sound event plays one of several pig sounds at random,
   * because the event has multiple sounds associated with it.
   *
   * Resource packs may add their own events to `sounds.json`; the command successfully plays these.
   * File names are not used by this command; it strictly uses the events defined in `sounds.json`
   * (which may not even be similar to the original file names and paths),
   * and thus a resource pack adding new sound files must define events for them
   * (this is not necessary when replacing old sounds already defined in events).
   *
   * @param source Specifies the music category and options the sound falls under.
   *
   * @param targets Specifies the sound's target.
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
