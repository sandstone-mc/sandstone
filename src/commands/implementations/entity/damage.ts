import { validateIntegerRange } from 'sandstone/commands/validators'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { Coordinates, DAMAGE_TYPES, SingleEntityArgument } from 'sandstone/arguments'
import type { DamageTypeClass } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { Macroable } from 'sandstone/core'

export class DamageCommandNode extends CommandNode {
  command = 'damage' as const
}

class DamageCauseCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * @param cause Cause of the damage, in the case of indirect damage.
   */
  from = (cause: Macroable<SingleEntityArgument<MACRO>, MACRO>) => this.finalCommand(['from', targetParser(cause)])
}

export class DamageSourceCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * @param entity Entity inflicting the damage.
   */
  by = (entity: Macroable<SingleEntityArgument<MACRO>, MACRO>) => this.subCommand(['by', targetParser(entity)], DamageCauseCommand)

  /**
   * Where the damage originated at (when no entity caused the damage).
   */
  at = (position: Macroable<Coordinates<MACRO>, MACRO>) => this.finalCommand(['at', coordinatesParser(position)])
}

export class DamageCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = DamageCommandNode

  /**
   * Deals damage.
   *
   * @param target Specifies the target.
   *
   * @param amount Specifies the amount of damage to be dealt.
   *
   * @param damageType This determines how the damage affects the entity as well as which death message is displayed
   */
  damage = (
    target: Macroable<SingleEntityArgument<MACRO>, MACRO>,
    amount: Macroable<number, MACRO>,
    damageType?: Macroable<LiteralUnion<DAMAGE_TYPES> | DamageTypeClass, MACRO>,
  ) => {
    validateIntegerRange(amount, 'amount', 0, 1_000_000)
    return this.subCommand([targetParser(target), amount, damageType], DamageSourceCommand)
  }
}
