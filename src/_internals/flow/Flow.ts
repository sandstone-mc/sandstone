import type { LiteralUnion } from '@/generalTypes'
import type {
  BLOCKS, Coordinates, SingleEntityArgument,
} from '@arguments'
import type { CommandsRoot } from '@commands'
import { Execute } from '@commands/implementations/Execute'
import type { Datapack } from '@datapack'
import type { CommandArgs } from '@datapack/minecraft'
import { toMcFunctionName } from '@datapack/minecraft'
import type { FunctionResource } from '@datapack/resourcesTree'
import type { ConditionClass } from '@variables'
import { coordinatesParser } from '@variables'
import { PlayerScore } from '@variables/PlayerScore'
import util from 'util'
import type { ConditionType } from './conditions'
import { getConditionScore, CombinedConditions } from './conditions'

const ASYNC_CALLBACK_NAME = '__await_flow'

function isAsyncFunction(func: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>)): func is (...args: any[]) => Promise<void> {
  return util.types.isAsyncFunction(func)
}

/** Call a given callback function, and inline it if possible */
function callOrInlineFunction(datapack: Datapack, callbackFunction: FunctionResource) {
  const { commandsRoot } = datapack

  if (
    callbackFunction?.isResource
        && callbackFunction.commands.length <= 1
        && callbackFunction.commands?.[0]?.[0] !== 'execute'
  ) {
    /*
     * If our callback only has 1 command, inline this command. We CANNOT inline executes, for complicated reasons.
     * If you want to understand the reasons, see @vdvman1#9510 explanation =>
     * https://discordapp.com/channels/154777837382008833/154777837382008833/754985742706409492
     */
    datapack.resources.deleteResource(callbackFunction.path, 'functions')

    if (callbackFunction.commands.length) {
      if (commandsRoot.arguments.length > 0) {
        commandsRoot.arguments.push('run')
      }

      commandsRoot.addAndRegister(...callbackFunction.commands[0])
    } else {
      commandsRoot.arguments = []
    }
  } else {
    // Else, register the function call
    commandsRoot.functionCmd(toMcFunctionName(callbackFunction.path))
  }
}

type FlowStatementConfig = {
  callbackName: string
} & (
  {
    initialCondition: false,
    loopCondition: false,
    condition?: undefined
  } | {
    initialCondition: boolean,
    loopCondition: boolean,
    condition: ConditionType
  }
)

export class Flow {
  private commandsRoot

  private datapack

  arguments: CommandArgs

  constructor(
    datapack: Datapack,
  ) {
    this.datapack = datapack
    this.commandsRoot = datapack.commandsRoot
    this.arguments = []
  }

  /** CONDITIONS */

  /**
   * Compares the block at a given position to a given block. Suceeds if both are identical.
   *
   * @param pos Position of a target block to test.
   *
   * @param block A block to test against.
   */
  block = (coords: Coordinates, block: LiteralUnion<BLOCKS>): ConditionClass => ({
    _toMinecraftCondition: () => ({ value: ['if', 'block', coordinatesParser(coords), block] }),
  })

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
  blocks = (start: Coordinates, end: Coordinates, destination: Coordinates, scanMode: 'all' | 'masked'): ConditionClass => ({
    _toMinecraftCondition: () => ({ value: ['if', 'blocks', coordinatesParser(start), coordinatesParser(end), coordinatesParser(destination), scanMode] }),
  })

  /**
   * Checks if the given target has any data for a given tag.
   *
   * @example
   * // Check whether the current block has an Inventory
   * _.if(_.data.block(rel(0, 0, 0), 'Inventory'), () => {
   *   say('The current block has data in its Inventory tag.')
   * })
   *
   * // Check whether the player has at least one slot with dirt
   * _.if(_.data.entity(`@r`, 'Inventory[{id: "minecraft:dirt"}]'), () => {
   *   say('The random player has dirt.')
   * })
   *
   * // Check whether there is data in the "Test" tag of the storage
   * _.if(_.data.storage('namespace:mystorage', 'Test'), () => {
   *   say('There is data in the "Test" tag of mystorage.')
   * })
   */
  data = {
    /**
     * Checks whether the targeted block has any data for a given tag.
     * @param pos Position of the block to be tested.
     * @param path Data tag to check for.
     */
    block: (pos: Coordinates, path: string) => ({ value: ['if', 'data', 'block', coordinatesParser(pos), path] }),

    /**
     * Checks whether the targeted entity has any data for a given tag
     * @param target One single entity to be tested.
     * @param path Data tag to check for.
     */
    entity: (target: SingleEntityArgument, path: string) => ({ value: ['if', 'data', 'entity', target, path] }),

    /**
     * Checks whether the targeted storage has any data for a given tag
     * @param source The storage to check in.
     * @param path Data tag to check for.
     */
    storage: (source: string, path: string) => ({ value: ['if', 'data', 'storage', source, path] }),
  }

  /** Logical operators */

  /**
   * Check if multiple conditions are true at the same time.
   * @param conditions The conditions to check.
   */
  and = (...conditions: (ConditionType)[]) => new CombinedConditions(this.commandsRoot, conditions, 'and')

  /**
   * Check if at least one of the given conditions is true.
   * @param conditions The conditions to check.
   */
  or = (...conditions: (ConditionType)[]) => new CombinedConditions(this.commandsRoot, conditions, 'or')

  /**
   * Check if the given condition is not true.
   * @param condition The condition to check.
   */
  not = (condition: ConditionType) => new CombinedConditions(this.commandsRoot, [condition], 'not')

  /** Flow statements */
  flowStatementAsync = async (callback: () => Promise<void>, config: FlowStatementConfig) => {
    /*
     * Sometimes, there are a few arguments left inside the commandsRoot (for execute.run mostly).
     * Keep them aside, & register them after.
     */
    const previousArguments = this.commandsRoot.arguments
    const previousInExecute = this.commandsRoot.inExecute
    this.commandsRoot.reset()

    const args = this.arguments.slice(1)

    const { currentFunction } = this.datapack

    const { fullName: asyncCallbackName } = this.datapack.getUniqueChildName(ASYNC_CALLBACK_NAME)

    // First, enter the callback
    const callbackFunctionName = this.datapack.createEnterChildFunction(config.callbackName)
    const callbackMcFunction = this.datapack.currentFunction!

    await callback()

    this.commandsRoot.register(true)

    // Add its commands
    if (config.initialCondition && !config.loopCondition) {
      // If we're in a if/else if/else, call the next lines at the end of each branch
      this.commandsRoot.functionCmd(asyncCallbackName)
    }

    // At the end of the callback, add the given conditions to call it again
    if (config.loopCondition) {
      /*
       * In an asynchronous flow statement, we need to recursively call the function if the condition is met, else we need to enter a new child function.
       * We create a new Flow object to prevent interfering with the current flow object, which might cause problems.
       */
      const flow = new Flow(this.datapack)
      flow.arguments = this.arguments
      flow
        .if(config.condition, () => {
          this.commandsRoot.functionCmd(callbackFunctionName)
        })
        .else(() => {
          this.commandsRoot.functionCmd(asyncCallbackName)
        })
    }

    // Exit the callback
    this.datapack.currentFunction = currentFunction

    // Put back the old arguments
    this.commandsRoot.arguments = previousArguments
    this.commandsRoot.inExecute = previousInExecute

    // Register the initial condition (in the root function) to enter the callback.
    if (config.initialCondition) {
      // In while statements, if the condition isn't met the 1st time, directly call the next lines of code
      if (config.loopCondition) {
        const flow = new Flow(this.datapack)
        flow.arguments = this.arguments
        flow
          .if(config.condition, () => { callOrInlineFunction(this.datapack, callbackMcFunction) })
          .else(() => { this.commandsRoot.functionCmd(asyncCallbackName) })
      } else {
        /*
         * In if/else/else if, the respective functions have to ensure the next lines of code will be called no matter what.
         * Therefore, this function just has to register the initial condition.
         */
        registerCondition(this.commandsRoot, config.condition, args)
        this.commandsRoot.inExecute = true
        callOrInlineFunction(this.datapack, callbackMcFunction)
      }
    } else {
      callOrInlineFunction(this.datapack, callbackMcFunction)
    }

    // Reset the _.execute.as().at()... arguments.
    this.arguments = []
  }

  flowStatement = (callback: () => void, config: FlowStatementConfig) => {
    /*
     * Sometimes, there are a few arguments left inside the commandsRoot (for execute.run mostly).
     * Keep them aside, & register them after.
     */
    const previousArguments = this.commandsRoot.arguments
    const previousInExecute = this.commandsRoot.inExecute
    this.commandsRoot.reset()

    const args = this.arguments.slice(1)

    const { currentFunction } = this.datapack

    // First, enter the callback
    const callbackFunctionName = this.datapack.createEnterChildFunction(config.callbackName)
    const callbackMcFunction = this.datapack.currentFunction!

    // Add its commands
    callback()

    this.commandsRoot.register(true)

    // At the end of the callback, add the given conditions to call it again
    if (config.loopCondition) {
      // In a synchronous flow statement, we just have to recursively call the function
      registerCondition(this.commandsRoot, config.condition, args)
      this.commandsRoot.inExecute = true
      this.commandsRoot.functionCmd(callbackFunctionName)
    }

    // Exit the callback
    this.datapack.currentFunction = currentFunction

    // Put back the old arguments
    this.commandsRoot.arguments = previousArguments
    this.commandsRoot.inExecute = previousInExecute

    // Register the initial condition (in the root function) to enter the callback
    if (config.initialCondition) {
      registerCondition(this.commandsRoot, config.condition, args)
      this.commandsRoot.inExecute = true
    }
    callOrInlineFunction(this.datapack, callbackMcFunction)

    this.arguments = []
  }

  private if_ = <R extends void | Promise<void>>(
    condition: ConditionType,
    callback: () => R,
    callbackName: string,
    ifScore: PlayerScore,
  ): (R extends void ? ElifElseFlow<R> : ElifElseFlow<R> & PromiseLike<void>) => {
    if (!isAsyncFunction(callback)) {
      this.flowStatement(callback, {
        callbackName,
        initialCondition: true,
        loopCondition: false,
        condition,
      })

      return {
        elseIf: (condition_: ConditionType, callback_: () => void) => this.if_(this.and(ifScore.equalTo(0), condition_), () => {
          callback_()
          ifScore.set(1)
        }, 'else_if', ifScore),
        else: (callback_: () => void) => this.if_(ifScore.equalTo(0), callback_, 'else', ifScore),
      } as any
    }

    const { currentFunction: initialFunction } = this.datapack

    const promise = this.flowStatementAsync(callback, {
      callbackName,
      initialCondition: true,
      loopCondition: false,
      condition,
    })

    const { currentFunction: callbackFunction } = this.datapack

    this.datapack.currentFunction = initialFunction
    return {
      elseIf: (condition_: ConditionType, callback_: () => Promise<void>) => this.if_(this.and(condition_, ifScore.equalTo(0)), async () => {
        // We keep the function where the "else if" is running
        const { currentFunction: newCallback } = this.datapack

        // Go back in the previous "if"/"else if"
        this.datapack.currentFunction = callbackFunction
        // Run its code
        await promise

        // Now, we're going back in the current "else if"
        this.datapack.currentFunction = newCallback

        // First, we run all synchronous code (that will end up in the .mcfunction instantly called by the "else if")
        const returnedPromise = callback_()

        // We notice Sandstone that the condition has successfully passed
        ifScore.set(1)

        // Then we run the asynchronous code, that will create other .mcfunction called with /schedule.
        await returnedPromise
      }, 'else_if', ifScore),
      else: (callback_: () => Promise<void>) => this.if_(ifScore.equalTo(0), async () => {
        // We keep the function where the "else" is running
        const { currentFunction: newCallback } = this.datapack

        // Go back in the previous "if"/"else if"
        this.datapack.currentFunction = callbackFunction
        // Run its code
        await promise

        // Now, we're going back in the current "else"
        this.datapack.currentFunction = newCallback

        // And we run the "else" code.
        await callback_()
      }, 'else', ifScore),
      then: async (onfulfilled: () => void) => {
        // Go back in the previous "if"/"else if"/"else"
        this.datapack.currentFunction = callbackFunction

        await promise
        this.datapack.createEnterChildFunction(ASYNC_CALLBACK_NAME)
        onfulfilled?.()
      },
    } as any
  }

  if = <R extends void | Promise<void>>(condition: ConditionType, callback: () => R): (R extends void ? ElifElseFlow<R> : ElifElseFlow<R> & PromiseLike<void>) => {
    const ifScore = getConditionScore(this.commandsRoot.Datapack)

    // First, specify the `if` didn't pass yet (it's in order to chain elif/else)
    ifScore.set(0)

    if (!isAsyncFunction(callback)) {
      return this.if_(condition, () => {
        callback()
        ifScore.set(1)
      }, 'if', ifScore) as any
    }
    // Async function
    return this.if_(condition, async () => {
      const returnedPromise = callback()
      ifScore.set(1)
      await returnedPromise
    }, 'if', ifScore) as any
  }

  binaryMatch = (score: PlayerScore, minimum: number, maximum: number, callback: (num: number) => void) => {
    // First, specify we didn't find a match yet
    const foundMatch = this.datapack.Variable(0)

    const callCallback = (num: number) => {
      this.if(this.and(score.equalTo(num), foundMatch.equalTo(0)), () => {
        // If we found the correct score, call the callback & specify we found a match
        callback(num)
        foundMatch.set(1)
      })
    }

    // Recursively match the score
    const recursiveMatch = (min: number, max: number) => {
      const diff = max - min

      if (diff < 0) {
        return
      }

      if (diff === 3) {
        callCallback(min)
        callCallback(min + 1)
        callCallback(min + 2)
        return
      }
      if (diff === 2) {
        callCallback(min)
        callCallback(min + 1)
        return
      }
      if (diff === 1) {
        callCallback(min)
        return
      }

      const mean = Math.floor((min + max) / 2)

      this.if(score.lowerThan(mean), () => recursiveMatch(min, mean))
      this.if(score.greaterOrEqualThan(mean), () => recursiveMatch(mean, max))
    }

    recursiveMatch(minimum, maximum)
  }

  private _while = <R extends void | Promise<void>>(condition: ConditionClass | CombinedConditions, callback: () => R, type: 'while' | 'do_while'): R => {
    if (!isAsyncFunction(callback)) {
      this.flowStatement(callback, {
        callbackName: type,
        initialCondition: type === 'while',
        loopCondition: true,
        condition,
      })

      return undefined as any
    }

    const promise = this.flowStatementAsync(callback, {
      callbackName: type,
      initialCondition: type === 'while',
      loopCondition: true,
      condition,
    })

    return {
      then: (onfulfilled: () => void) => {
        promise.then(() => {
          this.datapack.createEnterChildFunction(ASYNC_CALLBACK_NAME)
          onfulfilled?.()
        })
      },
    } as any
  }

  while = <R extends void | Promise<void>>(condition: ConditionClass | CombinedConditions, callback: () => R): R => this._while(condition, callback, 'while')

  doWhile = <R extends void | Promise<void>>(condition: ConditionClass | CombinedConditions, callback: () => R): R => this._while(condition, callback, 'do_while')

  binaryFor = (from: PlayerScore | number, to: PlayerScore |number, callback: (amount: number) => void, maximum = 128) => {
    if (typeof from === 'number' && typeof to === 'number') {
      callback(to - from)
    }

    const realStart = from instanceof PlayerScore ? from : this.datapack.Variable(from)
    const realEnd = to instanceof PlayerScore ? to : this.datapack.Variable(to)

    const iterations = realEnd.minus(realStart)

    const _ = this

    /*
     * For all iterations above the maximum,
     * just do a while loop that calls `maximum` times the callback,
     * until there is less than `maximum` iterations
     */
    _.while(iterations.lowerThan(maximum), () => {
      callback(maximum)
      iterations.remove(maximum)
    })

    /*
     * There is now less iterations than the allowed MAXIMUM
     * Start the binary part
     */
    for (let i = 1; i < maximum; i *= 2) {
      _.if(iterations.moduloBy(2).equalTo(1), () => {
        callback(i)
      })

      iterations.dividedBy(2)
    }
  }

  forRange = <R extends void | Promise<void>>(from: PlayerScore | number, to: PlayerScore | number, callback: (score: PlayerScore) => R) => {
    const scoreTracker = from instanceof PlayerScore ? from : this.datapack.Variable(from)

    // Small optimization: if we know the loop will run at least once, use a do while
    let loop = this.while
    if (typeof from === 'number' && typeof to === 'number' && to > from) {
      loop = this.doWhile
    }

    if (!isAsyncFunction(callback)) {
      return loop(scoreTracker.lowerThan(to as any), () => {
        callback(scoreTracker)
        scoreTracker.add(1)
      })
    }

    return loop(scoreTracker.lowerThan(to as any), async () => {
      await callback(scoreTracker)
      scoreTracker.add(1)
    })
  }

  forScore = <R extends void | Promise<void>>(
    score: PlayerScore | number,
    // eslint-disable-next-line no-shadow
    condition: ((score: PlayerScore) => ConditionType) | ConditionType,
    // eslint-disable-next-line no-shadow
    modifier: (score: PlayerScore) => void,
    // eslint-disable-next-line no-shadow
    callback: (score: PlayerScore) => R,
  ): R => {
    const realScore = score instanceof PlayerScore ? score : this.datapack.Variable(score)
    const realCondition = typeof condition === 'function' ? condition(realScore) : condition

    if (!isAsyncFunction(callback)) {
      return this.while(realCondition, () => {
        callback(realScore)
        modifier(realScore)
      }) as any
    }

    return this.while(realCondition, async () => {
      await callback(realScore)
      modifier(realScore)
    }) as any
  }

  private register = (soft?: boolean) => {
    this.commandsRoot.register(soft)
  }

  get execute(): Omit<Execute<Flow>, 'run' | 'runOne'> {
    return new Execute(this)
  }
}

function registerCondition(commandsRoot: CommandsRoot, condition: ConditionType, args: unknown[] = []) {
  let commands: string[][]

  if (condition instanceof CombinedConditions) {
    const realCondition = condition.removeOr().simplify()

    if (realCondition instanceof CombinedConditions) {
      const { callableExpression, requiredExpressions } = realCondition.toExecutes()
      commands = [...requiredExpressions, callableExpression]
    } else {
      commands = [['execute', ...args, ...realCondition._toMinecraftCondition().value]]
    }
  } else {
    commands = [['execute', ...args, ...condition._toMinecraftCondition().value]]
  }

  // Add & register all required commands
  for (const command of commands.slice(0, -1)) {
    commandsRoot.addAndRegister(...command)
  }

  // Add the callable command, WITHOUT REGISTERING IT. It must be appended with the command to run.
  const callableCommand = commands[commands.length - 1]
  commandsRoot.arguments.push(...callableCommand)
}

export type PublicFlow = Omit<Flow, 'arguments' | 'flowStatement' | 'elseIf' | 'else'>

type ElifElseFlow<R extends void | Promise<void>> = {
  elseIf: (condition: ConditionType, callback: () => R) => (R extends void ? ElifElseFlow<R> : ElifElseFlow<R> & PromiseLike<void>)
  else: (callback: () => R) => void
}
