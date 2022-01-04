import { CommandNode } from '@/next/core'

import { CommandArguments } from '../helpers'

import type { MCFunctionClass } from '@/next/core'

export class FunctionNode extends CommandNode<[string | MCFunctionClass]> {
  command = 'function' as const
}

export class FunctionCommand extends CommandArguments {
  NodeType = FunctionNode

  function = (mcFunction: string | MCFunctionClass) => this.command([mcFunction])
}
