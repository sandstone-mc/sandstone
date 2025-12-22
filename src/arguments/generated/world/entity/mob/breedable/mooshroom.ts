import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { MooshroomType } from 'sandstone/arguments/generated/world/component/entity.js'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'

export type Mooshroom = (Breedable & {
  /**
     * Value:
     *
     *  - Red(`red`)
     *  - Brown(`brown`)
     */
  Type?: MooshroomType
  stew_effects?: Dispatcher<'minecraft:data_component'>['suspicious_stew_effects']
})
