/** TODO: autogenerate that whole file */
import { COMMANDS_TREE, COMMANDS_TREE_TYPE } from './commandsTree/commands'

import type { SandstoneRoot } from './commands/types'
import { createCommandsResolver } from './commands/resolver'
import Datapack from './commands/Datapack'

type TypedSandstoneRoot = SandstoneRoot<COMMANDS_TREE_TYPE>

const dp = new Datapack('default')

const sandstone: TypedSandstoneRoot = createCommandsResolver(dp, COMMANDS_TREE) as any

export { COMMANDS_TREE }

export const { mcfunction, save: saveDatapack } = dp

export const {
  advancement,
  clone,
  execute,
  experience,
  teleport,
  xp,
  attribute,
  bossbar,
  clear,
  data,
  datapack,
  defaultgamemode,
  difficulty,
  gamemode,
  gamerule,
  effect,
  enchant,
  forceload,
  fill,
  give,
  help,
  kill,
  locate,
  locatebiome,
  loot,
  setblock,
  me,
  msg,
  particle,
  playsound,
  recipe,
  reload,
  scoreboard,
  say,
  schedule,
  replaceitem,
  seed,
  setworldspawn,
  spawnpoint,
  spectate,
  stopsound,
  spreadplayers,
  summon,
  tell,
  tellraw,
  title,
  tag,
  team,
  teammsg,
  time,
  tm,
  tp,
  trigger,
  w,
  weather,
  worldborder,
} = sandstone
