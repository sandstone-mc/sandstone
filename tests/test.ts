import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

const giveDiamonds = mcfunction('giveDiamonds', (count = 1) => {
  give('@a', 'minecraft:diamond', count)
})

mcfunction('main', () => {
  say('Giving diamonds to everyone!')
  giveDiamonds(64)
  giveDiamonds(32)
})

saveDatapack('My datapack', { verbose: true })
