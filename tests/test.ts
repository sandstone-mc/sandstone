import { advancement, replaceitem } from '../src/commands'
import { saveDatapack, mcfunction } from '../src/core'

console.log('before')
const test = mcfunction('test', (arg = 0) => {
  replaceitem.entity('@s', 'armor.chest', 'minecraft:acacia_button')
  test(1)
}, { lazy: true })
console.log('after')

mcfunction('cc', () => {
  console.log('INSIDE CC')
  test.schedule(0, 'append')
  test()
  test(2)
})

saveDatapack('test', {
  world: 'Crea1_15',
  verbose: true,
})
