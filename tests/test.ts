import { comment, say } from 'src/commands'
import {
  MCFunction, savePack, _,
} from 'src/core'
import { Variable } from 'src/variables'

const myFunc = MCFunction('recursive', () => {
  comment('Hey!')
  myFunc()
})

savePack('My Datapack', {
  verbose: true,
  world: 'Crea1_15',
})
