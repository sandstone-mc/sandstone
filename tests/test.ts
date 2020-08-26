import {
  execute,
  msg,
  say, team, teammessage, title, w, weather,
} from 'sandstone/commands'
import { createObjective, Selector } from 'sandstone/variables'
import { mcfunction, saveDatapack } from 'sandstone/core'

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

  execute.if(kills.ScoreHolder('@s').greaterThan(0)).runOne.worldborder.setWarningDistance(1)
})

saveDatapack('My datapack', {
  verbose: true,
})
