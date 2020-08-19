import { LiteralUnion } from '@/generalTypes'
/* eslint-disable no-use-before-define */
import {
  ANCHORS, AXES, BLOCKS, COMPARISON_OPERATORS, Coordinates, coordinatesParser, DIMENSION_TYPES, ObjectiveArgument, Rotation, SelectorArgument,
} from '@arguments'
import { MinecraftCondition } from '@arguments/condition'
import { Range } from '@variables'
import { PlayerScore } from '@variables/PlayerScore'
import type * as commands from '../../../commands'
import { Command } from '../Command'
import type { CommandsRoot } from '../CommandsRoot'
import { command } from '../decorators'

const executeConfig = {
  isRoot: false,
  hasSubcommands: true,
  executable: true,
  isExecuteSubcommand: true,
}

type StoreType = 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'

export class ExecuteStoreArgs extends Command {
  @command('block', { ...executeConfig, parsers: { '0': coordinatesParser } })
  block = (targetPos: Coordinates, path: string, type: StoreType, scale: number) => new Execute(this.commandsRoot)

  @command('bossbar', executeConfig)
  bossbar = (id: string, type: 'max' | 'value') => new Execute(this.commandsRoot)

  @command('entity', executeConfig)
  entity = (
    target: SelectorArgument<true>, path: string, type: StoreType, scale: number,
  ) => new Execute(this.commandsRoot)

  @command('score', executeConfig)
  score: (
    ((targets: SelectorArgument<false>, objective: ObjectiveArgument) => Execute) &
    ((playerScore: PlayerScore) => Execute)
  ) = (...args: unknown[]) => new Execute(this.commandsRoot)

  @command('storage', executeConfig)
  storage = (target: string, path: string, type: StoreType, scale: number) => new Execute(this.commandsRoot)
}

export class ExecuteStore extends Command {
  get result() {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('store', 'result')
    this.commandsRoot.executable = true
    this.commandsRoot.inExecute = true

    return new ExecuteStoreArgs(this.commandsRoot)
  }

  get success() {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('store', 'success')
    this.commandsRoot.executable = true
    this.commandsRoot.inExecute = true

    return new ExecuteStoreArgs(this.commandsRoot)
  }
}

export class ExecuteIfData extends Command {
  @command('block', { ...executeConfig, parsers: { '0': coordinatesParser } })
  block = (pos: Coordinates, path: string) => new Execute(this.commandsRoot)

  @command('entity', executeConfig)
  entity = (target: SelectorArgument<true>, path: string) => new Execute(this.commandsRoot)

  @command('storage', executeConfig)
  storage = (source: string, path: string) => new Execute(this.commandsRoot)
}

export class Execute extends Command {
  @command('align', executeConfig)
  align = (axes: AXES) => this

  @command('anchored', executeConfig)
  anchored = (anchor: ANCHORS) => this

  @command('as', executeConfig)
  as = (targets: SelectorArgument<false>) => this

  @command('at', executeConfig)
  at = (targets: SelectorArgument<false>) => this

  @command('facing', { ...executeConfig, parsers: { '0': coordinatesParser } })
  facing = (pos: Coordinates) => this

  @command(['facing', 'entity'], executeConfig)
  facingEntity = (targets: SelectorArgument<false>, anchor: ANCHORS) => this

  @command('in', executeConfig)
  in = (dimension: DIMENSION_TYPES) => this

  @command('positioned', { ...executeConfig, parsers: { '0': coordinatesParser } })
  positioned = (pos: Coordinates) => this

  @command(['positioned', 'as'], executeConfig)
  positionedAs = (targets: SelectorArgument<false>) => this

  @command('rotated', executeConfig)
  rotated = (rotation: Rotation) => this

  @command(['rotated', 'as'], executeConfig)
  rotatedAs = (targets: SelectorArgument<false>) => this

  @command(['if', 'block'], { ...executeConfig, parsers: { '0': coordinatesParser } })
  ifBlock = (pos: Coordinates, block: LiteralUnion<BLOCKS>) => this

  @command(['unless', 'block'], executeConfig)
  unlessBlock: this['ifBlock'] = (...args: unknown[]) => this

  @command(['if', 'blocks'], { ...executeConfig, parsers: { '0': coordinatesParser, '1': coordinatesParser, '2': coordinatesParser } })
  ifBlocks = (start: Coordinates, end: Coordinates, destination: Coordinates, scanMode: 'all' | 'masked') => this

  @command(['unless', 'blocks'], executeConfig)
  unlessBlocks: this['ifBlocks'] = (...args: unknown[]) => this

  get ifData() {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('if', 'data')
    this.commandsRoot.executable = true
    this.commandsRoot.inExecute = true

    return new ExecuteIfData(this.commandsRoot)
  }

  get unlessData() {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('unless', 'data')
    this.commandsRoot.executable = true
    this.commandsRoot.inExecute = true

    return new ExecuteIfData(this.commandsRoot)
  }

  @command(['if', 'entity'], executeConfig)
  ifEntity = (targets: SelectorArgument<false>) => this

  @command(['unless', 'entity'], executeConfig)
  unlessEntity: this['ifEntity'] = (...args: unknown[]) => this

  @command(['if', 'score'], executeConfig)
  ifScore: (
    ((
      target: SelectorArgument<true>,
      targetObjective: ObjectiveArgument,
      operator: COMPARISON_OPERATORS,
      source: SelectorArgument<true>,
      sourceObjective:
        ObjectiveArgument
    ) => Execute) &
    ((
      target: SelectorArgument<true>,
      targetObjective: ObjectiveArgument,
      operator: 'matches',
      range: Range,
    ) => Execute)
  ) = (...args: unknown[]) => this

  @command(['unless', 'score'], executeConfig)
  unlessScore: this['ifScore'] = (...args: unknown[]) => this

  @command(['if', 'predicate'], executeConfig)
  ifPredicate = (predicate: string) => this

  @command(['unless', 'predicate'], executeConfig)
  unlessPredicate: this['ifPredicate'] = (...args: unknown[]) => this

  @command('if', executeConfig)
  private if_ = (...args: string[]) => this

  @command('unless', executeConfig)
  private unless_ = (...args: string[]) => this

  if = (condition: MinecraftCondition) => this.if_(...condition.value)

  unless = (condition: MinecraftCondition) => this.unless_(...condition.value)

  store = new ExecuteStore(this.commandsRoot)

  // The Pick<> ensures only commands are returned from CommandsRoot
  get runOne(): Pick<CommandsRoot, ((keyof typeof commands) | 'function')> {
    return this.commandsRoot
  }

  run = (callback: () => void) => {
    const name = this.commandsRoot.arguments[1]
    const currentFunctionName = this.commandsRoot.Datapack.createEnterChildFunction(`execute_${name}`)

    const currentArgs = this.commandsRoot.arguments
    currentArgs.push('run', 'function', currentFunctionName)
    this.commandsRoot.reset()

    callback()

    this.commandsRoot.Datapack.exitChildFunction()

    this.commandsRoot.arguments = currentArgs
    this.commandsRoot.executable = true
    this.commandsRoot.register()
  }
}
