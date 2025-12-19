import type { Dispatcher } from 'sandstone/generated/dispatcher'
import type { MooshroomType } from 'sandstone/generated/world/component/entity'
import type { Breedable } from 'sandstone/generated/world/entity/mob/breedable'

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
