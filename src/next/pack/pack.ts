import { MCFunctionClass } from '@/next/core/resources/mcfunction'
import { SandstoneCore } from '@/next/core/sandstoneCore'

import { SandstoneCommands } from '../commands/commands'
import { ExecuteWithNodesToMCFunctionVisitor, UnifyChainedExecutesVisitor } from './visitors'
import { SimplifyExecuteFunctionVisitor } from './visitors/simplifyExecuteFunction'

export class SandstonePack {
  sandstoneCore: SandstoneCore

  sandstoneCommands: SandstoneCommands

  constructor(public name: string, public uid: string) {
    this.sandstoneCore = new SandstoneCore(name, uid)
    this.sandstoneCommands = new SandstoneCommands(this.sandstoneCore)
  }

  MCFunction = (name: string, callback: () => void) => new MCFunctionClass(this.sandstoneCore, name, {
    callback,
    isUserCreated: true,
    addToSandstoneCore: true,
  })

  save = () => {
    this.sandstoneCore.save({
      visitors: [
        new ExecuteWithNodesToMCFunctionVisitor(this.sandstoneCore),
        new UnifyChainedExecutesVisitor(this.sandstoneCore),
        new SimplifyExecuteFunctionVisitor(this.sandstoneCore),
      ],
    })
  }
}
