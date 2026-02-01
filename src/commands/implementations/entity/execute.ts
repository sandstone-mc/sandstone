import type {
  ANCHORS,
  AXES,
  Registry,
  COMPARISON_OPERATORS,
  ContainerSlotSelector,
  Coordinates,
  EntitySlotSelector,
  MultipleEntitiesArgument,
  ObjectiveArgument,
  Range,
  Rotation,
  SingleEntityArgumentOf,
} from 'sandstone/arguments'
import type { SandstoneCommands } from 'sandstone/commands'
import {
  isMacroArgument,
  type MacroArgument,
  type Macroable,
  type MCFunctionNode,
  type PredicateClass,
} from 'sandstone/core'
import type { Node } from 'sandstone/core/nodes'
import { ContainerCommandNode } from 'sandstone/core/nodes'
import type { _RawMCFunctionClass } from 'sandstone/core/resources/datapack/mcfunction'
import type { SandstonePack } from 'sandstone/pack'
import { makeCallable, toMinecraftResourceName } from 'sandstone/utils'
import type { DataPointClass } from 'sandstone/variables/Data'
import type { ObjectiveClass } from 'sandstone/variables/Objective'
import type { ItemPredicateClass } from 'sandstone/variables/ItemPredicate'
import { coordinatesParser, rangeParser, rotationParser, targetParser } from 'sandstone/variables/parsers'
import type { Score } from 'sandstone/variables/Score'
import { CommandArguments, FinalCommandOutput } from '../../helpers'
import { FunctionCommandNode } from '../server/function'

// Execute command
export type SubCommand = [subcommand: string, ...args: unknown[]]

// Yes these suck

const isObjective = (arg: any): arg is ObjectiveClass => typeof arg === 'object' && Object.hasOwn(arg, 'reset')

const isScore = (arg: any): arg is Score => typeof arg === 'object' && Object.hasOwn(arg, 'setDisplay')

export class ExecuteCommandPart<MACRO extends boolean> extends CommandArguments<typeof ExecuteCommandNode> {
  protected nestedExecute = (args: SubCommand, executable = true) =>
    this.subCommand([args], ExecuteCommand<MACRO>, executable)
}

export type StoreType = 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'
export type RelationType =
  | 'attacker'
  | 'controller'
  | 'leasher'
  | 'origin'
  | 'owner'
  | 'passengers'
  | 'target'
  | 'vehicle'

export class ExecuteCommandNode extends ContainerCommandNode<SubCommand[]> {
  command = 'execute' as const

  /**
   * Is being used by internals to generate a function call. (eg. Flow visitor)
   */
  isFake: boolean

  /**
   * By default, the execute is treated as single (execute.run.stuff).
   * This is set to `false` if the execute is used as a function (execute.run(() => { stuff })).
   */
  isSingleExecute: boolean

  /**
   * In case of a multiple execute, this specifies the base name of the MCFunction.
   */
  givenCallbackName: string | undefined

  constructor(
    sandstonePack: SandstonePack,
    args: SubCommand[] = [],
    {
      isFake = false,
      isSingleExecute = true,
      givenCallbackName = undefined as string | undefined,
      body = [] as Node[],
    } = {},
  ) {
    super(sandstonePack, ...args)

    this.givenCallbackName = givenCallbackName
    this.isSingleExecute = isSingleExecute
    this.isFake = isFake
    this.append(...body)
  }

  get callbackName() {
    return this.givenCallbackName ?? `execute_${this.args[0][0].split(' ')[0]}`
  }

  append = (...nodes: Node[]) => {
    for (const node of nodes) {
      this.body.push(node)

      if (this.isSingleExecute) {
        this.sandstoneCore.getCurrentMCFunctionOrThrow().exitContext()
      }
    }
    return (nodes.length === 1 ? nodes[0] : nodes) as any
  }

  getValue = () => {
    if (this.body.length > 1) {
      throw new Error('Execute nodes can only have one child node when toString is called.')
    }

    // This will be the execute string without "run"
    const flattenedArgs = this.args.flat(1)
    const args = []

    for (const arg of flattenedArgs) {
      if (arg !== undefined && arg !== null) {
        // Yes these are cursed, unfortunately, there's not really a better way to do this as visitors only visit the root nodes.
        if (typeof arg === 'object') {
          if (isMacroArgument(this.sandstoneCore, arg)) {
            this.isMacro = true

            args.push((arg as MacroArgument).toMacro())
          } else {
            args.push(arg)
          }
        } else {
          args.push(arg)
        }
      }
    }
    const executeString = `${this.command} ${args.join(' ')}`

    if (this.body.length === 0) {
      return executeString
    }

    let command = this.body[0].getValue()

    // Yes this is cursed
    if (this.isFake) {
      return command
    }

    if (command.startsWith('$')) {
      this.isMacro = true
      command = command.slice(1)
    }

    return `${this.isMacro ? '$' : ''}${executeString} run ${command}`
  }

  createMCFunction = (currentMCFunction: MCFunctionNode | null) => {
    if (this.isSingleExecute || !currentMCFunction) {
      return { node: this as ExecuteCommandNode }
    }

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = this.sandstonePack.MCFunction(`${currentMCFunction.resource.name}/${this.callbackName}`, {
      creator: 'sandstone',
      onConflict: 'rename',
    })
    const mcFunctionNode = mcFunction.node
    mcFunctionNode.body = this.body

    // Return an execute calling this MCFunction.
    const mcFunctionCall = new FunctionCommandNode(this.sandstonePack, mcFunction)
    this.body = [mcFunctionCall]

    return { node: this as ExecuteCommandNode, mcFunction: mcFunctionNode }
  }
}

export class ExecuteStoreArgsCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /**
   * Saves the final command's return value as tag data within a block entity.
   *
   * Store as a byte, short, int, long, float, or double. If the return value is a decimal, it is rounded first and then multiplied by `scale`.
   *
   * @param targetPos Position of target block
   *
   * @param path Location of the desired tag to hold the value in.
   *
   * @param type Desired data size/type.
   *
   * @param scale Multiplier to apply before storing value. Defaults to 1.
   */
  block = (
    targetPos: Macroable<Coordinates<MACRO>, MACRO>,
    path: Macroable<string, MACRO>,
    type: Macroable<StoreType, MACRO>,
    scale?: Macroable<number, MACRO>,
  ) => this.nestedExecute(['block', coordinatesParser(targetPos), path, type, scale])

  /**
   * Saves the final command's return value in either a bossbar's current value or its maximum value.
   *
   * @param id ID of the bossbar to target for saving.
   *
   * @param type Whether to overwrite the bossbar's current value or its max value.
   */
  bossbar = (id: Macroable<string, MACRO>, type: Macroable<'max' | 'value', MACRO>) =>
    this.nestedExecute(['bossbar', id, type])

  /**
   * Save the final command's return value in one of an entity's data tags.
   *
   * Store as a byte, short, int, long, float, or double. If the return value is a decimal, it is rounded first and then multiplied by `scale`.
   *
   * Like the `/data` command, `/execute store <arguments>` cannot modify player NBT.
   *
   * @param target A single entity to store under.
   *
   * @param path Location of the desired tag to hold the value in.
   *
   * @param type Desired data size/type.
   *
   * @param scale Multiplier to apply before storing value. Defaults to 1.
   */
  entity = <T extends string>(
    target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    path: Macroable<string, MACRO>,
    type: Macroable<StoreType, MACRO>,
    scale?: Macroable<number, MACRO>,
  ) => this.nestedExecute(['entity', targetParser(target), path, type, scale])

  /**
   * Overrides the given score with the final command's return value.
   *
   * @param targets Specifies score holder(s) whose score is to be overridden.
   *
   * @param objective A scoreboard objective.
   *
   * @param playerScore The player's score to override.
   */
  score(
    ...args:
      | [targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>, objective: Macroable<ObjectiveArgument, MACRO>]
      | [playerScore: Macroable<Score, MACRO>]
  ) {
    if (isScore(args[0])) {
      return this.nestedExecute(['score', args[0]])
    }
    return this.nestedExecute(['score', targetParser(args[0]), args[1]])
  }

  /**
   * Uses the `path` within storage `target` to store the return value in.
   *
   * Store as a byte, short, int, long, float, or double. If the return value is a decimal, it is rounded first and then multiplied by `scale`.
   *
   * If the storage does not yet exist, it gets created.
   *
   * @param target Target storage container, as a namespaced ID.
   *
   * @param path Location of the desired tag to hold the value in.
   *
   * @param type Desired data size/type.
   *
   * @param scale Multiplier to apply before storing value. Defaults to 1.
   */
  storage = (
    target: Macroable<string, MACRO>,
    path: Macroable<string, MACRO>,
    type: Macroable<StoreType, MACRO>,
    scale: Macroable<number, MACRO> = 1,
  ) => this.nestedExecute(['storage', target, path, type, scale])
}

export class ExecuteStoreCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /** Store the final command's result value. */
  get result() {
    return this.subCommand([['result']], ExecuteStoreArgsCommand<MACRO>, false)
  }

  /** Store the final command's success value. */
  get success() {
    return this.subCommand([['success']], ExecuteStoreArgsCommand<MACRO>, false)
  }
}

export class ExecuteDataArgsCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /**
   * Checks whether the targeted block has any data for a given tag
   * @param pos Position of the block to be tested.
   * @param path Data tag to check for.
   */
  block = (pos: Macroable<Coordinates<MACRO>, MACRO>, path: Macroable<string, MACRO>) =>
    this.nestedExecute(['data', 'block', coordinatesParser(pos), path], true)

  /**
   * Checks whether the targeted entity has any data for a given tag
   * @param target One single entity to be tested.
   * @param path Data tag to check for.
   */
  entity = <T extends string>(target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>, path: Macroable<string, MACRO>) =>
    this.nestedExecute(['data', 'entity', targetParser(target), path], true)

  /**
   * Checks whether the targeted storage has any data for a given tag
   * @param source The storage to check in.
   * @param path Data tag to check for.
   */
  storage = (source: Macroable<string, MACRO>, path: Macroable<string, MACRO>) =>
    this.nestedExecute(['data', 'storage', source, path], true)
}

/**
 * Item predicate for matching items in inventory slots.
 *
 * Can be a string (item ID, item tag, or item ID with component predicates)
 * or an ItemPredicateClass built using the `items()` function.
 *
 * @example
 * ```ts
 * // String format
 * 'minecraft:diamond'
 * '#minecraft:logs'
 * 'minecraft:diamond_sword[minecraft:enchantments~{sharpness:5}]'
 *
 * // Builder format
 * ItemPredicate('minecraft:diamond_sword').match('minecraft:enchantments', [...])
 * ```
 */
export type ItemPredicate = string | ItemPredicateClass

export class ExecuteItemsCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /**
   * Test for items in a block entity's inventory slots.
   *
   * @param sourcePos Position of the block entity to test.
   *
   * @param slots Slots to test (e.g., `'container.*'`, `'container.0'`).
   *
   * @param itemPredicate Item predicate to match against.
   *
   * @example
   * ```ts
   * // Check if chest has any diamonds
   * execute.if.items.block([0, 64, 0], 'container.*', 'minecraft:diamond')
   *
   * // Check for specific slot
   * execute.if.items.block([0, 64, 0], 'container.0', '#minecraft:logs')
   *
   * // Using builder for complex predicates
   * execute.if.items.block([0, 64, 0], 'container.*',
   *   ItemPredicate('minecraft:diamond_sword').match('minecraft:enchantments', [...])
   * )
   * ```
   */
  block = (
    sourcePos: Macroable<Coordinates<MACRO>, MACRO>,
    slots: Macroable<ContainerSlotSelector, MACRO>,
    itemPredicate: Macroable<ItemPredicate, MACRO>,
  ) => this.nestedExecute(['items', 'block', coordinatesParser(sourcePos), slots, `${itemPredicate}`], true)

  /**
   * Test for items in an entity's inventory slots.
   *
   * @param source Entity to test.
   *
   * @param slots Slots to test (e.g., `'inventory.*'`, `'hotbar.0'`, `'armor.chest'`).
   *
   * @param itemPredicate Item predicate to match against.
   *
   * @example
   * ```ts
   * // Check if player has any diamonds
   * execute.if.items.entity('@p', 'inventory.*', 'minecraft:diamond')
   *
   * // Check hotbar for tools
   * execute.if.items.entity('@s', 'hotbar.*', '#minecraft:tools')
   *
   * // Check for enchanted sword with builder
   * execute.if.items.entity('@p', 'weapon.mainhand',
   *   ItemPredicate('minecraft:diamond_sword').has('minecraft:enchantments')
   * )
   *
   * // Count items using store
   * execute.store.result(score).if.items.entity('@p', 'inventory.*',
   *   ItemPredicate('*').match('minecraft:damage', { durability: { max: 10 } })
   * )
   * ```
   */
  entity = (
    source: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
    slots: Macroable<EntitySlotSelector, MACRO>,
    itemPredicate: Macroable<ItemPredicate, MACRO>,
  ) => this.nestedExecute(['items', 'entity', targetParser(source), slots, `${itemPredicate}`], true)
}

export class ExecuteIfUnlessCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /**
   * Compares the block at a given position to a given block.
   *
   * @param pos Position of a target block to test.
   *
   * @param block A block to test against.
   */
  block = (pos: Macroable<Coordinates<MACRO>, MACRO>, block: Macroable<Registry['minecraft:block'], MACRO>) =>
    this.nestedExecute(['block', coordinatesParser(pos), block], true)

  /**
   * Compares the blocks in two equally sized volumes.
   * @param start Start position of the first volume.
   * @param end End position of the first volume.
   * @param destination Start position of the second volume.
   * @param scan_mode Specifies whether all blocks in the source volume should be compared, or if air blocks should be masked/ignored
   */
  blocks = (
    start: Macroable<Coordinates<MACRO>, MACRO>,
    end: Macroable<Coordinates<MACRO>, MACRO>,
    destination: Macroable<Coordinates<MACRO>, MACRO>,
    scan_mode: Macroable<'all' | 'masked', MACRO>,
  ) =>
    this.nestedExecute(
      ['blocks', coordinatesParser(start), coordinatesParser(end), coordinatesParser(destination), scan_mode],
      true,
    )

  /**
   * Checks whether one or more entities exist.
   *
   * @param targets The target entities to check.
   */
  entity = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) =>
    this.nestedExecute(['entity', targetParser(targets)], true)

  /**
   * Checks whether the `predicate` evaluates to a positive result.
   *
   * @param predicate The predicate to test.
   */
  predicate(predicate: Macroable<string | PredicateClass, MACRO>) {
    if (typeof predicate === 'string') {
      return this.nestedExecute(['predicate', predicate], true)
    }
    if (Object.hasOwn(predicate, 'toMacro')) {
      return this.nestedExecute(['predicate', predicate], true)
    }
    /* @ts-ignore */
    return this.nestedExecute(['predicate', toMinecraftResourceName(predicate.path)], true)
  }

  /**
   * Check a score against either another score or a given range.
   */
  // eslint-disable-next-line max-len
  score<T extends string>(
    firstTarget: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    firstObjective: Macroable<string | ObjectiveClass, MACRO>,
    comparison: 'matches',
    value: Macroable<Range<MACRO>, MACRO>,
  ): ExecuteCommand<MACRO>

  // eslint-disable-next-line max-len
  score<T extends string, O extends string>(
    firstTarget: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    firstObjective: Macroable<string | ObjectiveClass, MACRO>,
    comparison: Macroable<COMPARISON_OPERATORS, MACRO>,
    otherTarget: Macroable<SingleEntityArgumentOf<MACRO, O>, MACRO>,
    otherObjective: Macroable<string | ObjectiveClass, true>,
  ): ExecuteCommand<MACRO>

  score(firstScore: Score, comparison: 'matches', value: Macroable<Range<MACRO>, MACRO>): ExecuteCommand<MACRO>

  score(
    firstScore: Score,
    comparison: Macroable<COMPARISON_OPERATORS, MACRO>,
    otherScore: Macroable<Score, MACRO>,
  ): ExecuteCommand<MACRO>

  score(...args: any[]) {
    const finalArgs: string[] = []

    if (isScore(args[0])) {
      finalArgs.push(args[0].target.toString(), args[0].objective.name, args[1])
      if (isScore(args[2])) {
        finalArgs.push(args[2].target.toString(), args[2].objective.name)
      } else {
        finalArgs.push(rangeParser(this.sandstoneCore, args[2]))
      }
    } else {
      finalArgs.push(targetParser(args[0]), isObjective(args[1]) ? args[1].name : args[1], args[2])
      if (args[4]) {
        finalArgs.push(targetParser(args[3]), isObjective(args[4]) ? args[4].name : args[4])
      } else {
        finalArgs.push(rangeParser(this.sandstoneCore, args[3]))
      }
    }
    return this.nestedExecute(['score', ...finalArgs], true)
  }

  /**
   * Checks whether the current dimension matches the given one.
   * @param dimension Dimension to check against.
   */
  dimension = (dimension: Macroable<Registry['minecraft:dimension'], MACRO>) => this.nestedExecute(['dimension', dimension])

  /**
   * Checks whether the targeted block is in a chunk that is fully loaded (entity-processing chunk).
   * @param pos Position of target block to test.
   */
  loaded = (pos: Macroable<Coordinates<MACRO>, MACRO>) => this.nestedExecute(['loaded', coordinatesParser(pos)])

  /** Checks whether the data point exists or the targeted block, entity or storage has any data for a given tag. */
  get data(): ExecuteDataArgsCommand<MACRO> & ((data: DataPointClass) => ExecuteCommand<MACRO>) {
    return makeCallable(
      new ExecuteDataArgsCommand<MACRO>(this.sandstonePack, this.previousNode),
      (dataPoint: DataPointClass) => this.nestedExecute(dataPoint._toMinecraftCondition().getCondition() as ['']),
    )
  }

  /** Tests for items in block entity or entity inventory slots. */
  get items() {
    return new ExecuteItemsCommand<MACRO>(this.sandstonePack, this.previousNode)
  }

  function(func: Macroable<_RawMCFunctionClass<[], []> | (() => any) | string, MACRO>) {
    if (typeof func === 'object' && Object.hasOwn(func, 'addToTag')) {
      return this.nestedExecute(['function', toMinecraftResourceName((func as _RawMCFunctionClass<[], []>).path)])
    }
    /* @ts-ignore */
    if (typeof func === 'string' || Object.hasOwn(func, 'toMacro')) {
      return this.nestedExecute(['function', func])
    }
    const name = `${this.sandstoneCore.getCurrentMCFunctionOrThrow().resource.path.slice(2).join('/')}/execute_if_function`

    const _func = this.sandstonePack.MCFunction(name, {
      addToSandstoneCore: false,
      creator: 'sandstone',
      onConflict: 'rename',
      callback: func as () => void,
    })

    return this.nestedExecute(['function', name])
  }
}

export class ExecuteFacingEntityCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /**
   * Sets the command rotation to face a given point, as viewed from its anchor (either the eyes or the feet).
   *
   * @param targets The target(s) to rotate towards. (if you target multiple entities subcommands will run for each entity)
   *
   * @param anchor Whether to point at the target's eyes or feet.
   */
  entity = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>, anchor: Macroable<ANCHORS, MACRO> = 'feet') =>
    this.nestedExecute(['entity', targetParser(targets), anchor])
}

export class ExecutePositionedCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /**
   * Sets the command position, without changing rotation or dimension, by matching an entity's position.
   *
   * @param targets Target entity/entities to match position with.
   */
  as = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.nestedExecute(['as', targetParser(targets)])

  /**
   * Sets the command position matching the height map (highest position in a column of blocks according to criteria) for the current position.
   *
   * - `world_surface` Any non-air block.
   * - `motion_blocking` Any motion blocking material (eg. ignores flowers and grass).
   * - `motion_blocking_no_leaves` Any non-leaf motion blocking material.
   * - `ocean_floor` Any non-fluid motion blocking material.
   */
  over = (
    heightMap: Macroable<'world_surface' | 'motion_blocking' | 'motion_blocking_no_leaves' | 'ocean_floor', MACRO>,
  ) => this.nestedExecute(['over', heightMap])
}

export class ExecuteRotatedAsCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /**
   * Sets the command rotation, by matching an entity's rotation.
   *
   * @param targets Target entity/entities to match rotation with.
   */
  as = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.nestedExecute(['as', targetParser(targets)])
}

export class ExecuteCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  protected NodeType = ExecuteCommandNode

  /**
   * Align execution position to block coordinates.
   *
   * @param axes Coordinate axes to align ('x', 'y', 'z', or combinations like 'xy').
   *            Floors coordinates on specified axes.
   *
   * @example
   * ```ts
   * execute.align('xyz').run.teleport('@s', rel(0, 1, 0))  // Align to block grid
   * execute.as('@a').align('y').run.setblock(rel(0, 0, 0), 'minecraft:stone')
   * ```
   */
  align = (axes: Macroable<AXES, MACRO>) => this.nestedExecute(['align', axes])

  /**
   * Set execution anchor point.
   *
   * @param anchor Anchor position: 'eyes' or 'feet'.
   *              Changes the reference point for `^ ^ ^` coordinates.
   *
   * @example
   * ```ts
   * execute.anchored('eyes').run.particle('minecraft:heart', abs(0, 0, 0))
   * execute.as('@p').anchored('feet').run.summon('minecraft:armor_stand')
   * ```
   */
  anchored = (anchor: Macroable<ANCHORS, MACRO>) => this.nestedExecute(['anchored', anchor])

  /**
   * Change command executor.
   *
   * @param targets Entity selector to execute as.
   *               Changes @s reference without affecting position/rotation.
   *
   * @example
   * ```ts
   * execute.as('@a').run.say('Hello from everyone!')
   * execute.as('@e[type=zombie]').run.damage('@s', 10)
   * ```
   */
  as = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.nestedExecute(['as', targetParser(targets)])

  /**
   * Change execution position and rotation to match entity.
   *
   * @param targets Entity selector to copy position/rotation from.
   *               Does not change command executor (@s).
   *
   * @example
   * ```ts
   * execute.at('@p').run.summon('minecraft:lightning_bolt')
   * execute.as('@a').at('@e[type=villager,limit=1]').run.teleport('@s', rel(0, 5, 0))
   * ```
   */
  at = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.nestedExecute(['at', targetParser(targets)])

  /**
   * Sets the command rotation to face a given point, as viewed from its anchor (either the eyes or the feet).
   *
   * @param pos Coordinate to rotate towards.
   */
  facing(pos: Macroable<Coordinates<MACRO>, MACRO>): ExecuteCommand<MACRO>

  facing(pos?: Macroable<Coordinates<MACRO>, MACRO>) {
    if (pos) {
      return this.nestedExecute(['facing', coordinatesParser(pos)])
    }
    return this.subCommand([['facing']], ExecuteFacingEntityCommand<MACRO>, false)
  }

  /**
   * Sets the command dimension.
   *
   * @param dimension Name of the new execution dimension.
   */
  in = (dimension: Macroable<Registry['minecraft:dimension'], MACRO>) => this.nestedExecute(['in', dimension])

  /**
   * Sets the command executor to a related entity.
   * @param relation Relation with the current executor.
   */
  on = (relation: Macroable<RelationType, MACRO>) => this.nestedExecute(['on', relation])

  /**
   * Sets the command position, without changing rotation or dimension.
   *
   * @param pos The new position.
   */
  positioned(pos: Macroable<Coordinates<MACRO>, MACRO>): ExecuteCommand<MACRO>

  positioned(pos?: Macroable<Coordinates<MACRO>, MACRO>) {
    if (pos) {
      return this.nestedExecute(['positioned', coordinatesParser(pos)])
    }
    return this.subCommand([['positioned']], ExecutePositionedCommand<MACRO>, false)
  }

  /**
   * Sets the command rotation.
   *
   * @param rotation The desired rotation.
   *
   * First value is measured clockwise in degrees from due south (the +Z Axis), ranging [–180 to +180)
   * Second value is measured as declination from the horizon in degrees, ranging [–90 to +90] (straight up to straight down)
   *
   * Relative values can be used to specify a rotation relative to the current execution rotation.
   */
  rotated(rotation: Macroable<Rotation<MACRO>, MACRO>): ExecuteCommand<MACRO>

  rotated(rotation?: Macroable<Rotation<MACRO>, MACRO>) {
    if (rotation) {
      return this.nestedExecute(['rotated', rotationParser(rotation)])
    }
    return this.subCommand([['rotated']], ExecuteRotatedAsCommand, false)
  }

  /**
   * Summons an entity at the command position and sets the command executor to said newly summoned entity.
   * @param entityType Entity to summon.
   */
  summon(entityType: Macroable<Registry['minecraft:entity_type'], MACRO>) {
    return this.nestedExecute(['summon', entityType])
  }

  get if() {
    return this.subCommand([['if']], ExecuteIfUnlessCommand<MACRO>, false)
  }

  get unless() {
    return this.subCommand([['unless']], ExecuteIfUnlessCommand<MACRO>, false)
  }

  get store() {
    return this.subCommand([['store']], ExecuteStoreCommand<MACRO>, false)
  }

  get run() {
    const node = this.getNode()

    const commands = new Proxy(this.sandstonePack.commands as SandstoneCommands<MACRO>, {
      get: (_t, p, _r) => {
        // The context will automatically be exited by the node itself
        this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(node, false)
        return (this.sandstonePack.commands as any)[p]
      },
    })

    return makeCallable(
      commands,
      (...args: [callback: () => any] | [name: string, callback: () => any]) => {
        const callback = args.length === 1 ? args[0] : args[1]

        if (args.length === 2) {
          node.givenCallbackName = args[0]
        }

        node.isSingleExecute = false
        this.sandstoneCore.insideContext(node, callback, false)
        return new FinalCommandOutput(node)
      },
      true,
    )
  }
}
