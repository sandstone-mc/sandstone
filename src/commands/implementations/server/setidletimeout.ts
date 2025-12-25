import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers'

export class SetIdleTimeoutCommandNode extends CommandNode {
  command = 'setidletimeout' as const
}

export class SetIdleTimeoutCommand extends CommandArguments {
  protected NodeType = SetIdleTimeoutCommandNode

  /**
   * Set the idle timeout duration for automatic player kicking.
   * 
   * Players who remain idle (no input or movement) for longer than the specified
   * time will be automatically kicked from the server. This does not affect:
   * - Server operators (players with op status)
   * - Players in creative or spectator mode
   * - Players who are actively interacting (moving, chatting, using items)
   * 
   * @param minutes The idle timeout in minutes. Must be a positive integer.
   *                - 0: Disables idle timeout (players can idle indefinitely)
   *                - 1-40000: Minutes before idle players are kicked
   *                - Values above 40000 may cause issues
   * 
   * @example
   * ```ts
   * setidletimeout(15)  // 15 minute timeout
   * setidletimeout(0)   // Disable timeout
   * setidletimeout(120) // 2 hour timeout for long sessions
   * ```
   */
  setidletimeout = (minutes: number) => this.finalCommand([minutes])
}
