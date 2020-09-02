import type { LiteralUnion } from '@/generalTypes'
import {
  BLOCKS, Coordinates, coordinatesParser, MinecraftCondition,
} from '@arguments'
import type { CommandsRoot } from '@commands'
import { ObjectiveClass } from '@variables'

function conditionToString(condition: ConditionType): string {
  if (condition instanceof CombinedConditions) {
    return condition.toString()
  }

  return condition.value.join(' ')
}

export class CombinedConditions {
  private values

  private operator

  private commandsRoot

  private static id = 0

  constructor(
    commandsRoot: CommandsRoot,
    values: (ConditionType)[],
    operator: 'not' | 'and' | 'or',
  ) {
    this.values = values
    this.operator = operator
    this.commandsRoot = commandsRoot
  }

  removeOr = (): CombinedConditions => {
    const valuesWithoutOr = this.values.map((v) => (v instanceof CombinedConditions ? v.removeOr() : v))

    if (this.operator !== 'or') {
      return new CombinedConditions(this.commandsRoot, valuesWithoutOr, this.operator)
    }

    // We have an OR operator. We need to transform it into an AND, using De Morgan's law:
    // (A or B) = not (not A and not B)

    // This corresponds to (not A, not B, not C)
    const newValues = valuesWithoutOr.map((value) => new CombinedConditions(this.commandsRoot, [value], 'not'))

    // This corresponds to (not A and not B)
    const andCondition = new CombinedConditions(this.commandsRoot, newValues, 'and')

    // This is the final expression, not (not A and not B)
    const finalCondition = new CombinedConditions(this.commandsRoot, [andCondition], 'not')

    return finalCondition
  }

  simplify = (): ConditionType => {
    const simplifiedValues = this.values.map((value) => (value instanceof CombinedConditions ? value.simplify() : value))

    // Simplify NOT NOT A to A
    if (this.operator === 'not') {
      const condition = simplifiedValues[0]
      if (condition instanceof CombinedConditions && condition.operator === 'not') {
        const realCondition = condition.values[0]
        return realCondition
      }
    }

    const flattenedValues = simplifiedValues.flatMap((value) => {
      if (value instanceof CombinedConditions && value.operator === this.operator) {
        return value.values
      }
      return value
    })

    return new CombinedConditions(this.commandsRoot, flattenedValues, this.operator)
  }

  toExecutes = (inverted = false): {
    requiredExpressions: string[][]
    callableExpression: string[]
   } => {
    if (this.operator === 'or') {
      throw new Error('You must call removeOrs before.')
    }

    const requiredExpressions: string[][] = []

    const callableExpression: string[] = ['execute']

    this.values.forEach((value) => {
      if (value instanceof CombinedConditions) {
        if (value.operator === 'not' && !(value.values[0] instanceof CombinedConditions)) {
          callableExpression.push('unless', ...value.values[0].value)
          return
        }

        const executes = value.toExecutes()

        if (value.operator === 'not') {
          requiredExpressions.push(...executes.requiredExpressions)
          callableExpression.push(...executes.callableExpression)
          return
        }

        const { id } = CombinedConditions
        CombinedConditions.id += 1

        const sandstoneConditionsName = 'sandstone_cond'
        let sandstoneConditions: ObjectiveClass
        try {
          sandstoneConditions = this.commandsRoot.createObjective(sandstoneConditionsName, 'dummy', 'Sandstone Conditions')
        } catch (e) {
          sandstoneConditions = this.commandsRoot.Datapack.objectives.get(sandstoneConditionsName) as ObjectiveClass
        }

        // An intermediate condition
        const condition = sandstoneConditions.ScoreHolder('scoreHolder')

        requiredExpressions.push(...executes.requiredExpressions)
        requiredExpressions.push(['scoreboard', 'players', 'set', condition.toString(), '0'])
        requiredExpressions.push([...executes.callableExpression, 'run', 'scoreboard', 'players', 'set', condition.toString(), '1'])
        callableExpression.push(this.operator === 'not' ? 'unless' : 'if', 'score', condition.toString(), 'matches', '1')
        return
      }
      callableExpression.push('if', ...value.value)
    })

    return { requiredExpressions, callableExpression }
  }

  toString() {
    if (this.operator === 'not') {
      return `NOT ${conditionToString(this.values[0])}`
    }

    const keyword = this.operator.toUpperCase()

    let result = '('

    result += this.values.map(conditionToString).join(` ${keyword} `)

    result += ')'

    return result
  }
}

type ConditionType = CombinedConditions | MinecraftCondition

export class Flow {
  private commandsRoot

  constructor(
    commandsRoot: CommandsRoot,
  ) {
    this.commandsRoot = commandsRoot
  }

  block = (coords: Coordinates, block: LiteralUnion<BLOCKS>): MinecraftCondition => ({
    value: ['block', coordinatesParser(coords), block],
  })

  /** Logical operators */

  and = (...conditions: (ConditionType)[]) => new CombinedConditions(this.commandsRoot, conditions, 'and')

  or = (...conditions: (ConditionType)[]) => new CombinedConditions(this.commandsRoot, conditions, 'or')

  not = (...conditions: (ConditionType)[]) => new CombinedConditions(this.commandsRoot, conditions, 'not')

  /** Flow statements */

  while = (condition: MinecraftCondition | CombinedConditions, callback: () => void) => {
    // First, enter the callback
    const callbackFunctionName = this.commandsRoot.Datapack.createEnterChildFunction('while')

    // Add its commands
    callback()

    // At the end of the callback, add the given conditions to call it again
    registerCondition(this.commandsRoot, condition)
    this.commandsRoot.addAndRegister('function', callbackFunctionName)

    this.commandsRoot.Datapack.exitChildFunction()

    registerCondition(this.commandsRoot, condition)
    this.commandsRoot.addAndRegister('function', callbackFunctionName)
  }

  doWhile = (condition: MinecraftCondition | CombinedConditions, callback: () => void) => {
    const callbackFunctionName = this.commandsRoot.Datapack.createEnterChildFunction('while')

    callback()
    registerCondition(this.commandsRoot, condition)
    this.commandsRoot.addAndRegister('function', callbackFunctionName)

    this.commandsRoot.Datapack.exitChildFunction()

    this.commandsRoot.addAndRegister('function', callbackFunctionName)
  }
}

export function registerCondition(commandsRoot: CommandsRoot, condition: MinecraftCondition | CombinedConditions) {
  let commands: string[][]

  if (condition instanceof CombinedConditions) {
    const realCondition = condition.removeOr().simplify()

    if (realCondition instanceof CombinedConditions) {
      const { callableExpression, requiredExpressions } = realCondition.toExecutes()
      commands = [...requiredExpressions, [...callableExpression, 'run']]
    } else {
      commands = [['execute', 'if', ...realCondition.value]]
    }
  } else {
    commands = [['execute', 'if', ...condition.value]]
  }

  // Add & register all required commands
  for (const command of commands.slice(0, -1)) {
    commandsRoot.addAndRegister(...command)
  }

  // Add the callable command, WITHOUT REGISTERING IT. It must be appended with the command to run.
  const callableCommand = commands[commands.length - 1]
  commandsRoot.arguments.push(...callableCommand)
}
