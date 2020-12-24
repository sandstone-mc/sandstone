import { nanoid } from 'nanoid'
import { Datapack } from './datapack'
import type { Flow } from './flow'

let packUid = process.env.PACK_UID

if (!packUid) {
  packUid = nanoid(8)
  console.error(`\`packUid\` property missing from \`sandstone.config.ts\`. A new one will be generated at each build, which is **not** recommended. Please add the following line:

  packUid: '${packUid}',

to \`sandstone.config.ts\`, or set the PACK_UID environment variable.`)
}

export const dataPack = new Datapack(packUid, process.env.NAMESPACE ?? 'default')
export const { commandsRoot } = dataPack
export const _: Omit<Flow, 'arguments'> = dataPack.flow

export * from './variables'
