import {
  execute, gamerule, raw, say, tellraw,
} from '../src/commands'
import {
  mcfunction, Recipe, saveDatapack, _,
} from '../src/core'
import { createObjective, Selector } from '../src/variables'

Recipe('test', {
  type: 'blasting',
  ingredient: { item: 'minecraft:acacia_boat' },
  result: 'minecraft:coal',
  experience: 0,
})

mcfunction('cc', () => {
  raw('mount', 'cc')
})

saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })

/*

Added Recipe, raw command, and updated README

@TheMrZZ TheMrZZ released this now

Added Recipe, a raw command that can be used to create custom commands, and updated README.
Github Releases will now automatically be published to NPM.

*/
