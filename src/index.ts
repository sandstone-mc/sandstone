// Everything you are going to see is auto generated. Nothing hardcoded there.

import {
  effect, reload, execute, advancement, setblock, fill, mcfunction, saveDatapack,
} from './commandsTree'

mcfunction('main', () => {
  const giveEffect = effect.give.call(null, '@a', 'minecraft:absorption', 30, 2, true)

  effect.give('@a', 'minecraft:absorption', 30, 2)
  effect.clear('@a', 'minecraft:absorption')
  reload()

  advancement.grant('@a').everything()

  setblock('0 0 0', 'minecraft:acacia_button', 'destroy')

  execute.as('@a').run(() => {
    fill('0 0 0', '1 1 1', 'minecraft:acacia_button')
    fill('0 0 0', '1 1 1', 'minecraft:acacia_button').keep()
    fill('0 0 0', '1 1 1', 'minecraft:acacia_button').replace('minecraft:air')
  })

  execute.as('@s').say('Hello')
})

saveDatapack()
