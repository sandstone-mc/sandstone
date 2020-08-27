import {
  execute,
  msg,
  say, team, teammessage, title, w, weather,
} from '../src/commands'
import { createObjective, Selector } from '../src/variables'
import { mcfunction, saveDatapack } from '../src/core'

const kills = createObjective('kills', 'playerKillCount')

const recursion = mcfunction('recursion', () => {
  recursion()
})

const ping = mcfunction('ping', () => {
  say('ping')
  pong()
})

const pong = mcfunction('pong', () => {
  say('pong')
  ping()
})

saveDatapack('My datapack', {
  verbose: true,
  dryRun: true,
})
