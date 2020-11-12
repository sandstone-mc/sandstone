import { effect, give, tellraw } from '../src/commands'
import { mcfunction, savePack } from '../src/core'
import { Selector } from '../src/variables'
import { datapack } from '../src/_internals'
import { Menu } from './menu'

datapack.defaultNamespace = 'random'

mcfunction('boost_skeletons', () => {
  // Give skeletons speed II for 10 seconds
  const skeletons = Selector('@e', {
    type: 'minecraft:skeleton',
  })

  effect.give(skeletons, 'minecraft:speed', 10, 1)
})

mcfunction('test', () => {
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

savePack('My Datapack', {
  description: 'gi',
  world: 'Crea1_15',
  verbose: false,
})
