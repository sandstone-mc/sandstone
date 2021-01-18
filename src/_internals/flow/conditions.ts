import type { CommandsRoot } from '@commands'
import type { Datapack } from '@datapack'
import type { ConditionClass } from '@variables'

export function conditionToString(condition: ConditionType): string {
  if (condition instanceof CombinedConditions) {
    return condition.toString()
  }

  return condition._toMinecraftCondition().value.join(' ')
}

let conditionID = 0
export function getConditionScore(datapack: Datapack) {
  const score = datapack.rootObjective.ScoreHolder(`cond_${conditionID}`)
  conditionID += 1
  return score
}

export class CombinedConditions {
  private values

  private operator

  private commandsRoot

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

    /*
     * We have an OR operator. We need to transform it into an AND, using De Morgan's law:
     * (A or B) = not (not A and not B)
     */

    // This corresponds to (not A, not B, not C)
    const newValues = valuesWithoutOr.map((value) => new CombinedConditions(this.commandsRoot, [value], 'not'))

    // This corresponds to (not A and not B and not C)
    const andCondition = new CombinedConditions(this.commandsRoot, newValues, 'and')

    // This is the final expression, not (not A and not B and not C)
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

  toExecutes = (): {
    requiredExpressions: string[][]
    callableExpression: string[]
   } => {
    if (this.operator === 'or') {
      throw new Error('You must call removeOr before.')
    }

    const requiredExpressions: string[][] = []

    const callableExpression: string[] = []

    /*
     * For optimization purposes, we want to first check for CombinedConditions, and then for others.
     * It allows to shortcut normal conditions when a CombinedConditions has not been respected.
     */
    let values: ConditionType[] = []
    this.values.forEach((value) => {
      if (value instanceof CombinedConditions) {
        values = [value, ...values]
      } else {
        values.push(value)
      }
    })

    this.values.forEach((value) => {
      if (value instanceof CombinedConditions) {
        if (value.operator === 'not' && !(value.values[0] instanceof CombinedConditions)) {
          const cond = value.values[0]._toMinecraftCondition().value
          callableExpression.push(cond[0] === 'if' ? 'unless' : 'if', ...cond.slice(1))
          return
        }

        const executes = value.toExecutes()

        if (value.operator === 'not') {
          requiredExpressions.push(...executes.requiredExpressions)
          callableExpression.push(...executes.callableExpression)
          return
        }

        // An intermediate condition
        const condition = getConditionScore(this.commandsRoot.Datapack)

        requiredExpressions.push(...executes.requiredExpressions)
        requiredExpressions.push(['scoreboard', 'players', 'set', condition.toString(), '0'])
        requiredExpressions.push(['execute', ...executes.callableExpression, 'run', 'scoreboard', 'players', 'set', condition.toString(), '1'])
        callableExpression.push(this.operator === 'not' ? 'unless' : 'if', 'score', condition.toString(), 'matches', '1')
        return
      }

      let conditionArgs = value._toMinecraftCondition().value
      if (this.operator === 'not') {
        // Invert the 1st argument, which is "if" or "unless"
        const invertedOperator = conditionArgs[0] === 'if' ? 'unless' : 'if'
        conditionArgs = [invertedOperator, ...value._toMinecraftCondition().value.slice(1)]
      }
      callableExpression.push(...conditionArgs)
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

export type ConditionType = CombinedConditions | ConditionClass
