import { CommandNode } from '#core/nodes'
import { coordinatesParser, nbtStringifier } from '#variables'

import { CommandArguments } from '../../helpers'

import type { Coordinates, ENTITY_TYPES, RootNBT } from '#arguments'
import type { LiteralUnion } from '#utils'

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
