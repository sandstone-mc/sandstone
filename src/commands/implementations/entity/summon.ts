import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, nbtStringifier } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { Coordinates, ENTITY_TYPES, RootNBT } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'

export class SummonCommandNode extends CommandNode {
  command = 'summon' as const
}

export class SummonCommand extends CommandArguments {
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
  summon = (entity: LiteralUnion<ENTITY_TYPES>, pos?: Coordinates, nbt?: RootNBT) => this.finalCommand([entity, coordinatesParser(pos), nbt ? nbtStringifier(nbt) : undefined])
}
