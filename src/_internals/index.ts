import { nanoid } from 'nanoid'
import { Datapack } from './datapack'
import type { Flow } from './flow'

import { getConfigFile } from './config'

const configFile = getConfigFile()

let dataPackCode: string = configFile?.randomCode ?? process.env.RANDOM_CODE
if (!dataPackCode) {
  dataPackCode = nanoid(8)
  console.error(`\`randomCode\` property missing from \`sandstone.config.ts\`. A new one will be generated at each build, which is **not** recommended. Please add the following line:\n\n  randomCode: '${dataPackCode}',\n\nto \`sandstone.config.ts\`.`)
}
export const dataPack = new Datapack(dataPackCode, configFile?.namespace ?? process.env.NAMESPACE ?? 'default')
export const { commandsRoot } = dataPack
export const _: Omit<Flow, 'arguments'> = dataPack.flow

export * from './variables'
