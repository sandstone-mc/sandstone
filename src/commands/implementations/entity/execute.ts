import {
  type Macroable, type MacroArgument, type MCFunctionNode, type PredicateClass,
  isMacroArgument,
} from 'sandstone/core'
import { ContainerCommandNode } from 'sandstone/core/nodes'
import { makeCallable, toMinecraftResourceName } from 'sandstone/utils'
import {
  coordinatesParser, rangeParser, rotationParser,
  targetParser,
} from 'sandstone/variables/parsers'

import { CommandArguments, FinalCommandOutput } from '../../helpers.js'
import { FunctionCommandNode } from '../server/function.js'

import type {
  ANCHORS,
  AXES,
  BLOCKS,
  COMPARISON_OPERATORS,
  Coordinates, DIMENSIONS, ENTITY_TYPES, MultipleEntitiesArgument, ObjectiveArgument, Range, Rotation, SingleEntityArgument,
} from 'sandstone/arguments'
import type { SandstoneCommands } from 'sandstone/commands'
import type { Node } from 'sandstone/core/nodes'
import type {
  _RawMCFunctionClass,
} from 'sandstone/core/resources/datapack/mcfunction'
import type { SandstonePack } from 'sandstone/pack'
import type { LiteralUnion } from 'sandstone/utils'
import type { DataPointClass } from 'sandstone/variables/Data'
import type { ObjectiveClass } from 'sandstone/variables/Objective.js'
import type { Score } from 'sandstone/variables/Score.js'

// Execute command
export type SubCommand = [subcommand: string, ...args: unknown[]]

// Yes these suck

const isObjective = (arg: any): arg is ObjectiveClass => typeof arg === 'object' && Object.hasOwn(arg, 'reset')

const isScore = (arg: any): arg is Score => typeof arg === 'object' && Object.hasOwn(arg, 'setDisplay')

class ExecuteCommandPart<MACRO extends boolean> extends CommandArguments<typeof ExecuteCommandNode> {
  protected nestedExecute = (args: SubCommand, executable = true) => this.subCommand([args], ExecuteCommand<MACRO>, executable)
}

export type StoreType = 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'
export type RelationType = 'attacker' | 'controller' | 'leasher' | 'origin' | 'owner' | 'passengers' | 'target' | 'vehicle'

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

  constructor(sandstonePack: SandstonePack, args: SubCommand[] = [], {
    isFake = false,
    isSingleExecute = true,
    givenCallbackName = undefined as (string | undefined),
    body = [] as Node[],
  } = {}) {
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

    const namespace = currentMCFunction.resource.name.includes(':') ? `${currentMCFunction.resource.name.split(':')[0]}:` : ''

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = this.sandstonePack.MCFunction(`${namespace}${currentMCFunction.resource.path.slice(2).join('/')}/${this.callbackName}`, {
      creator: 'sandstone',
      onConflict: 'rename',
    })
    const mcFunctionNode = mcFunction['node']
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
  bossbar = (id: Macroable<string, MACRO>, type: Macroable<'max' | 'value', MACRO>) => this.nestedExecute(['bossbar', id, type])

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
  entity = (
    target: Macroable<SingleEntityArgument<MACRO>, MACRO>,
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
  score(...args: [targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>, objective: Macroable<ObjectiveArgument, MACRO>] | [playerScore: Macroable<Score, MACRO>]) {
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
  block = (pos: Macroable<Coordinates<MACRO>, MACRO>, path: Macroable<string, MACRO>) => this.nestedExecute(['block', coordinatesParser(pos), path], true)

  /**
   * Checks whether the targeted entity has any data for a given tag
   * @param target One single entity to be tested.
   * @param path Data tag to check for.
   */
  entity = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, path: Macroable<string, MACRO>) => this.nestedExecute(['entity', targetParser(target), path], true)

  /**
   * Checks whether the targeted storage has any data for a given tag
   * @param source The storage to check in.
   * @param path Data tag to check for.
   */
  storage = (source: Macroable<string, MACRO>, path: Macroable<string, MACRO>) => this.nestedExecute(['storage', source, path], true)
}

export class ExecuteIfUnlessCommand<MACRO extends boolean> extends ExecuteCommandPart<MACRO> {
  /**
   * Compares the block at a given position to a given block.
   *
   * @param pos Position of a target block to test.
   *
   * @param block A block to test against.
   */
  block = (pos: Macroable<Coordinates<MACRO>, MACRO>, block: Macroable<LiteralUnion<BLOCKS>, MACRO>) => this.nestedExecute(['block', coordinatesParser(pos), block], true)

  /**
   * Checks whether one or more entities exist.
   *
   * @param targets The target entities to check.
   */
  entity = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.nestedExecute(['entity', targetParser(targets)], true)

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
  score(firstTarget: Macroable<SingleEntityArgument<MACRO>, MACRO>, firstObjective: Macroable<string | ObjectiveClass, MACRO>, comparison: 'matches', value: Macroable<Range<MACRO>, MACRO>): ExecuteCommand<MACRO>

  // eslint-disable-next-line max-len
  score(firstTarget: Macroable<SingleEntityArgument<MACRO>, MACRO>, firstObjective: Macroable<string | ObjectiveClass, MACRO>, comparison: Macroable<COMPARISON_OPERATORS, MACRO>, otherTarget: Macroable<SingleEntityArgument<MACRO>, MACRO>, otherObjective: Macroable<string | ObjectiveClass, true>): ExecuteCommand<MACRO>

  score(firstScore: Score, comparison: 'matches', value: Macroable<Range<MACRO>, MACRO>): ExecuteCommand<MACRO>

  score(firstScore: Score, comparison: Macroable<COMPARISON_OPERATORS, MACRO>, otherScore: Macroable<Score, MACRO>): ExecuteCommand<MACRO>

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
  dimension = (dimension: Macroable<LiteralUnion<DIMENSIONS>, MACRO>) => this.nestedExecute(['dimension', dimension])

  /**
   * Checks whether the targeted block is in a chunk that is fully loaded (entity-processing chunk).
   * @param pos Position of target block to test.
   */
  loaded = (pos: Macroable<Coordinates<MACRO>, MACRO>) => this.nestedExecute(['loaded', coordinatesParser(pos)])

  /** Checks whether the data point exists or the targeted block, entity or storage has any data for a given tag. */
  data(dataPoint: DataPointClass): void

  data(): ExecuteDataArgsCommand<MACRO>

  data(dataPoint?: DataPointClass) {
    if (dataPoint) {
      return this.nestedExecute(dataPoint._toMinecraftCondition().getCondition() as [''])
    }
    return this.subCommand([['data']], ExecuteDataArgsCommand<MACRO>, false)
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
  entity = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>, anchor: Macroable<ANCHORS, MACRO> = 'feet') => this.nestedExecute(['entity', targetParser(targets), anchor])
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
  over = (heightMap: Macroable<'world_surface' | 'motion_blocking' | 'motion_blocking_no_leaves' | 'ocean_floor', MACRO>) => this.nestedExecute(['over', heightMap])
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
   * Updates the command's position, aligning to its current block position (an integer). Only applies along specified axes.
   * This is akin to flooring the coordinates – i.e. rounding them downwards. It updates the meaning of `~ ~ ~` and `^ ^ ^`.
   *
   * @param axes Any non-repeating combination of the characters 'x', 'y', and 'z'.
   */
  align = (axes: Macroable<AXES, MACRO>) => this.nestedExecute(['align', axes])

  /**
   * Stores the distance from the feet to the eyes of the entity that is executing the command in the anchor, which is part of the command context.
   * Effectively re-centers `^ ^ ^` on either the eyes or feet, also changing the angle the `facing` sub-command works off of.
   *
   * @param anchor Whether to anchor the executed command to eye level or feet level
   */
  anchored = (anchor: Macroable<ANCHORS, MACRO>) => this.nestedExecute(['anchored', anchor])

  /**
   * Sets the command sender to target entity, without changing position, rotation, dimension, or anchor
   *
   * @param targets Target entity/entities to become the new sender.
   */
  as = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.nestedExecute(['as', targetParser(targets)])

  /**
   * Sets the command position, rotation, and dimension to match those of an entity/entities; does not change sender
   * @param targets Target entity/entities to match position, rotation, and dimension with
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
  in = (dimension: Macroable<LiteralUnion<DIMENSIONS>, MACRO>) => this.nestedExecute(['in', dimension])

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
  summon(entityType: Macroable<LiteralUnion<ENTITY_TYPES>, MACRO>) {
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
      get: (target, p, receiver) => {
        // The context will automatically be exited by the node itself
        this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(node, false)
        return (this.sandstonePack.commands as any)[p]
      },
    })

    return makeCallable(commands, (callback: () => any) => {
      node.isSingleExecute = false
      this.sandstoneCore.insideContext(node, callback, false)
      return new FinalCommandOutput(node)
    }, true)
  }
}
