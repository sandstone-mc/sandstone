import {
  data, execute,
} from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'
import { createObjective, Selector } from '../src/variables'

const jinxCooldown = createObjective('jinxCooldown', 'dummy')
const myCooldown = jinxCooldown.ScoreHolder('@s')

const rng = createObjective('rng', 'dummy')
const myRng = rng.ScoreHolder('@s')

function getRotation() { return Math.random() * 360 }

const buffActiveFunc = mcfunction('buffactive', () => {})

mcfunction('test', () => {
  const closestCow = Selector('@e', { type: 'minecraft:cow', limit: 1 })
  data.modify.entity(closestCow, 'Health').set.value(0)
})

saveDatapack('myDatapack', { verbose: true, world: 'Crea1_15' })
