import type { Registry } from 'sandstone/generated/registry'
import type { BlockEntity } from 'sandstone/generated/world/block'
import type { ItemStack } from 'sandstone/generated/world/item'
import type { NBTList, NBTLong } from 'sandstone'

export type DecoratedPot = (BlockEntity & {
    /**
     * Item ID of what was used for each side of the pot.
     *
     * Value:
     * List length range: 4
     */
    sherds?: NBTList<(Sherd | `minecraft:${Sherd}`), {
        leftExclusive: false
        rightExclusive: false
        min: 4
        max: 4
    }>
    /**
     * Loot table that will populate this container.
     */
    LootTable?: (Registry['minecraft:loot_table'] | '')
    /**
     * Seed of the loot table.
     */
    LootTableSeed?: NBTLong
    item?: ItemStack
})

export type Sherd = (
    | 'angler_pottery_sherd'
    | 'archer_pottery_sherd'
    | 'arms_up_pottery_sherd'
    | 'blade_pottery_sherd'
    | 'brewer_pottery_sherd'
    | 'brick'
    | 'burn_pottery_sherd'
    | 'danger_pottery_sherd'
    | 'explorer_pottery_sherd'
    | 'friend_pottery_sherd'
    | 'heart_pottery_sherd'
    | 'heartbreak_pottery_sherd'
    | 'howl_pottery_sherd'
    | 'miner_pottery_sherd'
    | 'mourner_pottery_sherd'
    | 'plenty_pottery_sherd'
    | 'prize_pottery_sherd'
    | 'sheaf_pottery_sherd'
    | 'shelter_pottery_sherd'
    | 'skull_pottery_sherd'
    | 'snort_pottery_sherd'
    | 'flow_pottery_sherd'
    | 'guster_pottery_sherd'
    | 'scrape_pottery_sherd')
