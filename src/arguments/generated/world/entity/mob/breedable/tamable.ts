import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { DyeColorByte } from 'sandstone/arguments/generated/util/color.js'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'
import type { NeutralMob } from 'sandstone/arguments/generated/world/entity/mob.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { NBTIntArray } from 'sandstone'

export type Cat = (Tamable & {
    /**
     * Collar color, present for stray cats. Defaults to 14 (red).
     *
     * Value:
     *
     *  - White(`0`)
     *  - Orange(`1`)
     *  - Magenta(`2`)
     *  - LightBlue(`3`)
     *  - Yellow(`4`)
     *  - Lime(`5`)
     *  - Pink(`6`)
     *  - Gray(`7`)
     *  - LightGray(`8`)
     *  - Cyan(`9`)
     *  - Purple(`10`)
     *  - Blue(`11`)
     *  - Brown(`12`)
     *  - Green(`13`)
     *  - Red(`14`)
     *  - Black(`15`)
     */
    CollarColor?: DyeColorByte
    variant?: Registry['minecraft:cat_variant']
})

export type CatType = (-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)

export type Parrot = (Tamable & {
    /**
     * Value:
     *
     *  - RedBlue(`0`)
     *  - Blue(`1`)
     *  - Green(`2`)
     *  - YellowBlue(`3`)
     *  - Gray(`4`)
     */
    Variant?: ParrotVariantInt
})

export type ParrotVariantInt = (0 | 1 | 2 | 3 | 4)

export type Tamable = (Breedable & {
    /**
     * Value:
     * Array length range: 4
     */
    Owner?: NBTIntArray<{
        leftExclusive: false
        rightExclusive: false
        min: 4
        max: 4
    }>
    /**
     * Whether the mob is sitting.
     */
    Sitting?: boolean
})

export type Wolf = (Tamable & NeutralMob & {
    /**
     * Collar color, present for wild wolfs. Defaults to 14 (red).
     *
     * Value:
     *
     *  - White(`0`)
     *  - Orange(`1`)
     *  - Magenta(`2`)
     *  - LightBlue(`3`)
     *  - Yellow(`4`)
     *  - Lime(`5`)
     *  - Pink(`6`)
     *  - Gray(`7`)
     *  - LightGray(`8`)
     *  - Cyan(`9`)
     *  - Purple(`10`)
     *  - Blue(`11`)
     *  - Brown(`12`)
     *  - Green(`13`)
     *  - Red(`14`)
     *  - Black(`15`)
     */
    CollarColor?: DyeColorByte
    body_armor_item?: ItemStack
    variant?: Registry['minecraft:wolf_variant']
    sound_variant?: Registry['minecraft:wolf_sound_variant']
})
