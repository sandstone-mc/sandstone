import { CommandNode, TagClass } from 'sandstone/core'
import {
  type DATA_TYPES, type DataPointClass, type Macroable, nbtStringifier,
} from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { RootNBT } from 'sandstone/arguments/nbt.js'
import type { MCFunctionClass } from 'sandstone/core'
import type { FinalCommandOutput } from '../../helpers.js'

// Function command

export class FunctionCommandNode extends CommandNode<[string | MCFunctionClass<any, any>]> {
  command = 'function' as const
}

type WithMacros = MCFunctionClass<undefined, undefined> | string | TagClass<'functions'>

export class FunctionCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = FunctionCommandNode

  function(mcFunction: Macroable<WithMacros, MACRO>): FinalCommandOutput

  function(mcFunction: Macroable<WithMacros, MACRO>, params: Macroable<RootNBT, MACRO>): FinalCommandOutput

  function(mcFunction: Macroable<WithMacros, MACRO>, _: 'with', type: DATA_TYPES, target: string, path: string): FinalCommandOutput

  function(mcFunction: Macroable<WithMacros, MACRO>, _: 'with', dataPoint: DataPointClass): FinalCommandOutput

  function(mcFunction: Macroable<MCFunctionClass<NonNullable<any>, NonNullable<any>>, MACRO>): FinalCommandOutput

  function(
    mcFunction: Macroable<string | MCFunctionClass<any, any> | TagClass<'functions'>, MACRO>,
    params?: 'with' | Macroable<RootNBT, MACRO>,
    pointOrType?: DATA_TYPES | DataPointClass,
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
          args.push(pointOrType.type, pointOrType.target, pointOrType.path)
        }
      } else {
        /* @ts-ignore */
        args.push(typeof params === 'object' && params.toMacro ? params : nbtStringifier(params))
      }
    }

    return this.finalCommand([mcFunction instanceof TagClass ? `#${mcFunction}` : mcFunction, ...args])
  }
}
