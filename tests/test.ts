import { advancement, replaceitem } from '../src/commands'
import { saveDatapack, mcfunction } from '../src/core'

const test = mcfunction('test', (arg: number | undefined = undefined) => {
  replaceitem.entity('@s', 'armor.chest', 'minecraft:acacia_button', arg)
  test(1)
}, { lazy: true })

mcfunction('cc', () => {
  test.schedule(0, 'append')
  test()
  test(2)
})

saveDatapack('My Datapack', {
  verbose: true,
})