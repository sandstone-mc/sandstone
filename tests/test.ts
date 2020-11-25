/** eslint-disable */
import {
  effect, give, say, summon, tellraw,
} from '../src/commands'
import {
  Advancement,
  BasePath, LootTable, MCFunction, Predicate, Recipe, savePack,
} from '../src/core'
import { NBT, rel, Selector } from '../src/variables'
import { datapack, _ } from '../src/_internals'
import { ResourcesTree } from '../src/_internals/datapack/resourcesTree'
import { Menu } from './menu'

datapack.resources = new ResourcesTree()

// Advancement granted to survival players breeding 2 cows
const breedCowsAdvancement = Advancement('breed_cows', {
  criteria: {
    bred_two_cows: {
      trigger: 'minecraft:bred_animals',
      conditions: {
        child: { type: 'minecraft:cow' },
        player: { gamemode: 'survival' },
      },
    },
  },

  display: {
    icon: {
      item: 'minecraft:player_head',
      nbt: NBT.toString({
        display: { Name: JSON.stringify([{ text: 'Cow' }]) },
        SkullOwner: {
          Id: [210170708, 1898725698, -1548776749, -180478570],
          Properties: {
            textures: [{
              Value: 'eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzVhOWNkNThkNGM2N2JjY2M4ZmIxZjVmNzU2YTJkMzgxYzlmZmFjMjkyNGI3ZjRjYjcxYWE5ZmExM2ZiNWMifX19',
            }],
          },
        },
      }),
    },
    description: [{ text: 'Breed two cows together.' }],
    title: ['Breed two cows'],
    announce_to_chat: true,
    show_toast: true,
    background: 'minecraft:dirt',
  },
})

const myBasePath = BasePath({
  namespace: 'mydatapack',
  directory: 'path/to/',
})

const myPred = myBasePath.Predicate('test_if_sprinting', {
  condition: 'minecraft:entity_properties',
  entity: 'this',
  predicate: {
    flags: {
      is_sprinting: true,
    },
  },
})

myBasePath.child({ directory: 'hiss' }).Function('boost_skeletons', () => {
  // Give skeletons speed II for 10 seconds
  const skeletons = Selector('@e', {
    type: 'minecraft:skeleton',
  })

  effect.give(skeletons, 'minecraft:speed', 10, 1)

  summon('minecraft:skeleton', rel(0, 0, 0), {
    Rotation: NBT.float([90, 0]),
  })
})

MCFunction('pred', () => {
  _.if(myPred, () => {
    say('hi')
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
        tellraw('@a', [{ selector: '@s' }, { text: ' is going berzerk!', color: 'red' }])
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

MCFunction('go', () => {
  give('@a', `minecraft:player_head${NBT.toString({
    display: { Name: JSON.stringify([{ text: 'Cow' }]) },
    SkullOwner: {
      Id: NBT.integerArray([210170708, 1898725698, -1548776749, -180478570]),
      Properties: {
        textures: [{
          Value: 'eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvYzVhOWNkNThkNGM2N2JjY2M4ZmIxZjVmNzU2YTJkMzgxYzlmZmFjMjkyNGI3ZjRjYjcxYWE5ZmExM2ZiNWMifX19',
        }],
      },
    },
  })}`, 1)
})

/** Give 1 diamond if the weather is clear, 2 if it is raining. */
const l = LootTable('give_diamond', {
  pools: [{
    rolls: 1,
    entries: [{
      type: 'item',
      name: 'minecraft:diamond',
    }],
  }],
})

Advancement('breed_chickens', {
  criteria: {
    bred_chickens: {
      trigger: 'minecraft:bred_animals',
      conditions: {
        child: { type: 'minecraft:chicken' },
      },
    },
  },
  parent: breedCowsAdvancement,
})

/** Check if the location is inside swamp water. */
Predicate('in_swamp_water', {
  condition: 'minecraft:location_check',
  predicate: {
    biome: 'minecraft:swamp',
    fluid: {
      fluid: 'minecraft:water',
    },
  },
})

// Cooking cookies now gives coal.
Recipe('burning_cookies', {
  type: 'smelting',
  ingredient: {
    item: 'minecraft:cookie',
  },
  experience: 0,
  result: 'minecraft:coal',
  cookingtime: 50,
})

savePack('My Datapack', {
  world: 'Crea1_15',
  description: 'hi',
  verbose: true,
})

MCFunction('my_func', () => {
  say('Hi!')
  tellraw('@a', [{ text: 'I love ' }, { selector: '@a', color: 'aqua' }])
})

const playerWhoBredCows = Selector('@a', {
  advancements: {
    [breedCowsAdvancement.name]: {
      bred_cows: true,
      bred_chickens: false,
    },
  },
})

const breedAnimalsAdvancement = Advancement('breed_cows_and_chicken', {
  criteria: {
    bred_cows: {
      trigger: 'minecraft:bred_animals',
      conditions: {
        child: { type: 'minecraft:cow' },
      },
    },
    bred_chicken: {
      trigger: 'minecraft:bred_animals',
      conditions: {
        child: { type: 'minecraft:chicken' },
      },
    },
  },
})
