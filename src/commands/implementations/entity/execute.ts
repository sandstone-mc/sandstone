import { MCFunctionClass } from 'sandstone/core/index.js'
import { ContainerCommandNode } from 'sandstone/core/nodes.js'
import { makeCallable, toMinecraftResourceName } from 'sandstone/utils.js'
import {
  coordinatesParser, ObjectiveClass, rangeParser, rotationParser,
  Score,
  targetParser,
} from 'sandstone/variables/index.js'

import { CommandArguments, FinalCommandOutput } from '../../helpers.js'
import { FunctionCommandNode } from '../server/function.js'

import type { DataPointClass } from 'sandstone/variables/Data.js'
import type {
  ANCHORS,
  AXES,
  BLOCKS,
  COMPARISON_OPERATORS,
  Coordinates, DIMENSIONS, ENTITY_TYPES, MultipleEntitiesArgument, ObjectiveArgument, Rotation, SingleEntityArgument,
} from 'sandstone/arguments/index.js'
import type { MCFunctionNode, PredicateClass } from 'sandstone/core/index.js'
import type { Node } from 'sandstone/core/nodes.js'
import type { SandstonePack } from 'sandstone/pack/index.js'
import type { LiteralUnion } from 'sandstone/utils.js'

// Execute command
type SubCommand = [subcommand: string, ...args: unknown[]]

class ExecuteCommandPart extends CommandArguments<typeof ExecuteCommandNode> {
  protected nestedExecute = (args: SubCommand, executable = true) => this.subCommand([args], ExecuteCommand, executable)
}

export type StoreType = 'byte' | 'short' | 'int' | 'long' | 'float' | 'double'
export type RelationType = 'attacker' | 'controller' | 'leasher' | 'origin' | 'owner' | 'passengers' | 'target' | 'vehicle'

export class ExecuteCommandNode extends ContainerCommandNode<SubCommand[]> {
  command = 'execute' as const

  /**
   * By default, the execute is treated as single (execute.run.stuff).
   * This is set to `false` if the execute is used as a function (execute.run(() => { stuff })).
   */
  isSingleExecute: boolean

  /**
   * In case of a multiple execute, this specifies the base name of the MCFunction.
   */
  givenCallbackName: string | undefined

  constructor(sandstonePack: SandstonePack, args: SubCommand[] = [], {
    isSingleExecute = true,
    givenCallbackName = undefined as (string | undefined),
    body = [] as Node[],
  } = {}) {
    super(sandstonePack, ...args)

    this.givenCallbackName = givenCallbackName
    this.isSingleExecute = isSingleExecute
    this.append(...body)
  }

  get callbackName() {
    return this.givenCallbackName ?? `execute_${this.args[0][0].split(' ')[0]}`
  }

  append = (...nodes: Node[]) => {
    for (const node of nodes) {
      this.body.push(node)

      if (this.isSingleExecute) {
        this.sandstoneCore.getCurrentMCFunctionOrThrow().exitContext()
      }
    }
    return (nodes.length === 1 ? nodes[0] : nodes) as any
  }

  getValue = () => {
    if (this.body.length > 1) {
      throw new Error('Execute nodes can only have one child node when toString is called.')
    }

    // This will be the execute string without "run"
    const flattenedArgs = this.args.flat(1)
    const filteredArgs = flattenedArgs.filter((arg) => arg !== undefined)
    const executeString = `${this.command} ${filteredArgs.join(' ')}`

    if (this.body.length === 0) {
      return executeString
    }

    return `${executeString} run ${this.body[0].getValue()}`
  }

  createMCFunction = (currentMCFunction: MCFunctionNode | null) => {
    if (this.isSingleExecute || !currentMCFunction) {
      return { node: this as ExecuteCommandNode }
    }

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = new MCFunctionClass(this.sandstoneCore, `${currentMCFunction.resource.path.slice(2).join('/')}/${this.callbackName}`, {
      addToSandstoneCore: false,
      creator: 'sandstone',
      onConflict: 'rename',
    })
    const mcFunctionNode = mcFunction['node']
    mcFunctionNode.body = this.body

    // Return an execute calling this MCFunction.
    const mcFunctionCall = new FunctionCommandNode(this.sandstonePack, mcFunction)
    this.body = [mcFunctionCall]

    return { node: this as ExecuteCommandNode, mcFunction: mcFunctionNode }
  }
}

export class ExecuteStoreArgsCommand extends ExecuteCommandPart {
  /**
   * Saves the final command's return value as tag data within a block entity.
   *
   * Store as a byte, short, int, long, float, or double. If the return value is a decimal, it is rounded first and then multiplied by `scale`.
   *
   * @param targetPos Position of target block
   *
   * @param path Location of the desired tag to hold the value in.
   *
   * @param type Desired data size/type.
   *
   * @param scale Multiplier to apply before storing value. Defaults to 1.
   */
  block = (targetPos: Coordinates, path: string, type: StoreType, scale?: number) => this.nestedExecute(['block', coordinatesParser(targetPos), path, type, scale])

  /**
   * Saves the final command's return value in either a bossbar's current value or its maximum value.
   *
   * @param id ID of the bossbar to target for saving.
   *
   * @param type Whether to overwrite the bossbar's current value or its max value.
   */
  bossbar = (id: string, type: 'max' | 'value') => this.nestedExecute(['bossbar', id, type])

  /**
   * Save the final command's return value in one of an entity's data tags.
   *
   * Store as a byte, short, int, long, float, or double. If the return value is a decimal, it is rounded first and then multiplied by `scale`.
   *
   * Like the `/data` command, `/execute store <arguments>` cannot modify player NBT.
   *
   * @param target A single entity to store under.
   *
   * @param path Location of the desired tag to hold the value in.
   *
   * @param type Desired data size/type.
   *
   * @param scale Multiplier to apply before storing value. Defaults to 1.
   */
  entity = (target: SingleEntityArgument, path: string, type: StoreType, scale?: number) => this.nestedExecute(['entity', targetParser(target), path, type, scale])

  /**
   * Overrides the given score with the final command's return value.
   *
   * @param targets Specifies score holder(s) whose score is to be overridden.
   *
   * @param objective A scoreboard objective.
   *
   * @param playerScore The player's score to override.
   */
  score(...args: [targets: MultipleEntitiesArgument, objective: ObjectiveArgument] | [playerScore: Score]) {
    if (args[0] instanceof Score) {
      return this.nestedExecute(['score', args[0]])
    }
    return this.nestedExecute(['score', targetParser(args[0]), args[1]])
  }

  /**
   * Uses the `path` within storage `target` to store the return value in.
   *
   * Store as a byte, short, int, long, float, or double. If the return value is a decimal, it is rounded first and then multiplied by `scale`.
   *
   * If the storage does not yet exist, it gets created.
   *
   * @param target Target storage container, as a namespaced ID.
   *
   * @param path Location of the desired tag to hold the value in.
   *
   * @param type Desired data size/type.
   *
   * @param scale Multiplier to apply before storing value. Defaults to 1.
   */
  storage = (target: string, path: string, type: StoreType, scale: number = 1) => this.nestedExecute(['storage', target, path, type, scale])
}

export class ExecuteStoreCommand extends ExecuteCommandPart {
  /** Store the final command's result value. */
  get result() {
    return this.subCommand([['result']], ExecuteStoreArgsCommand, false)
  }

  /** Store the final command's success value. */
  get success() {
    return this.subCommand([['success']], ExecuteStoreArgsCommand, false)
  }
}

export class ExecuteDataArgsCommand extends ExecuteCommandPart {
  /**
   * Checks whether the targeted block has any data for a given tag
   * @param pos Position of the block to be tested.
   * @param path Data tag to check for.
   */
  block = (pos: Coordinates, path: string) => this.nestedExecute(['block', coordinatesParser(pos), path], true)

  /**
   * Checks whether the targeted entity has any data for a given tag
   * @param target One single entity to be tested.
   * @param path Data tag to check for.
   */
  entity = (target: SingleEntityArgument, path: string) => this.nestedExecute(['entity', targetParser(target), path], true)

  /**
   * Checks whether the targeted storage has any data for a given tag
   * @param source The storage to check in.
   * @param path Data tag to check for.
   */
  storage = (source: string, path: string) => this.nestedExecute(['storage', source, path], true)
}

export class ExecuteIfUnlessCommand extends ExecuteCommandPart {
  /**
   * Compares the block at a given position to a given block.
   *
   * @param pos Position of a target block to test.
   *
   * @param block A block to test against.
   */
  block = (pos: Coordinates, block: LiteralUnion<BLOCKS>) => this.nestedExecute(['block', coordinatesParser(pos), block], true)

  /**
   * Checks whether one or more entities exist.
   *
   * @param targets The target entities to check.
   */
  entity = (targets: MultipleEntitiesArgument) => this.nestedExecute(['entity', targetParser(targets)], true)

  /**
   * Checks whether the `predicate` evaluates to a positive result.
   *
   * @param predicate The predicate to test.
   */
  predicate = (predicate: string | PredicateClass) => this.nestedExecute(['predicate', typeof predicate === 'string' ? predicate : toMinecraftResourceName(predicate.path)], true)

  /**
   * Check a score against either another score or a given range.
   */
  score(firstTarget: SingleEntityArgument, firstObjective: string | ObjectiveClass, comparison: 'matches', value: Range): ExecuteCommand

  // eslint-disable-next-line max-len
  score(firstTarget: SingleEntityArgument, firstObjective: string | ObjectiveClass, comparison: COMPARISON_OPERATORS, otherTarget: SingleEntityArgument, otherObjective: string | ObjectiveClass): ExecuteCommand

  score(firstScore: Score, comparison: 'matches', value: Range): ExecuteCommand

  score(firstScore: Score, comparison: COMPARISON_OPERATORS, otherScore: Score): ExecuteCommand

  score(...args: any[]) {
    const finalArgs: string[] = []

    if (args[0] instanceof Score) {
      finalArgs.push(args[0].target.toString(), args[0].objective.name, args[1])
      if (args[2] instanceof Score) {
        finalArgs.push(args[2].target.toString(), args[2].objective.name)
      } else {
        finalArgs.push(rangeParser(args[2]))
      }
    } else {
      finalArgs.push(targetParser(args[0]), args[1] instanceof ObjectiveClass ? args[1].name : args[1], args[2])
      if (args[4]) {
        finalArgs.push(targetParser(args[3]), args[4] instanceof ObjectiveClass ? args[4].name : args[4])
      } else {
        finalArgs.push(rangeParser(args[3]))
      }
    }
    return this.nestedExecute(['score', ...finalArgs], true)
  }

  /**
   * Checks whether the current dimension matches the given one.
   * @param dimension Dimension to check against.
   */
  dimension = (dimension: LiteralUnion<DIMENSIONS>) => this.nestedExecute(['dimension', dimension])

  /**
   * Checks whether the targeted block is in a chunk that is fully loaded (entity-processing chunk).
   * @param pos Position of target block to test.
   */
  loaded = (pos: Coordinates) => this.nestedExecute(['loaded', coordinatesParser(pos)])

  /** Checks whether the data point exists or the targeted block, entity or storage has any data for a given tag. */
  data(dataPoint: DataPointClass): void

  data(dataPoint?: DataPointClass) {
    if (dataPoint) {
      return this.nestedExecute(dataPoint._toMinecraftCondition().getCondition() as [''])
    }
    return this.subCommand([['data']], ExecuteDataArgsCommand, false)
  }
}

export class ExecuteFacingEntityCommand extends ExecuteCommandPart {
  /**
   * Sets the command rotation to face a given point, as viewed from its anchor (either the eyes or the feet).
   *
   * @param targets The target(s) to rotate towards. (if you target multiple entities subcommands will run for each entity)
   *
   * @param anchor Whether to point at the target's eyes or feet.
   */
  entity = (targets: MultipleEntitiesArgument, anchor: ANCHORS = 'feet') => this.nestedExecute(['entity', targetParser(targets), anchor])
}

export class ExecutePositionedCommand extends ExecuteCommandPart {
  /**
   * Sets the command position, without changing rotation or dimension, by matching an entity's position.
   *
   * @param targets Target entity/entities to match position with.
   */
  as = (targets: MultipleEntitiesArgument) => this.nestedExecute(['as', targetParser(targets)])

  /**
   * Sets the command position matching the height map (highest position in a column of blocks according to criteria) for the current position.
   *
   * - `world_surface` Any non-air block.
   * - `motion_blocking` Any motion blocking material (eg. ignores flowers and grass).
   * - `motion_blocking_no_leaves` Any non-leaf motion blocking material.
   * - `ocean_floor` Any non-fluid motion blocking material.
   */
  over = (heightMap: 'world_surface' | 'motion_blocking' | 'motion_blocking_no_leaves' | 'ocean_floor') => this.nestedExecute(['over', heightMap])
}

export class ExecuteRotatedAsCommand extends ExecuteCommandPart {
  /**
   * Sets the command rotation, by matching an entity's rotation.
   *
   * @param targets Target entity/entities to match rotation with.
   */
  as = (targets: MultipleEntitiesArgument) => this.nestedExecute(['as', targetParser(targets)])
}

export class ExecuteCommand extends ExecuteCommandPart {
  protected NodeType = ExecuteCommandNode

  /**
   * Updates the command's position, aligning to its current block position (an integer). Only applies along specified axes.
   * This is akin to flooring the coordinates – i.e. rounding them downwards. It updates the meaning of `~ ~ ~` and `^ ^ ^`.
   *
   * @param axes Any non-repeating combination of the characters 'x', 'y', and 'z'.
   */
  align = (axes: AXES) => this.nestedExecute(['align', axes])

  /**
   * Stores the distance from the feet to the eyes of the entity that is executing the command in the anchor, which is part of the command context.
   * Effectively re-centers `^ ^ ^` on either the eyes or feet, also changing the angle the `facing` sub-command works off of.
   *
   * @param anchor Whether to anchor the executed command to eye level or feet level
   */
  anchored = (anchor: ANCHORS) => this.nestedExecute(['anchored', anchor])

  /**
   * Sets the command sender to target entity, without changing position, rotation, dimension, or anchor
   *
   * @param targets Target entity/entities to become the new sender.
   */
  as = (targets: MultipleEntitiesArgument) => this.nestedExecute(['as', targetParser(targets)])

  /**
   * Sets the command position, rotation, and dimension to match those of an entity/entities; does not change sender
   * @param targets Target entity/entities to match position, rotation, and dimension with
   */
  at = (targets: MultipleEntitiesArgument) => this.nestedExecute(['at', targetParser(targets)])

  /**
   * Sets the command rotation to face a given point, as viewed from its anchor (either the eyes or the feet).
   *
   * @param pos Coordinate to rotate towards.
   */
  facing(pos: Coordinates): ExecuteCommand

  facing(pos?: Coordinates) {
    if (pos) {
      return this.nestedExecute(['facing', coordinatesParser(pos)])
    }
    return this.subCommand([['facing']], ExecuteFacingEntityCommand, false)
  }

  /**
   * Sets the command dimension.
   *
   * @param dimension Name of the new execution dimension.
   */
  in = (dimension: LiteralUnion<DIMENSIONS>) => this.nestedExecute(['in', dimension])

  /**
   * Sets the command executor to a related entity.
   * @param relation Relation with the current executor.
   */
  on = (relation: RelationType) => this.nestedExecute(['on', relation])

  /**
   * Sets the command position, without changing rotation or dimension.
   *
   * @param pos The new position.
   */
  positioned(pos: Coordinates): ExecuteCommand

  positioned(pos?: Coordinates) {
    if (pos) {
      return this.nestedExecute(['positioned', coordinatesParser(pos)])
    }
    return this.subCommand([['positioned']], ExecutePositionedCommand, false)
  }

  /**
   * Sets the command rotation.
   *
   * @param rotation The desired rotation.
   *
   * First value is measured clockwise in degrees from due south (the +Z Axis), ranging [–180 to +180)
   * Second value is measured as declination from the horizon in degrees, ranging [–90 to +90] (straight up to straight down)
   *
   * Relative values can be used to specify a rotation relative to the current execution rotation.
   */
  rotated(rotation: Rotation): ExecuteCommand

  rotated(rotation?: Rotation) {
    if (rotation) {
      return this.nestedExecute(['rotated', rotationParser(rotation)])
    }
    return this.subCommand([['rotated']], ExecuteRotatedAsCommand, false)
  }

  /**
   * Summons an entity at the command position and sets the command executor to said newly summoned entity.
   * @param entityType Entity to summon.
   */
  summon(entityType: LiteralUnion<ENTITY_TYPES>) {
    return this.nestedExecute(['summon', entityType])
  }

  get if() {
    return this.subCommand([['if']], ExecuteIfUnlessCommand, false)
  }

  get unless() {
    return this.subCommand([['unless']], ExecuteIfUnlessCommand, false)
  }

  get store() {
    return this.subCommand([['store']], ExecuteStoreCommand, false)
  }

  get run() {
    const node = this.getNode()

    const commands = new Proxy(this.sandstonePack.commands, {
      get: (target, p, receiver) => {
        // The context will automatically be exited by the node itself
        this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(node, false)
        return (this.sandstonePack.commands as any)[p]
      },
    })

    return makeCallable(commands, (callback: () => void) => {
      node.isSingleExecute = false
      this.sandstoneCore.insideContext(node, callback, false)
      return new FinalCommandOutput(node)
    }, true)
  }
}
