import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'
import type { NBTInt } from 'sandstone'

export type Chicken = (Breedable & {
  /**
     * Whether it is from a chicken jockey.
     * If true it will despawn and will drop more experience.
     */
  IsChickenJockey?: boolean
  /**
     * Time until it lays another egg.
     */
  EggLayTime?: NBTInt
  variant?: Registry['minecraft:chicken_variant']
})
