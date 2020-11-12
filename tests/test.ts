import { effect } from '../src/commands'
import { mcfunction, savePack } from '../src/core'
import { Selector } from '../src/variables'
import { datapack } from '../src/_internals'

datapack.defaultNamespace = 'random'

mcfunction('boost_skeletons', () => {
  // Give skeletons speed II for 10 seconds
  const skeletons = Selector('@e', {
    type: 'minecraft:skeleton',
  })

  effect.give(skeletons, 'minecraft:speed', 10, 1)
})

savePack('My Datapack', {
  description: 'gi',
  async customFileHandler({
    relativePath, rootPath, packType, type, content, resource, saveOptions,
  }) {
    console.log('== New file ==\n')
    console.log('- packType:\t', JSON.stringify(packType))
    console.log('- type:\t\t', JSON.stringify(type))
    console.log('- rootPath:\t', JSON.stringify(rootPath))
    console.log('- relativePath: ', JSON.stringify(relativePath))
    console.log('- content:\t', JSON.stringify(content))
    console.log('- resource:\t', JSON.stringify(resource))
    console.log('- saveOptions:\t', JSON.stringify(saveOptions))

    console.log('\n')
  },
})
