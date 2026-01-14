import type { SymbolDataComponent, SymbolDataComponentPredicate } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { MinMaxBounds } from 'sandstone/arguments/generated/data/util'
import type { SandstonePack } from 'sandstone/pack'
import { nbtStringifier } from 'sandstone/variables/nbt/NBTs'
import * as util from 'util'
import { formatDebugString } from '../utils'
import { MacroArgument,
TagClass } from 'sandstone/core';
import { NBTObject } from 'sandstone/arguments';
import type { ItemModelBuilder } from 'sandstone/core/resources/resourcepack/itemDefinition';

/** Item type: specific item, tag, or wildcard */
export type ItemPredicateItem = Registry['minecraft:item'] | `#${string}` | TagClass<'item'> | '*'

/** Keys for sub-predicate matching (~ operator) */
type PredicateKeys = keyof SymbolDataComponentPredicate<'map'>

/** Keys for exact value matching (= operator) */
type ComponentKeys = keyof SymbolDataComponent<'map'>

/** Range for count test */
type CountRange = number | MinMaxBounds<number> | { min?: number; max?: number }

/** A single test entry */
type TestEntry = {
  negated: boolean
  component: string
  operator: '=' | '~' | 'exists'
  value?: MacroArgument | NBTObject
}

/** A group of tests joined by OR */
type OrGroup = TestEntry[]

/**
 * Builder for item predicates used in commands like `clear` and `execute if items`.
 *
 * @example
 * ```ts
 * // Simple item match
 * ItemPredicate('minecraft:diamond')
 *
 * // With component tests
 * ItemPredicate('minecraft:diamond_sword')
 *   .match('minecraft:enchantments', [{ enchantment: 'minecraft:sharpness', levels: { min: 3 } }])
 *   .has('minecraft:custom_name')
 *
 * // Wildcard with count
 * ItemPredicate('*').count({ max: 16 })
 *
 * // Tag with negation
 * ItemPredicate('#minecraft:swords').without('minecraft:damage')
 *
 * // OR logic: items without damage OR with damage=0
 * ItemPredicate('*').or(
 *   i => i.without('minecraft:damage'),
 *   i => i.exact('minecraft:damage', 0)
 * )
 * ```
 */
export class ItemPredicateClass {
  private readonly pack: SandstonePack

  private readonly itemType: ItemPredicateItem

  protected readonly testGroups: OrGroup[] = []

  constructor(pack: SandstonePack, itemType: ItemPredicateItem) {
    this.pack = pack
    this.itemType = itemType
  }

  /** Check if a component exists */
  has<K extends ComponentKeys>(component: K): this {
    this.addTest({ negated: false, component, operator: 'exists' })
    return this
  }

  /** Check if a component does NOT exist */
  without<K extends ComponentKeys>(component: K): this {
    this.addTest({ negated: true, component, operator: 'exists' })
    return this
  }

  /** Exact match for a component value (= operator) */
  exact<K extends ComponentKeys>(
    component: K,
    value: SymbolDataComponent<'map'>[K],
  ): this {
    this.addTest({ negated: false, component, operator: '=', value })
    return this
  }

  /** Negated exact match (!component=value) */
  notExact<K extends ComponentKeys>(
    component: K,
    value: SymbolDataComponent<'map'>[K],
  ): this {
    this.addTest({ negated: true, component, operator: '=', value })
    return this
  }

  /** Sub-predicate match (~ operator) */
  match<K extends PredicateKeys>(
    predicate: K,
    value: SymbolDataComponentPredicate<'map'>[K],
  ): this {
    this.addTest({ negated: false, component: predicate, operator: '~', value })
    return this
  }

  /** Negated sub-predicate match (!predicate~value) */
  notMatch<K extends PredicateKeys>(
    predicate: K,
    value: SymbolDataComponentPredicate<'map'>[K],
  ): this {
    this.addTest({ negated: true, component: predicate, operator: '~', value })
    return this
  }

  /** Test stack count */
  count(range: CountRange): this {
    this.addTest({ negated: false, component: 'count', operator: '~', value: range })
    return this
  }

  /**
   * Create an OR group of conditions.
   * Each callback receives a fresh builder; all their tests are joined with |.
   *
   * @example
   * ```ts
   * ItemPredicate('*').or(
   *   i => i.without('minecraft:damage'),
   *   i => i.exact('minecraft:damage', 0)
   * )
   * // Produces: *[!minecraft:damage|minecraft:damage=0]
   * ```
   */
  or(...builders: Array<(item: ItemPredicateClass) => ItemPredicateClass>): this {
    const orGroup: OrGroup = []

    for (const builderFn of builders) {
      const tempBuilder = new ItemPredicateClass(this.pack, this.itemType)
      builderFn(tempBuilder)

      // Collect all tests from the temp builder into this OR group
      for (const group of tempBuilder.testGroups) {
        orGroup.push(...group)
      }
    }

    if (orGroup.length > 0) {
      this.testGroups.push(orGroup)
    }

    return this
  }

  /**
   * Create an item model builder from this predicate.
   * The builder inherits all predicate tests and adds model-specific methods
   * for building ItemModel JSON for resource packs.
   *
   * @example
   * ```ts
   * ItemPredicate('minecraft:diamond_sword')
   *   .has('minecraft:enchantments')
   *   .without('minecraft:damage')
   *   .model()
   *   .onTrue('custom:enchanted_pristine')
   *   .onFalse('minecraft:item/diamond_sword')
   * ```
   */
  model(): ItemModelBuilder {
    // Dynamic import to avoid circular dependency
    const { ItemModelBuilder } = require('sandstone/core/resources/resourcepack/itemDefinition')
    const builder = new ItemModelBuilder(this.pack)
    // Copy test groups to the new builder
    for (const group of this.testGroups) {
      builder.testGroups.push([...group])
    }
    return builder
  }

  private addTest(test: TestEntry): void {
    // Each regular test is its own group (AND between groups)
    this.testGroups.push([test])
  }

  private stringifyTest(test: TestEntry): string {
    const prefix = test.negated ? '!' : ''

    if (test.operator === 'exists') {
      return `${prefix}${test.component}`
    }

    const valueStr = nbtStringifier(test.value)
    return `${prefix}${test.component}${test.operator}${valueStr}`
  }

  private stringifyOrGroup(group: OrGroup): string {
    return group.map((test) => this.stringifyTest(test)).join('|')
  }

  toString(): string {
    if (this.testGroups.length === 0) {
      if (this.itemType instanceof TagClass) {
        return this.itemType.name
      }
      return this.itemType
    }

    const testsStr = this.testGroups
      .map((group) => this.stringifyOrGroup(group))
      .join(',')

    return `${this.itemType}[${testsStr}]`
  }

  protected toJSON(): string {
    // TODO
    throw new Error()
  }

  [util.inspect.custom](): string {
    return formatDebugString(this.constructor.name, this.toString(), undefined, undefined)
  }
}
