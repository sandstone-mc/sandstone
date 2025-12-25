import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers'

export class DataPackCommandNode extends CommandNode {
  command = 'datapack' as const
}

export class DataPackEnableCommand extends CommandArguments {
  /**
   * Load this pack before all others. It will have the lowest priority.
   */
  first = () => this.finalCommand(['first'])

  /**
   * Load this pack after all others. It will have the highest priority.
   */
  last = () => this.finalCommand(['last'])

  /**
   * Load this pack just before an existing pack.
   * It will have a lower priority than the existing one.
   *
   * @param name The name of the existing datapack.
   */
  before = (name: string) => this.finalCommand(['before', name])

  /**
   * Load this pack just after an existing pack.
   * It will have a higher priority than the existing one.
   *
   * @param name The name of the existing datapack.
   */
  after = (name: string) => this.finalCommand(['after', name])
}

export class DataPackCommand extends CommandArguments {
  protected NodeType = DataPackCommandNode

  /**
   * Disable a datapack.
   *
   * @param name Datapack name to disable.
   *            Examples: 'minecraft', 'vanilla', 'mypack'
   *
   * @example
   * ```ts
   * datapack.disable('mypack')        // Disable specific pack
   * ```
   */
  disable = (name: string) => this.finalCommand([name])

  /**
   * Enable a datapack with priority control.
   *
   * @param name Datapack name to enable.
   *            Examples: 'mypack', 'additional_features'
   *
   * @example
   * ```ts
   * datapack.enable('mypack').last()               // Highest priority
   * datapack.enable('mypack').first()              // Lowest priority
   * datapack.enable('mypack').before('vanilla')    // Load before vanilla
   * datapack.enable('mypack').after('base_pack')   // Load after base_pack
   * ```
   */
  enable = (name: string) => this.subCommand(['enable', name], DataPackEnableCommand, false)

  /**
   * List datapacks.
   *
   * @param type Optional filter: 'available' shows all packs, 'enabled' shows active packs.
   *            If not specified, shows all datapacks.
   *
   * @example
   * ```ts
   * datapack.list()                  // List all datapacks
   * datapack.list('enabled')         // List only enabled packs
   * datapack.list('available')       // List available packs
   * ```
   */
  list = (type?: 'available' | 'enabled') => this.finalCommand(['list', type])
}
