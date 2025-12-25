import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments } from '../../helpers'

// Say command

export class SayCommandNode extends CommandNode<[string]> {
  command = 'say' as const
}

export class SayCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SayCommandNode

  /**
   * Broadcast a message to all players from the server.
   * 
   * The message is sent to all players currently connected to the server.
   * Unlike tellraw, this uses plain text and appears in the standard chat format
   * with a "[Server]" prefix. The message is also logged to the server console.
   * 
   * Message formatting:
   * - Plain text only (no JSON text components)
   * - Automatically prefixed with "[Server]" in game
   * - Appears in gray color to distinguish from player chat
   * - Visible to all players regardless of their location or gamemode
   * 
   * @param message The plain text message to broadcast to all players.
   *                Can contain spaces and basic text. For advanced formatting,
   *                colors, or clickable text, use tellraw instead.
   * 
   * @example
   * ```ts
   * // Basic server announcements
   * say('Server maintenance in 10 minutes')
   * say('Welcome to the survival world!')
   * 
   * // Status messages
   * say('PvP has been enabled in the arena')
   * say('Daily reset complete')
   * 
   * // Event notifications
   * say('Treasure hunt starting at spawn!')
   * ```
   */
  say = (message: Macroable<string, MACRO>) => this.finalCommand([message])
}
