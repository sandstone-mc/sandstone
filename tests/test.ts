import { effect } from '../src/commands'
import {
  BasePath, savePack,
} from '../src/core'
import { Selector } from '../src/variables'

const myBasePath = BasePath({
  namespace: 'mydatapack',
})

myBasePath.Predicate('test_if_sprinting', {
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
})

savePack('My Datapack', {
  description: 'gi',
  world: 'Crea1_15',
  verbose: true,
})
