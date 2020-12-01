import { say, tellraw } from 'src/commands'
import { MCFunction, sleep, savePack } from 'src/core'

const disp = MCFunction('display_message', async () => {
  say('ho')
  await sleep(10)
  say('oops I slept too much')
})

MCFunction('test', () => {
  say('b4')
  disp()
  say('aftR')
})

savePack('My Datapack', {
  verbose: true,
  world: 'Crea1_15',
  dryRun: true,
})
