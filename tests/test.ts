import { MCFunction, savePack } from 'src/core'
import { createObjective } from 'src/variables'

MCFunction('test', () => {
  const myObjective = createObjective('test', 'dummy')
  const myPlayerScore1 = myObjective.ScoreHolder('@s')
  myPlayerScore1.moduloBy(5)
})

savePack('Hi', {
  asRootDatapack: true,
  verbose: true,
  dryRun: true,
})
