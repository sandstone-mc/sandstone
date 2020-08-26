import { Selector } from '../src/variables'
import {
  say, team, teammessage, title,
} from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'

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

  team.add('cc', {})

  teammessage('cc')

  title(Selector('@a', { x_rotation: 0, score: { test: [0, 1] } })).actionbar({})
})

saveDatapack('My Datapack', {
  verbose: true,
})
