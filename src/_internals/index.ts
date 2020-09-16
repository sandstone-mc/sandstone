import 'module-alias/register'
import { Datapack } from './datapack'
import { Flow } from './flow'

export const datapack = new Datapack('default')
export const { commandsRoot } = datapack
export const _: Omit<Flow, 'arguments'> = datapack.flow

export * from './variables'
