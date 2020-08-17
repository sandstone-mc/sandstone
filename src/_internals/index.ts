import 'module-alias/register'

import { Datapack } from './datapack'

export const datapack = new Datapack('default')
export const { commandsRoot } = datapack

export * from './variables'
