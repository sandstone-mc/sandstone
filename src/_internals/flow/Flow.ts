import type { LiteralUnion } from '@/generalTypes'
import type {
  BLOCKS, Coordinates, SingleEntityArgument,
} from '@arguments'
import type { CommandsRoot } from '@commands'
import { Execute } from '@commands/implementations/Execute'
import type { CommandArgs } from '@datapack/minecraft'
import type { ConditionClass } from '@variables'
import { coordinatesParser } from '@variables'
import { PlayerScore } from '@variables/PlayerScore'
import type { ConditionType } from './conditions'
import { CombinedConditions, getConditionsObjective } from './conditions'

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

  /** CONDITIONS */

  /**
   * Compares the block at a given position to a given block. Suceeds if both are identical.
   *
   * @param pos Position of a target block to test.
   *
   * @param block A block to test against.
   */
  block = (coords: Coordinates, block: LiteralUnion<BLOCKS>): ConditionClass => ({
    _toMinecraftCondition: () => ({ value: ['block', coordinatesParser(coords), block] }),
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
    _toMinecraftCondition: () => ({ value: ['blocks', coordinatesParser(start), coordinatesParser(end), coordinatesParser(destination), scanMode] }),
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
    block: (pos: Coordinates, path: string) => ({ value: ['data', 'block', coordinatesParser(pos), path] }),

    /**
     * Checks whether the targeted entity has any data for a given tag
     * @param target One single entity to be tested.
     * @param path Data tag to check for.
     */
    entity: (target: SingleEntityArgument, path: string) => ({ value: ['data', 'entity', target, path] }),

    /**
     * Checks whether the targeted storage has any data for a given tag
     * @param source The storage to check in.
     * @param path Data tag to check for.
     */
    storage: (source: string, path: string) => ({ value: ['data', 'storage', source, path] }),
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
  flowStatement = (callback: () => void, config: FlowStatementConfig) => {
    /*
     * Sometimes, there are a few arguments left inside the commandsRoot (for execute.run mostly).
     * Keep them aside, & register them after.
     */
    const previousArguments = this.commandsRoot.arguments
    const previousInExecute = this.commandsRoot.inExecute
    this.commandsRoot.reset()

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
      this.commandsRoot.inExecute = true
      this.commandsRoot.functionCmd(callbackFunctionName)
    }

    // Exit the callback
    this.commandsRoot.Datapack.exitChildFunction()

    // Put back the old arguments
    this.commandsRoot.arguments = previousArguments
    this.commandsRoot.inExecute = previousInExecute

    // Register the initial condition (in the root function) to enter the callback
    if (config.initialCondition) {
      registerCondition(this.commandsRoot, config.condition, args)
      this.commandsRoot.inExecute = true
    }

    if (
      callbackMcFunction?.isResource
      && callbackMcFunction.commands.length <= 1
      && callbackMcFunction.commands?.[0]?.[0] !== 'execute'
    ) {
      /*
       * If our callback only has 1 command, inline this command. We CANNOT inline executes, for complicated reasons.
       * If you want to understand the reasons, see @vdvman1#9510 explanation =>
       * https://discordapp.com/channels/154777837382008833/154777837382008833/754985742706409492
       */
      this.commandsRoot.Datapack.resources.deleteResource(callbackMcFunction.path, 'functions')

      if (callbackMcFunction.commands.length) {
        if (this.commandsRoot.arguments.length > 0) {
          this.commandsRoot.arguments.push('run')
        }

        this.commandsRoot.addAndRegister(...callbackMcFunction.commands[0])
      } else {
        this.commandsRoot.arguments = []
      }
    } else {
      // Else, register the function call
      this.commandsRoot.functionCmd(callbackFunctionName)
    }

    this.arguments = []
  }

  if = (condition: ConditionType, callback: () => void): ElifElseFlow => {
    const conditionsObjective = getConditionsObjective(this.commandsRoot)

    // First, specify the `if` didn't pass yet (it's in order to chain elif/else)
    const ifScore = conditionsObjective.ScoreHolder('if_result')
    ifScore.set(0)

    this.flowStatement(() => {
      callback()
      ifScore.set(1)
    }, {
      callbackName: 'if',
      initialCondition: true,
      loopCondition: false,
      condition,
    })

    return this
  }

  elseIf = (condition: ConditionType, callback: () => void): ElifElseFlow => {
    const conditionsObjective = getConditionsObjective(this.commandsRoot)
    const ifScore = conditionsObjective.ScoreHolder('if_result')

    this.flowStatement(() => {
      callback()
      ifScore.set(1)
    }, {
      callbackName: 'else_if',
      initialCondition: true,
      loopCondition: false,
      condition: this.and(ifScore.equalTo(0), condition),
    })

    return this
  }

  else = (callback: () => void) => {
    const conditionsObjective = getConditionsObjective(this.commandsRoot)
    const ifScore = conditionsObjective.ScoreHolder('if_result')

    this.flowStatement(callback, {
      callbackName: 'else',
      initialCondition: true,
      loopCondition: false,
      condition: ifScore.equalTo(0),
    })
  }

  binaryMatch = (score: PlayerScore, minimum: number, maximum: number, callback: (num: number) => void) => {
    // First, specify we didn't find a match yet
    const foundMatch = this.commandsRoot.Datapack.Variable(0)

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

    const realStart = from instanceof PlayerScore ? from : this.commandsRoot.Datapack.Variable(from)
    const realEnd = to instanceof PlayerScore ? to : this.commandsRoot.Datapack.Variable(to)

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

    const scoreTracker = from instanceof PlayerScore ? from : this.commandsRoot.Datapack.Variable(from)

    /*
     * If the callback does not use the "score" argument, we can directly set the real score
     * `scoreTracker` to the end (instead of spamming `scoreboard players add anonymous sand_ano 1`).
     */
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
    // eslint-disable-next-line no-shadow
    condition: ((score: PlayerScore) => ConditionType) | ConditionType,
    // eslint-disable-next-line no-shadow
    modifier: (score: PlayerScore) => void,
    // eslint-disable-next-line no-shadow
    callback: (score: PlayerScore) => void,
  ) => {
    const realScore = score instanceof PlayerScore ? score : this.commandsRoot.Datapack.Variable(score)
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
      commands = [...requiredExpressions, callableExpression]
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

export type PublicFlow = Omit<Flow, 'arguments' | 'flowStatement' | 'elseIf' | 'else'>
type ElifElseFlow = Pick<Flow, 'elseIf' | 'else'>
