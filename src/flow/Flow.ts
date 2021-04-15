import { isAsyncFunction } from '@/utils'
import { Execute } from '@commands/implementations/Execute'
import { toMCFunctionName } from '@datapack/minecraft'
import { ConditionClass, coordinatesParser } from '@variables'
import { Score } from '@variables/Score'

import { CombinedConditions, getConditionScore } from './conditions'

import type {
  BLOCKS, Coordinates, SingleEntityArgument,
} from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'
import type { CommandsRoot } from '@commands'
import type { Datapack } from '@datapack'
import type { CommandArgs } from '@datapack/minecraft'
import type { FunctionResource } from '@datapack/resourcesTree'
import type { ConditionType } from './conditions'

const ASYNC_CALLBACK_NAME = '__await_flow'

function valueToCondition(value: unknown[]): ConditionClass {
  const condition = new ConditionClass()
  condition._toMinecraftCondition = () => ({ value })
  return condition
}

/** Call a given callback function, and inline it if possible */
function callOrInlineFunction(datapack: Datapack, callbackFunction: FunctionResource, forceInlineScore?: Score) {
  const { commandsRoot } = datapack

  if (
    callbackFunction?.isResource && (
      (
        // Either our command is 1-line-long, then it can be inlined (if it's not an execute!)
        callbackFunction.commands.length <= 1
        && callbackFunction.commands?.[0]?.[0] !== 'execute'
      ) || (
        /*
         * Either it has 2 commands, but the 2nde one is used in an if/else context,
         * and can be dropped in favor of an `execute store`
         */
        callbackFunction.commands.length === 2
        && forceInlineScore
      )
    )
  ) {
    /*
     * If our callback only has 1 command, inline this command. We CANNOT inline executes, for complicated reasons.
     * If you want to understand the reasons, see @vdvman1#9510 explanation =>
     * https://discordapp.com/channels/154777837382008833/154777837382008833/754985742706409492
     */
    datapack.resources.deleteResource(callbackFunction.path, 'functions')

    if (callbackFunction.commands.length) {
      if (callbackFunction.commands.length === 2 && forceInlineScore) {
        // If we have 2 commands, add the execute store
        if (commandsRoot.arguments.length === 0) {
          commandsRoot.arguments.push('execute')
        }

        commandsRoot.arguments.push('store', 'success', 'score', forceInlineScore)
      }

      if (commandsRoot.arguments.length > 0) {
        commandsRoot.arguments.push('run')
      }

      commandsRoot.addAndRegister(...callbackFunction.commands[0])
    } else {
      commandsRoot.arguments = []
    }
  } else {
    // Else, register the function call
    commandsRoot.functionCmd(toMCFunctionName(callbackFunction.path))
  }
}

type FlowStatementConfig = {
  callbackName: string
  absoluteName?: string
  forceInlineScore?: Score
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

  executeState: CommandsRoot['executeState']

  constructor(
    datapack: Datapack,
  ) {
    this.datapack = datapack
    this.commandsRoot = datapack.commandsRoot
    this.arguments = []
    this.executeState = 'outside'
  }

  /** CONDITIONS */

  /**
   * Compares the block at a given position to a given block. Suceeds if both are identical.
   *
   * @param pos Position of a target block to test.
   *
   * @param block A block to test against.
   */
  block = (coords: Coordinates, block: LiteralUnion<BLOCKS>): ConditionClass => (
    valueToCondition(['if', 'block', coordinatesParser(coords), block])
  )

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
  blocks = (start: Coordinates, end: Coordinates, destination: Coordinates, scanMode: 'all' | 'masked'): ConditionClass => (
    valueToCondition(['if', 'blocks', coordinatesParser(start), coordinatesParser(end), coordinatesParser(destination), scanMode])
  )

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
    block: (pos: Coordinates, path: string) => valueToCondition(['if', 'data', 'block', coordinatesParser(pos), path]),

    /**
     * Checks whether the targeted entity has any data for a given tag
     * @param target One single entity to be tested.
     * @param path Data tag to check for.
     */
    entity: (target: SingleEntityArgument, path: string) => valueToCondition(['if', 'data', 'entity', target, path]),

    /**
     * Checks whether the targeted storage has any data for a given tag
     * @param source The storage to check in.
     * @param path Data tag to check for.
     */
    storage: (source: string, path: string) => valueToCondition(['if', 'data', 'storage', source, path]),
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
    const previousExecuteState = this.commandsRoot.executeState
    this.commandsRoot.reset()

    const args = this.arguments.slice(1)

    const { currentFunction } = this.datapack

    const { fullName: asyncCallbackName } = this.datapack.getUniqueChildName(ASYNC_CALLBACK_NAME)

    // First, enter the callback
    let callbackFunctionName: string

    if (config.absoluteName) {
      callbackFunctionName = this.datapack.createEnterRootFunction(config.absoluteName, 'throw')
    } else {
      callbackFunctionName = this.datapack.createEnterChildFunction(config.callbackName)
    }

    const callbackMCFunction = this.datapack.currentFunction!

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
    this.commandsRoot.executeState = previousExecuteState

    // Register the initial condition (in the root function) to enter the callback.
    if (config.initialCondition) {
      // In while statements, if the condition isn't met the 1st time, directly call the next lines of code
      if (config.loopCondition) {
        const flow = new Flow(this.datapack)
        flow.arguments = this.arguments
        flow
          .if(config.condition, () => { callOrInlineFunction(this.datapack, callbackMCFunction) })
          .else(() => { this.commandsRoot.functionCmd(asyncCallbackName) })
      } else {
        /*
         * In if/else/else if, the respective functions have to ensure the next lines of code will be called no matter what.
         * Therefore, this function just has to register the initial condition.
         */
        registerCondition(this.commandsRoot, config.condition, args)
        this.commandsRoot.executeState = 'after'
        callOrInlineFunction(this.datapack, callbackMCFunction)
      }
    } else {
      callOrInlineFunction(this.datapack, callbackMCFunction)
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
    const previousExecuteState = this.commandsRoot.executeState
    this.commandsRoot.reset()

    const args = this.arguments.slice(1)

    const { currentFunction } = this.datapack

    // First, enter the callback
    let callbackFunctionName: string

    if (config.absoluteName) {
      callbackFunctionName = this.datapack.createEnterRootFunction(config.absoluteName, 'throw')
    } else {
      callbackFunctionName = this.datapack.createEnterChildFunction(config.callbackName)
    }

    const callbackMCFunction = this.datapack.currentFunction!

    // Add its commands
    callback()

    this.commandsRoot.register(true)

    // At the end of the callback, add the given conditions to call it again
    if (config.loopCondition) {
      // In a synchronous flow statement, we just have to recursively call the function
      registerCondition(this.commandsRoot, config.condition, args)
      this.commandsRoot.executeState = 'after'
      this.commandsRoot.functionCmd(callbackFunctionName)
    }

    // Exit the callback
    this.datapack.currentFunction = currentFunction

    // Put back the old arguments
    this.commandsRoot.arguments = previousArguments
    this.commandsRoot.executeState = previousExecuteState

    // Register the initial condition (in the root function) to enter the callback
    if (config.initialCondition) {
      registerCondition(this.commandsRoot, config.condition, args)
      this.commandsRoot.executeState = 'after'
    }
    callOrInlineFunction(this.datapack, callbackMCFunction, config.forceInlineScore)

    this.arguments = []
  }

  private if_ = <R extends void | Promise<void>>(
    condition: ConditionType,
    callback: () => R,
    callbackName: string,
    ifScore: Score,
    forceInlineScore = false,
  ): (R extends void ? ElifElseFlow<R> : ElifElseFlow<R> & PromiseLike<void>) => {
    function ensureConsistency(nextCallback: () => void) {
      if (!isAsyncFunction(callback) && isAsyncFunction(nextCallback)) {
        throw new Error('Passed an asynchronous callback in a synchronous if/else if/else. If/else if/else must be all synchronous, or all asynchronous.')
      }
      if (isAsyncFunction(callback) && !isAsyncFunction(nextCallback)) {
        throw new Error('Passed a synchronous callback in an asynchronous if/else if/else. If/else if/else must be all synchronous, or all asynchronous.')
      }
    }

    if (!isAsyncFunction(callback)) {
      // Register the current if
      this.flowStatement(callback, {
        callbackName,
        initialCondition: true,
        loopCondition: false,
        condition,
        forceInlineScore: forceInlineScore ? ifScore : undefined,
      })

      // We know the callback is synchronous. We must prevent the user to pass an asynchronous callback in else/else if.
      return {
        elseIf: (nextCondition: ConditionType, nextCallback: () => void) => {
          // Ensure the callback is synchronous.
          ensureConsistency(nextCallback)

          return this.if_(this.and(this.not(ifScore.matches([0, null])), nextCondition), () => {
            nextCallback()
            ifScore.set(1)
          }, 'else_if', ifScore, true)
        },
        else: (nextCallback: () => void) => {
          // Ensure the callback is synchronous.
          ensureConsistency(nextCallback)

          this.if_(this.not(ifScore.matches([0, null])), nextCallback, 'else', ifScore, false)
        },
      } as ElifElseFlow<void> as any
    }

    const getPreviousPromise = () => this.flowStatementAsync(callback, {
      callbackName,
      initialCondition: true,
      loopCondition: false,
      condition,
    })

    const { currentFunction: parentFunction } = this.datapack

    return {
      elseIf: (nextCondition: ConditionType, nextCallback: () => Promise<void>) => {
        // Ensure the callback is asynchronous.
        ensureConsistency(nextCallback)

        return this.if_(this.and(nextCondition, this.not(ifScore.matches([0, null]))), async () => {
          // We keep the function where the "else if" is running
          const { currentFunction: newCallback } = this.datapack

          // Go back in the parent function
          this.datapack.currentFunction = parentFunction
          // Run the previous "if/else if" code
          await getPreviousPromise()

          // Now, we're going back in the current "else if"
          this.datapack.currentFunction = newCallback

          // First, we run all synchronous code (that will end up in the .mcfunction instantly called by the "else if")
          const returnedPromise = nextCallback()

          // We notice Sandstone that the condition has successfully passed
          ifScore.set(1)

          // Then we run the asynchronous code, that will create other .mcfunction called with /schedule.
          await returnedPromise
        }, 'else_if', ifScore)
      },
      else: (nextCallback: () => Promise<void>) => {
        // Ensure the callback is asynchronous.
        ensureConsistency(nextCallback)

        /*
         * We return the "if" result, which theoritically could allow our users to
         * write `.if().else().if()`, however this is forbidden thanks to our TypeScript types.
         * We have to return the result for the `then` part.
         */
        return this.if_(this.not(ifScore.matches([0, null])), async () => {
          // We keep the function where the "else" is running
          const { currentFunction: newCallback } = this.datapack

          // Go back in the parent function
          this.datapack.currentFunction = parentFunction
          // Run the previous "if"/"else if" code
          await getPreviousPromise()

          // Now, we're going back in the current "else"
          this.datapack.currentFunction = newCallback

          // And we run the "else" code.
          await nextCallback()
        }, 'else', ifScore)
      },
      then: async (onfulfilled: () => void) => {
        // In theory, we are already in the parent function so we shouldn't need to go back in it.

        // Run the previous "if/else if/else" code
        await getPreviousPromise()

        // Go back in the parent function, because we don't know where the last "if/else if/else" code ended up.
        this.datapack.currentFunction = parentFunction

        // Finally enter the callback function
        this.datapack.createEnterChildFunction(ASYNC_CALLBACK_NAME)
        return onfulfilled?.()
      },
    } as any
  }

  if = <R extends void | Promise<void>>(condition: ConditionType, callback: () => R): (R extends void ? ElifElseFlow<R> : ElifElseFlow<R> & PromiseLike<void>) => {
    const ifScore = getConditionScore(this.commandsRoot.Datapack)

    if (!isAsyncFunction(callback)) {
      // /!\ Complicated stuff happening here.
      let callbackFunction: FunctionResource
      const { elseIf: realElseIf, else: realElse } = this.if_(condition, () => { callbackFunction = this.datapack.currentFunction!; callback() }, 'if', ifScore, false)
      const { currentFunction } = this.datapack

      // for Typescript
      if (!currentFunction?.isResource) { throw new Error('Impossible') }

      const ifCommandIndex = currentFunction.commands.length - 1

      const switchToComplicatedIf = () => {
        const command = currentFunction.commands[ifCommandIndex]

        try {
          // If this doesn't raise an error, it means the function didn't get inlined
          this.datapack.resources.getResource(callbackFunction.path, 'functions')

          // The function wasn't inlined - add the '/scoreboard players set' at the end of the function
          if (!callbackFunction?.isResource) { throw new Error('Impossible') }
          callbackFunction.commands.push(['scoreboard', 'players', 'set', ifScore, 1])
        } catch (e) {
          // The function was inlined - add the 'store success' part to the execute
          currentFunction.commands[ifCommandIndex] = ['execute', 'store', 'success', 'score', ifScore, ...command.slice(1)]
        }

        // Add the reset
        currentFunction.commands = [
          ...currentFunction.commands.slice(0, ifCommandIndex),
          ['scoreboard', 'players', 'reset', ifScore],
          ...currentFunction.commands.slice(ifCommandIndex),
        ]
      }

      return {
        elseIf: (...args: Parameters<typeof realElseIf>) => {
          switchToComplicatedIf()
          return realElseIf(...args)
        },
        else: (cb: Parameters<typeof realElse>['0']) => {
          switchToComplicatedIf()
          return realElse(cb)
        },
      } as ElifElseFlow<void> as any
    }

    // First, specify the `if` didn't pass yet (it's in order to chain elif/else)
    ifScore.reset()

    // Async function
    return this.if_(condition, async () => {
      const returnedPromise = callback()
      ifScore.set(1)
      await returnedPromise
    }, 'if', ifScore) as any
  }

  binaryMatch = (score: Score, minimum: number, maximum: number, callback: (num: number) => void) => {
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

      this.if(score.lessThan(mean), () => recursiveMatch(min, mean))
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

    const { currentFunction: parentFunction } = this.datapack

    return {
      then: async (onfulfilled: () => void) => {
        // In theory, we are already in the parent function so we shouldn't need to go back in it.

        // Run the previous code
        await this.flowStatementAsync(callback, {
          callbackName: type,
          initialCondition: type === 'while',
          loopCondition: true,
          condition,
        })

        // Go back in the parent function, because we don't know where the last code ended up.
        this.datapack.currentFunction = parentFunction

        // Finally enter the callback function
        this.datapack.createEnterChildFunction(ASYNC_CALLBACK_NAME)
        return onfulfilled?.()
      },
    } as PromiseLike<void> as any
  }

  while = <R extends void | Promise<void>>(condition: ConditionClass | CombinedConditions, callback: () => R): R => this._while(condition, callback, 'while')

  doWhile = <R extends void | Promise<void>>(condition: ConditionClass | CombinedConditions, callback: () => R): R => this._while(condition, callback, 'do_while')

  binaryFor = (from: Score | number, to: Score |number, callback: (amount: number) => void, maximum = 128) => {
    if (typeof from === 'number' && typeof to === 'number') {
      callback(to - from)
    }

    const realStart = from instanceof Score ? from : this.datapack.Variable(from)
    const realEnd = to instanceof Score ? to : this.datapack.Variable(to)

    const iterations = realEnd.minus(realStart)

    const _ = this

    /*
     * For all iterations above the maximum,
     * just do a while loop that calls `maximum` times the callback,
     * until there is less than `maximum` iterations
     */
    _.while(iterations.lessThan(maximum), () => {
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

  forRange = <R extends void | Promise<void>>(from: Score | number, to: Score | number, callback: (score: Score) => R) => {
    const scoreTracker = from instanceof Score ? from : this.datapack.Variable(from)

    // Small optimization: if we know the loop will run at least once, use a do while
    let loop = this.while
    if (typeof from === 'number' && typeof to === 'number' && to > from) {
      loop = this.doWhile
    }

    if (!isAsyncFunction(callback)) {
      return loop(scoreTracker.lessThan(to), () => {
        callback(scoreTracker)
        scoreTracker.add(1)
      })
    }

    return loop(scoreTracker.lessThan(to), async () => {
      await callback(scoreTracker)
      scoreTracker.add(1)
    })
  }

  forScore = <R extends void | Promise<void>>(
    score: Score | number,
    // eslint-disable-next-line no-shadow
    condition: ((score: Score) => ConditionType) | ConditionType,
    // eslint-disable-next-line no-shadow
    modifier: (score: Score) => void,
    // eslint-disable-next-line no-shadow
    callback: (score: Score) => R,
  ): R => {
    const realScore = score instanceof Score ? score : this.datapack.Variable(score)
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
    throw new Error('Not supposed to happen!')
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
