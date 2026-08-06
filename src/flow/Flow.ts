import type {
  Registry,
  Coordinates,
  JSONTextComponent,
  MultipleEntitiesArgument,
  MultiplePlayersArgument,
  NBTObject,
  MultiplePlayersArgumentOf,
  SymbolBlock,
  SymbolMcdocBlockStates,
  TimeArgument,
  SingleEntityArgument,
} from 'sandstone/arguments'
import type { ItemSlotSource } from '../commands/implementations/world/item'
import type {
  ConditionClass,
  DataPointClass,
  IterableDataClass,
  JSONTextComponentClass,
  StringDataPointClass,
} from 'sandstone/variables'
import { parseJSONText, Score} from 'sandstone/variables'
import { ThrowNode } from './throw'
import type { AwaitNode, AwaitNodeClass, DataPointPickClass, MacroArgument, MCFunctionClass, PredicateClass, SandstoneCore } from '../core'
import type { LiteralUnion, NamespacedLiteralUnion, NamespacedString, NonEmptyString, RemoveFirst } from 'sandstone/utils'
import { makeCallable } from 'sandstone/utils'
import { AttachClass, SleepClass, UntilClass } from './async'
import { AndNode, ConditionNode, NotNode, OrNode, SandstoneConditions, type BlockConditionNode, type ItemsBlockConditionNode, type ItemsEntityConditionNode, type SlotsBlockConditionNode, type SlotsEntityConditionNode } from './conditions'
import type { ItemPredicate } from './conditions/variables/items'
import { IfStatement } from './if_else'
import type { ForOfIterator } from './loops'
import { binaryFor, ForIStatement, ForOfStatement, WhileStatement } from './loops'
import { WithClass } from './macro'
import type { ConditionCallback, DefaultType, SwitchCase } from './switch_case'
import { CaseStatement, executeSwitch } from './switch_case'

export type Condition = ConditionNode | ConditionClass

type ParseLiteral<T> = (
  T extends 'true' | 'false' ? boolean :
  T extends `${infer N extends number}` ? N :
  T
)

type ParseBlockState<T> = {
  [K in keyof T]: ParseLiteral<T[K]>
}

type BlockEntity = NamespacedLiteralUnion<keyof SymbolBlock>

type BlockStatic = NamespacedLiteralUnion<Exclude<keyof SymbolMcdocBlockStates, keyof SymbolBlock>>

export function conditionToNode(condition: Condition) {
  if (!(condition instanceof ConditionNode)) {
    return condition._toMinecraftCondition()
  }
  return condition
}

export class Flow {
  constructor(public sandstoneCore: SandstoneCore) {}

  if(condition: Condition, callback: () => void): IfStatement<false>
  if(condition: Condition): IfStatement<true>
  if(
    condition: Condition,
    callback?: () => void,
  ): IfStatement<boolean> {
    const cb = callback ?? (() => {})
    return new IfStatement<boolean>(
      this.sandstoneCore,
      conditionToNode(condition),
      cb,
    ) as IfStatement<boolean>
  }

  /**
   * Combine conditions with AND.
   *
   * Accepts either variadic conditions (`_.and(a, b, c)`) or a single array
   * (`_.and([a, b, c])`, useful for `Array.prototype.map` results).
   */
  and(...conditions: Condition[]): AndNode
  and(conditions: Condition[]): AndNode
  and(...args: any[]): AndNode {
    const conditions = (args[0] instanceof Array ? args[0] : args) as Condition[]
    return new AndNode(
      this.sandstoneCore,
      conditions.map((condition) => conditionToNode(condition)),
    )
  }

  /**
   * Combine conditions with OR.
   *
   * Accepts either variadic conditions (`_.or(a, b, c)`) or a single array
   * (`_.or([a, b, c])`, useful for `Array.prototype.map` results).
   */
  or(...conditions: Condition[]): OrNode
  or(conditions: Condition[]): OrNode
  or(...args: any[]): OrNode {
    const conditions = (args[0] instanceof Array ? args[0] : args) as Condition[]
    return new OrNode(
      this.sandstoneCore,
      conditions.map((condition) => conditionToNode(condition)),
    )
  }

  not = (condition: Condition) => new NotNode(this.sandstoneCore, conditionToNode(condition))

  get return() {
    return this.sandstoneCore.pack.commands.returnCmd
  }

  /**
   * Async-control
   *
   *   1. Methods - `_.await.sleep`, `_.await.until`, `_.await.attach`, `_.await.interrupt` 
   *
   *   2. Custom - `_.await(YourAwaitNodeClass, ...args)` threads `SandstoneCore` 
   *      through for you, then forwards the remaining args to your class constructor.
   */
  get await() {
    // TODO: implement logPath: AwaitBodyVisitor should log the AwaitNode class name, root MCFunction name, branch, awaitNodeIdx, and stackTrace of the AwaitNode creation.

    const methods = {
      sleep: (delay: TimeArgument, logPath = false) => new SleepClass(this.sandstoneCore, delay, logPath),
      until: (condition: Condition, pollRate: TimeArgument, logPath = false) =>
        new UntilClass(this.sandstoneCore, condition, pollRate, logPath),
      /**
       * Start awaiting another `MCFunction`'s active `AwaitNode` at run time
       * 
       * @param entrypoint   How to continue after the await resolves.
       *                      - `'start'` - `MCFunction` continuance begins before the target would continue (will not delay the target). \
       *                        If your executor (asyncContext) supports `Passengers` you can use `AttachClass#execute` to run commands `as` the target.
       *                      - `'end'` - `MCFunction` continues as-is the tick after the target continues.
       * @param func         Root `MCFunction` of the target AwaitNode.
       * @param branch       Planned `MCFunction` pre-optimizer-visitors path relative to the root, empty if the `AwaitNode` was added at the root.
       * @param awaitNodeIdx `N` of the `AwaitNode` within the above branch.
       * @param entity       `await.attach` will error if this is left unspecified when attaching to an `AwaitNode` that is a child of an `asyncContext` `MCFunction`.
       */
      attach: <Entrypoint extends 'start' | 'end'>(
        entrypoint: Entrypoint,
        func: MCFunctionClass<any, any> | NonEmptyString,
        branch: string[],
        awaitNodeIdx: number,
        entity?: SingleEntityArgument,
      ) => {
        // TODO: Add an AttachVisitor
        // TODO: At compile time if the entrypoint is `'start'` and the AttachClass instance's execute method is being used it should:
        // TODO: at run time, if the executor is an entity that allows passengers, summon a no-op area effect cloud with its NBT set to despawn it after the tick is over and its owner set to the UUID of the target context.
        // TODO: With that `execute on passengers if entity @s[tag=<todo>] ...` can be used as the start of the ExecuteCommand

        return new AttachClass(
          this.sandstoneCore,
          { entrypoint, func, branch, awaitNodeIdx, entity },
          false,
        )
      },
      /**
       * Cancels active `AwaitNode`'s at run time (kinda like `clearTimeout` in JS)
       * 
       * Note: Only use if you need to interrupt externally, `_.return` / `returnCmd` can be used internally.
       * 
       * When interrupting an `asyncContext` mcfunction:
       * - Current executor is an entity being tracked by the `asyncContext`? -> Interrupts only for that entity.
       * - Executor is missing or is not being tracked by the `asyncContext`? -> Interrupts all `AwaitNode`'s in the `MCFunction` for all entities being tracked.
       */
      interrupt: (
        func: MCFunctionClass<any, any> | NonEmptyString,
        /**
         * Adds command(s) to run within the target context before interrupting.
         * 
         * Callback is called multiple times -> Once for each `AwaitNode` that is a direct or nested child of the root.
         * 
         * Return `false` at compile time to cancel the interrupt for a given `branch`+`awaitNodeIdx` `AwaitNode` path.
         * 
         * @param root         Resolved `func`.
         * @param branch       Planned `MCFunction` pre-optimizer-visitors path relative to the root `MCFunction`, empty if the `AwaitNode` was added at the root.
         * @param awaitNodeIdx `N` of the `AwaitNode` within the above branch.
         * @param node         The `AwaitNode` being interrupted.
         */
        handle?: (root: MCFunctionClass<any, any>, branch: string[], awaitNodeIdx: number, node: AwaitNode) => any,
      ) => {
        // TODO: Return a custom node with its own visitor
      },
    }
    const custom = <C extends AwaitNodeClass>(Ctor: C, ...args: RemoveFirst<ConstructorParameters<C>>) =>
      new Ctor(this.sandstoneCore, ...args)
    return makeCallable<typeof methods, typeof custom>(methods, custom, true)
  }

  /**
   * Logs an error in data storage and chat by default and `return fail`'s from the context.
   *
   * @param error Error to log before `return`.
   * @param broadcast Whether to scope the broadcast of the error (from `@a`) or disable it.
   *
   * @returns DataPoint where error was stored.
   */
  throw(error?: JSONTextComponent, broadcast?: MultiplePlayersArgument<false> | false): DataPointClass

  /**
   * Logs an error in data storage and chat by default and `return fail`'s from the context.
   *
   * @param error Error to log before `return`.
   * @param broadcast Whether to scope the broadcast of the error (from `@a`) or disable it.
   * @param dataPoint Disable storing to data point.
   *
   * @returns The full error text component.
   */
  throw(
    error: JSONTextComponent | undefined,
    broadcast: MultiplePlayersArgument<false> | false | undefined,
    dataPoint: false,
  ): JSONTextComponentClass

  /**
   * Logs an error in data storage and chat by default and `return fail`'s from the context.
   *
   * @param error Error to log before `return`.
   * @param broadcast Whether to scope the broadcast of the error (from `@a`) or disable it.
   * @param dataPoint Specific point to store the error to.
   *
   * @returns DataPoint that was set.
   */
  throw(
    error: JSONTextComponent | undefined,
    broadcast: MultiplePlayersArgument<false> | false | undefined,
    dataPoint: DataPointClass,
  ): DataPointClass

  public throw<T extends string>(
    error?: JSONTextComponent,
    broadcast?: MultiplePlayersArgumentOf<false, T> | false,
    dataPoint?: DataPointClass | false,
  ) {
    const { pack, getCurrentMCFunctionOrThrow } = this.sandstoneCore
    const { DataVariable } = pack

    const node = getCurrentMCFunctionOrThrow()

    const fullError: JSONTextComponent = [
      { text: '\nSandstone Pack Error:\n', color: 'yellow' },
      typeof error === 'string' ? { text: error } : error ?? { text: '[Function Threw]' },
      { text: '\n\n'},

      { text: `@ Function ${node.resource.name}. Node ${node.body.length - 1}.\n` },
    ]

    const errorSerializable = parseJSONText(this.sandstoneCore, fullError)! as JSONTextComponentClass

    // Defer all command emission to ThrowTransformationVisitor. We just stash
    // the throw site's args on a marker node so the visitor can materialize
    // tellraw / data modify / return 1 in the right place and wrap enclosing
    // executes with `if function <throw_fn> run return fail` for propagation.
    if (dataPoint !== false) {
      const point = dataPoint ?? DataVariable()
      new ThrowNode(this.sandstoneCore, fullError, broadcast, point)
      return point
    }

    new ThrowNode(this.sandstoneCore, fullError, broadcast, false)
    return errorSerializable
  }

  while(condition: Condition, callback: () => void) {
    return new WhileStatement(this.sandstoneCore, conditionToNode(condition), callback)
  }

  doWhile(condition: Condition, callback: () => void) {
    callback()
    return new WhileStatement(this.sandstoneCore, conditionToNode(condition), callback)
  }

  for(
    initial: number | Score,
    end: (iterator: Score) => Condition,
    iterate: (iterator: Score) => Score,
    callback: (iterator: Score | number, _continue: () => void) => any,
  ): ForIStatement

  for(
    range: [start: number | Score, end: number | Score],
    type: 'iterate',
    callback: (iterator: Score, _continue: () => void) => any,
  ): ForIStatement

  for(
    type: 'entry',
    _: 'of' | 'of-reverse',
    iterable: IterableDataClass<'list' | 'map'>,
    callback: (entry: DataPointClass) => any,
  ): ForOfStatement<'entry', [entry: DataPointClass]>

  for(
    type: ['key', 'value'],
    _: 'of' | 'of-reverse',
    iterable: IterableDataClass<'map'>,
    callback: (key: StringDataPointClass, value: DataPointClass) => any,
  ): ForOfStatement<['key', 'value'], [key: StringDataPointClass, value: DataPointClass]>

  for(
    type: ['i', 'entry'],
    _: 'of' | 'of-reverse',
    iterable: IterableDataClass<'list' | 'map'>,
    callback: (i: Score, entry: DataPointClass) => any,
  ): ForOfStatement<['i', 'entry'], [i: Score, entry: DataPointClass]>

  for(
    arg1: (number | Score) | ForOfIterator | [start: number | Score, end: number | Score],
    arg2: ((iterator: Score) => Condition) | 'of' | 'of-reverse' | 'iterate',
    arg3:
      | ((iterator: Score) => Score)
      | IterableDataClass<'list' | 'map'>
      | ((num: number) => any)
      | ((iterator: Score, _continue: () => void) => any),
    // eslint-disable-next-line max-len
    arg4?:
      | ((iterator: Score, _continue: () => void) => any)
      | ((entry: DataPointClass) => any)
      | ((key: StringDataPointClass, value: DataPointClass) => any)
      | ((i: Score, value: DataPointClass) => any),
  ) {
    if (typeof arg1 === 'number' || arg1 instanceof Score) {
      return new ForIStatement(
        this.sandstoneCore,
        arg1,
        arg2 as (iterator: Score) => Condition,
        arg3 as (iterator: Score) => Score,
        arg4 as (iterator: Score | number) => any,
      )
    }
    // Yes these are dumb. Blame TypeScript. Yes I tried a generic, it didn't work.
    if (arg1 === 'entry') {
      return new ForOfStatement(
        this.sandstoneCore,
        arg1,
        arg2 === 'of-reverse' ? 'reverse' : 'normal',
        arg3 as IterableDataClass<'map' | 'list'>,
        arg4 as (entry: DataPointClass) => any,
      )
    }
    if (arg1[0] === 'key') {
      return new ForOfStatement(
        this.sandstoneCore,
        arg1,
        arg2 === 'of-reverse' ? 'reverse' : 'normal',
        arg3 as IterableDataClass<'map'>,
        arg4 as (key: StringDataPointClass, value: DataPointClass) => any,
      )
    }
    if (typeof arg1[0] === 'number' || arg1[0] instanceof Score) {
      if (arg2 === 'iterate') {
        return new ForIStatement(
          this.sandstoneCore,
          arg1[0],
          (i) => i['<='](arg1[1] as Score | number),
          (i) => i['++'],
          arg3 as (iterator: unknown) => any,
        )
      }
    }

    return new ForOfStatement(
      this.sandstoneCore,
      arg1 as ForOfIterator,
      arg2 === 'of-reverse' ? 'reverse' : 'normal',
      arg3 as IterableDataClass<'list' | 'map'>,
      arg4 as (i: Score, value: DataPointClass) => any,
    )
  }

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(value: ValueType, cases: CaseStatement<CheckType, ValueType> | DefaultType<CheckType, ValueType>): void

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(value: ValueType, cases: SwitchCase<ValueType, CheckType>[] | [...SwitchCase<ValueType, CheckType>[], ['default', () => any]]): void

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(
    value: ValueType,
    cases: SwitchCase<ValueType, CheckType>[] | [...SwitchCase<ValueType, CheckType>[], ['default', () => any]] | CaseStatement<CheckType, ValueType> | DefaultType<CheckType, ValueType>,
  ) {
    executeSwitch(this.sandstoneCore, value, cases)
  }

  case<SwitchValueType extends DataPointClass | DataPointPickClass | Score>(value: (SwitchValueType extends Score ? number : NBTObject) | ConditionCallback<SwitchValueType>, callback: () => any) {
    if (typeof value === 'function') {
      return new CaseStatement<SwitchValueType extends Score ? number : NBTObject, SwitchValueType>([
        { type: 'condition', condition: value, callback },
      ])
    }
    return new CaseStatement<SwitchValueType extends Score ? number : NBTObject, SwitchValueType>([
      {
        type: 'static',
        /* @ts-ignore */
        value,
        callback
      },
    ])
  }

  // Conditions
  /**
   * Checks for a specific biome in a given position.
   * @param coordinates Position to test.
   * @param biome Biome(s) to test for (can be a tag).
   */
  biome = (coordinates: Coordinates, biome: Registry['minecraft:worldgen/biome']) => {
    return new SandstoneConditions.Biome(this.sandstoneCore, coordinates, biome)
  }

  /**
   * Compares the block at a given position to a given block.
   *
   * @param position Position of a target block to test.
   * @param block Block to test for (can be a tag).
   * @param state Optional block state properties to match.
   *
   * @example
   * ```ts
   * // Simple block check
   * _.if(_.block(abs(0, 64, 0), 'minecraft:stone'), () => { ... })
   *
   * // Check block with specific state
   * _.if(_.block(abs(0, 64, 0), 'minecraft:oak_log', { axis: 'y' }), () => { ... })
   * ```
   */
  block<BLOCK extends BlockStatic>(
    position: Coordinates,
    block: BLOCK,
    state?: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number>,
  ): BlockConditionNode

  /**
   * Compares the block at a given position to a given block with NBT data.
   *
   * @param position Position of a target block to test.
   * @param block Block to test for (must be a block entity).
   * @param state Optional block state properties to match.
   * @param nbt NBT data to match against the block entity.
   *
   * @example
   * ```ts
   * // Check chest with specific NBT
   * _.if(_.block(abs(0, 64, 0), 'minecraft:chest', { facing: 'north' }, { Items: [] }), () => { ... })
   *
   * // Check command block
   * _.if(_.block(['~', '~', '~1'], 'minecraft:command_block', {}, { Command: 'say Hello' }), () => { ... })
   * ```
   */
  block<BLOCK extends BlockEntity>(
    position: Coordinates,
    block: BLOCK,
    state: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number> | undefined,
    nbt: BLOCK extends keyof SymbolBlock
      ? NonNullable<SymbolBlock[BLOCK]>
      : SymbolBlock<'%fallback'>,
  ): BlockConditionNode

  block(
    position: Coordinates,
    block: Registry['minecraft:block'],
    state?: Record<string, string | boolean | number>,
    nbt?: NBTObject,
  ) {
    return new SandstoneConditions.Block(this.sandstoneCore, position, block, state, nbt)
  }

  /**
   * Compares the blocks in two equally sized volumes.
   * @param start Start position of the first volume.
   * @param end End position of the first volume.
   * @param destination Start position of the second volume.
   * @param scan_mode Specifies whether all blocks in the source volume should be compared, or if air blocks should be masked/ignored
   */
  blocks = (start: Coordinates, end: Coordinates, destination: Coordinates, scan_mode: 'all' | 'masked' = 'all') => {
    return new SandstoneConditions.Blocks(this.sandstoneCore, start, end, destination, scan_mode)
  }

  /**
   * Checks whether the targeted block, entity or storage has any data tag for a given path.
   *
   * You must provide a Data instance.
   *
   * ⚠️ You should prefer using the Data instance as a direct condition, as this function is only here for completeness.
   *
   * @example
   * _.if(_.data(Data('entity', '@s', 'myData')), () => {
   *   // Do something if the data exists
   * })
   *
   * // You should however prefer using the Data instance directly:
   * _.if(Data('entity', '@s', 'myData'), () => {
   *  // Do something if the data exists
   * })
   *
   * @param data Data instance to check.
   */
  data = (data: DataPointClass) => {
    return new SandstoneConditions.DataPointExists(this.sandstoneCore, data)
  }

  /**
   * Checks if the execution is in a matching dimension.
   * @param dimension Dimension to check for.
   */
  dimension = (dimension: Registry['minecraft:dimension']) => {
    return new SandstoneConditions.Dimension(this.sandstoneCore, dimension)
  }

  /**
   * Checks a function or function tag and matches the return value(s). If a tag is given, all functions run regardless of the results of prior functions.
   * @param mcfunction Function to check for.
   */
  mcfunction = (mcfunction: NamespacedString | MCFunctionClass<undefined, undefined>) => {
    if (typeof mcfunction === 'string') {
      return new SandstoneConditions.Function(this.sandstoneCore, mcfunction)
    }
    return new SandstoneConditions.Function(this.sandstoneCore, mcfunction.name)
  }

  /**
   * Checks whether one or more entities exist.
   *
   * @example
   * _.if(_.entity('@a[tag=example]'), () => {
   *   // Do something if the entity exists
   * })
   *
   * // ⚠️ You can use a Selector directly to achieve the same result:
   * _.if(Selector('@a', {tag: 'example'}), () => {
   *   // Do something if the entity exists
   * })
   *
   * @param targets Entity targets to check for.
   */
  entity = (targets: MultipleEntitiesArgument) => {
    return new SandstoneConditions.Selector(this.sandstoneCore, targets.toString())
  }

  /**
   * Tests for items in block entity or entity inventory slots.
   *
   * @example
   * ```ts
   * // Check if chest has any diamonds
   * _.if(_.items.block(abs(0, 64, 0), 'container.*', 'minecraft:diamond'), () => { ... })
   *
   * // Check if player has any diamonds
   * _.if(_.items.entity('@p', 'inventory.*', 'minecraft:diamond'), () => { ... })
   *
   * // Check for enchanted sword with builder
   * _.if(_.items.entity('@p', 'weapon.mainhand',
   *   ItemPredicate('minecraft:diamond_sword').has('minecraft:enchantments')
   * ), () => { ... })
   * ```
   */
  get items(): {
    /**
     * Test for items in a block entity's inventory slots.
     *
     * @param sourcePos Position of the block entity to test.
     * @param slotSource Slot source to test (e.g., `'container.*'`, inline slot source, or a slot source reference).
     * @param itemPredicate Item predicate to match against.
     */
    block: (sourcePos: Coordinates, slotSource: ItemSlotSource, itemPredicate: ItemPredicate) => ItemsBlockConditionNode
    /**
     * Test for items in an entity's inventory slots.
     *
     * @param source Entity to test.
     * @param slotSource Slot source to test (e.g., `'inventory.*'`, inline slot source, or a slot source reference).
     * @param itemPredicate Item predicate to match against.
     */
    entity: (source: MultipleEntitiesArgument, slotSource: ItemSlotSource, itemPredicate: ItemPredicate) => ItemsEntityConditionNode
  } {
    return {
      block: (sourcePos: Coordinates, slotSource: ItemSlotSource, itemPredicate: ItemPredicate) =>
        new SandstoneConditions.ItemsBlock(this.sandstoneCore, sourcePos, slotSource, itemPredicate),
      entity: (source: MultipleEntitiesArgument, slotSource: ItemSlotSource, itemPredicate: ItemPredicate) =>
        new SandstoneConditions.ItemsEntity(this.sandstoneCore, source, slotSource, itemPredicate),
    }
  }

  /**
   * Counts slots from a slot source that are present in a block entity or entity.
   *
   * @example
   * ```ts
   * _.if(_.slots.entity('@p', 'inventory.*'), () => { ... })
   * _.if(_.slots.block(abs(0, 64, 0), { type: 'minecraft:slot_range', slots: 'armor.chest' }), () => { ... })
   * ```
   */
  get slots(): {
    /**
     * Count slots from a slot source that are present in a block entity.
     *
     * @param sourcePos Position of the block entity to test.
     * @param slotSource Slot source (e.g., `'container.*'`, inline slot source, or a slot source reference).
     */
    block: (sourcePos: Coordinates, slotSource: ItemSlotSource) => SlotsBlockConditionNode
    /**
     * Count slots from a slot source that are present in an entity.
     *
     * @param source Entity to test.
     * @param slotSource Slot source (e.g., `'inventory.*'`, inline slot source, or a slot source reference).
     */
    entity: (source: MultipleEntitiesArgument, slotSource: ItemSlotSource) => SlotsEntityConditionNode
  } {
    return {
      block: (sourcePos: Coordinates, slotSource: ItemSlotSource) =>
        new SandstoneConditions.SlotsBlock(this.sandstoneCore, sourcePos, slotSource),
      entity: (source: MultipleEntitiesArgument, slotSource: ItemSlotSource) =>
        new SandstoneConditions.SlotsEntity(this.sandstoneCore, source, slotSource),
    }
  }

  /**
   * Checks if chunks at a given position is fully loaded.
   * @param position Position to check.
   */
  chunksLoaded = (position: Coordinates) => {
    return new SandstoneConditions.Loaded(this.sandstoneCore, position)
  }

  /**
   * Checks whether the predicate successes.
   *
   * @param predicate Predicate to check.
   */
  predicate = (predicate: LiteralUnion<string> | PredicateClass) => {
    if (typeof predicate === 'string') {
      return new SandstoneConditions.Predicate(this.sandstoneCore, predicate)
    }
    return new SandstoneConditions.Predicate(this.sandstoneCore, predicate.name)
  }

  with = (env: MacroArgument[], callback: (() => any)) => new WithClass(this.sandstoneCore, env, callback)
}
