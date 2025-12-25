import type { RootNBT } from 'sandstone/arguments/nbt'
import type { DataPointPickClass, Macroable, MCFunctionClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { TagClass } from 'sandstone/core/resources/datapack/tag'
import type { DATA_TYPES, DataPointClass } from 'sandstone/variables'
import { nbtStringifier } from 'sandstone/variables/nbt/NBTs'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'

// Function command

export class FunctionCommandNode extends CommandNode<[string | MCFunctionClass<any, any>]> {
  command = 'function' as const
}

type Func = MCFunctionClass<undefined, undefined> | string | TagClass<'functions'>

export class FunctionCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = FunctionCommandNode

  /**
   * Call a function or function tag.
   *
   * @param mcFunction Function to call. Can be function name, MCFunction object, or function tag.
   *                  Examples: 'minecraft:foo', myFunction, '#mypack:init_functions'
   *
   * @param params Optional parameters or 'with' keyword for data context.
   * @param pointOrType Optional data type or data point for 'with' clause.
   * @param target Optional target for data context.
   * @param path Optional path for data context.
   *
   * @example
   * ```ts
   * func('minecraft:load')                    // Call vanilla function
   * func(myFunction)                         // Call Sandstone function
   * func('#mypack:tick_functions')           // Call function tag
   * func('minecraft:test', {x: 100})         // Call with parameters
   * func('minecraft:process', 'with', 'entity', '@s', 'Tags')  // With data context
   * ```
   */
  function(mcFunction: Macroable<Func, MACRO>): FinalCommandOutput

  function(mcFunction: Macroable<Func, MACRO>, params: Macroable<RootNBT, MACRO>): FinalCommandOutput

  function(
    mcFunction: Macroable<Func, MACRO>,
    _: 'with',
    type: DATA_TYPES,
    target: string,
    path: string,
  ): FinalCommandOutput

  function(
    mcFunction: Macroable<Func, MACRO>,
    _: 'with',
    dataPoint: DataPointClass | DataPointPickClass,
  ): FinalCommandOutput

  function(
    mcFunction: Macroable<string | MCFunctionClass<any, any> | TagClass<'functions'>, MACRO>,
    params?: 'with' | Macroable<RootNBT, MACRO>,
    pointOrType?: DATA_TYPES | DataPointClass | DataPointPickClass,
    target?: string,
    path?: string,
  ) {
    const args: unknown[] = []

    if (params) {
      if (params === 'with' && pointOrType) {
        args.push('with')
        if (typeof pointOrType === 'string') {
          args.push(pointOrType, target, path)
        } else {
          const point = (
            Object.hasOwn(pointOrType, '_toDataPoint') ? (pointOrType as DataPointPickClass)._toDataPoint : pointOrType
          ) as DataPointClass

          args.push(point.type, point.currentTarget, point.path)
        }
      } else {
        args.push(typeof params === 'object' && params.toMacro ? params : nbtStringifier(params))
      }
    }

    return this.finalCommand([mcFunction instanceof TagClass ? `#${mcFunction}` : mcFunction, ...args])
  }
}
