import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

const giveDiamonds = mcfunction('giveDiamonds', (count) => {
  give('@a', 'minecraft:diamond', count)
}, { lazy: true })

mcfunction('main', () => {
  say('Giving diamonds to everyone!')
  giveDiamonds(32)
  giveDiamonds(64)
})

saveDatapack('My datapack', { verbose: true })
