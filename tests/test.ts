import { mcfunction, savePack } from "src/core";
import { createObjective } from "src/variables";

mcfunction('test', () => {
    const myObjective = createObjective('test', 'dummy')
  const myPlayerScore1 = myObjective.ScoreHolder('@s')
  myPlayerScore1.moduloBy(5)

})

savePack('Hi', {
  verbose: true,
  dryRun: true
})