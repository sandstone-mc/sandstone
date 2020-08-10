import { CommandsRoot } from './commands'
import { Datapack } from './datapack'

export * from './variables'

export const datapack = new Datapack('default')
const commandsRoot = new CommandsRoot(datapack)

export const { say, teleport, tellraw } = commandsRoot
