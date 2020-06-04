/* eslint-disable quote-props */

import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

import { Knight } from './classes/knight'
import { Wizard } from './classes/wizard'


const classes = [new Knight(), new Wizard()]

mcfunction('main', () => {
  // Execute as players who used a skill
  execute.as('@a[scores={useSkill=0..}]').run(() => {
    // For each class
    for (const class_ of classes) {
      // The player is a of the current class
      execute.as(`@s[scores={class=${class_.class}}]`).run(class_.skill)
    }
  })
})


saveDatapack()
