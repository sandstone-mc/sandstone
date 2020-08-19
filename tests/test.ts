import { abs } from '../src/variables'
import { execute, say, teleport, particle } from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'

mcfunction('main', () => {
    execute.as('@a').at('@s').run(() => {
        // All this commands are executed "as @a at @s".
        // Sets a block of dirt under all players, and air on their body & head.
        say('~ ~-1 ~', 'minecraft:dirt')
        say('~ ~ ~', 'minecraft:air')
        say('~ ~1 ~', 'minecraft:air')
    })
})

saveDatapack('My datapack', { verbose: true })
