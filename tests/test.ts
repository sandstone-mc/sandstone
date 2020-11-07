import { effect } from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'
import { NBT, Selector } from '../src/variables'
import { datapack } from '../src/_internals'

datapack.defaultNamespace = 'random'

mcfunction('boost_skeletons', () => {
  // Give skeletons speed II for 10 seconds
  const skeletons = Selector('@e', {
    type: 'minecraft:skeleton',
  })

  effect.give(skeletons, 'minecraft:speed', 10, 1)
})

saveDatapack('My Datapack', {
  world: 'Crea1_15',
  verbose: true,
})
