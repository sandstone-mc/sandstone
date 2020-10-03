import type { LiteralUnion } from '@/generalTypes'
import type {
  ANCHORS, AXES, BLOCKS, COMPARISON_OPERATORS, Coordinates, DIMENSION_TYPES, MultipleEntitiesArgument, ObjectiveArgument, Rotation, SingleEntityArgument,
} from '@arguments'
import type { Flow } from '@flow'
import type { ConditionClass, Range } from '@variables'
import { coordinatesParser } from '@variables'
import type { PlayerScore } from '@variables/PlayerScore'
import type * as commands from '../../../commands'
import type { CommandsRoot } from '../CommandsRoot'
import { command } from '../decorators'

const executeConfig = {
  isRoot: false,
  hasSubcommands: true,
  executable: true,
  isExecuteSubcommand: true,
}

type StoreType = 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'

type CommandsRootLike = CommandsRoot | Flow

class CommandLike<T extends CommandsRootLike> {
  protected commandsRoot: T

  constructor(commandsRootLike: T) {
    this.commandsRoot = commandsRootLike
  }
}

class ExecuteSubcommand<T extends CommandsRootLike> extends CommandLike<T> {
  protected execute: InferExecute<T>

  constructor(execute: InferExecute<T>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    super(execute.commandsRoot)

    this.execute = execute
  }
}

function isRealCommandsRoot(commandsRootLike: CommandsRootLike): commandsRootLike is CommandsRoot {
  return Object.prototype.hasOwnProperty.call(commandsRootLike, 'register')
}

export class ExecuteStoreArgs<T extends CommandsRootLike> extends ExecuteSubcommand<T> {
  @command('block', { ...executeConfig, parsers: { '0': coordinatesParser } })
  block = (targetPos: Coordinates, path: string, type: StoreType, scale: number) => this.execute

  @command('bossbar', executeConfig)
  bossbar = (id: string, type: 'max' | 'value') => this.execute

  @command('entity', executeConfig)
  entity = (
    target: SingleEntityArgument, path: string, type: StoreType, scale: number,
  ) => this.execute

  @command('score', executeConfig)
  score: (
    ((targets: MultipleEntitiesArgument, objective: ObjectiveArgument) => InferExecute<T>) &
    ((playerScore: PlayerScore) => InferExecute<T>)
  ) = (...args: unknown[]) => this.execute

  @command('storage', executeConfig)
  storage = (target: string, path: string, type: StoreType, scale: number) => this.execute
}

export class ExecuteStore<T extends CommandsRootLike> extends ExecuteSubcommand<T> {
  get result(): ExecuteStoreArgs<T> {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('store', 'result')

    if (isRealCommandsRoot(this.commandsRoot)) {
      this.commandsRoot.executable = true
      this.commandsRoot.inExecute = true
    }

    return new ExecuteStoreArgs(this.execute)
  }

  get success() {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('store', 'success')

    if (isRealCommandsRoot(this.commandsRoot)) {
      this.commandsRoot.executable = true
      this.commandsRoot.inExecute = true
    }

    return new ExecuteStoreArgs(this.execute)
  }
}

export class ExecuteIfData<T extends CommandsRootLike> extends ExecuteSubcommand<T> {
  @command('block', { ...executeConfig, parsers: { '0': coordinatesParser } })
  block = (pos: Coordinates, path: string) => this.execute

  @command('entity', executeConfig)
  entity = (target: SingleEntityArgument, path: string) => this.execute

  @command('storage', executeConfig)
  storage = (source: string, path: string) => this.execute
}

export class Execute<T extends CommandsRootLike> extends CommandLike<T> {
  @command('align', executeConfig)
  align = (axes: AXES) => this

  @command('anchored', executeConfig)
  anchored = (anchor: ANCHORS) => this

  @command('as', executeConfig)
  as = (targets: MultipleEntitiesArgument) => this

  @command('at', executeConfig)
  at = (targets: MultipleEntitiesArgument) => this

  @command('facing', { ...executeConfig, parsers: { '0': coordinatesParser } })
  facing = (pos: Coordinates) => this

  @command(['facing', 'entity'], executeConfig)
  facingEntity = (targets: MultipleEntitiesArgument, anchor: ANCHORS) => this

  @command('in', executeConfig)
  in = (dimension: DIMENSION_TYPES) => this

  @command('positioned', { ...executeConfig, parsers: { '0': coordinatesParser } })
  positioned = (pos: Coordinates) => this

  @command(['positioned', 'as'], executeConfig)
  positionedAs = (targets: MultipleEntitiesArgument) => this

  @command('rotated', executeConfig)
  rotated = (rotation: Rotation) => this

  @command(['rotated', 'as'], executeConfig)
  rotatedAs = (targets: MultipleEntitiesArgument) => this

  @command(['if', 'block'], { ...executeConfig, parsers: { '0': coordinatesParser } })
  ifBlock = (pos: Coordinates, block: LiteralUnion<BLOCKS>) => this

  @command(['unless', 'block'], executeConfig)
  unlessBlock: this['ifBlock'] = (...args: unknown[]) => this

  @command(['if', 'blocks'], { ...executeConfig, parsers: { '0': coordinatesParser, '1': coordinatesParser, '2': coordinatesParser } })
  ifBlocks = (start: Coordinates, end: Coordinates, destination: Coordinates, scanMode: 'all' | 'masked') => this

  @command(['unless', 'blocks'], executeConfig)
  unlessBlocks: this['ifBlocks'] = (...args: unknown[]) => this

  get ifData(): ExecuteIfData<T> {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('if', 'data')

    if (isRealCommandsRoot(this.commandsRoot)) {
      this.commandsRoot.executable = true
      this.commandsRoot.inExecute = true
    }

    return new ExecuteIfData(this as unknown as InferExecute<T>)
  }

  get unlessData(): ExecuteIfData<T> {
    if (!this.commandsRoot.arguments.length) {
      this.commandsRoot.arguments.push('execute')
    }
    this.commandsRoot.arguments.push('unless', 'data')

    if (isRealCommandsRoot(this.commandsRoot)) {
      this.commandsRoot.executable = true
      this.commandsRoot.inExecute = true
    }

    return new ExecuteIfData(this as unknown as InferExecute<T>)
  }

  @command(['if', 'entity'], executeConfig)
  ifEntity = (targets: MultipleEntitiesArgument) => this

  @command(['unless', 'entity'], executeConfig)
  unlessEntity: this['ifEntity'] = (...args: unknown[]) => this

  @command(['if', 'score'], executeConfig)
  ifScore: (
    ((
      target: SingleEntityArgument,
      targetObjective: ObjectiveArgument,
      operator: COMPARISON_OPERATORS,
      source: SingleEntityArgument,
      sourceObjective:
        ObjectiveArgument
    ) => this) &
    ((
      target: SingleEntityArgument,
      targetObjective: ObjectiveArgument,
      operator: 'matches',
      range: Range,
    ) => this)
  ) = (...args: unknown[]) => this

  @command(['unless', 'score'], executeConfig)
  unlessScore: this['ifScore'] = (...args: unknown[]) => this

  @command(['if', 'predicate'], executeConfig)
  ifPredicate = (predicate: string) => this

  @command(['unless', 'predicate'], executeConfig)
  unlessPredicate: this['ifPredicate'] = (...args: unknown[]) => this

  // For if & unless, we're using an intermediate command because the "real" arguments are in the `.value` property of the condition

  @command('if', executeConfig)
  private if_ = (...args: string[]) => this

  @command('unless', executeConfig)
  private unless_ = (...args: string[]) => this

  if = (condition: ConditionClass) => this.if_(...condition._toMinecraftCondition().value)

  unless = (condition: ConditionClass) => this.unless_(...condition._toMinecraftCondition().value)

  store: ExecuteStore<T> = new ExecuteStore(this as unknown as InferExecute<T>)

  get runOne(): (
    T extends CommandsRoot ?
      // The Pick<> ensures only commands are returned from CommandsRoot
      Pick<T, ((keyof typeof commands) | 'function')> :
      T
  ) {
    return this.commandsRoot as any
  }
}

export class ExecuteWithRun<T extends CommandsRoot> extends Execute<T> {
  run = (callback: () => void) => {
    this.commandsRoot.Datapack.flow.flowStatement(callback, {
      callbackName: `execute_${this.commandsRoot.arguments[1]}`,
      initialCondition: false,
      loopCondition: false,
    })
  }
}

type InferExecute<T extends CommandsRootLike> = T extends CommandsRoot ? ExecuteWithRun<T> : Execute<T>
