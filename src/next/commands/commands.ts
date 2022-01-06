import {
  AdvancementCommand, ExecuteCommand, FunctionCommand, SayCommand,
} from './implementations'

import type { SandstoneCore } from '../core/sandstoneCore'

export class SandstoneCommands {
  constructor(protected sandstoneCore: SandstoneCore) { }

  advancement = new AdvancementCommand(this.sandstoneCore)

  execute = new ExecuteCommand(this.sandstoneCore, undefined, this)

  functionCmd = new FunctionCommand(this.sandstoneCore).function

  say = new SayCommand(this.sandstoneCore).say
}
