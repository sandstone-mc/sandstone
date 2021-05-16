import chalk from 'chalk'
import { nanoid } from 'nanoid'

import { Datapack } from './datapack'
import { NAMESPACE, PACK_UID } from './env'

import type { Flow } from './flow'

const packUid = PACK_UID ?? 'default_uid'

export const dataPack = new Datapack(packUid, NAMESPACE ?? 'default')
export const { commandsRoot } = dataPack
export const _: Omit<Flow, 'arguments'> = dataPack.flow

export * from './variables'
