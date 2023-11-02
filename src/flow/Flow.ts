import { parseJSONText } from 'sandstone/variables'

import {
  AndNode, ConditionNode, NotNode, OrNode,
} from './conditions/index.js'
import { IfStatement } from './if_else.js'

import type { JSONTextComponent, MultiplePlayersArgument } from 'sandstone/arguments'
import type { ConditionClass, DataPointClass } from 'sandstone/variables'
import type { SandstoneCore } from '../core/index.js'

export type Condition = ConditionNode | ConditionClass
export class Flow {
  constructor(public sandstoneCore: SandstoneCore) { }

  conditionToNode(condition: Condition) {
    if (!(condition instanceof ConditionNode)) {
      return condition._toMinecraftCondition()
    }
    return condition
  }

  if = (condition: Condition, callback: () => void) => new IfStatement(this.sandstoneCore, this.conditionToNode(condition), callback)

  and = (...conditions: Condition[]) => new AndNode(this.sandstoneCore, conditions.map((condition) => this.conditionToNode(condition)))

  or = (...conditions: Condition[]) => new OrNode(this.sandstoneCore, conditions.map((condition) => this.conditionToNode(condition)))

  not = (condition: Condition) => new NotNode(this.sandstoneCore, this.conditionToNode(condition))

  get return() {
    return this.sandstoneCore.pack.commands.returnCmd
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
   * @returns The full error text component string.
   */
  throw(error: JSONTextComponent | undefined, broadcast: MultiplePlayersArgument<false> | false | undefined, dataPoint: false): string

  /**
   * Logs an error in data storage and chat by default and `return fail`'s from the context.
   *
   * @param error Error to log before `return`.
   * @param broadcast Whether to scope the broadcast of the error (from `@a`) or disable it.
   * @param dataPoint Specific point to store the error to.
   *
   * @returns DataPoint that was set.
   */
  throw(error: JSONTextComponent | undefined, broadcast: MultiplePlayersArgument<false> | false | undefined, dataPoint: DataPointClass): DataPointClass

  public throw(error?: JSONTextComponent, broadcast?: MultiplePlayersArgument<false> | false, dataPoint?: DataPointClass | false) {
    const { pack, getCurrentMCFunctionOrThrow } = this.sandstoneCore
    const { DataVariable, commands } = pack
    const { tellraw, returnCmd } = commands

    const node = getCurrentMCFunctionOrThrow()

    const fullError: JSONTextComponent = [
      { text: '\nSandstone Pack Error:\n', color: 'yellow' },
      error || '[Function Threw]', '\n\n',

      `@ Function ${node.resource.name}. Node ${node.body.length - 1}.\n`,
    ]

    if (broadcast !== false) {
      tellraw(broadcast || '@a', fullError)
    }

    const errorString = parseJSONText(fullError) as unknown as string

    if (dataPoint !== false) {
      let point
      if (dataPoint === undefined) {
        point = DataVariable(parseJSONText(fullError) as unknown as string)
      } else {
        point = dataPoint.set(errorString)
      }
      returnCmd.fail()

      return point
    }

    returnCmd.fail()

    return errorString
  }
}
