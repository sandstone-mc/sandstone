import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { Text } from 'sandstone/arguments/generated/util/text.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { _RawFunctionClass, AdvancementClass, NBTClass, NBTInt, NBTList } from 'sandstone'

export type Advancement = {
    /**
     * If present, advancement will be visible in the advancement tabs.
     */
    display?: AdvancementDisplay
    /**
     * If this field is absent, this advancement is a root advancement.
     * Circular references cause a loading failure.
     */
    parent?: (Registry['minecraft:advancement'] | AdvancementClass)
    /**
     * If `requirements` is not defined, all defined criteria will be required.
     */
    criteria: ({
        [Key in `${any}${string}`]?: AdvancementCriterion;
    })
    /**
     * If all criteria are required at once, this may be omitted.
     *
     * Contains all of the `criteria` keys.
     *
     * If all of the lists each have at least one criteria met, the advancement is complete (basically AND grouping of OR groups).
     *
     * Value:
     * List length range: 1..
     */
    requirements?: NBTList<NBTList<`${any}${string}`, {
        leftExclusive: false
        min: 1
    }>, {
        leftExclusive: false
        min: 1
    }>
    /**
     * Provided to the player when this advancement is obtained.
     */
    rewards?: AdvancementRewards
    /**
     * Defaults to `false`. The vanilla game client only reads this for advancements from the `minecraft` namespace.
     */
    sends_telemetry_event?: boolean
}

export type AdvancementCriterion = ({
    [S in Extract<Registry['minecraft:trigger_type'], string>]?: ({
        /**
         * Many triggers can occur multiple times, however, the reward will only be provided multiple times if the advancement is first revoked, which is often done within the function reward.
         */
        trigger: S
    } & (S extends keyof Dispatcher<'minecraft:trigger'>
        ? Dispatcher<'minecraft:trigger'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:trigger_type']])

export type AdvancementDisplay = {
    icon: ItemStack
    title: Text
    description: Text
    /**
     * Used for the advancement tab (root advancement only).
     */
    background?: Registry['minecraft:texture']
    /**
     * Controls the advancement tile frame. Defaults to `task`.
     *
     * Value:
     *
     *  - Task(`task`): Normal border.
     *  - Challenge(`challenge`): Fancy spiked border (used for the kill all mobs advancement).
     *  - Goal(`goal`): Rounded border (used for the full beacon advancement).
     */
    frame?: AdvancementFrame
    /**
     * Whether to show the toast pop up after completing this advancement. Defaults to `true`.
     */
    show_toast?: boolean
    /**
     * Whether to announce in the chat when this advancement has been completed. Defaults to `true`.
     */
    announce_to_chat?: boolean
    /**
     * Whether or not to hide this advancement and all its children from the advancement screen,
     * until this advancement have been completed.
     * Has no effect on root advancements themselves, but still affects all their children.
     * Defaults to `false`.
     */
    hidden?: boolean
}

export type AdvancementFrame = ('task' | 'challenge' | 'goal')

export type AdvancementIcon = {
    item: Registry['minecraft:item']
    nbt?: `${any}${string}` | NBTClass
}

export type AdvancementRewards = {
    /**
     * Function to run as the player (not at). Function group tags are not allowed.
     */
    function?: (`${string}:${string}` | _RawFunctionClass)
    /**
     * Loot tables to give.
     */
    loot?: Array<Registry['minecraft:loot_table']>
    /**
     * Recipes to unlock.
     */
    recipes?: Array<Registry['minecraft:recipe']>
    /**
     * XP to add.
     */
    experience?: NBTInt
}

export type Trigger = (
    | 'allay_drop_item_on_block'
    | 'avoid_vibration'
    | 'bee_nest_destroyed'
    | 'bred_animals'
    | 'brewed_potion'
    | 'changed_dimension'
    | 'channeled_lightning'
    | 'construct_beacon'
    | 'consume_item'
    | 'cured_zombie_villager'
    | 'effects_changed'
    | 'enchanted_item'
    | 'enter_block'
    | 'entity_hurt_player'
    | 'entity_killed_player'
    | 'fall_from_height'
    | 'filled_bucket'
    | 'fishing_rod_hooked'
    | 'hero_of_the_village'
    | 'impossible'
    | 'inventory_changed'
    | 'item_durability_changed'
    | 'item_used_on_block'
    | 'kill_mob_near_sculk_catalyst'
    | 'killed_by_crossbow'
    | 'levitation'
    | 'lightning_strike'
    | 'location'
    | 'nether_travel'
    | 'placed_block'
    | 'player_generates_container_loot'
    | 'player_hurt_entity'
    | 'player_interacted_with_entity'
    | 'player_killed_entity'
    | 'recipe_crafted'
    | 'recipe_unlocked'
    | 'ride_entity_in_lava'
    | 'shot_crossbow'
    | 'safely_harvest_honey'
    | 'slept_in_bed'
    | 'slide_down_block'
    | 'started_riding'
    | 'summoned_entity'
    | 'tame_animal'
    | 'target_hit'
    | 'thrown_item_picked_up_by_entity'
    | 'thrown_item_picked_up_by_player'
    | 'tick'
    | 'used_ender_eye'
    | 'used_totem'
    | 'using_item'
    | 'villager_trade'
    | 'voluntary_exile')
