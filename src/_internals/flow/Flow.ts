import type { LiteralUnion } from '@/generalTypes'
import {
  BLOCKS, Coordinates, coordinatesParser,
} from '@arguments'
import type { CommandsRoot } from '@commands'
import { Execute } from '@commands/implementations/Execute'
import type { CommandArgs } from '@datapack/minecraft'
import { ConditionClass } from '@variables'
import { PlayerScore } from '@variables/PlayerScore'
import { CombinedConditions, ConditionType } from './conditions'

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

  arguments: CommandArgs

  constructor(
    commandsRoot: CommandsRoot,
  ) {
    this.commandsRoot = commandsRoot
    this.arguments = []
  }

  block = (coords: Coordinates, block: LiteralUnion<BLOCKS>): ConditionClass => ({
    _toMinecraftCondition: () => ({ value: ['block', coordinatesParser(coords), block] }),
  })

  /** Logical operators */

  and = (...conditions: (ConditionType)[]) => new CombinedConditions(this.commandsRoot, conditions, 'and')

  or = (...conditions: (ConditionType)[]) => new CombinedConditions(this.commandsRoot, conditions, 'or')

  not = (...conditions: (ConditionType)[]) => new CombinedConditions(this.commandsRoot, conditions, 'not')

  /** Flow statements */
  flowStatement = (callback: () => void, config: FlowStatementConfig) => {
    const args = this.arguments.slice(1)

    // First, enter the callback
    const callbackFunctionName = this.commandsRoot.Datapack.createEnterChildFunction(config.callbackName)
    const callbackMcFunction = this.commandsRoot.Datapack.currentFunction

    // Add its commands
    callback()
    this.commandsRoot.register(true)

    // At the end of the callback, add the given conditions to call it again
    if (config.loopCondition) {
      registerCondition(this.commandsRoot, config.condition, args)
      this.commandsRoot.addAndRegister('function', callbackFunctionName)
    }

    // Exit the callback
    this.commandsRoot.Datapack.exitChildFunction()

    // Register the initial condition (in the root function) to enter the callback
    if (config.initialCondition) {
      registerCondition(this.commandsRoot, config.condition, args)
      this.commandsRoot.inExecute = true
    }

    if (
      callbackMcFunction?.isResource
      && callbackMcFunction.commands.length === 1
      && callbackMcFunction.commands[0][0] !== 'execute'
    ) {
      // If our callback only has 1 command, inline this command. We CANNOT inline executes, for complicated reasons.
      // If you want to understand the reasons, see @vdvman1#9510 explanation =>
      // https://discordapp.com/channels/154777837382008833/154777837382008833/754985742706409492
      this.commandsRoot.Datapack.resources.deleteResource(callbackMcFunction.path, 'functions')

      if (this.commandsRoot.arguments.length > 0) {
        this.commandsRoot.arguments.push('run')
      }

      this.commandsRoot.addAndRegister(...callbackMcFunction.commands[0])
    } else {
      // Else, register the function call
      this.commandsRoot.function(callbackFunctionName)
    }

    this.arguments = []
  }

  if = (condition: ConditionType, callback: () => void) => {
    this.flowStatement(callback, {
      callbackName: 'if',
      initialCondition: true,
      loopCondition: false,
      condition,
    })
  }

  while = (condition: ConditionClass | CombinedConditions, callback: () => void) => {
    this.flowStatement(callback, {
      callbackName: 'while',
      initialCondition: true,
      loopCondition: true,
      condition,
    })
  }

  doWhile = (condition: ConditionClass | CombinedConditions, callback: () => void) => {
    this.flowStatement(callback, {
      callbackName: 'doWhile',
      initialCondition: false,
      loopCondition: true,
      condition,
    })
  }

  binaryFor = (from: PlayerScore | number, to: PlayerScore |number, callback: (amount: number) => void, maximum = 128) => {
    if (typeof from === 'number' && typeof to === 'number') {
      callback(to - from)
    }

    const realStart = from instanceof PlayerScore ? from : this.commandsRoot.Datapack.createAnonymousScore().set(from)
    const realEnd = to instanceof PlayerScore ? to : this.commandsRoot.Datapack.createAnonymousScore().set(to)

    const iterations = realEnd.minus(realStart)

    const _ = this

    // For all iterations above the maximum,
    // just do a while loop that calls `maximum` times the callback,
    // until there is less than `maximum` iterations
    _.while(iterations.lowerThan(maximum), () => {
      callback(maximum)
      iterations.remove(maximum)
    })

    // There is now less iterations than the allowed MAXIMUM
    // Start the binary part
    for (let i = 1; i < maximum; i *= 2) {
      _.if(iterations.moduloBy(2).equalTo(1), () => {
        callback(i)
      })

      iterations.dividedBy(2)
    }
  }

  forRange = (from: PlayerScore | number, to: PlayerScore | number, callback: (score: PlayerScore) => void, maximum = 16) => {
    function callCallbackNTimes(n: number) {
      for (let i = 0; i < n; i += 1) {
        if (callback.length > 0) {
          callback(scoreTracker)
          scoreTracker.add(1)
        } else {
          // We know the callback takes no arguments - it's OK to avoid it
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          callback()
        }
      }
    }

    const scoreTracker = from instanceof PlayerScore ? from : this.commandsRoot.Datapack.createAnonymousScore().set(from)

    // If the callback does not use the "score" argument, we can directly set the real score
    // `scoreTracker` to the end (instead of spamming `scoreboard players add anonymous sand_ano 1`).
    if (callback.length === 0) {
      // Typescript has a bug, and will not recognize `scoreTracker.set(to)` as a valid expression. So I have to use this condition.
      if (typeof to === 'number') {
        scoreTracker.set(to)
      } else {
        scoreTracker.set(to)
      }
    }

    this.binaryFor(scoreTracker, to, callCallbackNTimes, maximum)
  }

  forScore = (
    score: PlayerScore | number,
    condition: ((score: PlayerScore) => ConditionType) | ConditionType,
    modifier: (score: PlayerScore) => void,
    callback: (score: PlayerScore) => void,
  ) => {
    const realScore = score instanceof PlayerScore ? score : this.commandsRoot.Datapack.createAnonymousScore().set(score)
    const realCondition = typeof condition === 'function' ? condition(realScore) : condition

    this.while(realCondition, () => {
      callback(realScore)
      modifier(realScore)
    })
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
      commands = [...requiredExpressions, [...callableExpression, 'run']]
    } else {
      commands = [['execute', ...args, 'if', ...realCondition._toMinecraftCondition().value]]
    }
  } else {
    commands = [['execute', ...args, 'if', ...condition._toMinecraftCondition().value]]
  }

  // Add & register all required commands
  for (const command of commands.slice(0, -1)) {
    commandsRoot.addAndRegister(...command)
  }

  // Add the callable command, WITHOUT REGISTERING IT. It must be appended with the command to run.
  const callableCommand = commands[commands.length - 1]
  commandsRoot.arguments.push(...callableCommand)
}

export type PublicFlow = Omit<Flow, 'arguments' | 'flowStatement'>
