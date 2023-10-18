import { CommandNode, TagClass } from 'sandstone/core'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

import type { MCFunctionClass } from 'sandstone/core'

// Function command

export class FunctionCommandNode extends CommandNode<[string | MCFunctionClass]> {
  command = 'function' as const
}

export class FunctionCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = FunctionCommandNode

  function = (mcFunction: string | MCFunctionClass | TagClass<'functions'>) => this.finalCommand([mcFunction instanceof TagClass ? `#${mcFunction}` : mcFunction])
}
