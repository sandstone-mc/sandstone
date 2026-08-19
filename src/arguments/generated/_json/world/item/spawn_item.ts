import type { JsonAnyEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonWritableBook, JsonWrittenBook } from 'sandstone/arguments/generated/_json/world/item/book.ts'
import type { JsonCompass } from 'sandstone/arguments/generated/_json/world/item/compass.ts'
import type { JsonCrossbow } from 'sandstone/arguments/generated/_json/world/item/crossbow.ts'
import type { JsonDebugStick } from 'sandstone/arguments/generated/_json/world/item/debug_stick.ts'
import type { JsonEnchantedBook } from 'sandstone/arguments/generated/_json/world/item/enchanted_book.ts'
import type { JsonFireworkRocket, JsonFireworkStar } from 'sandstone/arguments/generated/_json/world/item/firework.ts'
import type {
  JsonAxolotlBucket,
  JsonBasicFishBucket,
} from 'sandstone/arguments/generated/_json/world/item/fish_bucket.ts'
import type { JsonGoatHorn } from 'sandstone/arguments/generated/_json/world/item/goat_horn.ts'
import type { JsonPlayerHead } from 'sandstone/arguments/generated/_json/world/item/head.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonKnowledgeBook } from 'sandstone/arguments/generated/_json/world/item/knowledge_book.ts'
import type { JsonLeatherArmor } from 'sandstone/arguments/generated/_json/world/item/leather_armor.ts'
import type { JsonFilledMap } from 'sandstone/arguments/generated/_json/world/item/map.ts'
import type { JsonEffectItem } from 'sandstone/arguments/generated/_json/world/item/potion.ts'
import type { JsonShield } from 'sandstone/arguments/generated/_json/world/item/shield.ts'
import type { JsonSuspiciousStew } from 'sandstone/arguments/generated/_json/world/item/suspicious_stew.ts'

export type JsonSpawnItem = (JsonItemBase & {
  /**
   * Data of the spawned entity.
   */
  EntityTag?: JsonAnyEntity,
})
type JsonItemDispatcherMap = {
  'acacia_boat': JsonItemAcaciaBoat,
  'minecraft:acacia_boat': JsonItemAcaciaBoat,
  'acacia_chest_boat': JsonItemAcaciaChestBoat,
  'minecraft:acacia_chest_boat': JsonItemAcaciaChestBoat,
  'allay_spawn_egg': JsonItemAllaySpawnEgg,
  'minecraft:allay_spawn_egg': JsonItemAllaySpawnEgg,
  'armadillo_spawn_egg': JsonItemArmadilloSpawnEgg,
  'minecraft:armadillo_spawn_egg': JsonItemArmadilloSpawnEgg,
  'armor_stand': JsonItemArmorStand,
  'minecraft:armor_stand': JsonItemArmorStand,
  'axolotl_bucket': JsonItemAxolotlBucket,
  'minecraft:axolotl_bucket': JsonItemAxolotlBucket,
  'axolotl_spawn_egg': JsonItemAxolotlSpawnEgg,
  'minecraft:axolotl_spawn_egg': JsonItemAxolotlSpawnEgg,
  'bamboo_chest_raft': JsonItemBambooChestRaft,
  'minecraft:bamboo_chest_raft': JsonItemBambooChestRaft,
  'bamboo_raft': JsonItemBambooRaft,
  'minecraft:bamboo_raft': JsonItemBambooRaft,
  'bat_spawn_egg': JsonItemBatSpawnEgg,
  'minecraft:bat_spawn_egg': JsonItemBatSpawnEgg,
  'bee_spawn_egg': JsonItemBeeSpawnEgg,
  'minecraft:bee_spawn_egg': JsonItemBeeSpawnEgg,
  'birch_boat': JsonItemBirchBoat,
  'minecraft:birch_boat': JsonItemBirchBoat,
  'birch_chest_boat': JsonItemBirchChestBoat,
  'minecraft:birch_chest_boat': JsonItemBirchChestBoat,
  'blaze_spawn_egg': JsonItemBlazeSpawnEgg,
  'minecraft:blaze_spawn_egg': JsonItemBlazeSpawnEgg,
  'bogged_spawn_egg': JsonItemBoggedSpawnEgg,
  'minecraft:bogged_spawn_egg': JsonItemBoggedSpawnEgg,
  'breeze_spawn_egg': JsonItemBreezeSpawnEgg,
  'minecraft:breeze_spawn_egg': JsonItemBreezeSpawnEgg,
  'camel_husk_spawn_egg': JsonItemCamelHuskSpawnEgg,
  'minecraft:camel_husk_spawn_egg': JsonItemCamelHuskSpawnEgg,
  'camel_spawn_egg': JsonItemCamelSpawnEgg,
  'minecraft:camel_spawn_egg': JsonItemCamelSpawnEgg,
  'cat_spawn_egg': JsonItemCatSpawnEgg,
  'minecraft:cat_spawn_egg': JsonItemCatSpawnEgg,
  'cave_spider_spawn_egg': JsonItemCaveSpiderSpawnEgg,
  'minecraft:cave_spider_spawn_egg': JsonItemCaveSpiderSpawnEgg,
  'cherry_boat': JsonItemCherryBoat,
  'minecraft:cherry_boat': JsonItemCherryBoat,
  'cherry_chest_boat': JsonItemCherryChestBoat,
  'minecraft:cherry_chest_boat': JsonItemCherryChestBoat,
  'chest_minecart': JsonItemChestMinecart,
  'minecraft:chest_minecart': JsonItemChestMinecart,
  'chicken_spawn_egg': JsonItemChickenSpawnEgg,
  'minecraft:chicken_spawn_egg': JsonItemChickenSpawnEgg,
  'cod_bucket': JsonItemCodBucket,
  'minecraft:cod_bucket': JsonItemCodBucket,
  'cod_spawn_egg': JsonItemCodSpawnEgg,
  'minecraft:cod_spawn_egg': JsonItemCodSpawnEgg,
  'command_block_minecart': JsonItemCommandBlockMinecart,
  'minecraft:command_block_minecart': JsonItemCommandBlockMinecart,
  'compass': JsonItemCompass,
  'minecraft:compass': JsonItemCompass,
  'copper_golem_spawn_egg': JsonItemCopperGolemSpawnEgg,
  'minecraft:copper_golem_spawn_egg': JsonItemCopperGolemSpawnEgg,
  'cow_spawn_egg': JsonItemCowSpawnEgg,
  'minecraft:cow_spawn_egg': JsonItemCowSpawnEgg,
  'creaking_spawn_egg': JsonItemCreakingSpawnEgg,
  'minecraft:creaking_spawn_egg': JsonItemCreakingSpawnEgg,
  'creeper_spawn_egg': JsonItemCreeperSpawnEgg,
  'minecraft:creeper_spawn_egg': JsonItemCreeperSpawnEgg,
  'crossbow': JsonItemCrossbow,
  'minecraft:crossbow': JsonItemCrossbow,
  'dark_oak_boat': JsonItemDarkOakBoat,
  'minecraft:dark_oak_boat': JsonItemDarkOakBoat,
  'dark_oak_chest_boat': JsonItemDarkOakChestBoat,
  'minecraft:dark_oak_chest_boat': JsonItemDarkOakChestBoat,
  'debug_stick': JsonItemDebugStick,
  'minecraft:debug_stick': JsonItemDebugStick,
  'dolphin_spawn_egg': JsonItemDolphinSpawnEgg,
  'minecraft:dolphin_spawn_egg': JsonItemDolphinSpawnEgg,
  'donkey_spawn_egg': JsonItemDonkeySpawnEgg,
  'minecraft:donkey_spawn_egg': JsonItemDonkeySpawnEgg,
  'drowned_spawn_egg': JsonItemDrownedSpawnEgg,
  'minecraft:drowned_spawn_egg': JsonItemDrownedSpawnEgg,
  'elder_guardian_spawn_egg': JsonItemElderGuardianSpawnEgg,
  'minecraft:elder_guardian_spawn_egg': JsonItemElderGuardianSpawnEgg,
  'enchanted_book': JsonItemEnchantedBook,
  'minecraft:enchanted_book': JsonItemEnchantedBook,
  'ender_dragon_spawn_egg': JsonItemEnderDragonSpawnEgg,
  'minecraft:ender_dragon_spawn_egg': JsonItemEnderDragonSpawnEgg,
  'enderman_spawn_egg': JsonItemEndermanSpawnEgg,
  'minecraft:enderman_spawn_egg': JsonItemEndermanSpawnEgg,
  'endermite_spawn_egg': JsonItemEndermiteSpawnEgg,
  'minecraft:endermite_spawn_egg': JsonItemEndermiteSpawnEgg,
  'evoker_spawn_egg': JsonItemEvokerSpawnEgg,
  'minecraft:evoker_spawn_egg': JsonItemEvokerSpawnEgg,
  'filled_map': JsonItemFilledMap,
  'minecraft:filled_map': JsonItemFilledMap,
  'firework_rocket': JsonItemFireworkRocket,
  'minecraft:firework_rocket': JsonItemFireworkRocket,
  'firework_star': JsonItemFireworkStar,
  'minecraft:firework_star': JsonItemFireworkStar,
  'fox_spawn_egg': JsonItemFoxSpawnEgg,
  'minecraft:fox_spawn_egg': JsonItemFoxSpawnEgg,
  'frog_spawn_egg': JsonItemFrogSpawnEgg,
  'minecraft:frog_spawn_egg': JsonItemFrogSpawnEgg,
  'furnace_minecart': JsonItemFurnaceMinecart,
  'minecraft:furnace_minecart': JsonItemFurnaceMinecart,
  'ghast_spawn_egg': JsonItemGhastSpawnEgg,
  'minecraft:ghast_spawn_egg': JsonItemGhastSpawnEgg,
  'glow_item_frame': JsonItemGlowItemFrame,
  'minecraft:glow_item_frame': JsonItemGlowItemFrame,
  'glow_squid_spawn_egg': JsonItemGlowSquidSpawnEgg,
  'minecraft:glow_squid_spawn_egg': JsonItemGlowSquidSpawnEgg,
  'goat_horn': JsonItemGoatHorn,
  'minecraft:goat_horn': JsonItemGoatHorn,
  'goat_spawn_egg': JsonItemGoatSpawnEgg,
  'minecraft:goat_spawn_egg': JsonItemGoatSpawnEgg,
  'guardian_spawn_egg': JsonItemGuardianSpawnEgg,
  'minecraft:guardian_spawn_egg': JsonItemGuardianSpawnEgg,
  'happy_ghast_spawn_egg': JsonItemHappyGhastSpawnEgg,
  'minecraft:happy_ghast_spawn_egg': JsonItemHappyGhastSpawnEgg,
  'hoglin_spawn_egg': JsonItemHoglinSpawnEgg,
  'minecraft:hoglin_spawn_egg': JsonItemHoglinSpawnEgg,
  'hopper_minecart': JsonItemHopperMinecart,
  'minecraft:hopper_minecart': JsonItemHopperMinecart,
  'horse_spawn_egg': JsonItemHorseSpawnEgg,
  'minecraft:horse_spawn_egg': JsonItemHorseSpawnEgg,
  'husk_spawn_egg': JsonItemHuskSpawnEgg,
  'minecraft:husk_spawn_egg': JsonItemHuskSpawnEgg,
  'iron_golem_spawn_egg': JsonItemIronGolemSpawnEgg,
  'minecraft:iron_golem_spawn_egg': JsonItemIronGolemSpawnEgg,
  'item_frame': JsonItemItemFrame,
  'minecraft:item_frame': JsonItemItemFrame,
  'jungle_boat': JsonItemJungleBoat,
  'minecraft:jungle_boat': JsonItemJungleBoat,
  'jungle_chest_boat': JsonItemJungleChestBoat,
  'minecraft:jungle_chest_boat': JsonItemJungleChestBoat,
  'knowledge_book': JsonItemKnowledgeBook,
  'minecraft:knowledge_book': JsonItemKnowledgeBook,
  'leather_boots': JsonItemLeatherBoots,
  'minecraft:leather_boots': JsonItemLeatherBoots,
  'leather_chestplate': JsonItemLeatherChestplate,
  'minecraft:leather_chestplate': JsonItemLeatherChestplate,
  'leather_helmet': JsonItemLeatherHelmet,
  'minecraft:leather_helmet': JsonItemLeatherHelmet,
  'leather_horse_armor': JsonItemLeatherHorseArmor,
  'minecraft:leather_horse_armor': JsonItemLeatherHorseArmor,
  'leather_leggings': JsonItemLeatherLeggings,
  'minecraft:leather_leggings': JsonItemLeatherLeggings,
  'lingering_potion': JsonItemLingeringPotion,
  'minecraft:lingering_potion': JsonItemLingeringPotion,
  'llama_spawn_egg': JsonItemLlamaSpawnEgg,
  'minecraft:llama_spawn_egg': JsonItemLlamaSpawnEgg,
  'magma_cube_spawn_egg': JsonItemMagmaCubeSpawnEgg,
  'minecraft:magma_cube_spawn_egg': JsonItemMagmaCubeSpawnEgg,
  'mangrove_boat': JsonItemMangroveBoat,
  'minecraft:mangrove_boat': JsonItemMangroveBoat,
  'mangrove_chest_boat': JsonItemMangroveChestBoat,
  'minecraft:mangrove_chest_boat': JsonItemMangroveChestBoat,
  'minecart': JsonItemMinecart,
  'minecraft:minecart': JsonItemMinecart,
  'mooshroom_spawn_egg': JsonItemMooshroomSpawnEgg,
  'minecraft:mooshroom_spawn_egg': JsonItemMooshroomSpawnEgg,
  'mule_spawn_egg': JsonItemMuleSpawnEgg,
  'minecraft:mule_spawn_egg': JsonItemMuleSpawnEgg,
  'nautilus_spawn_egg': JsonItemNautilusSpawnEgg,
  'minecraft:nautilus_spawn_egg': JsonItemNautilusSpawnEgg,
  'oak_boat': JsonItemOakBoat,
  'minecraft:oak_boat': JsonItemOakBoat,
  'oak_chest_boat': JsonItemOakChestBoat,
  'minecraft:oak_chest_boat': JsonItemOakChestBoat,
  'ocelot_spawn_egg': JsonItemOcelotSpawnEgg,
  'minecraft:ocelot_spawn_egg': JsonItemOcelotSpawnEgg,
  'painting': JsonItemPainting,
  'minecraft:painting': JsonItemPainting,
  'panda_spawn_egg': JsonItemPandaSpawnEgg,
  'minecraft:panda_spawn_egg': JsonItemPandaSpawnEgg,
  'parched_spawn_egg': JsonItemParchedSpawnEgg,
  'minecraft:parched_spawn_egg': JsonItemParchedSpawnEgg,
  'parrot_spawn_egg': JsonItemParrotSpawnEgg,
  'minecraft:parrot_spawn_egg': JsonItemParrotSpawnEgg,
  'phantom_spawn_egg': JsonItemPhantomSpawnEgg,
  'minecraft:phantom_spawn_egg': JsonItemPhantomSpawnEgg,
  'pig_spawn_egg': JsonItemPigSpawnEgg,
  'minecraft:pig_spawn_egg': JsonItemPigSpawnEgg,
  'piglin_brute_spawn_egg': JsonItemPiglinBruteSpawnEgg,
  'minecraft:piglin_brute_spawn_egg': JsonItemPiglinBruteSpawnEgg,
  'piglin_spawn_egg': JsonItemPiglinSpawnEgg,
  'minecraft:piglin_spawn_egg': JsonItemPiglinSpawnEgg,
  'pillager_spawn_egg': JsonItemPillagerSpawnEgg,
  'minecraft:pillager_spawn_egg': JsonItemPillagerSpawnEgg,
  'player_head': JsonItemPlayerHead,
  'minecraft:player_head': JsonItemPlayerHead,
  'polar_bear_spawn_egg': JsonItemPolarBearSpawnEgg,
  'minecraft:polar_bear_spawn_egg': JsonItemPolarBearSpawnEgg,
  'potion': JsonItemPotion,
  'minecraft:potion': JsonItemPotion,
  'pufferfish_bucket': JsonItemPufferfishBucket,
  'minecraft:pufferfish_bucket': JsonItemPufferfishBucket,
  'pufferfish_spawn_egg': JsonItemPufferfishSpawnEgg,
  'minecraft:pufferfish_spawn_egg': JsonItemPufferfishSpawnEgg,
  'rabbit_spawn_egg': JsonItemRabbitSpawnEgg,
  'minecraft:rabbit_spawn_egg': JsonItemRabbitSpawnEgg,
  'ravager_spawn_egg': JsonItemRavagerSpawnEgg,
  'minecraft:ravager_spawn_egg': JsonItemRavagerSpawnEgg,
  'salmon_bucket': JsonItemSalmonBucket,
  'minecraft:salmon_bucket': JsonItemSalmonBucket,
  'salmon_spawn_egg': JsonItemSalmonSpawnEgg,
  'minecraft:salmon_spawn_egg': JsonItemSalmonSpawnEgg,
  'sheep_spawn_egg': JsonItemSheepSpawnEgg,
  'minecraft:sheep_spawn_egg': JsonItemSheepSpawnEgg,
  'shield': JsonItemShield,
  'minecraft:shield': JsonItemShield,
  'shulker_spawn_egg': JsonItemShulkerSpawnEgg,
  'minecraft:shulker_spawn_egg': JsonItemShulkerSpawnEgg,
  'silverfish_spawn_egg': JsonItemSilverfishSpawnEgg,
  'minecraft:silverfish_spawn_egg': JsonItemSilverfishSpawnEgg,
  'skeleton_horse_spawn_egg': JsonItemSkeletonHorseSpawnEgg,
  'minecraft:skeleton_horse_spawn_egg': JsonItemSkeletonHorseSpawnEgg,
  'skeleton_spawn_egg': JsonItemSkeletonSpawnEgg,
  'minecraft:skeleton_spawn_egg': JsonItemSkeletonSpawnEgg,
  'slime_spawn_egg': JsonItemSlimeSpawnEgg,
  'minecraft:slime_spawn_egg': JsonItemSlimeSpawnEgg,
  'sniffer_spawn_egg': JsonItemSnifferSpawnEgg,
  'minecraft:sniffer_spawn_egg': JsonItemSnifferSpawnEgg,
  'snow_golem_spawn_egg': JsonItemSnowGolemSpawnEgg,
  'minecraft:snow_golem_spawn_egg': JsonItemSnowGolemSpawnEgg,
  'spider_spawn_egg': JsonItemSpiderSpawnEgg,
  'minecraft:spider_spawn_egg': JsonItemSpiderSpawnEgg,
  'splash_potion': JsonItemSplashPotion,
  'minecraft:splash_potion': JsonItemSplashPotion,
  'spruce_boat': JsonItemSpruceBoat,
  'minecraft:spruce_boat': JsonItemSpruceBoat,
  'spruce_chest_boat': JsonItemSpruceChestBoat,
  'minecraft:spruce_chest_boat': JsonItemSpruceChestBoat,
  'squid_spawn_egg': JsonItemSquidSpawnEgg,
  'minecraft:squid_spawn_egg': JsonItemSquidSpawnEgg,
  'stray_spawn_egg': JsonItemStraySpawnEgg,
  'minecraft:stray_spawn_egg': JsonItemStraySpawnEgg,
  'strider_spawn_egg': JsonItemStriderSpawnEgg,
  'minecraft:strider_spawn_egg': JsonItemStriderSpawnEgg,
  'suspicious_stew': JsonItemSuspiciousStew,
  'minecraft:suspicious_stew': JsonItemSuspiciousStew,
  'tadpole_bucket': JsonItemTadpoleBucket,
  'minecraft:tadpole_bucket': JsonItemTadpoleBucket,
  'tadpole_spawn_egg': JsonItemTadpoleSpawnEgg,
  'minecraft:tadpole_spawn_egg': JsonItemTadpoleSpawnEgg,
  'tipped_arrow': JsonItemTippedArrow,
  'minecraft:tipped_arrow': JsonItemTippedArrow,
  'tnt_minecart': JsonItemTntMinecart,
  'minecraft:tnt_minecart': JsonItemTntMinecart,
  'trader_llama_spawn_egg': JsonItemTraderLlamaSpawnEgg,
  'minecraft:trader_llama_spawn_egg': JsonItemTraderLlamaSpawnEgg,
  'tropical_fish_bucket': JsonItemTropicalFishBucket,
  'minecraft:tropical_fish_bucket': JsonItemTropicalFishBucket,
  'tropical_fish_spawn_egg': JsonItemTropicalFishSpawnEgg,
  'minecraft:tropical_fish_spawn_egg': JsonItemTropicalFishSpawnEgg,
  'turtle_spawn_egg': JsonItemTurtleSpawnEgg,
  'minecraft:turtle_spawn_egg': JsonItemTurtleSpawnEgg,
  'vex_spawn_egg': JsonItemVexSpawnEgg,
  'minecraft:vex_spawn_egg': JsonItemVexSpawnEgg,
  'villager_spawn_egg': JsonItemVillagerSpawnEgg,
  'minecraft:villager_spawn_egg': JsonItemVillagerSpawnEgg,
  'vindicator_spawn_egg': JsonItemVindicatorSpawnEgg,
  'minecraft:vindicator_spawn_egg': JsonItemVindicatorSpawnEgg,
  'wandering_trader_spawn_egg': JsonItemWanderingTraderSpawnEgg,
  'minecraft:wandering_trader_spawn_egg': JsonItemWanderingTraderSpawnEgg,
  'warden_spawn_egg': JsonItemWardenSpawnEgg,
  'minecraft:warden_spawn_egg': JsonItemWardenSpawnEgg,
  'witch_spawn_egg': JsonItemWitchSpawnEgg,
  'minecraft:witch_spawn_egg': JsonItemWitchSpawnEgg,
  'wither_skeleton_spawn_egg': JsonItemWitherSkeletonSpawnEgg,
  'minecraft:wither_skeleton_spawn_egg': JsonItemWitherSkeletonSpawnEgg,
  'wither_spawn_egg': JsonItemWitherSpawnEgg,
  'minecraft:wither_spawn_egg': JsonItemWitherSpawnEgg,
  'wolf_spawn_egg': JsonItemWolfSpawnEgg,
  'minecraft:wolf_spawn_egg': JsonItemWolfSpawnEgg,
  'writable_book': JsonItemWritableBook,
  'minecraft:writable_book': JsonItemWritableBook,
  'written_book': JsonItemWrittenBook,
  'minecraft:written_book': JsonItemWrittenBook,
  'zoglin_spawn_egg': JsonItemZoglinSpawnEgg,
  'minecraft:zoglin_spawn_egg': JsonItemZoglinSpawnEgg,
  'zombie_horse_spawn_egg': JsonItemZombieHorseSpawnEgg,
  'minecraft:zombie_horse_spawn_egg': JsonItemZombieHorseSpawnEgg,
  'zombie_nautilus_spawn_egg': JsonItemZombieNautilusSpawnEgg,
  'minecraft:zombie_nautilus_spawn_egg': JsonItemZombieNautilusSpawnEgg,
  'zombie_spawn_egg': JsonItemZombieSpawnEgg,
  'minecraft:zombie_spawn_egg': JsonItemZombieSpawnEgg,
  'zombie_villager_spawn_egg': JsonItemZombieVillagerSpawnEgg,
  'minecraft:zombie_villager_spawn_egg': JsonItemZombieVillagerSpawnEgg,
  'zombified_piglin_spawn_egg': JsonItemZombifiedPiglinSpawnEgg,
  'minecraft:zombified_piglin_spawn_egg': JsonItemZombifiedPiglinSpawnEgg,
}
type JsonItemKeys = keyof JsonItemDispatcherMap
type JsonItemFallback = (
  | JsonItemAcaciaBoat
  | JsonItemAcaciaChestBoat
  | JsonItemAllaySpawnEgg
  | JsonItemArmadilloSpawnEgg
  | JsonItemArmorStand
  | JsonItemAxolotlBucket
  | JsonItemAxolotlSpawnEgg
  | JsonItemBambooChestRaft
  | JsonItemBambooRaft
  | JsonItemBatSpawnEgg
  | JsonItemBeeSpawnEgg
  | JsonItemBirchBoat
  | JsonItemBirchChestBoat
  | JsonItemBlazeSpawnEgg
  | JsonItemBoggedSpawnEgg
  | JsonItemBreezeSpawnEgg
  | JsonItemCamelHuskSpawnEgg
  | JsonItemCamelSpawnEgg
  | JsonItemCatSpawnEgg
  | JsonItemCaveSpiderSpawnEgg
  | JsonItemCherryBoat
  | JsonItemCherryChestBoat
  | JsonItemChestMinecart
  | JsonItemChickenSpawnEgg
  | JsonItemCodBucket
  | JsonItemCodSpawnEgg
  | JsonItemCommandBlockMinecart
  | JsonItemCompass
  | JsonItemCopperGolemSpawnEgg
  | JsonItemCowSpawnEgg
  | JsonItemCreakingSpawnEgg
  | JsonItemCreeperSpawnEgg
  | JsonItemCrossbow
  | JsonItemDarkOakBoat
  | JsonItemDarkOakChestBoat
  | JsonItemDebugStick
  | JsonItemDolphinSpawnEgg
  | JsonItemDonkeySpawnEgg
  | JsonItemDrownedSpawnEgg
  | JsonItemElderGuardianSpawnEgg
  | JsonItemEnchantedBook
  | JsonItemEnderDragonSpawnEgg
  | JsonItemEndermanSpawnEgg
  | JsonItemEndermiteSpawnEgg
  | JsonItemEvokerSpawnEgg
  | JsonItemFilledMap
  | JsonItemFireworkRocket
  | JsonItemFireworkStar
  | JsonItemFoxSpawnEgg
  | JsonItemFrogSpawnEgg
  | JsonItemFurnaceMinecart
  | JsonItemGhastSpawnEgg
  | JsonItemGlowItemFrame
  | JsonItemGlowSquidSpawnEgg
  | JsonItemGoatHorn
  | JsonItemGoatSpawnEgg
  | JsonItemGuardianSpawnEgg
  | JsonItemHappyGhastSpawnEgg
  | JsonItemHoglinSpawnEgg
  | JsonItemHopperMinecart
  | JsonItemHorseSpawnEgg
  | JsonItemHuskSpawnEgg
  | JsonItemIronGolemSpawnEgg
  | JsonItemItemFrame
  | JsonItemJungleBoat
  | JsonItemJungleChestBoat
  | JsonItemKnowledgeBook
  | JsonItemLeatherBoots
  | JsonItemLeatherChestplate
  | JsonItemLeatherHelmet
  | JsonItemLeatherHorseArmor
  | JsonItemLeatherLeggings
  | JsonItemLingeringPotion
  | JsonItemLlamaSpawnEgg
  | JsonItemMagmaCubeSpawnEgg
  | JsonItemMangroveBoat
  | JsonItemMangroveChestBoat
  | JsonItemMinecart
  | JsonItemMooshroomSpawnEgg
  | JsonItemMuleSpawnEgg
  | JsonItemNautilusSpawnEgg
  | JsonItemOakBoat
  | JsonItemOakChestBoat
  | JsonItemOcelotSpawnEgg
  | JsonItemPainting
  | JsonItemPandaSpawnEgg
  | JsonItemParchedSpawnEgg
  | JsonItemParrotSpawnEgg
  | JsonItemPhantomSpawnEgg
  | JsonItemPigSpawnEgg
  | JsonItemPiglinBruteSpawnEgg
  | JsonItemPiglinSpawnEgg
  | JsonItemPillagerSpawnEgg
  | JsonItemPlayerHead
  | JsonItemPolarBearSpawnEgg
  | JsonItemPotion
  | JsonItemPufferfishBucket
  | JsonItemPufferfishSpawnEgg
  | JsonItemRabbitSpawnEgg
  | JsonItemRavagerSpawnEgg
  | JsonItemSalmonBucket
  | JsonItemSalmonSpawnEgg
  | JsonItemSheepSpawnEgg
  | JsonItemShield
  | JsonItemShulkerSpawnEgg
  | JsonItemSilverfishSpawnEgg
  | JsonItemSkeletonHorseSpawnEgg
  | JsonItemSkeletonSpawnEgg
  | JsonItemSlimeSpawnEgg
  | JsonItemSnifferSpawnEgg
  | JsonItemSnowGolemSpawnEgg
  | JsonItemSpiderSpawnEgg
  | JsonItemSplashPotion
  | JsonItemSpruceBoat
  | JsonItemSpruceChestBoat
  | JsonItemSquidSpawnEgg
  | JsonItemStraySpawnEgg
  | JsonItemStriderSpawnEgg
  | JsonItemSuspiciousStew
  | JsonItemTadpoleBucket
  | JsonItemTadpoleSpawnEgg
  | JsonItemTippedArrow
  | JsonItemTntMinecart
  | JsonItemTraderLlamaSpawnEgg
  | JsonItemTropicalFishBucket
  | JsonItemTropicalFishSpawnEgg
  | JsonItemTurtleSpawnEgg
  | JsonItemVexSpawnEgg
  | JsonItemVillagerSpawnEgg
  | JsonItemVindicatorSpawnEgg
  | JsonItemWanderingTraderSpawnEgg
  | JsonItemWardenSpawnEgg
  | JsonItemWitchSpawnEgg
  | JsonItemWitherSkeletonSpawnEgg
  | JsonItemWitherSpawnEgg
  | JsonItemWolfSpawnEgg
  | JsonItemWritableBook
  | JsonItemWrittenBook
  | JsonItemZoglinSpawnEgg
  | JsonItemZombieHorseSpawnEgg
  | JsonItemZombieNautilusSpawnEgg
  | JsonItemZombieSpawnEgg
  | JsonItemZombieVillagerSpawnEgg
  | JsonItemZombifiedPiglinSpawnEgg
  | JsonItemFallbackType)
export type JsonItemFallbackType = JsonItemBase
type JsonItemAcaciaBoat = JsonSpawnItem
type JsonItemAcaciaChestBoat = JsonSpawnItem
type JsonItemAllaySpawnEgg = JsonSpawnItem
type JsonItemArmadilloSpawnEgg = JsonSpawnItem
type JsonItemArmorStand = JsonSpawnItem
type JsonItemAxolotlBucket = JsonBasicFishBucket
type JsonItemAxolotlSpawnEgg = JsonSpawnItem
type JsonItemBambooChestRaft = JsonSpawnItem
type JsonItemBambooRaft = JsonSpawnItem
type JsonItemBatSpawnEgg = JsonSpawnItem
type JsonItemBeeSpawnEgg = JsonSpawnItem
type JsonItemBirchBoat = JsonSpawnItem
type JsonItemBirchChestBoat = JsonSpawnItem
type JsonItemBlazeSpawnEgg = JsonSpawnItem
type JsonItemBoggedSpawnEgg = JsonSpawnItem
type JsonItemBreezeSpawnEgg = JsonSpawnItem
type JsonItemCamelHuskSpawnEgg = JsonSpawnItem
type JsonItemCamelSpawnEgg = JsonSpawnItem
type JsonItemCatSpawnEgg = JsonSpawnItem
type JsonItemCaveSpiderSpawnEgg = JsonSpawnItem
type JsonItemCherryBoat = JsonSpawnItem
type JsonItemCherryChestBoat = JsonSpawnItem
type JsonItemChestMinecart = JsonSpawnItem
type JsonItemChickenSpawnEgg = JsonSpawnItem
type JsonItemCodBucket = JsonBasicFishBucket
type JsonItemCodSpawnEgg = JsonSpawnItem
type JsonItemCommandBlockMinecart = JsonSpawnItem
type JsonItemCompass = JsonCompass
type JsonItemCopperGolemSpawnEgg = JsonSpawnItem
type JsonItemCowSpawnEgg = JsonSpawnItem
type JsonItemCreakingSpawnEgg = JsonSpawnItem
type JsonItemCreeperSpawnEgg = JsonSpawnItem
type JsonItemCrossbow = JsonCrossbow
type JsonItemDarkOakBoat = JsonSpawnItem
type JsonItemDarkOakChestBoat = JsonSpawnItem
type JsonItemDebugStick = JsonDebugStick
type JsonItemDolphinSpawnEgg = JsonSpawnItem
type JsonItemDonkeySpawnEgg = JsonSpawnItem
type JsonItemDrownedSpawnEgg = JsonSpawnItem
type JsonItemElderGuardianSpawnEgg = JsonSpawnItem
type JsonItemEnchantedBook = JsonEnchantedBook
type JsonItemEnderDragonSpawnEgg = JsonSpawnItem
type JsonItemEndermanSpawnEgg = JsonSpawnItem
type JsonItemEndermiteSpawnEgg = JsonSpawnItem
type JsonItemEvokerSpawnEgg = JsonSpawnItem
type JsonItemFilledMap = JsonFilledMap
type JsonItemFireworkRocket = JsonFireworkRocket
type JsonItemFireworkStar = JsonFireworkStar
type JsonItemFoxSpawnEgg = JsonSpawnItem
type JsonItemFrogSpawnEgg = JsonSpawnItem
type JsonItemFurnaceMinecart = JsonSpawnItem
type JsonItemGhastSpawnEgg = JsonSpawnItem
type JsonItemGlowItemFrame = JsonSpawnItem
type JsonItemGlowSquidSpawnEgg = JsonSpawnItem
type JsonItemGoatHorn = JsonGoatHorn
type JsonItemGoatSpawnEgg = JsonSpawnItem
type JsonItemGuardianSpawnEgg = JsonSpawnItem
type JsonItemHappyGhastSpawnEgg = JsonSpawnItem
type JsonItemHoglinSpawnEgg = JsonSpawnItem
type JsonItemHopperMinecart = JsonSpawnItem
type JsonItemHorseSpawnEgg = JsonSpawnItem
type JsonItemHuskSpawnEgg = JsonSpawnItem
type JsonItemIronGolemSpawnEgg = JsonSpawnItem
type JsonItemItemFrame = JsonSpawnItem
type JsonItemJungleBoat = JsonSpawnItem
type JsonItemJungleChestBoat = JsonSpawnItem
type JsonItemKnowledgeBook = JsonKnowledgeBook
type JsonItemLeatherBoots = JsonLeatherArmor
type JsonItemLeatherChestplate = JsonLeatherArmor
type JsonItemLeatherHelmet = JsonLeatherArmor
type JsonItemLeatherHorseArmor = JsonLeatherArmor
type JsonItemLeatherLeggings = JsonLeatherArmor
type JsonItemLingeringPotion = JsonEffectItem
type JsonItemLlamaSpawnEgg = JsonSpawnItem
type JsonItemMagmaCubeSpawnEgg = JsonSpawnItem
type JsonItemMangroveBoat = JsonSpawnItem
type JsonItemMangroveChestBoat = JsonSpawnItem
type JsonItemMinecart = JsonSpawnItem
type JsonItemMooshroomSpawnEgg = JsonSpawnItem
type JsonItemMuleSpawnEgg = JsonSpawnItem
type JsonItemNautilusSpawnEgg = JsonSpawnItem
type JsonItemOakBoat = JsonSpawnItem
type JsonItemOakChestBoat = JsonSpawnItem
type JsonItemOcelotSpawnEgg = JsonSpawnItem
type JsonItemPainting = JsonSpawnItem
type JsonItemPandaSpawnEgg = JsonSpawnItem
type JsonItemParchedSpawnEgg = JsonSpawnItem
type JsonItemParrotSpawnEgg = JsonSpawnItem
type JsonItemPhantomSpawnEgg = JsonSpawnItem
type JsonItemPigSpawnEgg = JsonSpawnItem
type JsonItemPiglinBruteSpawnEgg = JsonSpawnItem
type JsonItemPiglinSpawnEgg = JsonSpawnItem
type JsonItemPillagerSpawnEgg = JsonSpawnItem
type JsonItemPlayerHead = JsonPlayerHead
type JsonItemPolarBearSpawnEgg = JsonSpawnItem
type JsonItemPotion = JsonEffectItem
type JsonItemPufferfishBucket = JsonBasicFishBucket
type JsonItemPufferfishSpawnEgg = JsonSpawnItem
type JsonItemRabbitSpawnEgg = JsonSpawnItem
type JsonItemRavagerSpawnEgg = JsonSpawnItem
type JsonItemSalmonBucket = JsonBasicFishBucket
type JsonItemSalmonSpawnEgg = JsonSpawnItem
type JsonItemSheepSpawnEgg = JsonSpawnItem
type JsonItemShield = JsonShield
type JsonItemShulkerSpawnEgg = JsonSpawnItem
type JsonItemSilverfishSpawnEgg = JsonSpawnItem
type JsonItemSkeletonHorseSpawnEgg = JsonSpawnItem
type JsonItemSkeletonSpawnEgg = JsonSpawnItem
type JsonItemSlimeSpawnEgg = JsonSpawnItem
type JsonItemSnifferSpawnEgg = JsonSpawnItem
type JsonItemSnowGolemSpawnEgg = JsonSpawnItem
type JsonItemSpiderSpawnEgg = JsonSpawnItem
type JsonItemSplashPotion = JsonEffectItem
type JsonItemSpruceBoat = JsonSpawnItem
type JsonItemSpruceChestBoat = JsonSpawnItem
type JsonItemSquidSpawnEgg = JsonSpawnItem
type JsonItemStraySpawnEgg = JsonSpawnItem
type JsonItemStriderSpawnEgg = JsonSpawnItem
type JsonItemSuspiciousStew = JsonSuspiciousStew
type JsonItemTadpoleBucket = JsonBasicFishBucket
type JsonItemTadpoleSpawnEgg = JsonSpawnItem
type JsonItemTippedArrow = JsonEffectItem
type JsonItemTntMinecart = JsonSpawnItem
type JsonItemTraderLlamaSpawnEgg = JsonSpawnItem
type JsonItemTropicalFishBucket = JsonAxolotlBucket
type JsonItemTropicalFishSpawnEgg = JsonSpawnItem
type JsonItemTurtleSpawnEgg = JsonSpawnItem
type JsonItemVexSpawnEgg = JsonSpawnItem
type JsonItemVillagerSpawnEgg = JsonSpawnItem
type JsonItemVindicatorSpawnEgg = JsonSpawnItem
type JsonItemWanderingTraderSpawnEgg = JsonSpawnItem
type JsonItemWardenSpawnEgg = JsonSpawnItem
type JsonItemWitchSpawnEgg = JsonSpawnItem
type JsonItemWitherSkeletonSpawnEgg = JsonSpawnItem
type JsonItemWitherSpawnEgg = JsonSpawnItem
type JsonItemWolfSpawnEgg = JsonSpawnItem
type JsonItemWritableBook = JsonWritableBook
type JsonItemWrittenBook = JsonWrittenBook
type JsonItemZoglinSpawnEgg = JsonSpawnItem
type JsonItemZombieHorseSpawnEgg = JsonSpawnItem
type JsonItemZombieNautilusSpawnEgg = JsonSpawnItem
type JsonItemZombieSpawnEgg = JsonSpawnItem
type JsonItemZombieVillagerSpawnEgg = JsonSpawnItem
type JsonItemZombifiedPiglinSpawnEgg = JsonSpawnItem
export type JsonSymbolItem<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonItemDispatcherMap
  : CASE extends 'keys'
    ? JsonItemKeys
    : CASE extends '%fallback' ? JsonItemFallback : CASE extends '%unknown' ? JsonItemFallbackType : never
