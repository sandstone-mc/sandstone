import { Datapack } from './datapack'
import type { Flow } from './flow'

import { getConfigFile } from './config'

const configFile = getConfigFile()

export const datapack = new Datapack(configFile?.namespace ?? process.env.NAMESPACE ?? 'default')
export const { commandsRoot } = datapack
export const _: Omit<Flow, 'arguments'> = datapack.flow

export * from './variables'
