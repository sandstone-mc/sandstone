import {
  comment,
  give,
  tellraw,
} from '../src/commands'
import { mcfunction, saveDatapack, _ } from '../src/core'
import {
  createObjective, Selector,
} from '../src/variables'

const self = Selector('@s')
const kills = createObjective('kills', 'playerKillCount')
const myKills = kills.ScoreHolder('@s')

mcfunction('reward', () => {
  comment('Gives the player as many diamonds as the number of kills he made.')

  // First, tell everyone we're rewarding the player
  tellraw('@a', [{ text: 'Giving ' }, self, ' ', myKills, 'diamonds'])

  // Then, for each kill, give a diamond to the player
  _.while(
    _.or(
      myKills.greaterThan(0),
      myKills.lowerOrEqualThan(-5),
    ),
    () => {
      give('@s', 'minecraft:diamond', 1)
      myKills.remove(1)
    },
  )
})

saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })
