import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

const giveDiamonds = mcfunction('giveDiamonds', () => {
  give('@a', 'minecraft:diamond', 64)
})

mcfunction('main', () => {
  say('Giving diamonds to everyone!')
  giveDiamonds()
})

saveDatapack('My datapack', { verbose: true })
