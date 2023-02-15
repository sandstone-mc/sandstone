import { CommandNode } from '#core/nodes'

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
   * Disable the specified pack.
   *
   * @param name Specifies the name of the data pack.
   */
  disable = (name: string) => this.finalCommand([name])

  /**
   * Enable the specified pack.
   *
   * @param name Specifies the name of the data pack.
   *
   * @example
   *
   * // Enable `myDatapack`, and give it the highest priority
   * datapack.enable('myDatapack').last()
   *
   * // Enable `myDatapack`, just before `importantDatapack`.
   * // `mydatapack` will have a lower priority.
   * datapack.enable('myDatapack').before('importantDatapack')
   */
  enable = (name: string) => this.subCommand(['enable', name], DataPackEnableCommand, false)

  /**
   * List all data packs, or list only the available/enabled ones.
   *
   * Hovering over the data packs in the chat output shows their description defined in their pack.mcmeta.
   *
   * @param typ `"available"` to only show available datapacks, `"enabled"` to only show enabled ones.
   */
  list = (type: 'available' | 'enabled') => this.finalCommand(['list', type])
}
