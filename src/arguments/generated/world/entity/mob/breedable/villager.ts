import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable'
import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob'
import type { ItemCost, ItemStack } from 'sandstone/arguments/generated/world/item'
import type { NBTByte, NBTFloat, NBTInt, NBTIntArray, NBTList, NBTLong } from 'sandstone'

export type Offers = {
  /**
     * Trades it has to offer.
     */
  Recipes?: Array<Recipe>
}

export type PlayerReputationPart = ({
  [S in Extract<ReputationPart, string>]?: {
    /**
         * Value:
         *
         *  - MajorNegative(`major_negative`):
         *    Caused by the villager being directly killed, increasing by 25 each time.
         *
         *    Increases others' `major_negative` by 15 when shared through gossip.
         *
         *    Decays by 10 every 20 minutes.
         *  - MinorNegative(`minor_negative`):
         *    Caused by the villager being directly hurt, increasing by 25 each time
         *
         *    Increases others' `major_negative` by 5 when shared through gossip.
         *
         *    Decays by 20 every 20 minutes.
         *  - MajorPositive(`major_positive`):
         *    Caused by the villager being cured, is always set to 20.
         *
         *    Does not increase others' `major_positive` through gossip.
         *
         *    Does not decay.
         *  - MinorPositive(`minor_positive`):
         *    Caused by the villager being cured, is increased by 25 each time.
         *
         *    Increases others' `minor_positive` by 20 when shared through gossip.
         *
         *    Decays by 1 every 20 minutes.
         *  - Trading(`trading`):
         *    Caused by trading with the villager, increasing by 2 each time.
         *
         *    Does not increase others' `trading` through gossip.
         *
         *    Decays by 2 every 20 minutes.
         */
    Type?: S
    Value?: (S extends keyof Dispatcher<'minecraft:reputation_part_value'>
      ? Dispatcher<'minecraft:reputation_part_value'>[S]
      : Record<string, unknown>)
    /**
         * UUID of the player that caused the gossip-worthy event(s) related to this reputation part.
         *
         * Value:
         * Array length range: 4
         */
    Target?: NBTIntArray<{
      leftExclusive: false
      rightExclusive: false
      min: 4
      max: 4
    }>
  };
}[ReputationPart])

export type Recipe = {
  /**
     * Whether it should reward experience for using this trade.
     *
     * Experience amount is `3 + random(0, 3)` plus `5` if the trade is causing the merchant to increase in tier.
     */
  rewardExp?: boolean
  /**
     * Maximum number of uses for this trade before the merchant has to restock.
     *
     * Value:
     * Range: 0..
     */
  maxUses?: NBTInt<{
    min: 0
  }>
  /**
     * Times this trade has been used since the merchant last restocked.
     *
     * Value:
     * Range: 0..
     */
  uses?: NBTInt<{
    min: 0
  }>
  /**
     * Price item required by the merchant, count is modified depending on `demand` & per-player context.
     */
  buy?: ItemCost
  /**
     * Second item required by the merchant, count does not change.
     */
  buyB?: ItemCost
  /**
     * Item being offered by the merchant.
     */
  sell?: ItemStack
  /**
     * XP the merchant gains from the trade.
     *
     * Value:
     * Range: 0..
     */
  xp?: NBTInt<{
    min: 0
  }>
  /**
     * How much demand & reputation each affect the count of the `buy` item.
     */
  priceMultiplier?: NBTFloat
  /**
     * Modifier added to the original count of the `buy` item.
     */
  specialPrice?: NBTInt
  /**
     * Count adjuster of the `buy` item based on demand.
     *
     * Minus twice the number of times the villager has the trade in stock.
     *  When restocking subtract the number of possible purchases before running out of stock and add twice the number of actually made purchases.
     *  When the demand becomes positive, the count is increased by the initial count times `priceMultiplier` times the demand.
     */
  demand?: NBTInt
}

export type ReputationPart = ('major_negative' | 'minor_negative' | 'major_positive' | 'minor_positive' | 'trading')

export type Villager = (Breedable & VillagerBase & {
  VillagerData?: VillagerData
  /**
     * Determines whether the villager will be available to reproduce.
     *
     * When the value is `12` the villager can reproduce.
     *
     * After reproducing, the value is reset to `0`.
     *
     * To increase this value villagers will pick up food that is in range.
     *
     * Foods: Potatoes, Carrots, & Beetroots increase the level by `1`. Bread increases the level by `4`.
     *
     * Value:
     * Range: 0..12
     */
  FoodLevel?: NBTByte<{
    min: 0
    max: 12
  }>
  /**
     * Affects per-player reputation which affects trade offer pricing and iron golem behavior.
     *
     * Reputation is assembled through events the villager has witnessed (within 16 blocks) or heard about from other villagers through gossip.
     *
     * All reputation parts decay over time except `major_positive` which is only ever increased (when the villager is cured).
     *
     * Decay occurs every 24k ticks (20 minutes), tracked by `LastGossipDecay`.
     *
     * Once a reputation part decays to zero it is removed from the list.
     */
  Gossips?: Array<PlayerReputationPart>
  /**
     * Last game-tick every gossip significance `Value` could have decayed.
     *
     * Once this reaches 24k (20 minutes) less than the current game tick a decay occurs again.
     */
  LastGossipDecay?: NBTLong
  /**
     * Last game-tick it removed `uses` & updated `demand` of every trade offer by going to its `job_site`.
     */
  LastRestock?: NBTLong
  /**
     * Times it has reset the `uses` & updated `demand` of every trade offer by going to its `job_site` in the past 12k ticks (10 minutes).
     *
     * Time is tracked by `LastRestock`.
     *
     * When two restocks have occurred, another restock (and reset of this value to `0`) will only occur after 10 minutes.
     *
     * Value:
     * Range: 0..2
     */
  RestocksToday?: NBTInt<{
    min: 0
    max: 2
  }>
  /**
     * XP it has, increases when trades are used by each trade offer's `xp` value.
     *
     * After `250` the XP will continue to increase, but will do nothing more.
     *
     * Trade tiers:
     *  - `0..9`     - Tier 1: Novice
     *  - `10..69`   - Tier 2: Apprentice
     *  - `70..149`  - Tier 3: Journeyman
     *  - `150..249` - Tier 4: Expert
     *  - `250..`    - Tier 5: Master
     *
     * Value:
     * Range: 0..
     */
  Xp?: NBTInt<{
    min: 0
  }>
})

export type VillagerBase = {
  /**
     * Slots from 0 to 7.
     *
     * Value:
     * List length range: 0..8
     */
  Inventory?: NBTList<ItemStack, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 8
  }>
  /**
     * Trade offers it has.
     */
  Offers?: Offers
}

export type VillagerData = {
  /**
     * Used for trading and badge rendering.
     */
  level?: NBTInt
  profession?: Registry['minecraft:villager_profession']
  type?: Registry['minecraft:villager_type']
}

export type WanderingTrader = (MobBase & VillagerBase & {
  /**
     * Ticks until it despawns.
     */
  DespawnDelay?: NBTInt
  /**
     * Where it is heading to.
     *
     * Value:
     * Array length range: 3
     */
  wander_target?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
})

export type WanderTarget = {
  X?: NBTInt
  Y?: NBTInt
  Z?: NBTInt
}
