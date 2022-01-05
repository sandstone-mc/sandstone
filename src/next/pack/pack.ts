import { MCFunctionClass } from '@/next/core/resources/mcfunction'
import { SandstoneCore } from '@/next/core/sandstoneCore'

import { SandstoneCommands } from '../commands/commands'
import { AdvancementClass } from '../core/resources/advancement'
import { ExecuteWithNodesToMCFunctionVisitor, UnifyChainedExecutesVisitor } from './visitors'
import { SimplifyExecuteFunctionVisitor } from './visitors/simplifyExecuteFunction'

import type { AdvancementJSON } from '@arguments'
import type { ResourcePath } from '@datapack/resourcesTree'

export class SandstonePack {
  sandstoneCore: SandstoneCore

  sandstoneCommands: SandstoneCommands

  constructor(public defaultNamespace: string, public uid: string) {
    this.sandstoneCore = new SandstoneCore()
    this.sandstoneCommands = new SandstoneCommands(this.sandstoneCore)
  }

  resourceNameToPath = (resourceName: string): ResourcePath => {
    let namespace = this.defaultNamespace
    let fullName = resourceName

    if (resourceName.includes(':')) {
      ([namespace, fullName] = resourceName.split(':'))
    }

    const fullPath = fullName.split('/')

    return [namespace, ...fullPath]
  }

  MCFunction = (name: string, callback: () => void) => new MCFunctionClass(this.sandstoneCore, this.resourceNameToPath(name), {
    callback,
    creator: 'user',
    addToSandstoneCore: true,
    parent: this.sandstoneCore.currentMCFunction?.resource,
  })

  Advancement = <T extends string>(name: string, advancement: AdvancementJSON<T>) => new AdvancementClass(this.sandstoneCore, this.resourceNameToPath(name), {
    advancement,
    creator: 'user',
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
