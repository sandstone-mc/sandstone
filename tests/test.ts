import { createObjective, Selector } from '../src/variables'
import {
  execute,
  msg,
  say, team, teammessage, title, w, weather,
} from '../src/commands'
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

  execute.if(kills.ScoreHolder('@s').greaterThan(0)).runOne.worldborder.setWarningDistance(5)
})

saveDatapack('My Datapack', {
  verbose: true,
})
