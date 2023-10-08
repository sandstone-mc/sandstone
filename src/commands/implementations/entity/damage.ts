import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { validateIntegerRange } from 'sandstone/commands/validators'
import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { DamageTypeClass } from 'sandstone/core'
import type { Coordinates, DAMAGE_TYPES, SingleEntityArgument } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'

export class DamageCommandNode extends CommandNode {
  command = 'damage' as const
}

class DamageCauseCommand extends CommandArguments {
  /**
   * @param cause Cause of the damage, in the case of indirect damage.
   */
  from = (cause: SingleEntityArgument) => this.finalCommand(['from', targetParser(cause)])
}

export class DamageSourceCommand extends CommandArguments {
  /**
   * @param entity Entity inflicting the damage.
   */
  by = (entity: SingleEntityArgument) => this.subCommand(['by', targetParser(entity)], DamageCauseCommand)

  /**
   * Where the damage originated at (when no entity caused the damage).
   */
  at = (position: Coordinates) => this.finalCommand(['at', coordinatesParser(position)])
}

export class DamageCommand extends CommandArguments {
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
    target: SingleEntityArgument,
    amount: number,
    damageType?: LiteralUnion<DAMAGE_TYPES> | DamageTypeClass,
  ) => {
    validateIntegerRange(amount, 'amount', 0, 1_000_000)
    return this.subCommand([targetParser(target), amount, damageType], DamageSourceCommand)
  }
}
