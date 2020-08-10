say Hello
teleport @a 0 0 0
teleport @a 0 0 0 facing entity @s 
teleport @s[advancements={story/form_obsidian=true, story/obtain_armor={iron_helmet=true}}]
tellraw @a {"text": "cc"}
attribute @s BaseModifier get 
bossbar add minecraft:test {"text": "cc"}
clone 0 0 0 1 1 1 2 2 2 filtered minecraft:acacia_button force
clear @a minecraft:acacia_boat[test=cc] 