import type { JsonTextComponent } from '../src/arguments'
import { effect, execute, say } from '../src/commands'
import {
  Advancement, mcfunction, saveDatapack, Predicate, _,
} from '../src/core'

const test = Advancement('coucou:test', {
  criteria: {
    test: {
      trigger: 'minecraft:impossible',
    },
  },
})

const pred = Predicate('mypredicate', {
  condition: 'minecraft:random_chance',
  chance: 0.8,
})

mcfunction('myfunc', () => {
  _
    .if(pred, () => {
      test.grant('@s')
    })
    .elseIf(pred, () => {
      effect.give('@s', 'minecraft:slowness')
    })
    .else(() => {
      say('else')
    })
})

saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })
