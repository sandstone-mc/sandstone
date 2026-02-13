import type { BASIC_COLORS, SingleEntityArgumentOf } from 'sandstone/arguments'
import type { Macroable, WaypointStyleClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments, type FinalCommandOutput } from '../../helpers'
import type { NamespacedLiteralUnion } from 'sandstone'

export class WaypointCommandNode extends CommandNode {
  command = 'waypoint' as const
}

/**
 * Manages waypoints displayed on the locator bar.
 *
 * @see https://minecraft.wiki/w/Commands/waypoint
 */
export class WaypointCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = WaypointCommandNode

  /**
   * Lists all tracked waypoints from entities.
   *
   * Displays each player's name or entity's type with their waypoint color.
   */
  list = () => this.finalCommand(['list'])

  /**
   * Modify an entity's waypoint appearance.
   *
   * @param target The entity whose waypoint to modify (player name, target selector, or UUID).
   */
  modify = <T extends string>(target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>) =>
    this.subCommand(['modify', targetParser(target)], WaypointModifyArguments<MACRO>, false)
}

export class WaypointModifyArguments<MACRO extends boolean> extends CommandArguments {
  /**
   * Sets the waypoint color to a standard Minecraft color.
   *
   * @param name One of the 16 standard Minecraft color names.
   */
  color(name: Macroable<Exclude<BASIC_COLORS, 'reset'>, MACRO>): FinalCommandOutput

  /**
   * Resets the waypoint color to its default (randomly chosen by the game, or the entity's team color).
   */
  color(type: 'reset'): FinalCommandOutput

  /**
   * Sets the waypoint color using a hexadecimal color code.
   *
   * @param color A 6-digit hexadecimal color code (RRGGBB format). Can be a number (usually formatted as `0xFFFFFF`) or string.
   */
  color(type: 'hex', color: Macroable<number | string, MACRO>): FinalCommandOutput

  /**
   * Sets the waypoint color using RGB values (0-255 per channel).
   *
   * @param color An array of `[red, green, blue]` values, each from 0 to 255.
   */
  color(type: 'rgb', color: [number, number, number]): FinalCommandOutput

  /**
   * Sets the waypoint color using RGB percentage values (0-1 per channel).
   *
   * @param color An array of `[red, green, blue]` values, each from 0.0 to 1.0.
   */
  color(type: 'rgb%', color: [number, number, number]): FinalCommandOutput

  color(type: Macroable<BASIC_COLORS | 'hex' | 'rgb' | 'rgb%', MACRO>, color?: Macroable<number | string | [number, number, number], MACRO>) {
    if (type === 'hex') {
      if (typeof color !== 'number') {
        return this.finalCommand(['color', 'hex', color])
      }
      return this.finalCommand(['color', 'hex', color.toString(16).toUpperCase().padStart(6, '0')])
    }
    if (type === 'rgb') {
      if (Array.isArray(color)) {
        const [red, green, blue] = color

        const hex = ((red << 16) + (green << 8) + (blue))

        return this.finalCommand(['color', 'hex', hex.toString(16).toUpperCase().padStart(6, '0')])
      }
      throw new Error(`[WaypointModifyArguments#color] Invalid color argument: ${color}`)
    }
    if (type === 'rgb%') {
      if (Array.isArray(color)) {
        const [red, green, blue] = color.map((c) => c * 255)

        const hex = ((red << 16) + (green << 8) + (blue))

        return this.finalCommand(['color', 'hex', hex.toString(16).toUpperCase().padStart(6, '0')])
      }
      throw new Error(`[WaypointModifyArguments#color] Invalid color argument: ${color}`)
    }
    return this.finalCommand(['color', type])
  }

  /**
   * Resets the waypoint style to the default.
   */
  style(operation: 'reset'): FinalCommandOutput

  /**
   * Sets the waypoint style from a resource pack's `waypoint_style` directory.
   *
   * @param waypointStyle Resource location for the waypoint style.
   */
  style(operation: 'set', waypointStyle: WaypointStyleClass | NamespacedLiteralUnion<'minecraft:default'>): FinalCommandOutput

  style(operation: 'reset' | 'set', waypointStyle?: WaypointStyleClass | string) {
    if (operation === 'reset') {
      return this.finalCommand(['style', 'reset'])
    }
    return this.finalCommand(['color', 'set', waypointStyle])
  }
}
