/* eslint-disable quote-props */

import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

import { Knight } from './classes/knight'
import { Wizard } from './classes/wizard'


const classes = [new Knight(), new Wizard()]

const main = mcfunction(() => {
  execute.as('@a').at('@s').run(() => {
    // All this commands are executed "as @a at @s".
    // Sets a block of dirt under all players, and air on their body & head.
    setblock('~ ~-1 ~', 'minecraft:dirt')
    setblock('~ ~ ~', 'minecraft:air')
    setblock('~ ~1 ~', 'minecraft:air')
  })
})

mcfunction(() => {
  main()
})


saveDatapack('My Datapack', 'Test2')
