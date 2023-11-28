import { CommandNode } from 'sandstone/core/nodes'
import { nbtStringifier } from 'sandstone/variables/nbt/NBTs'
import { coordinatesParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { Coordinates, ENTITY_TYPES, RootNBT } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'

export class SummonCommandNode extends CommandNode {
  command = 'summon' as const
}

export class SummonCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SummonCommandNode

  /**
   * Summons an entity.
   *
   * @param entity Specifies the entity to be summoned.
   *
   * @param pos Specifies the position to summon the entity. If not specified, defaults to the position of the command's execution.
   *
   * @param nbt Specifies the data tag for the entity.
   */
  summon = (
    entity: Macroable<LiteralUnion<ENTITY_TYPES>, MACRO>,
    pos?: Macroable<Coordinates<MACRO>, MACRO>,
    nbt?: Macroable<RootNBT, MACRO>,
  ) => this.finalCommand([entity, coordinatesParser(pos), (!nbt || (typeof nbt === 'object' && nbt.toMacro)) ? nbt : nbtStringifier(nbt as RootNBT)])
}
