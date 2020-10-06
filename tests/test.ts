import type { LiteralUnion } from '../src/arguments'
import {
  execute, gamerule, give, raw, say, tellraw,
} from '../src/commands'
import {
  mcfunction, Predicate, Recipe, saveDatapack, Tag, _,
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

const cc = mcfunction('cc', () => {})

Tag('functions', 'hi2', [
  'test:mc',
  'minecraft:acacia_button',
  cc,
])

saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })
