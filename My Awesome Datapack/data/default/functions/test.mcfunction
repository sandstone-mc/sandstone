say Hello
teleport @s 0 0 0 facing entity Exymat eyes
teleport @s ~0 ~0 ~0 ~0 ~180
tellraw @a [{"score":{"name":"@s","objective":"test"}},{"selector":"@a"},{"nbt":"Path","block":"~0 ~0 ~0"}]