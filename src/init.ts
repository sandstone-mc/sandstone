import chalk from 'chalk'
import { nanoid } from 'nanoid'

import { Datapack } from './datapack'

import type { Flow } from './flow'

let packUid: string

if (!process.env.PACK_UID) {
  packUid = nanoid(8)
  console.error(chalk.red(`\`packUid\` property missing from \`sandstone.config.ts\`. A new one will be generated at each build, which is **not** recommended. Please add the following line:

  packUid: '${packUid}',

to \`sandstone.config.ts\`, or set the PACK_UID environment variable.`))
} else {
  packUid = process.env.PACK_UID
}

export const dataPack = new Datapack(packUid, process.env.NAMESPACE ?? 'default')
export const { commandsRoot } = dataPack
export const _: Omit<Flow, 'arguments'> = dataPack.flow

export * from './variables'
