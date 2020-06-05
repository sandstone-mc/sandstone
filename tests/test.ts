import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

const giveDiamonds = mcfunction('giveDiamonds', (count: number) => {
  give('@a', 'minecraft:diamond', count)
})

mcfunction('main', () => {
  say('Giving diamonds to everyone!')
  giveDiamonds(32)
})

saveDatapack('My datapack', { verbose: true })
