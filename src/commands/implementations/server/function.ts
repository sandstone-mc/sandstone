import { CommandNode, TagClass } from '#core'

import { CommandArguments } from '../../helpers'

import type { MCFunctionClass } from '#core'

// Function command

export class FunctionCommandNode extends CommandNode<[string | MCFunctionClass]> {
  command = 'function' as const
}

export class FunctionCommand extends CommandArguments {
  protected NodeType = FunctionCommandNode

  function = (mcFunction: string | MCFunctionClass | TagClass<'functions'>) => this.finalCommand([mcFunction instanceof TagClass ? `#${mcFunction}` : mcFunction])
}
