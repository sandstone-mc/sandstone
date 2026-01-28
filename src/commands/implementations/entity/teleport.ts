import type { Coordinates, MultipleEntitiesArgument, Rotation, SingleEntityArgumentOf } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { VectorClass } from 'sandstone/variables/Coordinates'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class TeleportCommandNode extends CommandNode {
  command = 'tp' as const
}

export class TeleportFacingCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Specifies the coordinates to make the target(s) facing to.
   * May use tilde and caret notation to specify a position relative to the position where the command is executed.
   */
  facing = (location: Macroable<Coordinates<MACRO>, MACRO>) =>
    this.finalCommand(['facing', coordinatesParser(location)])

  /**
   * Specifies the entity to make the target(s) facing to.
   *
   * @param entity Must be a player name, a target selector, or a UUID‌.
   *             Permits entity other than players.
   *
   * @param anchor Specifies whether the entity'eyes or feet to make the target(s) facing to.
   *             Must be one of eyes and feet. If not specified, defaults to eyes.
   */
  facingEntity = <T extends string>(entity: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>, anchor?: Macroable<'eyes' | 'feet', MACRO>) =>
    this.finalCommand(['facing', targetParser(entity), anchor])
}

export class TeleportCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TeleportCommandNode

  /**
   * Teleports the executor to a given entity.
   *
   * @param destinationEntity Specifies the entity to teleport the executor to.
   *                         Must be a player name, a target selector, or a UUID.
   *                         Permits entity other than players.
   */
  tp<T extends string>(destinationEntity: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>): void

  /**
   * Teleports the executor to a given location.
   *
   * @param location Specifies the coordinates to teleport the executor to.
   *                May use tilde and caret notation to specify a position relative
   *                to the position where the command is executed.
   */
  tp(location: Macroable<Coordinates<MACRO>, MACRO>): void

  /**
   * Teleports entities (players, mobs, etc.) to the given entity.
   *
   * @param targets Specifies the entity(s) to be teleported.
   *               Must be a player name, a target selector, or a UUID.
   *               Permits entities other than players.
   *
   * @param destinationEntity Specifies the entity to teleport the targets to.
   *                         Must be a player name, a target selector, or a UUID.
   *                         Permits entity other than players.
   */
  tp<T extends string>(
    targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
    destinationEntity: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
  ): void

  /**
   * Teleports entities (players, mobs, etc.) to the given location.
   *
   * @param targets Specifies the entity(s) to be teleported.
   *               Must be a player name, a target selector, or a UUID.
   *               Permits entities other than players.
   *
   * @param location Specifies the coordinates to teleport the target(s) to.
   *                May use tilde and caret notation to specify a position relative
   *                to the position where the command is executed.
   *
   * @returns An object with two optional possibilities: `facing` or `facingEntity`,
   *         to change the direction the player is facing.
   */
  tp(
    targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
    location: Macroable<Coordinates<MACRO>, MACRO>,
  ): TeleportFacingCommand<MACRO>

  /**
   * Teleports entities (players, mobs, etc.) to the given location, with the given rotation.
   *
   * @param targets Specifies the entity(s) to be teleported.
   *               Must be a player name, a target selector, or a UUID.
   *               Permits entities other than players.
   *
   * @param location Specifies the coordinates to teleport the target(s) to.
   *                May use tilde and caret notation to specify a position relative
   *                to the position where the command is executed.
   *
   * @param rotation Specifies the rotation.
   *                Tilde notation can be used to specify a rotation relative to
   *                the target's previous rotation.
   */
  tp(
    targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
    location: Macroable<Coordinates<MACRO>, MACRO>,
    rotation: Macroable<Rotation<MACRO>, MACRO>,
  ): void

  tp(...args: unknown[]): any {
    const parsedArgs = [...args.slice(0, 3).map(coordinatesParser), ...args.slice(3).map(targetParser)]

    if (parsedArgs.length === 2 && (parsedArgs[1] instanceof VectorClass || typeof parsedArgs[1] === 'string')) {
      return this.subCommand(parsedArgs, TeleportFacingCommand<MACRO>, true)
    }

    return this.finalCommand(parsedArgs)
  }
}
