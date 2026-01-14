import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'

export type Pig = (Saddled & {
  variant?: Registry['minecraft:pig_variant']
})

export type Saddled = Breedable
