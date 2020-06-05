/* eslint-disable quote-props */

import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

import { Knight } from './classes/knight'
import { Wizard } from './classes/wizard'


const classes = [new Knight(), new Wizard()]

const main = mcfunction('hey', () => {
  setblock('~ ~1 ~', 'minecraft:air')
})

mcfunction('cc:no', () => {
  main()
})


saveDatapack('My Datapack', { verbose: true })
