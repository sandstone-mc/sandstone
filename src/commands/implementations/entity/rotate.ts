import type { Coordinates, Rotation, SingleEntityArgumentOf } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments, FinalCommandOutput } from '../../helpers'

export class RotateCommandNode extends CommandNode {
  command = 'rotate' as const
}

/**
 * Changes an entity's rotation.
 *
 * @see https://minecraft.wiki/w/Commands/rotate
 */
export class RotateCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = RotateCommandNode

  /**
   * Sets an entity's rotation directly.
   *
   * @param rotation Yaw and pitch. Supports relative rotation.
   */
  rotate<T extends string>(
    target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    rotation: Macroable<Rotation<MACRO>, MACRO>,
  ): FinalCommandOutput

  /**
   * Rotates an entity to face a location or another entity.
   */
  rotate<T extends string>(
    target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
  ): RotateFacingArguments<MACRO>

  rotate<T extends string>(
    target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    rotation?: Macroable<Rotation<MACRO>, MACRO>,
  ) {
    if (rotation !== undefined) {
      return this.finalCommand([targetParser(target), coordinatesParser(rotation)])
    }
    return this.subCommand([targetParser(target)], RotateFacingArguments<MACRO>, false)
  }
}

export class RotateFacingArguments<MACRO extends boolean> extends CommandArguments {
  /**
   * Rotates the entity to face a block location.
   */
  facing = (location: Macroable<Coordinates<MACRO>, MACRO>): FinalCommandOutput =>
    this.finalCommand(['facing', coordinatesParser(location)])

  /**
   * Rotates the entity to face another entity.
   *
   * @param anchor Whether to face the entity's `'eyes'` or `'feet'`. Defaults to `'feet'`.
   */
  facingEntity = <T extends string>(
    entity: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    anchor?: Macroable<'eyes' | 'feet', MACRO>,
  ): FinalCommandOutput =>
    this.finalCommand(['facing', 'entity', targetParser(entity), anchor])
}