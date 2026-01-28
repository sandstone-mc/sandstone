import type { MultiplePlayersArgumentOf, RootNBT, SymbolDataComponent } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core'
import { nbtStringifier, targetParser } from 'sandstone/variables'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { MemberModifiers } from 'sandstone/utils'

// Give command

export class GiveCommandNode extends CommandNode {
  command = 'give' as const
}

export class GiveCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = GiveCommandNode

  /**
   * Give items to players.
   *
   * Adds the specified items directly to player inventories. If the inventory
   * is full, excess items are dropped at the player's location.
   *
   * @param targets Players to give items to (e.g., `'@p'`, `'@a'`, `'PlayerName'`).
   *
   * @param item The item type to give (e.g., `'minecraft:diamond'`).
   *
   * @param count Optional quantity to give (defaults to 1).
   *
   * @example
   * ```ts
   * give('@p', 'minecraft:apple', 5)
   * give('@a', 'minecraft:diamond', 10)
   * give('PlayerName', 'minecraft:emerald', 20)
   * ```
   */
  give<T extends string>(
    targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
    item: Macroable<Registry['minecraft:item'], MACRO>,
    count?: number,
  ): FinalCommandOutput

  /**
   * Give items with component modifications to players.
   *
   * Adds items with custom data components to player inventories. Components
   * allow customizing enchantments, display names, lore, attributes, and more.
   *
   * @param targets Players to give items to (e.g., `'@p'`, `'@a'`, `'PlayerName'`).
   *
   * @param item The item type to give (e.g., `'minecraft:diamond_sword'`).
   *
   * @param components Data component modifications for the item. Prefix a
   *                  component key with `!` and use `{}` as the value to
   *                  remove a default component.
   *
   * @param count Optional quantity to give (defaults to 1).
   *
   * @example
   * ```ts
   * // Enchanted sword with custom name
   * give('@p', 'minecraft:diamond_sword', {
   *   'minecraft:enchantments': {
   *     'minecraft:sharpness': 5,
   *     'minecraft:unbreaking': 3,
   *   },
   *   'minecraft:custom_name': 'Excalibur',
   *   'minecraft:lore': ['A legendary blade'],
   * })
   *
   * // Unbreakable chestplate with bonus health
   * give('@p', 'minecraft:diamond_chestplate', {
   *   'minecraft:unbreakable': {},
   *   'minecraft:attribute_modifiers': [{
   *     type: 'minecraft:max_health',
   *     amount: 4,
   *     operation: 'add_value',
   *     slot: 'chest',
   *     id: 'my_pack:health_boost',
   *   }],
   * })
   *
   * // Remove default attributes from a tool
   * give('@p', 'minecraft:diamond_pickaxe', {
   *   '!minecraft:attribute_modifiers': {},
   * })
   *
   * // Written book
   * give('@a', 'minecraft:written_book', {
   *   'minecraft:written_book_content': {
   *     title: 'Server Rules',
   *     author: 'Admin',
   *     pages: ['Welcome to the server!'],
   *   },
   * })
   * ```
   */
  give<T extends string>(
    targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
    item: Macroable<Registry['minecraft:item'], MACRO>,
    components: Macroable<MemberModifiers<SymbolDataComponent>, MACRO>,
    count?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  give<T extends string>(
    targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
    item: Macroable<Registry['minecraft:item'], MACRO>,
    countOrComponents?: Macroable<any, MACRO>,
    count?: Macroable<number, MACRO>,
  ) {
    if (typeof countOrComponents === 'object') {
      return this.finalCommand([targetParser(targets), `${item}${componentPatchStringifier(countOrComponents as any)}`, count])
    }
    return this.finalCommand([targetParser(targets), item, countOrComponents])
  }
}

export function componentPatchStringifier(components: Record<string, RootNBT | Record<string, never>>) {
  if (Object.hasOwn(components, 'toMacro')) {
    // @ts-ignore
    return components.toMacro() as string
  }
  const resultPairs: string[] = []

  for (const [key, value] of Object.entries(components)) {
    if (key.startsWith('!')) {
      if (typeof value === 'object' && Object.keys(value).length === 0) {
        resultPairs.push(`!${key}={}`)
      } else {
        throw new Error(`Attempted to insert a negation component patch of ${key} with a value, use {} instead.`)
      }
    } else {
      resultPairs.push(`${key}=${nbtStringifier(value)}`)
    }
  }

  return `[${resultPairs.join(',')}]`
}
