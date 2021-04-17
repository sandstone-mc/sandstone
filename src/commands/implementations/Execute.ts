import { isAsyncFunction } from '@/utils'
import { coordinatesParser, rangeParser, rotationParser } from '@variables'

import { command } from '../decorators'

import type {
  ANCHORS, AXES, BLOCKS, COMPARISON_OPERATORS, Coordinates, DIMENSION_TYPES, MultipleEntitiesArgument, ObjectiveArgument, Rotation, SingleEntityArgument,
} from 'src/arguments'
import type * as commands from '@/commandsOnly'
import type { LiteralUnion } from '@/generalTypes'
import type { Flow } from '@flow'
import type { ConditionClass, Range } from '@variables'
import type { DataPointInstance } from '@variables/Data'
import type { Score } from '@variables/Score'
import type { CommandsRoot } from '../CommandsRoot'

const executeConfig = {
  isRoot: false,
  hasSubcommands: true,
  executable: true,
  isExecuteSubcommand: true,
}

export type StoreType = 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'

type CommandsRootLike = CommandsRoot | Flow

class CommandLike<T extends CommandsRootLike> {
  protected commandsRoot: T

  constructor(commandsRootLike: T) {
    this.commandsRoot = commandsRootLike
  }
}

class ExecuteSubcommand<T extends CommandsRootLike> extends CommandLike<T> {
  protected execute: InferExecute<T>

  constructor(execute: InferExecute<T>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    super(execute.commandsRoot)

    this.execute = execute
  }
}

function isRealCommandsRoot(commandsRootLike: CommandsRootLike): commandsRootLike is CommandsRoot {
  return Object.prototype.hasOwnProperty.call(commandsRootLike, 'register')
}

export class ExecuteStoreArgs<T extends CommandsRootLike> extends ExecuteSubcommand<T> {
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
  @command('block', { ...executeConfig, parsers: { '0': coordinatesParser } })
  block = (targetPos: Coordinates, path: string, type: StoreType, scale = 1) => this.execute

  /**
   * Saves the final command's return value in either a bossbar's current value or its maximum value.
   *
   * @param id ID of the bossbar to target for saving.
   *
   * @param type Whether to overwrite the bossbar's current value or its max value.
   */
  @command('bossbar', executeConfig)
  bossbar = (id: string, type: 'max' | 'value') => this.execute

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
  @command('entity', executeConfig)
  entity = (
    target: SingleEntityArgument, path: string, type: StoreType, scale = 1,
  ) => this.execute

  @command('score', executeConfig)
  score: (
  (
    /**
     * Overrides `targets`' score on the given `objective` with the final command's return value.
     *
     * @param targets Specifies score holder(s) whose score is to be overridden.
     *
     * @param objective A scoreboard objective.
     */
    (targets: MultipleEntitiesArgument, objective: ObjectiveArgument) => InferExecute<T>
  ) & (
    /**
     * Overrides the given player's score with the final command's return value.
     *
     * @param playerScore The player's score to override.
     */
    (playerScore: Score) => InferExecute<T>)
  ) = (...args: unknown[]) => this.execute

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
  @command('storage', executeConfig)
  storage = (target: string, path: string, type: StoreType, scale = 1) => this.execute
}

export class ExecuteStore<T extends CommandsRootLike> extends ExecuteSubcommand<T> {
  /** Store the final command's result value. */
  get result(): ExecuteStoreArgs<T> {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('store', 'result')

    if (isRealCommandsRoot(this.commandsRoot)) {
      this.commandsRoot.executable = true
      this.commandsRoot.executeState = 'inside'
    }

    return new ExecuteStoreArgs(this.execute)
  }

  /** Store the final command's success value. */
  get success() {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('store', 'success')

    if (isRealCommandsRoot(this.commandsRoot)) {
      this.commandsRoot.executable = true
      this.commandsRoot.executeState = 'inside'
    }

    return new ExecuteStoreArgs(this.execute)
  }
}

export class ExecuteIfData<T extends CommandsRootLike> extends ExecuteSubcommand<T> {
  /**
   * Checks whether the targeted block has any data for a given tag
   * @param pos Position of the block to be tested.
   * @param path Data tag to check for.
   */
  @command('block', { ...executeConfig, parsers: { '0': coordinatesParser } })
  block = (pos: Coordinates, path: string) => this.execute

  /**
   * Checks whether the targeted entity has any data for a given tag
   * @param target One single entity to be tested.
   * @param path Data tag to check for.
   */
  @command('entity', executeConfig)
  entity = (target: SingleEntityArgument, path: string) => this.execute

  /**
   * Checks whether the targeted storage has any data for a given tag
   * @param source The storage to check in.
   * @param path Data tag to check for.
   */
  @command('storage', executeConfig)
  storage = (source: string, path: string) => this.execute
}

type IfsAndUnlesses<T extends CommandsRootLike, E extends Execute<T>> = {
  ifBlock: (pos: Coordinates, block: LiteralUnion<BLOCKS>) => E

  ifBlocks: (start: Coordinates, end: Coordinates, destination: Coordinates, scanMode: 'all' | 'masked') => E

  ifData: ((data: DataPointInstance) => E) & ExecuteIfData<T>

  ifEntity: (targets: MultipleEntitiesArgument) => E

  ifPredicate: (predicate: string) => E

  ifScore: (
    /**
     * Check a score against either another score or a given range.
     *
     * @param target A single score holder.
     *
     * @param objective The scoreboard objective to check under.
     *
     * @param operator The comparison operator to use.
     *
     * @param source A second score holder to compare against.
     *
     * @param sourceObjective  A scoreboard objective to compare against.
     */
    (
      target: SingleEntityArgument,
      targetObjective: ObjectiveArgument,
      operator: COMPARISON_OPERATORS,
      source: SingleEntityArgument,
      sourceObjective: ObjectiveArgument
    ) => Execute<T>
 ) & (
    /**
     * Check a score against either another score or a given range.
     *
     * @param target A single score holder.
     *
     * @param objective The scoreboard objective to check under.
     *
     * @param operator The comparison operator to use.
     *
     * @param range Range to compare score against.
     */
    (
      target: SingleEntityArgument,
      targetObjective: ObjectiveArgument,
      operator: 'matches',
      range: Range
   ) => E
  )
}

type IfType<T extends CommandsRootLike, E extends Execute<T>> = {
  /**
   * Compares the block at a given position to a given block.
   *
   * @param pos Position of a target block to test.
   *
   * @param block A block to test against.
   */
  block: IfsAndUnlesses<T, E>['ifBlock']

  /**
   * Compares the blocks in two equally sized volumes. Suceeds if both are identical.
   *
   * @param start Positions of the first diagonal corner of the source volume (the comparand; the volume to compare).
   *
   * @param end Positions of the second diagonal corner of the source volume (the comparand; the volume to compare)
   *
   * @param destination
   * Position of the lower northwest (the smallest X, Y and Z value) corner of the destination volume
   * (the comparator; the volume to compare to). Assumed to be of the same size as the source volume.
   *
   * @param scanMode Specifies whether all blocks in the source volume should be compared, or if air blocks should be masked/ignored.
   */
  blocks: IfsAndUnlesses<T, E>['ifBlocks']

  /** Checks whether the targeted block, entity or storage has any data for a given tag. */
  data: IfsAndUnlesses<T, E>['ifData']

  /**
   * Checks whether one or more entities exist.
   *
   * @param targets The target entities to check.
   */
  entity: IfsAndUnlesses<T, E>['ifEntity']

  /**
   * Checks whether the `predicate` evaluates to a positive result.
   *
   * @param predicate The predicate to test.
   */
  predicate: IfsAndUnlesses<T, E>['ifPredicate']

  /**
   * Check a score against either another score or a given range.
   */
  score: IfsAndUnlesses<T, E>['ifScore']
}

export class Execute<T extends CommandsRootLike> extends CommandLike<T> {
  /**
   * Updates the command's position, aligning to its current block position (an integer). Only applies along specified axes.
   * This is akin to flooring the coordinates – i.e. rounding them downwards. It updates the meaning of `~ ~ ~` and `^ ^ ^`.
   *
   * @param axes Any non-repeating combination of the characters 'x', 'y', and 'z'.
   */
  @command('align', executeConfig)
  align = (axes: AXES) => this

  /**
   * Stores the distance from the feet to the eyes of the entity that is executing the command in the anchor, which is part of the command context.
   * Effectively recentres `^ ^ ^` on either the eyes or feet, also changing the angle the `facing` sub-command works off of.
   *
   * @param anchor Whether to anchor the executed command to eye level or feet level
   */
  @command('anchored', executeConfig)
  anchored = (anchor: ANCHORS) => this

  /**
   * Sets the command sender to target entity, without changing position, rotation, dimension, or anchor
   *
   * @param targets Target entity/entities to become the new sender.
   */
  @command('as', executeConfig)
  as = (targets: MultipleEntitiesArgument) => this

  /**
   * Sets the command position, rotation, and dimension to match those of an entity/entities; does not change sender
   * @param targets Target entity/entities to match position, rotation, and dimension with
   */
  @command('at', executeConfig)
  at = (targets: MultipleEntitiesArgument) => this

  /**
   * Sets the command rotation to face a given point, as viewed from its anchor (either the eyes or the feet).
   *
   * @param pos Coordinate to rotate towards.
   */
  @command('facing', { ...executeConfig, parsers: { '0': coordinatesParser } })
  facing = (pos: Coordinates) => this

  /**
   * Sets the command rotation to face a given point, as viewed from its anchor (either the eyes or the feet).
   *
   * @param targets The target(s) to rotate towards.
   *
   * @param anchor Whether to point at the target's eyes or feet.
   */
  @command(['facing', 'entity'], executeConfig)
  facingEntity = (targets: MultipleEntitiesArgument, anchor: ANCHORS) => this

  /**
   * Sets the command dimension.
   *
   * @param dimension Name of the new execution dimension.
   */
  @command('in', executeConfig)
  in = (dimension: LiteralUnion<DIMENSION_TYPES>) => this

  /**
   * Sets the command position, without changing rotation or dimension.
   *
   * @param pos The new position.
   */
  @command('positioned', { ...executeConfig, parsers: { '0': coordinatesParser } })
  positioned = (pos: Coordinates) => this

  /**
   * Sets the command position, without changing rotation or dimension, by matching an entity's position.
   *
   * @param targets Target entity/entities to match position with.
   */
  @command(['positioned', 'as'], executeConfig)
  positionedAs = (targets: MultipleEntitiesArgument) => this

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
  @command('rotated', { ...executeConfig, parsers: { '0': rotationParser } })
  rotated = (rotation: Rotation) => this

  /**
   * Sets the command rotation, by matching an entity's rotation.
   *
   * @param targets Target entity/entities to match rotation with.
   */
  @command(['rotated', 'as'], executeConfig)
  rotatedAs = (targets: MultipleEntitiesArgument) => this

  @command(['if', 'block'], { ...executeConfig, parsers: { '0': coordinatesParser } })
  private ifBlock: IfsAndUnlesses<T, this>['ifBlock'] = (...args: unknown[]) => this

  @command(['unless', 'block'], executeConfig)
  private unlessBlock: IfsAndUnlesses<T, this>['ifBlock'] = (...args: unknown[]) => this

  @command(['if', 'blocks'], { ...executeConfig, parsers: { '0': coordinatesParser, '1': coordinatesParser, '2': coordinatesParser } })
  private ifBlocks: IfsAndUnlesses<T, this>['ifBlocks'] = (...args: unknown[]) => this

  @command(['unless', 'blocks'], executeConfig)
  private unlessBlocks: IfsAndUnlesses<T, this>['ifBlocks'] = (...args: unknown[]) => this

  private ifData = (): IfsAndUnlesses<T, this>['ifData'] => {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('if', 'data')

    if (isRealCommandsRoot(this.commandsRoot)) {
      this.commandsRoot.executable = true
      this.commandsRoot.executeState = 'inside'
    }

    const result = (data: DataPointInstance) => {
      this.commandsRoot.arguments.push(data.type, data.currentTarget, data.path)
      return this
    }

    return Object.assign(result, new ExecuteIfData(this as unknown as InferExecute<T>))
  }

  private unlessData = (): IfsAndUnlesses<T, this>['ifData'] => {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('unless', 'data')

    if (isRealCommandsRoot(this.commandsRoot)) {
      this.commandsRoot.executable = true
      this.commandsRoot.executeState = 'inside'
    }

    const result = (data: DataPointInstance) => {
      this.commandsRoot.arguments.push(data.type, data.currentTarget, data.path)
      return this
    }

    return Object.assign(result, new ExecuteIfData(this as unknown as InferExecute<T>))
  }

  @command(['if', 'entity'], executeConfig)
  private ifEntity: IfsAndUnlesses<T, this>['ifEntity'] = (...args: unknown[]) => this

  @command(['unless', 'entity'], executeConfig)
  private unlessEntity: IfsAndUnlesses<T, this>['ifEntity'] = (...args: unknown[]) => this

  @command(['if', 'predicate'], executeConfig)
  private ifPredicate: IfsAndUnlesses<T, this>['ifPredicate'] = (...args: unknown[]) => this

  @command(['unless', 'predicate'], executeConfig)
  private unlessPredicate: IfsAndUnlesses<T, this>['ifPredicate'] = (...args: unknown[]) => this

  @command(['if', 'score'], {
    ...executeConfig,
    parsers: {
      '3': (arg, innerArgs) => {
        if (innerArgs[2] === 'matches') {
          return rangeParser(arg)
        }
        return arg
      },
    },
  })
  private ifScore: IfsAndUnlesses<T, this>['ifScore'] = (...args: unknown[]) => this

  @command(['unless', 'score'], {
    ...executeConfig,
    parsers: {
      '3': (arg, innerArgs) => {
        if (innerArgs[2] === 'matches') {
          return rangeParser(arg)
        }
        return arg
      },
    },
  })
  private unlessScore: IfsAndUnlesses<T, this>['ifScore'] = (...args: unknown[]) => this

  // For if & unless, we're using an intermediate command because the "real" arguments are in the `.value` property of the condition

  @command([], executeConfig)
  private if_ = (...args: string[]) => this

  /** Checks if the given condition is met. */
  get if(): ((condition: ConditionClass) => this) & IfType<T, this> {
    const result = Object.assign(
      (condition: ConditionClass) => this.if_(...condition._toMinecraftCondition().value), {
        block: this.ifBlock,
        blocks: this.ifBlocks,
        data: 0 as any, // We are going to override it just below
        entity: this.ifEntity,
        predicate: this.ifPredicate,
        score: this.ifScore,
      },
    )

    Object.defineProperty(result, 'data', {
      get: this.ifData,
    })
    return result
  }

  /** Checks if the given conditions is not met. */
  get unless(): Execute<T>['if'] {
    const func = (condition: ConditionClass) => {
      const args = condition._toMinecraftCondition().value
      if (args[0] === 'if') {
        args[0] = 'unless'
      } else {
        args[0] = 'if'
      }

      return this.if_(...args)
    }

    const result = Object.assign(func, {
      block: this.unlessBlock,
      blocks: this.unlessBlocks,
      data: 0 as any, // We are going to override it just below
      entity: this.unlessEntity,
      predicate: this.unlessPredicate,
      score: this.unlessScore,
    })

    Object.defineProperty(result, 'data', {
      get: this.unlessData,
    })

    return result
  }

  @command([], {
    isRoot: false, executable: true, hasSubcommands: false,
  })
  protected register = () => {}

  /**
   * Store the final command's result or success value somewhere.
   * It first records the location to store in, and then stores in the location after all the commands are executed.
   *
   * Note that the return values of commands must be an integer. If a decimal, it is rounded down.
   */
  store: ExecuteStore<T> = new ExecuteStore(this as unknown as InferExecute<T>)

  /**
   * Runs a single command.
   */
  get run(): (
    T extends CommandsRoot ?
      // The Pick<> ensures only commands are returned from CommandsRoot
      Pick<T, keyof typeof commands> :
      T
  ) {
    this.commandsRoot.executeState = 'after'

    return this.commandsRoot as any
  }
}

type RunCallback = (
  (<R extends Promise<void> | void>(callback: () => R) => R) &
  (<R extends Promise<void> | void>(name: string, callback: () => R) => R)
)

export class ExecuteWithRun<T extends CommandsRoot> extends Execute<T> {
  /**
   * Runs one or multiple commands.
   *
   * When giving a callback, if it only creates one command, and this command is safe to be inlined,
   * it will be inlined to avoid a useless function call.
   *
   * @example
   * // Run multiple commands
   * execute.as(`@a`).run(() => {
   *    give(`@s`, 'minecraft:diamond', 1)
   *    kill(`@s`)
   * })
   *
   * // Run a single command
   * execute.as(`@s`).run.give(`@s`, 'minecraft:diamond', 1)
   */
  get run() {
    type Callback = ((callback: () => void) => void)
    type Result = (Record<string, unknown> & Callback)

    const runMultiple: Result = ((nameOrCb: string | Callback, callbackOrUndefined?: Callback) => {
      const datapack = this.commandsRoot.Datapack

      const callback = (callbackOrUndefined ?? nameOrCb) as Callback
      const name = typeof nameOrCb === 'string' ? nameOrCb : undefined

      const fallbackName = `execute_${this.commandsRoot.arguments[1]}`
      if (isAsyncFunction(callback)) {
        const realName = name ?? fallbackName
        const mcFunction = datapack.createCallbackMCFunction(realName, callback, typeof name === 'undefined')
        mcFunction()
      } else {
        datapack.flow.flowStatement(callback as any, {
          absoluteName: name,
          callbackName: fallbackName,
          initialCondition: false,
          loopCondition: false,
        })
      }
    }) as any

    // We need to add all CommandsRoot keys to this function.
    const keys = [
      ...Object.getOwnPropertyNames(this.commandsRoot),
      ...Object.getOwnPropertyNames(Object.getPrototypeOf(this.commandsRoot)),
    ] as (keyof CommandsRoot)[]

    for (const key of keys) {
      /*
       * Filter away keys that are not commands. While that's not mandatory since TypeScript will not propose them with autocompletion,
       * it prevents overriding properties by mistake.
       *
       * However, it is MANDATORY to exclude "arguments" and "constructor", since those two properties exists on functions, and will cause a problem if kept.
       */
      if (['register', 'addAndRegister', 'arguments', 'inExecute', 'executable', 'Datapack', 'commandsRoot', 'constructor', 'reset'].includes(key)) {
        continue
      }

      runMultiple[key] = (this.commandsRoot)[key]
    }

    this.commandsRoot.executeState = 'after'
    return runMultiple as RunCallback & (T extends CommandsRoot ? Pick<T, keyof typeof commands> : T)
  }
}

type InferExecute<T extends CommandsRootLike> = T extends CommandsRoot ? ExecuteWithRun<T> : Execute<T>
