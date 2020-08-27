import {
  give,
  say,
} from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'

function giveDiamonds(count: number) {
  give('@a', 'minecraft:diamond', count)
}

mcfunction('main', () => {
  giveDiamonds(64)
  giveDiamonds(32)
})

saveDatapack('My datapack', {
  verbose: true,
  dryRun: true,
})
