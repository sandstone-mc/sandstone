import {
  execute, gamerule, say, tellraw,
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

saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })
