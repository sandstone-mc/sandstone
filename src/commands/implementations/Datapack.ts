import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

class DatapackEnable extends Command {
  /**
   * Load this pack before all others. It will have the lowest priority.
   */
  @command('first')
  first = () => {}

  /**
   * Load this pack after all others. It will have the highest priority.
   */
  @command('last')
  last = () => {}

  /**
   * Load this pack just before an existing pack.
   * It will have a lower priority than the existing one.
   *
   * @param name The name of the existing datapack.
   */
  @command('before')
  before = (name: string) => {}

  /**
   * Load this pack just after an existing pack.
   * It will have a higher priority than the existing one.
   *
   * @param name The name of the existing datapack.
   */
  @command('after')
  after = (name: string) => {}
}

/** Controls the loading/unloading of data packs. */
export class DatapackCommand extends Command {
  /**
   * Disable the specified pack.
   *
   * @param name Specifies the name of the data pack.
   */
  @command(['datapack', 'disable'], { isRoot: true })
  disable = (name: string) => {}

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
  @command(['datapack', 'enable'], { isRoot: true, hasSubcommands: true })
  enable = (name: string) => new DatapackEnable(this.commandsRoot)

  /**
   * List all data packs, or list only the available/enabled ones.
   *
   * Hovering over the data packs in the chat output shows their description defined in their pack.mcmeta.
   *
   * @param typ `"available"` to only show available datapacks, `"enabled"` to only show enabled ones.
   */
  @command(['datapack', 'list'], { isRoot: true })
  list = (type: 'available' | 'enabled') => {}
}
