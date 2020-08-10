import { CommandsRoot } from './commands'
import { Datapack } from './datapack'

export {
  Selector,
  abs, absolute,
  loc, local,
  rel, relative,
} from './variables'

export const datapack = new Datapack('default')
const commandsRoot = new CommandsRoot(datapack)

export const { say, teleport, tellraw, attribute, bossbar, clear, clone } = commandsRoot
