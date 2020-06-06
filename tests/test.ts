import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

mcfunction('a', () => {
  execute.as('@a').run(() => {
    say('hi')
  })
})

saveDatapack('My datapack', { verbose: true })
