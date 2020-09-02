import 'module-alias/register'
import { Datapack } from './datapack'
import { Flow } from './flow'

export const datapack = new Datapack('default')
export const { commandsRoot } = datapack
export const _ = new Flow(commandsRoot)

export * from './variables'

export { MinecraftCondition } from './arguments'
export { CombinedConditions } from './flow'
