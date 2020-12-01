import { say, tellraw } from 'src/commands'
import { MCFunction, sleep, savePack } from 'src/core'

MCFunction('display_message', async () => {
  say('ho')
  await sleep(10)

  say('oops I slept too much')
  await sleep(12)

  say('once again')
})

savePack('My Datapack', {
  verbose: true,
  world: 'Crea1_15',
  dryRun: true,
})
