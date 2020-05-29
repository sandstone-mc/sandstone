// Everything you are going to see is auto generated. Nothing hardcoded there.

import {
  effect, setblock, enchant, execute, particle, locatebiome, playsound,
} from './commandsTree'

// 1. Give everyone haste 2
effect.give('@a', 'minecraft:haste', 30, 2)

// 2. Set obsidian at 0 0 0
setblock('~ ~ ~', 'minecraft:obsidian')

// 3. Enchant all players current object with sharpness 2
enchant('@a', 'minecraft:sharpness')

// 4. Summon a skeleton at every player
execute.as('@a').at('@s').summon('minecraft:skeleton')

// 5. Put a bunch of soul fire flame particles
particle('minecraft:soul_fire_flame')

// 6. Locate the closest bamboo jungle hills
locatebiome('minecraft:bamboo_jungle_hills')

// 7. Make a creepy cave sound
playsound('minecraft:ambient.cave')
