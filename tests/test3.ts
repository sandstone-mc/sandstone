import { kill, say } from 'src/commands'
import { MCFunction } from 'src/core'
import { Selector } from 'src/variables'

// Make a function that kills skeletons
MCFunction('kill_skeletons', () => {
  say('I hate skeletons!')
  const skeletons = Selector('@e', { type: 'minecraft:skeleton' })
  kill(skeletons)
})
