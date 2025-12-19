import type { AnyEntity } from 'sandstone/arguments/generated/world/entity.js'
import type { WritableBook, WrittenBook } from 'sandstone/arguments/generated/world/item/book.js'
import type { Compass } from 'sandstone/arguments/generated/world/item/compass.js'
import type { Crossbow } from 'sandstone/arguments/generated/world/item/crossbow.js'
import type { DebugStick } from 'sandstone/arguments/generated/world/item/debug_stick.js'
import type { EnchantedBook } from 'sandstone/arguments/generated/world/item/enchanted_book.js'
import type { FireworkRocket, FireworkStar } from 'sandstone/arguments/generated/world/item/firework.js'
import type { AxolotlBucket, BasicFishBucket } from 'sandstone/arguments/generated/world/item/fish_bucket.js'
import type { GoatHorn } from 'sandstone/arguments/generated/world/item/goat_horn.js'
import type { PlayerHead } from 'sandstone/arguments/generated/world/item/head.js'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'
import type { KnowledgeBook } from 'sandstone/arguments/generated/world/item/knowledge_book.js'
import type { LeatherArmor } from 'sandstone/arguments/generated/world/item/leather_armor.js'
import type { FilledMap } from 'sandstone/arguments/generated/world/item/map.js'
import type { EffectItem } from 'sandstone/arguments/generated/world/item/potion.js'
import type { Shield } from 'sandstone/arguments/generated/world/item/shield.js'
import type { SuspiciousStew } from 'sandstone/arguments/generated/world/item/suspicious_stew.js'

export type SpawnItem = (ItemBase & {
    /**
     * Data of the spawned entity.
     */
    EntityTag?: AnyEntity
})
type ItemDispatcherMap = {
    'acacia_boat': ItemAcaciaBoat
    'minecraft:acacia_boat': ItemAcaciaBoat
    'acacia_chest_boat': ItemAcaciaChestBoat
    'minecraft:acacia_chest_boat': ItemAcaciaChestBoat
    'allay_spawn_egg': ItemAllaySpawnEgg
    'minecraft:allay_spawn_egg': ItemAllaySpawnEgg
    'armadillo_spawn_egg': ItemArmadilloSpawnEgg
    'minecraft:armadillo_spawn_egg': ItemArmadilloSpawnEgg
    'armor_stand': ItemArmorStand
    'minecraft:armor_stand': ItemArmorStand
    'axolotl_bucket': ItemAxolotlBucket
    'minecraft:axolotl_bucket': ItemAxolotlBucket
    'axolotl_spawn_egg': ItemAxolotlSpawnEgg
    'minecraft:axolotl_spawn_egg': ItemAxolotlSpawnEgg
    'bamboo_chest_raft': ItemBambooChestRaft
    'minecraft:bamboo_chest_raft': ItemBambooChestRaft
    'bamboo_raft': ItemBambooRaft
    'minecraft:bamboo_raft': ItemBambooRaft
    'bat_spawn_egg': ItemBatSpawnEgg
    'minecraft:bat_spawn_egg': ItemBatSpawnEgg
    'bee_spawn_egg': ItemBeeSpawnEgg
    'minecraft:bee_spawn_egg': ItemBeeSpawnEgg
    'birch_boat': ItemBirchBoat
    'minecraft:birch_boat': ItemBirchBoat
    'birch_chest_boat': ItemBirchChestBoat
    'minecraft:birch_chest_boat': ItemBirchChestBoat
    'blaze_spawn_egg': ItemBlazeSpawnEgg
    'minecraft:blaze_spawn_egg': ItemBlazeSpawnEgg
    'bogged_spawn_egg': ItemBoggedSpawnEgg
    'minecraft:bogged_spawn_egg': ItemBoggedSpawnEgg
    'breeze_spawn_egg': ItemBreezeSpawnEgg
    'minecraft:breeze_spawn_egg': ItemBreezeSpawnEgg
    'camel_husk_spawn_egg': ItemCamelHuskSpawnEgg
    'minecraft:camel_husk_spawn_egg': ItemCamelHuskSpawnEgg
    'camel_spawn_egg': ItemCamelSpawnEgg
    'minecraft:camel_spawn_egg': ItemCamelSpawnEgg
    'cat_spawn_egg': ItemCatSpawnEgg
    'minecraft:cat_spawn_egg': ItemCatSpawnEgg
    'cave_spider_spawn_egg': ItemCaveSpiderSpawnEgg
    'minecraft:cave_spider_spawn_egg': ItemCaveSpiderSpawnEgg
    'cherry_boat': ItemCherryBoat
    'minecraft:cherry_boat': ItemCherryBoat
    'cherry_chest_boat': ItemCherryChestBoat
    'minecraft:cherry_chest_boat': ItemCherryChestBoat
    'chest_minecart': ItemChestMinecart
    'minecraft:chest_minecart': ItemChestMinecart
    'chicken_spawn_egg': ItemChickenSpawnEgg
    'minecraft:chicken_spawn_egg': ItemChickenSpawnEgg
    'cod_bucket': ItemCodBucket
    'minecraft:cod_bucket': ItemCodBucket
    'cod_spawn_egg': ItemCodSpawnEgg
    'minecraft:cod_spawn_egg': ItemCodSpawnEgg
    'command_block_minecart': ItemCommandBlockMinecart
    'minecraft:command_block_minecart': ItemCommandBlockMinecart
    'compass': ItemCompass
    'minecraft:compass': ItemCompass
    'copper_golem_spawn_egg': ItemCopperGolemSpawnEgg
    'minecraft:copper_golem_spawn_egg': ItemCopperGolemSpawnEgg
    'cow_spawn_egg': ItemCowSpawnEgg
    'minecraft:cow_spawn_egg': ItemCowSpawnEgg
    'creaking_spawn_egg': ItemCreakingSpawnEgg
    'minecraft:creaking_spawn_egg': ItemCreakingSpawnEgg
    'creeper_spawn_egg': ItemCreeperSpawnEgg
    'minecraft:creeper_spawn_egg': ItemCreeperSpawnEgg
    'crossbow': ItemCrossbow
    'minecraft:crossbow': ItemCrossbow
    'dark_oak_boat': ItemDarkOakBoat
    'minecraft:dark_oak_boat': ItemDarkOakBoat
    'dark_oak_chest_boat': ItemDarkOakChestBoat
    'minecraft:dark_oak_chest_boat': ItemDarkOakChestBoat
    'debug_stick': ItemDebugStick
    'minecraft:debug_stick': ItemDebugStick
    'dolphin_spawn_egg': ItemDolphinSpawnEgg
    'minecraft:dolphin_spawn_egg': ItemDolphinSpawnEgg
    'donkey_spawn_egg': ItemDonkeySpawnEgg
    'minecraft:donkey_spawn_egg': ItemDonkeySpawnEgg
    'drowned_spawn_egg': ItemDrownedSpawnEgg
    'minecraft:drowned_spawn_egg': ItemDrownedSpawnEgg
    'elder_guardian_spawn_egg': ItemElderGuardianSpawnEgg
    'minecraft:elder_guardian_spawn_egg': ItemElderGuardianSpawnEgg
    'enchanted_book': ItemEnchantedBook
    'minecraft:enchanted_book': ItemEnchantedBook
    'ender_dragon_spawn_egg': ItemEnderDragonSpawnEgg
    'minecraft:ender_dragon_spawn_egg': ItemEnderDragonSpawnEgg
    'enderman_spawn_egg': ItemEndermanSpawnEgg
    'minecraft:enderman_spawn_egg': ItemEndermanSpawnEgg
    'endermite_spawn_egg': ItemEndermiteSpawnEgg
    'minecraft:endermite_spawn_egg': ItemEndermiteSpawnEgg
    'evoker_spawn_egg': ItemEvokerSpawnEgg
    'minecraft:evoker_spawn_egg': ItemEvokerSpawnEgg
    'filled_map': ItemFilledMap
    'minecraft:filled_map': ItemFilledMap
    'firework_rocket': ItemFireworkRocket
    'minecraft:firework_rocket': ItemFireworkRocket
    'firework_star': ItemFireworkStar
    'minecraft:firework_star': ItemFireworkStar
    'fox_spawn_egg': ItemFoxSpawnEgg
    'minecraft:fox_spawn_egg': ItemFoxSpawnEgg
    'frog_spawn_egg': ItemFrogSpawnEgg
    'minecraft:frog_spawn_egg': ItemFrogSpawnEgg
    'furnace_minecart': ItemFurnaceMinecart
    'minecraft:furnace_minecart': ItemFurnaceMinecart
    'ghast_spawn_egg': ItemGhastSpawnEgg
    'minecraft:ghast_spawn_egg': ItemGhastSpawnEgg
    'glow_item_frame': ItemGlowItemFrame
    'minecraft:glow_item_frame': ItemGlowItemFrame
    'glow_squid_spawn_egg': ItemGlowSquidSpawnEgg
    'minecraft:glow_squid_spawn_egg': ItemGlowSquidSpawnEgg
    'goat_horn': ItemGoatHorn
    'minecraft:goat_horn': ItemGoatHorn
    'goat_spawn_egg': ItemGoatSpawnEgg
    'minecraft:goat_spawn_egg': ItemGoatSpawnEgg
    'guardian_spawn_egg': ItemGuardianSpawnEgg
    'minecraft:guardian_spawn_egg': ItemGuardianSpawnEgg
    'happy_ghast_spawn_egg': ItemHappyGhastSpawnEgg
    'minecraft:happy_ghast_spawn_egg': ItemHappyGhastSpawnEgg
    'hoglin_spawn_egg': ItemHoglinSpawnEgg
    'minecraft:hoglin_spawn_egg': ItemHoglinSpawnEgg
    'hopper_minecart': ItemHopperMinecart
    'minecraft:hopper_minecart': ItemHopperMinecart
    'horse_spawn_egg': ItemHorseSpawnEgg
    'minecraft:horse_spawn_egg': ItemHorseSpawnEgg
    'husk_spawn_egg': ItemHuskSpawnEgg
    'minecraft:husk_spawn_egg': ItemHuskSpawnEgg
    'iron_golem_spawn_egg': ItemIronGolemSpawnEgg
    'minecraft:iron_golem_spawn_egg': ItemIronGolemSpawnEgg
    'item_frame': ItemItemFrame
    'minecraft:item_frame': ItemItemFrame
    'jungle_boat': ItemJungleBoat
    'minecraft:jungle_boat': ItemJungleBoat
    'jungle_chest_boat': ItemJungleChestBoat
    'minecraft:jungle_chest_boat': ItemJungleChestBoat
    'knowledge_book': ItemKnowledgeBook
    'minecraft:knowledge_book': ItemKnowledgeBook
    'leather_boots': ItemLeatherBoots
    'minecraft:leather_boots': ItemLeatherBoots
    'leather_chestplate': ItemLeatherChestplate
    'minecraft:leather_chestplate': ItemLeatherChestplate
    'leather_helmet': ItemLeatherHelmet
    'minecraft:leather_helmet': ItemLeatherHelmet
    'leather_horse_armor': ItemLeatherHorseArmor
    'minecraft:leather_horse_armor': ItemLeatherHorseArmor
    'leather_leggings': ItemLeatherLeggings
    'minecraft:leather_leggings': ItemLeatherLeggings
    'lingering_potion': ItemLingeringPotion
    'minecraft:lingering_potion': ItemLingeringPotion
    'llama_spawn_egg': ItemLlamaSpawnEgg
    'minecraft:llama_spawn_egg': ItemLlamaSpawnEgg
    'magma_cube_spawn_egg': ItemMagmaCubeSpawnEgg
    'minecraft:magma_cube_spawn_egg': ItemMagmaCubeSpawnEgg
    'mangrove_boat': ItemMangroveBoat
    'minecraft:mangrove_boat': ItemMangroveBoat
    'mangrove_chest_boat': ItemMangroveChestBoat
    'minecraft:mangrove_chest_boat': ItemMangroveChestBoat
    'minecart': ItemMinecart
    'minecraft:minecart': ItemMinecart
    'mooshroom_spawn_egg': ItemMooshroomSpawnEgg
    'minecraft:mooshroom_spawn_egg': ItemMooshroomSpawnEgg
    'mule_spawn_egg': ItemMuleSpawnEgg
    'minecraft:mule_spawn_egg': ItemMuleSpawnEgg
    'nautilus_spawn_egg': ItemNautilusSpawnEgg
    'minecraft:nautilus_spawn_egg': ItemNautilusSpawnEgg
    'oak_boat': ItemOakBoat
    'minecraft:oak_boat': ItemOakBoat
    'oak_chest_boat': ItemOakChestBoat
    'minecraft:oak_chest_boat': ItemOakChestBoat
    'ocelot_spawn_egg': ItemOcelotSpawnEgg
    'minecraft:ocelot_spawn_egg': ItemOcelotSpawnEgg
    'painting': ItemPainting
    'minecraft:painting': ItemPainting
    'panda_spawn_egg': ItemPandaSpawnEgg
    'minecraft:panda_spawn_egg': ItemPandaSpawnEgg
    'parched_spawn_egg': ItemParchedSpawnEgg
    'minecraft:parched_spawn_egg': ItemParchedSpawnEgg
    'parrot_spawn_egg': ItemParrotSpawnEgg
    'minecraft:parrot_spawn_egg': ItemParrotSpawnEgg
    'phantom_spawn_egg': ItemPhantomSpawnEgg
    'minecraft:phantom_spawn_egg': ItemPhantomSpawnEgg
    'pig_spawn_egg': ItemPigSpawnEgg
    'minecraft:pig_spawn_egg': ItemPigSpawnEgg
    'piglin_brute_spawn_egg': ItemPiglinBruteSpawnEgg
    'minecraft:piglin_brute_spawn_egg': ItemPiglinBruteSpawnEgg
    'piglin_spawn_egg': ItemPiglinSpawnEgg
    'minecraft:piglin_spawn_egg': ItemPiglinSpawnEgg
    'pillager_spawn_egg': ItemPillagerSpawnEgg
    'minecraft:pillager_spawn_egg': ItemPillagerSpawnEgg
    'player_head': ItemPlayerHead
    'minecraft:player_head': ItemPlayerHead
    'polar_bear_spawn_egg': ItemPolarBearSpawnEgg
    'minecraft:polar_bear_spawn_egg': ItemPolarBearSpawnEgg
    'potion': ItemPotion
    'minecraft:potion': ItemPotion
    'pufferfish_bucket': ItemPufferfishBucket
    'minecraft:pufferfish_bucket': ItemPufferfishBucket
    'pufferfish_spawn_egg': ItemPufferfishSpawnEgg
    'minecraft:pufferfish_spawn_egg': ItemPufferfishSpawnEgg
    'rabbit_spawn_egg': ItemRabbitSpawnEgg
    'minecraft:rabbit_spawn_egg': ItemRabbitSpawnEgg
    'ravager_spawn_egg': ItemRavagerSpawnEgg
    'minecraft:ravager_spawn_egg': ItemRavagerSpawnEgg
    'salmon_bucket': ItemSalmonBucket
    'minecraft:salmon_bucket': ItemSalmonBucket
    'salmon_spawn_egg': ItemSalmonSpawnEgg
    'minecraft:salmon_spawn_egg': ItemSalmonSpawnEgg
    'sheep_spawn_egg': ItemSheepSpawnEgg
    'minecraft:sheep_spawn_egg': ItemSheepSpawnEgg
    'shield': ItemShield
    'minecraft:shield': ItemShield
    'shulker_spawn_egg': ItemShulkerSpawnEgg
    'minecraft:shulker_spawn_egg': ItemShulkerSpawnEgg
    'silverfish_spawn_egg': ItemSilverfishSpawnEgg
    'minecraft:silverfish_spawn_egg': ItemSilverfishSpawnEgg
    'skeleton_horse_spawn_egg': ItemSkeletonHorseSpawnEgg
    'minecraft:skeleton_horse_spawn_egg': ItemSkeletonHorseSpawnEgg
    'skeleton_spawn_egg': ItemSkeletonSpawnEgg
    'minecraft:skeleton_spawn_egg': ItemSkeletonSpawnEgg
    'slime_spawn_egg': ItemSlimeSpawnEgg
    'minecraft:slime_spawn_egg': ItemSlimeSpawnEgg
    'sniffer_spawn_egg': ItemSnifferSpawnEgg
    'minecraft:sniffer_spawn_egg': ItemSnifferSpawnEgg
    'snow_golem_spawn_egg': ItemSnowGolemSpawnEgg
    'minecraft:snow_golem_spawn_egg': ItemSnowGolemSpawnEgg
    'spider_spawn_egg': ItemSpiderSpawnEgg
    'minecraft:spider_spawn_egg': ItemSpiderSpawnEgg
    'splash_potion': ItemSplashPotion
    'minecraft:splash_potion': ItemSplashPotion
    'spruce_boat': ItemSpruceBoat
    'minecraft:spruce_boat': ItemSpruceBoat
    'spruce_chest_boat': ItemSpruceChestBoat
    'minecraft:spruce_chest_boat': ItemSpruceChestBoat
    'squid_spawn_egg': ItemSquidSpawnEgg
    'minecraft:squid_spawn_egg': ItemSquidSpawnEgg
    'stray_spawn_egg': ItemStraySpawnEgg
    'minecraft:stray_spawn_egg': ItemStraySpawnEgg
    'strider_spawn_egg': ItemStriderSpawnEgg
    'minecraft:strider_spawn_egg': ItemStriderSpawnEgg
    'suspicious_stew': ItemSuspiciousStew
    'minecraft:suspicious_stew': ItemSuspiciousStew
    'tadpole_bucket': ItemTadpoleBucket
    'minecraft:tadpole_bucket': ItemTadpoleBucket
    'tadpole_spawn_egg': ItemTadpoleSpawnEgg
    'minecraft:tadpole_spawn_egg': ItemTadpoleSpawnEgg
    'tipped_arrow': ItemTippedArrow
    'minecraft:tipped_arrow': ItemTippedArrow
    'tnt_minecart': ItemTntMinecart
    'minecraft:tnt_minecart': ItemTntMinecart
    'trader_llama_spawn_egg': ItemTraderLlamaSpawnEgg
    'minecraft:trader_llama_spawn_egg': ItemTraderLlamaSpawnEgg
    'tropical_fish_bucket': ItemTropicalFishBucket
    'minecraft:tropical_fish_bucket': ItemTropicalFishBucket
    'tropical_fish_spawn_egg': ItemTropicalFishSpawnEgg
    'minecraft:tropical_fish_spawn_egg': ItemTropicalFishSpawnEgg
    'turtle_spawn_egg': ItemTurtleSpawnEgg
    'minecraft:turtle_spawn_egg': ItemTurtleSpawnEgg
    'vex_spawn_egg': ItemVexSpawnEgg
    'minecraft:vex_spawn_egg': ItemVexSpawnEgg
    'villager_spawn_egg': ItemVillagerSpawnEgg
    'minecraft:villager_spawn_egg': ItemVillagerSpawnEgg
    'vindicator_spawn_egg': ItemVindicatorSpawnEgg
    'minecraft:vindicator_spawn_egg': ItemVindicatorSpawnEgg
    'wandering_trader_spawn_egg': ItemWanderingTraderSpawnEgg
    'minecraft:wandering_trader_spawn_egg': ItemWanderingTraderSpawnEgg
    'warden_spawn_egg': ItemWardenSpawnEgg
    'minecraft:warden_spawn_egg': ItemWardenSpawnEgg
    'witch_spawn_egg': ItemWitchSpawnEgg
    'minecraft:witch_spawn_egg': ItemWitchSpawnEgg
    'wither_skeleton_spawn_egg': ItemWitherSkeletonSpawnEgg
    'minecraft:wither_skeleton_spawn_egg': ItemWitherSkeletonSpawnEgg
    'wither_spawn_egg': ItemWitherSpawnEgg
    'minecraft:wither_spawn_egg': ItemWitherSpawnEgg
    'wolf_spawn_egg': ItemWolfSpawnEgg
    'minecraft:wolf_spawn_egg': ItemWolfSpawnEgg
    'writable_book': ItemWritableBook
    'minecraft:writable_book': ItemWritableBook
    'written_book': ItemWrittenBook
    'minecraft:written_book': ItemWrittenBook
    'zoglin_spawn_egg': ItemZoglinSpawnEgg
    'minecraft:zoglin_spawn_egg': ItemZoglinSpawnEgg
    'zombie_horse_spawn_egg': ItemZombieHorseSpawnEgg
    'minecraft:zombie_horse_spawn_egg': ItemZombieHorseSpawnEgg
    'zombie_nautilus_spawn_egg': ItemZombieNautilusSpawnEgg
    'minecraft:zombie_nautilus_spawn_egg': ItemZombieNautilusSpawnEgg
    'zombie_spawn_egg': ItemZombieSpawnEgg
    'minecraft:zombie_spawn_egg': ItemZombieSpawnEgg
    'zombie_villager_spawn_egg': ItemZombieVillagerSpawnEgg
    'minecraft:zombie_villager_spawn_egg': ItemZombieVillagerSpawnEgg
    'zombified_piglin_spawn_egg': ItemZombifiedPiglinSpawnEgg
    'minecraft:zombified_piglin_spawn_egg': ItemZombifiedPiglinSpawnEgg
}
type ItemKeys = keyof ItemDispatcherMap
type ItemFallback = (
    | ItemAcaciaBoat
    | ItemAcaciaChestBoat
    | ItemAllaySpawnEgg
    | ItemArmadilloSpawnEgg
    | ItemArmorStand
    | ItemAxolotlBucket
    | ItemAxolotlSpawnEgg
    | ItemBambooChestRaft
    | ItemBambooRaft
    | ItemBatSpawnEgg
    | ItemBeeSpawnEgg
    | ItemBirchBoat
    | ItemBirchChestBoat
    | ItemBlazeSpawnEgg
    | ItemBoggedSpawnEgg
    | ItemBreezeSpawnEgg
    | ItemCamelHuskSpawnEgg
    | ItemCamelSpawnEgg
    | ItemCatSpawnEgg
    | ItemCaveSpiderSpawnEgg
    | ItemCherryBoat
    | ItemCherryChestBoat
    | ItemChestMinecart
    | ItemChickenSpawnEgg
    | ItemCodBucket
    | ItemCodSpawnEgg
    | ItemCommandBlockMinecart
    | ItemCompass
    | ItemCopperGolemSpawnEgg
    | ItemCowSpawnEgg
    | ItemCreakingSpawnEgg
    | ItemCreeperSpawnEgg
    | ItemCrossbow
    | ItemDarkOakBoat
    | ItemDarkOakChestBoat
    | ItemDebugStick
    | ItemDolphinSpawnEgg
    | ItemDonkeySpawnEgg
    | ItemDrownedSpawnEgg
    | ItemElderGuardianSpawnEgg
    | ItemEnchantedBook
    | ItemEnderDragonSpawnEgg
    | ItemEndermanSpawnEgg
    | ItemEndermiteSpawnEgg
    | ItemEvokerSpawnEgg
    | ItemFilledMap
    | ItemFireworkRocket
    | ItemFireworkStar
    | ItemFoxSpawnEgg
    | ItemFrogSpawnEgg
    | ItemFurnaceMinecart
    | ItemGhastSpawnEgg
    | ItemGlowItemFrame
    | ItemGlowSquidSpawnEgg
    | ItemGoatHorn
    | ItemGoatSpawnEgg
    | ItemGuardianSpawnEgg
    | ItemHappyGhastSpawnEgg
    | ItemHoglinSpawnEgg
    | ItemHopperMinecart
    | ItemHorseSpawnEgg
    | ItemHuskSpawnEgg
    | ItemIronGolemSpawnEgg
    | ItemItemFrame
    | ItemJungleBoat
    | ItemJungleChestBoat
    | ItemKnowledgeBook
    | ItemLeatherBoots
    | ItemLeatherChestplate
    | ItemLeatherHelmet
    | ItemLeatherHorseArmor
    | ItemLeatherLeggings
    | ItemLingeringPotion
    | ItemLlamaSpawnEgg
    | ItemMagmaCubeSpawnEgg
    | ItemMangroveBoat
    | ItemMangroveChestBoat
    | ItemMinecart
    | ItemMooshroomSpawnEgg
    | ItemMuleSpawnEgg
    | ItemNautilusSpawnEgg
    | ItemOakBoat
    | ItemOakChestBoat
    | ItemOcelotSpawnEgg
    | ItemPainting
    | ItemPandaSpawnEgg
    | ItemParchedSpawnEgg
    | ItemParrotSpawnEgg
    | ItemPhantomSpawnEgg
    | ItemPigSpawnEgg
    | ItemPiglinBruteSpawnEgg
    | ItemPiglinSpawnEgg
    | ItemPillagerSpawnEgg
    | ItemPlayerHead
    | ItemPolarBearSpawnEgg
    | ItemPotion
    | ItemPufferfishBucket
    | ItemPufferfishSpawnEgg
    | ItemRabbitSpawnEgg
    | ItemRavagerSpawnEgg
    | ItemSalmonBucket
    | ItemSalmonSpawnEgg
    | ItemSheepSpawnEgg
    | ItemShield
    | ItemShulkerSpawnEgg
    | ItemSilverfishSpawnEgg
    | ItemSkeletonHorseSpawnEgg
    | ItemSkeletonSpawnEgg
    | ItemSlimeSpawnEgg
    | ItemSnifferSpawnEgg
    | ItemSnowGolemSpawnEgg
    | ItemSpiderSpawnEgg
    | ItemSplashPotion
    | ItemSpruceBoat
    | ItemSpruceChestBoat
    | ItemSquidSpawnEgg
    | ItemStraySpawnEgg
    | ItemStriderSpawnEgg
    | ItemSuspiciousStew
    | ItemTadpoleBucket
    | ItemTadpoleSpawnEgg
    | ItemTippedArrow
    | ItemTntMinecart
    | ItemTraderLlamaSpawnEgg
    | ItemTropicalFishBucket
    | ItemTropicalFishSpawnEgg
    | ItemTurtleSpawnEgg
    | ItemVexSpawnEgg
    | ItemVillagerSpawnEgg
    | ItemVindicatorSpawnEgg
    | ItemWanderingTraderSpawnEgg
    | ItemWardenSpawnEgg
    | ItemWitchSpawnEgg
    | ItemWitherSkeletonSpawnEgg
    | ItemWitherSpawnEgg
    | ItemWolfSpawnEgg
    | ItemWritableBook
    | ItemWrittenBook
    | ItemZoglinSpawnEgg
    | ItemZombieHorseSpawnEgg
    | ItemZombieNautilusSpawnEgg
    | ItemZombieSpawnEgg
    | ItemZombieVillagerSpawnEgg
    | ItemZombifiedPiglinSpawnEgg
    | ItemFallbackType)
type ItemFallbackType = ItemBase
type ItemAcaciaBoat = SpawnItem
type ItemAcaciaChestBoat = SpawnItem
type ItemAllaySpawnEgg = SpawnItem
type ItemArmadilloSpawnEgg = SpawnItem
type ItemArmorStand = SpawnItem
type ItemAxolotlBucket = BasicFishBucket
type ItemAxolotlSpawnEgg = SpawnItem
type ItemBambooChestRaft = SpawnItem
type ItemBambooRaft = SpawnItem
type ItemBatSpawnEgg = SpawnItem
type ItemBeeSpawnEgg = SpawnItem
type ItemBirchBoat = SpawnItem
type ItemBirchChestBoat = SpawnItem
type ItemBlazeSpawnEgg = SpawnItem
type ItemBoggedSpawnEgg = SpawnItem
type ItemBreezeSpawnEgg = SpawnItem
type ItemCamelHuskSpawnEgg = SpawnItem
type ItemCamelSpawnEgg = SpawnItem
type ItemCatSpawnEgg = SpawnItem
type ItemCaveSpiderSpawnEgg = SpawnItem
type ItemCherryBoat = SpawnItem
type ItemCherryChestBoat = SpawnItem
type ItemChestMinecart = SpawnItem
type ItemChickenSpawnEgg = SpawnItem
type ItemCodBucket = BasicFishBucket
type ItemCodSpawnEgg = SpawnItem
type ItemCommandBlockMinecart = SpawnItem
type ItemCompass = Compass
type ItemCopperGolemSpawnEgg = SpawnItem
type ItemCowSpawnEgg = SpawnItem
type ItemCreakingSpawnEgg = SpawnItem
type ItemCreeperSpawnEgg = SpawnItem
type ItemCrossbow = Crossbow
type ItemDarkOakBoat = SpawnItem
type ItemDarkOakChestBoat = SpawnItem
type ItemDebugStick = DebugStick
type ItemDolphinSpawnEgg = SpawnItem
type ItemDonkeySpawnEgg = SpawnItem
type ItemDrownedSpawnEgg = SpawnItem
type ItemElderGuardianSpawnEgg = SpawnItem
type ItemEnchantedBook = EnchantedBook
type ItemEnderDragonSpawnEgg = SpawnItem
type ItemEndermanSpawnEgg = SpawnItem
type ItemEndermiteSpawnEgg = SpawnItem
type ItemEvokerSpawnEgg = SpawnItem
type ItemFilledMap = FilledMap
type ItemFireworkRocket = FireworkRocket
type ItemFireworkStar = FireworkStar
type ItemFoxSpawnEgg = SpawnItem
type ItemFrogSpawnEgg = SpawnItem
type ItemFurnaceMinecart = SpawnItem
type ItemGhastSpawnEgg = SpawnItem
type ItemGlowItemFrame = SpawnItem
type ItemGlowSquidSpawnEgg = SpawnItem
type ItemGoatHorn = GoatHorn
type ItemGoatSpawnEgg = SpawnItem
type ItemGuardianSpawnEgg = SpawnItem
type ItemHappyGhastSpawnEgg = SpawnItem
type ItemHoglinSpawnEgg = SpawnItem
type ItemHopperMinecart = SpawnItem
type ItemHorseSpawnEgg = SpawnItem
type ItemHuskSpawnEgg = SpawnItem
type ItemIronGolemSpawnEgg = SpawnItem
type ItemItemFrame = SpawnItem
type ItemJungleBoat = SpawnItem
type ItemJungleChestBoat = SpawnItem
type ItemKnowledgeBook = KnowledgeBook
type ItemLeatherBoots = LeatherArmor
type ItemLeatherChestplate = LeatherArmor
type ItemLeatherHelmet = LeatherArmor
type ItemLeatherHorseArmor = LeatherArmor
type ItemLeatherLeggings = LeatherArmor
type ItemLingeringPotion = EffectItem
type ItemLlamaSpawnEgg = SpawnItem
type ItemMagmaCubeSpawnEgg = SpawnItem
type ItemMangroveBoat = SpawnItem
type ItemMangroveChestBoat = SpawnItem
type ItemMinecart = SpawnItem
type ItemMooshroomSpawnEgg = SpawnItem
type ItemMuleSpawnEgg = SpawnItem
type ItemNautilusSpawnEgg = SpawnItem
type ItemOakBoat = SpawnItem
type ItemOakChestBoat = SpawnItem
type ItemOcelotSpawnEgg = SpawnItem
type ItemPainting = SpawnItem
type ItemPandaSpawnEgg = SpawnItem
type ItemParchedSpawnEgg = SpawnItem
type ItemParrotSpawnEgg = SpawnItem
type ItemPhantomSpawnEgg = SpawnItem
type ItemPigSpawnEgg = SpawnItem
type ItemPiglinBruteSpawnEgg = SpawnItem
type ItemPiglinSpawnEgg = SpawnItem
type ItemPillagerSpawnEgg = SpawnItem
type ItemPlayerHead = PlayerHead
type ItemPolarBearSpawnEgg = SpawnItem
type ItemPotion = EffectItem
type ItemPufferfishBucket = BasicFishBucket
type ItemPufferfishSpawnEgg = SpawnItem
type ItemRabbitSpawnEgg = SpawnItem
type ItemRavagerSpawnEgg = SpawnItem
type ItemSalmonBucket = BasicFishBucket
type ItemSalmonSpawnEgg = SpawnItem
type ItemSheepSpawnEgg = SpawnItem
type ItemShield = Shield
type ItemShulkerSpawnEgg = SpawnItem
type ItemSilverfishSpawnEgg = SpawnItem
type ItemSkeletonHorseSpawnEgg = SpawnItem
type ItemSkeletonSpawnEgg = SpawnItem
type ItemSlimeSpawnEgg = SpawnItem
type ItemSnifferSpawnEgg = SpawnItem
type ItemSnowGolemSpawnEgg = SpawnItem
type ItemSpiderSpawnEgg = SpawnItem
type ItemSplashPotion = EffectItem
type ItemSpruceBoat = SpawnItem
type ItemSpruceChestBoat = SpawnItem
type ItemSquidSpawnEgg = SpawnItem
type ItemStraySpawnEgg = SpawnItem
type ItemStriderSpawnEgg = SpawnItem
type ItemSuspiciousStew = SuspiciousStew
type ItemTadpoleBucket = BasicFishBucket
type ItemTadpoleSpawnEgg = SpawnItem
type ItemTippedArrow = EffectItem
type ItemTntMinecart = SpawnItem
type ItemTraderLlamaSpawnEgg = SpawnItem
type ItemTropicalFishBucket = AxolotlBucket
type ItemTropicalFishSpawnEgg = SpawnItem
type ItemTurtleSpawnEgg = SpawnItem
type ItemVexSpawnEgg = SpawnItem
type ItemVillagerSpawnEgg = SpawnItem
type ItemVindicatorSpawnEgg = SpawnItem
type ItemWanderingTraderSpawnEgg = SpawnItem
type ItemWardenSpawnEgg = SpawnItem
type ItemWitchSpawnEgg = SpawnItem
type ItemWitherSkeletonSpawnEgg = SpawnItem
type ItemWitherSpawnEgg = SpawnItem
type ItemWolfSpawnEgg = SpawnItem
type ItemWritableBook = WritableBook
type ItemWrittenBook = WrittenBook
type ItemZoglinSpawnEgg = SpawnItem
type ItemZombieHorseSpawnEgg = SpawnItem
type ItemZombieNautilusSpawnEgg = SpawnItem
type ItemZombieSpawnEgg = SpawnItem
type ItemZombieVillagerSpawnEgg = SpawnItem
type ItemZombifiedPiglinSpawnEgg = SpawnItem
export type SymbolItem<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? ItemDispatcherMap
    : CASE extends 'keys' ? ItemKeys : CASE extends '%fallback' ? ItemFallback : never
