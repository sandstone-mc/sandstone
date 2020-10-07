import type { LiteralUnion } from '../src/arguments'
import {
  execute, gamerule, give, raw, say, tellraw,
} from '../src/commands'
import {
  mcfunction, Predicate, Recipe, saveDatapack, Tag, _,
} from '../src/core'
import {
  createObjective, rel, Selector, Variable,
} from '../src/variables'
import { Menu } from './menu'

mcfunction('test', () => {
  const counter = Variable(0)

  _.while(counter.lowerOrEqualThan(10), () => {
    say('hi')
    say('ho')
    counter.add(1)
  })
})

saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })
