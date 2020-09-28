import type { JsonTextComponent } from '../src/arguments'
import { effect, execute, say } from '../src/commands'
import {
  Advancement, mcfunction, saveDatapack, Predicate, _,
} from '../src/core'
import { Menu } from './menu'
import sandstone from './sandstone.json'

const test = Advancement('coucou:test', {
  criteria: {
    test: {
      trigger: 'minecraft:impossible',
    },
  },
})

const pred = Predicate('mypredicate', [
  {
    condition: 'minecraft:random_chance',
    chance: 0.5,
  },
])

mcfunction('myfunc', () => {
  _
    .if(pred, () => {
      say('Lucky boï')
    })
    .elseIf(pred, () => {
      say('Unlucky boï...')
      effect.give('@s', 'minecraft:slowness')
    })
    .else(() => {
      say('else')
    })
})

mcfunction('test', () => {
  const myMenu = new Menu({
    '0': ['minecraft:birch_fence', { Test: 0 }, () => {
      say('Callback')
    }],
    '2': ['minecraft:acacia_boat', {
      '0': 'minecraft:zombie_spawn_egg',
    }],
  })

  myMenu.start('@p')
})

console.log(sandstone)
saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })
