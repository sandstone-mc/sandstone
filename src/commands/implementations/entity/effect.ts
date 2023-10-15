import { validateIntegerRange } from 'sandstone/commands/validators'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { MOB_EFFECTS, MultipleEntitiesArgument } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'

export class EffectCommandNode extends CommandNode {
  command = 'effect' as const
}

export class EffectCommand extends CommandArguments {
  protected NodeType = EffectCommandNode

  /**
   * Gives an effect.
   *
   * @param targets Specifies the target(s).
   *
   * @param effect Specifies the effect to be added.
   *
   * @param seconds
   * Specifies the effect's duration in seconds
   * (or in gameticks for `instant_damage`, `instant_health`, and `saturation`).
   * If not specified, defaults to 30 seconds (or 1 gametick for `instant_damage`, `instant_health`, and `saturation`).
   *
   * It must be between `0` and `1_000_000` (inclusive).
   *
   * @param amplifier
   * Specifies the number of additional levels to add to the effect.
   * If not specified, defaults to `0`.
   *
   * Note that the first tier of a status effect (e.g. Regeneration I) is `0`, so the second tier,
   * for example Regeneration II, would be specified by an amplifier level of `1`.
   *
   * @param hideParticles
   * Specifies whether the particles and the HUD indicator‌ of the status effect should be hidden.
   * If not specified, defaults to `false`.
   */
  give = (
    targets: MultipleEntitiesArgument,
    effect: LiteralUnion<MOB_EFFECTS>,
    seconds?: number | 'infinite',
    amplifier?: number,
    hideParticles?: boolean,
  ) => {
    if (seconds && seconds !== 'infinite') validateIntegerRange(seconds, 'seconds', 0, 1_000_000)
    return this.finalCommand(['give', targetParser(targets), effect, seconds, amplifier, hideParticles])
  }

  /**
   * Removes an effect.
   *
   * @param targets Specifies the target(s). If unspecified, defaults to `@s`.
   *
   * @param effect Specifies the effect to be removed. If unspecified, clears all effects.
   */
  clear = (targets?: MultipleEntitiesArgument, effect?: LiteralUnion<MOB_EFFECTS>) => this.finalCommand(['clear', targetParser(targets), effect])
}
