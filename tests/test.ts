import { say, tellraw } from 'src/commands'
import { MCFunction, sleep, savePack } from 'src/core'

MCFunction('council', async () => {
  tellraw('@a', '[Aragorn] - You have my sword.')
  await sleep(10) // sleep 10 ticks, half a second.

  tellraw('@a', '[Legolas] - And my bow.')
  await sleep('1s') // sleep 1 second

  tellraw('@a', '[Gimly] - AND MY AXE!')
})

savePack('My Datapack', {
  verbose: true,
  world: 'Crea1_15',
  dryRun: true,
})
