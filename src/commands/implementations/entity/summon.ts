import type { Coordinates, RootNBT, SymbolEntity } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { nbtStringifier } from 'sandstone/variables/nbt/NBTs'
import { coordinatesParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class SummonCommandNode extends CommandNode {
  command = 'summon' as const
}

export class SummonCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SummonCommandNode

  /**
   * Summon an entity at the specified location.
   * 
   * Creates a new entity in the world with optional positioning and NBT data.
   * The entity will be created with default properties unless overridden by NBT.
   * 
   * **Entity Categories:**
   * - **Mobs:** 'minecraft:zombie', 'minecraft:villager', 'minecraft:cow'
   * - **Items:** 'minecraft:item' (requires Item NBT)
   * - **Projectiles:** 'minecraft:arrow', 'minecraft:fireball'
   * - **Vehicles:** 'minecraft:boat', 'minecraft:minecart'
   * - **Utility:** 'minecraft:armor_stand', 'minecraft:item_frame'
   * - **Effects:** 'minecraft:area_effect_cloud', 'minecraft:marker'
   *
   * @param entity The entity type to summon. Must be a valid entity ID.
   *              Examples: 'minecraft:zombie', 'minecraft:cow', 'minecraft:armor_stand'
   *
   * @param pos Optional position where to summon the entity.
   *           Defaults to command execution location if not specified.
   *           Supports absolute, relative, and local coordinates.
   *
   * @param nbt Optional NBT data to configure the entity's properties.
   *           Controls attributes, equipment, behavior, appearance, and more.
   * 
   * @example
   * ```ts
   * // Basic entity summoning
   * summon('minecraft:cow')                    // At current location
   * summon('minecraft:zombie', [100, 64, 200]) // At specific coordinates
   * summon('minecraft:villager', ['~5', '~', '~']) // Relative position
   * 
   * // Custom boss mob
   * summon('minecraft:zombie', [0, 64, 0], {
   *   CustomName: '{"text":"Guardian","color":"gold"}',
   *   Health: 50,
   *   Attributes: [
   *     {Name: 'generic.max_health', Base: 50},
   *     {Name: 'generic.attack_damage', Base: 10}
   *   ]
   * })
   * ```
   */
  summon<ENTITY extends Macroable<Registry['minecraft:entity_type'], MACRO>>(
    entity: ENTITY,
    pos?: Macroable<Coordinates<MACRO>, MACRO>,
    nbt?: Macroable<ENTITY extends keyof SymbolEntity ? NonNullable<SymbolEntity[ENTITY]> : RootNBT, MACRO>,
  ) {
    return this.finalCommand([
      entity,
      coordinatesParser(pos),
      nbtStringifier(nbt as RootNBT),
    ])
  }
}
