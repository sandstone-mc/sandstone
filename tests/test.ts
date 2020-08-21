import { createObjective, Selector } from '../src/variables'
import { advancement, execute, replaceitem, say } from '../src/commands'
import { saveDatapack, mcfunction } from '../src/core'

const recursion = mcfunction('recursion', () => {
  recursion()
}, { lazy: true })

mcfunction('main', () => {
  recursion()
})

saveDatapack('My Datapack', {
  verbose: true,
})