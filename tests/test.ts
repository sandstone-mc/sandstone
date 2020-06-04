import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock,
} from '../src'

mcfunction('main', () => {
  execute.as('@a').at('@s').run(() => {
    // All this commands are executed "as @a at @s".
    // Sets a block of dirt under all players, and air on their body & head.
    setblock('~ ~-1 ~', 'minecraft:dirt')
    setblock('~ ~ ~', 'minecraft:air')
    setblock('~ ~1 ~', 'minecraft:air')
  })
})

saveDatapack()
