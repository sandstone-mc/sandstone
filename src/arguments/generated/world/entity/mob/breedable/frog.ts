import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'

export type Frog = (Breedable & {
  variant?: Registry['minecraft:frog_variant'],
})
