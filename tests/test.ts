import { mcfunction, saveDatapack } from '../src/core'

import {
  advancement,
  attribute, bossbar, clear, clone, data, datapack, enchant, execute, fill, say, scoreboard,
  teleport, tellraw,
} from '../src/commands'

import {
  abs,
  createObjective, Selector, self,
} from '../src/variables'

const kills = createObjective('kills', 'playerKills')
const myKills = kills.ScoreHolder('@s')

mcfunction('multiply_kills', () => {
  execute.if(myKills.greaterThan('@r', 'kills')).runOne.say('Hello')
  execute.if(myKills.equalTo('@r', 'kills')).runOne.say('Hello')

  fill(abs(0, 0, 0), abs(10, 10, 10), 'minecraft:acacia_button')
})

saveDatapack('My Awesome Datapack', { verbose: true })
