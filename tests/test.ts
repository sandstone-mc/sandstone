import {
  execute, gamerule, give, raw, say, tellraw,
} from '../src/commands'
import {
  mcfunction, Predicate, Recipe, saveDatapack, _,
} from '../src/core'
import { createObjective, Selector } from '../src/variables'

const myPredicate = Predicate('mypred', {
  condition: 'minecraft:entity_scores',
  entity: 'killer',
  scores: {
    cc: {
      max: 0,
      min: 2,
    },
  },
})

const myScore = createObjective('aa', 'dummy')

const me = Selector('@s', {
  predicate: myPredicate,
  scores: {
    [myScore.name]: [0, Infinity],
  },
})

mcfunction('cc', () => {
  give(me, 'minecraft:blue_ice')
})

saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })
