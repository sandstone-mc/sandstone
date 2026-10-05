import type { SandstonePack } from 'sandstone/pack'
import { AssertCommand } from './assert'
import { AwaitCommand } from './await'
import { DummyCommand } from './dummy'
import { FailCommand } from './fail'
import { SucceedCommand } from './succeed'

export * from './assert'
export * from './await'
export * from './dummy'
export * from './fail'
export * from './succeed'
export * from './log'

function bind<CLASS, METHOD extends string>(
  pack: SandstonePack,
  _class: CLASS,
  method: METHOD,
) {
  /* @ts-ignore */
  const cmd = new _class(pack)

  if (typeof cmd[method].bind === 'function') {
    return cmd[method].bind(cmd)
  }
  throw Error('Commands binder screwed up')
}

/**
 * Aggregates the PackTest-specific commands. Used as the `commands` map
 * exposed to test mcfunctions.
 *
 * Mirrors `SandstoneCommands` (`pack.commands`) but scoped to commands
 * provided by the [PackTest](https://github.com/misode/packtest) server mod.
 *
 * Macros are not supported inside test mcfunctions, so this class does not
 * take a `MACRO` generic.
 */
export class SandstoneTestCommands {
  constructor(protected sandstonePack: SandstonePack) {}

  get assert() {
    return new AssertCommand(this.sandstonePack)
  }

  get await() {
    return new AwaitCommand(this.sandstonePack)
  }

  get dummy() {
    return new DummyCommand(this.sandstonePack)
  }

  get fail() {
    return bind(this.sandstonePack, FailCommand, 'fail') as FailCommand['fail']
  }

  get succeed() {
    return bind(this.sandstonePack, SucceedCommand, 'succeed') as SucceedCommand['succeed']
  }
}