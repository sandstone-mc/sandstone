import {
  effect, give, say, tellraw,
} from '../src/commands'
import {
  Advancement, MCFunction, Predicate, savePack, _,
} from '../src/core'
import { Menu } from './menu'

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

MCFunction('myfunc', () => {
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

MCFunction('test', () => {
  const menu = new Menu({
    // A menu giving the strength effect
    '0': ['minecraft:golden_sword', {
      '0': ['minecraft:wooden_sword', () => { effect.give('@s', 'minecraft:strength', 10, 0) }],
      '1': ['minecraft:iron_sword', () => { effect.give('@s', 'minecraft:strength', 10, 1) }],
      '2': ['minecraft:diamond_sword', () => { effect.give('@s', 'minecraft:strength', 10, 2) }],
      '3': ['minecraft:netherite_sword', () => { effect.give('@s', 'minecraft:strength', 10, 3) }],
      '4': ['minecraft:netherite_sword', { Enchantments: [{ id: 'minecraft:sharpness', lvl: 1 }] }, () => {
        tellraw('@a', [{ selector: '@s' }, { text: 'is going berzerk!', color: 'red' }])
        effect.give('@s', 'minecraft:strength', 10, 5)
      }],
    }],
    '4': ['minecraft:beef', {
      '3': ['minecraft:cooked_beef', () => { give('@s', 'minecraft:cooked_beef', 32) }],
      '4': ['minecraft:cooked_chicken', () => { give('@s', 'minecraft:cooked_chicken', 32) }],
      '5': ['minecraft:rabbit', () => { give('@s', 'minecraft:cooked_rabbit', 32) }],
    }],
  })

  menu.start('@p')
})

savePack('My datapack', { verbose: true, world: 'Crea1_15' })
