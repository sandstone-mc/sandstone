import type { RootNBT } from 'sandstone/arguments/nbt.js'
import type { DataPointPickClass, Macroable, MCFunctionClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { TagClass } from 'sandstone/core/resources/datapack/tag'
import type { DATA_TYPES, DataPointClass } from 'sandstone/variables'
import { nbtStringifier } from 'sandstone/variables/nbt/NBTs'
import type { FinalCommandOutput } from '../../helpers.js'
import { CommandArguments } from '../../helpers.js'

// Function command

export class FunctionCommandNode extends CommandNode<[string | MCFunctionClass<any, any>]> {
  command = 'function' as const
}

type Func = MCFunctionClass<undefined, undefined> | string | TagClass<'functions'>

export class FunctionCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = FunctionCommandNode

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
