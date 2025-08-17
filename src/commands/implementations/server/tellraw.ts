import type { JSONTextComponent, MultiplePlayersArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { parseJSONText } from 'sandstone/variables/JSONTextComponentClass'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class TellRawCommandNode extends CommandNode {
  command = 'tellraw' as const
}

export class TellRawCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TellRawCommandNode

  /**
   * Send a formatted JSON text message to specific players.
   * 
   * Delivers rich text messages with advanced formatting, colors, and interactive
   * elements to the specified target players. Unlike say, this doesn't add any
   * server prefix and appears as direct communication.
   * 
   * The message supports full JSON text component specification including:
   * - Basic formatting: color, bold, italic, underlined, strikethrough, obfuscated
   * - Hover events: show_text, show_item, show_entity
   * - Click events: open_url, run_command, suggest_command, change_page, copy_to_clipboard
   * - Compound messages with multiple styled parts
   * 
   * @param targets Player selector(s) specifying who should receive the message.
   *                Can be individual players (@p, @a, player names) or selector expressions
   *                like @a[team=red] or @p[distance=..10].
   * 
   * @param message JSON text component defining the message content and formatting.
   *                Can be a simple text object or complex nested components with
   *                multiple parts, each with their own styling and interactions.
   * 
   * @example
   * ```ts
   * // Send to all players
   * tellraw('@a', {text: 'Game starting in 30 seconds!', color: 'yellow', bold: true})
   * 
   * // Send to specific player
   * tellraw('Steve', {text: 'You have a new message', color: 'green'})
   * 
   * // Send to players meeting criteria
   * tellraw('@a[team=blue]', {text: 'Your team is winning!', color: 'blue'})
   * 
   * // Interactive message with click and hover
   * tellraw('@p', {
   *   text: 'Visit our website',
   *   color: 'aqua',
   *   underlined: true,
   *   clickEvent: {action: 'open_url', value: 'https://example.com'},
   *   hoverEvent: {action: 'show_text', contents: 'Click to open in browser'}
   * })
   * 
   * // Multi-part message with different styling
   * tellraw('@a', [
   *   {text: 'Welcome ', color: 'white'},
   *   {text: 'VIP Player', color: 'gold', bold: true},
   *   {text: ' to the server!', color: 'white'}
   * ])
   * 
   * // Command suggestion on click
   * tellraw('@p', {
   *   text: '[Teleport Home]',
   *   color: 'green',
   *   clickEvent: {action: 'suggest_command', value: '/tp @s ~ ~10 ~'}
   * })
   * ```
   */
  tellraw = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>, message: Macroable<JSONTextComponent, MACRO>) =>
    this.finalCommand([targetParser(targets), parseJSONText(this.sandstoneCore, message)])
}
