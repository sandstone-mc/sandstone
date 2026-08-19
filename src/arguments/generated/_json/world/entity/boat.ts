import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonSlottedItem } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonAreaEffectCloud } from 'sandstone/arguments/generated/_json/world/entity/area_effect_cloud.ts'
import type { JsonCushion } from 'sandstone/arguments/generated/_json/world/entity/cushion.ts'
import type {
  JsonBlockDisplay,
  JsonItemDisplay,
  JsonTextDisplay,
} from 'sandstone/arguments/generated/_json/world/entity/display.ts'
import type { JsonEndCrystal } from 'sandstone/arguments/generated/_json/world/entity/end_crystal.ts'
import type { JsonEvokerFangs } from 'sandstone/arguments/generated/_json/world/entity/evoker_fangs.ts'
import type { JsonExperienceOrb } from 'sandstone/arguments/generated/_json/world/entity/experience_orb.ts'
import type { JsonEyeOfEnder } from 'sandstone/arguments/generated/_json/world/entity/eye_of_ender.ts'
import type { JsonFallingBlock } from 'sandstone/arguments/generated/_json/world/entity/falling_block.ts'
import type { JsonInteraction } from 'sandstone/arguments/generated/_json/world/entity/interaction.ts'
import type { JsonItem } from 'sandstone/arguments/generated/_json/world/entity/item.ts'
import type { JsonItemFrame } from 'sandstone/arguments/generated/_json/world/entity/item_frame.ts'
import type { JsonBlockAttachedEntity, JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonMarker } from 'sandstone/arguments/generated/_json/world/entity/marker.ts'
import type {
  JsonChestMinecart,
  JsonCommandBlockMinecart,
  JsonFurnaceMinecart,
  JsonHopperMinecart,
  JsonMinecart,
  JsonSpawnerMinecart,
  JsonTntMinecart,
} from 'sandstone/arguments/generated/_json/world/entity/minecart.ts'
import type { JsonAllay } from 'sandstone/arguments/generated/_json/world/entity/mob/allay.ts'
import type { JsonArmorStand } from 'sandstone/arguments/generated/_json/world/entity/mob/armor_stand.ts'
import type { JsonBat } from 'sandstone/arguments/generated/_json/world/entity/mob/bat.ts'
import type { JsonBogged } from 'sandstone/arguments/generated/_json/world/entity/mob/bogged.ts'
import type { JsonArmadillo } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/armadillo.ts'
import type { JsonAxolotl } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/axolotl.ts'
import type { JsonBee } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/bee.ts'
import type { JsonChicken } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/chicken.ts'
import type { JsonCow } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/cow.ts'
import type { JsonFox } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/fox.ts'
import type { JsonFrog } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/frog.ts'
import type { JsonGoat } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/goat.ts'
import type { JsonHoglin } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/hoglin.ts'
import type {
  JsonCamel,
  JsonChestedHorse,
  JsonHorse,
  JsonHorseBase,
  JsonLlama,
  JsonSkeletonHorse,
  JsonTraderLlama,
} from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/horse.ts'
import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { JsonMooshroom } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/mooshroom.ts'
import type { JsonOcelot } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/ocelot.ts'
import type { JsonPanda } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/panda.ts'
import type { JsonPolarBear } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/polar_bear.ts'
import type { JsonRabbit } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/rabbit.ts'
import type { JsonPig, JsonSaddled } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/saddled.ts'
import type { JsonSheep } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/sheep.ts'
import type {
  JsonCat,
  JsonParrot,
  JsonTamable,
  JsonWolf,
} from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/tamable.ts'
import type { JsonTurtle } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/turtle.ts'
import type {
  JsonVillager,
  JsonWanderingTrader,
} from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/villager.ts'
import type { JsonCopperGolem } from 'sandstone/arguments/generated/_json/world/entity/mob/copper_golem.ts'
import type { JsonCreaking } from 'sandstone/arguments/generated/_json/world/entity/mob/creaking.ts'
import type { JsonCreeper } from 'sandstone/arguments/generated/_json/world/entity/mob/creeper.ts'
import type { JsonDolphin } from 'sandstone/arguments/generated/_json/world/entity/mob/dolphin.ts'
import type { JsonEnderDragon } from 'sandstone/arguments/generated/_json/world/entity/mob/ender_dragon.ts'
import type { JsonEnderman } from 'sandstone/arguments/generated/_json/world/entity/mob/enderman.ts'
import type { JsonEndermite } from 'sandstone/arguments/generated/_json/world/entity/mob/endermite.ts'
import type {
  JsonFish,
  JsonPufferfish,
  JsonSalmon,
  JsonTropicalFish,
} from 'sandstone/arguments/generated/_json/world/entity/mob/fish.ts'
import type { JsonGhast } from 'sandstone/arguments/generated/_json/world/entity/mob/ghast.ts'
import type { JsonGlowSquid } from 'sandstone/arguments/generated/_json/world/entity/mob/glow_squid.ts'
import type { JsonHappyGhast } from 'sandstone/arguments/generated/_json/world/entity/mob/happy_ghast.ts'
import type { JsonIronGolem } from 'sandstone/arguments/generated/_json/world/entity/mob/iron_golem.ts'
import type { JsonMobBase, JsonSquid } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { JsonMannequin } from 'sandstone/arguments/generated/_json/world/entity/mob/mannequin.ts'
import type { JsonPhantom } from 'sandstone/arguments/generated/_json/world/entity/mob/phantom.ts'
import type { JsonPiglin, JsonPiglinBase } from 'sandstone/arguments/generated/_json/world/entity/mob/piglin.ts'
import type { JsonPlayer } from 'sandstone/arguments/generated/_json/world/entity/mob/player.ts'
import type {
  JsonPillager,
  JsonRaiderBase,
  JsonRavager,
  JsonSpellcaster,
  JsonVindicator,
} from 'sandstone/arguments/generated/_json/world/entity/mob/raider.ts'
import type { JsonShulker } from 'sandstone/arguments/generated/_json/world/entity/mob/shulker.ts'
import type { JsonSkeleton } from 'sandstone/arguments/generated/_json/world/entity/mob/skeleton.ts'
import type { JsonSlime, JsonSulfurCube } from 'sandstone/arguments/generated/_json/world/entity/mob/slime.ts'
import type { JsonSnowGolem } from 'sandstone/arguments/generated/_json/world/entity/mob/snow_golem.ts'
import type { JsonTadpole } from 'sandstone/arguments/generated/_json/world/entity/mob/tadpole.ts'
import type { JsonVex } from 'sandstone/arguments/generated/_json/world/entity/mob/vex.ts'
import type { JsonWarden } from 'sandstone/arguments/generated/_json/world/entity/mob/warden.ts'
import type { JsonWither } from 'sandstone/arguments/generated/_json/world/entity/mob/wither.ts'
import type { JsonZoglin } from 'sandstone/arguments/generated/_json/world/entity/mob/zoglin.ts'
import type { JsonZombie, JsonZombieVillager } from 'sandstone/arguments/generated/_json/world/entity/mob/zombie.ts'
import type { JsonZombiePigman } from 'sandstone/arguments/generated/_json/world/entity/mob/zombified_piglin.ts'
import type { JsonOminousItemSpawner } from 'sandstone/arguments/generated/_json/world/entity/ominous_item_spawner.ts'
import type { JsonPainting } from 'sandstone/arguments/generated/_json/world/entity/painting.ts'
import type {
  JsonArrow,
  JsonSpectralArrow,
  JsonTrident,
} from 'sandstone/arguments/generated/_json/world/entity/projectile/arrow.ts'
import type {
  JsonAcceleratingProjectileBase,
  JsonDespawnableProjectileBase,
  JsonFireballBase,
  JsonLargeFireball,
  JsonWitherSkull,
} from 'sandstone/arguments/generated/_json/world/entity/projectile/fireball.ts'
import type {
  JsonFireWorkRocket,
} from 'sandstone/arguments/generated/_json/world/entity/projectile/firework_rocket.ts'
import type { JsonLlamaSpit } from 'sandstone/arguments/generated/_json/world/entity/projectile.ts'
import type { JsonShulkerBullet } from 'sandstone/arguments/generated/_json/world/entity/projectile/shulker_bullet.ts'
import type {
  JsonPotion,
  JsonThrowableItem,
} from 'sandstone/arguments/generated/_json/world/entity/projectile/throwable.ts'
import type { JsonTnt } from 'sandstone/arguments/generated/_json/world/entity/tnt.ts'
import type { JsonNBTList, LootTableClass, NBTByte, NBTLong } from 'sandstone'

export type JsonBoat = JsonEntityBase

export type JsonBoatType = (
  | 'oak'
  | 'spruce'
  | 'birch'
  | 'jungle'
  | 'acacia'
  | 'dark_oak'
  | 'mangrove'
  | 'bamboo'
  | 'cherry')

export type JsonChestBoat = (JsonBoat & {
  /**
   * Loot table that will populate this chest boat.
   */
  LootTable?: (JsonRegistry['minecraft:loot_table'] | '' | LootTableClass),
  /**
   * Seed of the loot table.
   */
  LootTableSeed?: (NBTLong | number),
  /**
   * Slots from 0 to 26.
   *
   * Value:
   * List length range: 0..27
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 26,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 27,
  }>,
})
type JsonEntityDispatcherMap = {
  'acacia_boat': JsonEntityAcaciaBoat,
  'minecraft:acacia_boat': JsonEntityAcaciaBoat,
  'acacia_chest_boat': JsonEntityAcaciaChestBoat,
  'minecraft:acacia_chest_boat': JsonEntityAcaciaChestBoat,
  'allay': JsonEntityAllay,
  'minecraft:allay': JsonEntityAllay,
  'area_effect_cloud': JsonEntityAreaEffectCloud,
  'minecraft:area_effect_cloud': JsonEntityAreaEffectCloud,
  'armadillo': JsonEntityArmadillo,
  'minecraft:armadillo': JsonEntityArmadillo,
  'armor_stand': JsonEntityArmorStand,
  'minecraft:armor_stand': JsonEntityArmorStand,
  'arrow': JsonEntityArrow,
  'minecraft:arrow': JsonEntityArrow,
  'axolotl': JsonEntityAxolotl,
  'minecraft:axolotl': JsonEntityAxolotl,
  'bamboo_chest_raft': JsonEntityBambooChestRaft,
  'minecraft:bamboo_chest_raft': JsonEntityBambooChestRaft,
  'bamboo_raft': JsonEntityBambooRaft,
  'minecraft:bamboo_raft': JsonEntityBambooRaft,
  'bat': JsonEntityBat,
  'minecraft:bat': JsonEntityBat,
  'bee': JsonEntityBee,
  'minecraft:bee': JsonEntityBee,
  'birch_boat': JsonEntityBirchBoat,
  'minecraft:birch_boat': JsonEntityBirchBoat,
  'birch_chest_boat': JsonEntityBirchChestBoat,
  'minecraft:birch_chest_boat': JsonEntityBirchChestBoat,
  'blaze': JsonEntityBlaze,
  'minecraft:blaze': JsonEntityBlaze,
  'block_display': JsonEntityBlockDisplay,
  'minecraft:block_display': JsonEntityBlockDisplay,
  'bogged': JsonEntityBogged,
  'minecraft:bogged': JsonEntityBogged,
  'breeze': JsonEntityBreeze,
  'minecraft:breeze': JsonEntityBreeze,
  'breeze_wind_charge': JsonEntityBreezeWindCharge,
  'minecraft:breeze_wind_charge': JsonEntityBreezeWindCharge,
  'camel': JsonEntityCamel,
  'minecraft:camel': JsonEntityCamel,
  'camel_husk': JsonEntityCamelHusk,
  'minecraft:camel_husk': JsonEntityCamelHusk,
  'cat': JsonEntityCat,
  'minecraft:cat': JsonEntityCat,
  'cave_spider': JsonEntityCaveSpider,
  'minecraft:cave_spider': JsonEntityCaveSpider,
  'cherry_boat': JsonEntityCherryBoat,
  'minecraft:cherry_boat': JsonEntityCherryBoat,
  'cherry_chest_boat': JsonEntityCherryChestBoat,
  'minecraft:cherry_chest_boat': JsonEntityCherryChestBoat,
  'chest_minecart': JsonEntityChestMinecart,
  'minecraft:chest_minecart': JsonEntityChestMinecart,
  'chicken': JsonEntityChicken,
  'minecraft:chicken': JsonEntityChicken,
  'cod': JsonEntityCod,
  'minecraft:cod': JsonEntityCod,
  'command_block_minecart': JsonEntityCommandBlockMinecart,
  'minecraft:command_block_minecart': JsonEntityCommandBlockMinecart,
  'copper_golem': JsonEntityCopperGolem,
  'minecraft:copper_golem': JsonEntityCopperGolem,
  'cow': JsonEntityCow,
  'minecraft:cow': JsonEntityCow,
  'creaking': JsonEntityCreaking,
  'minecraft:creaking': JsonEntityCreaking,
  'creeper': JsonEntityCreeper,
  'minecraft:creeper': JsonEntityCreeper,
  'cushion': JsonEntityCushion,
  'minecraft:cushion': JsonEntityCushion,
  'dark_oak_boat': JsonEntityDarkOakBoat,
  'minecraft:dark_oak_boat': JsonEntityDarkOakBoat,
  'dark_oak_chest_boat': JsonEntityDarkOakChestBoat,
  'minecraft:dark_oak_chest_boat': JsonEntityDarkOakChestBoat,
  'dolphin': JsonEntityDolphin,
  'minecraft:dolphin': JsonEntityDolphin,
  'donkey': JsonEntityDonkey,
  'minecraft:donkey': JsonEntityDonkey,
  'dragon_fireball': JsonEntityDragonFireball,
  'minecraft:dragon_fireball': JsonEntityDragonFireball,
  'drowned': JsonEntityDrowned,
  'minecraft:drowned': JsonEntityDrowned,
  'egg': JsonEntityEgg,
  'minecraft:egg': JsonEntityEgg,
  'elder_guardian': JsonEntityElderGuardian,
  'minecraft:elder_guardian': JsonEntityElderGuardian,
  'end_crystal': JsonEntityEndCrystal,
  'minecraft:end_crystal': JsonEntityEndCrystal,
  'ender_dragon': JsonEntityEnderDragon,
  'minecraft:ender_dragon': JsonEntityEnderDragon,
  'ender_pearl': JsonEntityEnderPearl,
  'minecraft:ender_pearl': JsonEntityEnderPearl,
  'enderman': JsonEntityEnderman,
  'minecraft:enderman': JsonEntityEnderman,
  'endermite': JsonEntityEndermite,
  'minecraft:endermite': JsonEntityEndermite,
  'evoker': JsonEntityEvoker,
  'minecraft:evoker': JsonEntityEvoker,
  'evoker_fangs': JsonEntityEvokerFangs,
  'minecraft:evoker_fangs': JsonEntityEvokerFangs,
  'experience_bottle': JsonEntityExperienceBottle,
  'minecraft:experience_bottle': JsonEntityExperienceBottle,
  'experience_orb': JsonEntityExperienceOrb,
  'minecraft:experience_orb': JsonEntityExperienceOrb,
  'eye_of_ender': JsonEntityEyeOfEnder,
  'minecraft:eye_of_ender': JsonEntityEyeOfEnder,
  'falling_block': JsonEntityFallingBlock,
  'minecraft:falling_block': JsonEntityFallingBlock,
  'fireball': JsonEntityFireball,
  'minecraft:fireball': JsonEntityFireball,
  'firework_rocket': JsonEntityFireworkRocket,
  'minecraft:firework_rocket': JsonEntityFireworkRocket,
  'fox': JsonEntityFox,
  'minecraft:fox': JsonEntityFox,
  'frog': JsonEntityFrog,
  'minecraft:frog': JsonEntityFrog,
  'furnace_minecart': JsonEntityFurnaceMinecart,
  'minecraft:furnace_minecart': JsonEntityFurnaceMinecart,
  'ghast': JsonEntityGhast,
  'minecraft:ghast': JsonEntityGhast,
  'giant': JsonEntityGiant,
  'minecraft:giant': JsonEntityGiant,
  'glow_item_frame': JsonEntityGlowItemFrame,
  'minecraft:glow_item_frame': JsonEntityGlowItemFrame,
  'glow_squid': JsonEntityGlowSquid,
  'minecraft:glow_squid': JsonEntityGlowSquid,
  'goat': JsonEntityGoat,
  'minecraft:goat': JsonEntityGoat,
  'guardian': JsonEntityGuardian,
  'minecraft:guardian': JsonEntityGuardian,
  'happy_ghast': JsonEntityHappyGhast,
  'minecraft:happy_ghast': JsonEntityHappyGhast,
  'hoglin': JsonEntityHoglin,
  'minecraft:hoglin': JsonEntityHoglin,
  'hopper_minecart': JsonEntityHopperMinecart,
  'minecraft:hopper_minecart': JsonEntityHopperMinecart,
  'horse': JsonEntityHorse,
  'minecraft:horse': JsonEntityHorse,
  'husk': JsonEntityHusk,
  'minecraft:husk': JsonEntityHusk,
  'illusioner': JsonEntityIllusioner,
  'minecraft:illusioner': JsonEntityIllusioner,
  'interaction': JsonEntityInteraction,
  'minecraft:interaction': JsonEntityInteraction,
  'iron_golem': JsonEntityIronGolem,
  'minecraft:iron_golem': JsonEntityIronGolem,
  'item': JsonEntityItem,
  'minecraft:item': JsonEntityItem,
  'item_display': JsonEntityItemDisplay,
  'minecraft:item_display': JsonEntityItemDisplay,
  'item_frame': JsonEntityItemFrame,
  'minecraft:item_frame': JsonEntityItemFrame,
  'jungle_boat': JsonEntityJungleBoat,
  'minecraft:jungle_boat': JsonEntityJungleBoat,
  'jungle_chest_boat': JsonEntityJungleChestBoat,
  'minecraft:jungle_chest_boat': JsonEntityJungleChestBoat,
  'leash_knot': JsonEntityLeashKnot,
  'minecraft:leash_knot': JsonEntityLeashKnot,
  'lingering_potion': JsonEntityLingeringPotion,
  'minecraft:lingering_potion': JsonEntityLingeringPotion,
  'llama': JsonEntityLlama,
  'minecraft:llama': JsonEntityLlama,
  'llama_spit': JsonEntityLlamaSpit,
  'minecraft:llama_spit': JsonEntityLlamaSpit,
  'magma_cube': JsonEntityMagmaCube,
  'minecraft:magma_cube': JsonEntityMagmaCube,
  'mangrove_boat': JsonEntityMangroveBoat,
  'minecraft:mangrove_boat': JsonEntityMangroveBoat,
  'mangrove_chest_boat': JsonEntityMangroveChestBoat,
  'minecraft:mangrove_chest_boat': JsonEntityMangroveChestBoat,
  'mannequin': JsonEntityMannequin,
  'minecraft:mannequin': JsonEntityMannequin,
  'marker': JsonEntityMarker,
  'minecraft:marker': JsonEntityMarker,
  'minecart': JsonEntityMinecart,
  'minecraft:minecart': JsonEntityMinecart,
  'mooshroom': JsonEntityMooshroom,
  'minecraft:mooshroom': JsonEntityMooshroom,
  'mule': JsonEntityMule,
  'minecraft:mule': JsonEntityMule,
  'nautilus': JsonEntityNautilus,
  'minecraft:nautilus': JsonEntityNautilus,
  'oak_boat': JsonEntityOakBoat,
  'minecraft:oak_boat': JsonEntityOakBoat,
  'oak_chest_boat': JsonEntityOakChestBoat,
  'minecraft:oak_chest_boat': JsonEntityOakChestBoat,
  'ocelot': JsonEntityOcelot,
  'minecraft:ocelot': JsonEntityOcelot,
  'ominous_item_spawner': JsonEntityOminousItemSpawner,
  'minecraft:ominous_item_spawner': JsonEntityOminousItemSpawner,
  'painting': JsonEntityPainting,
  'minecraft:painting': JsonEntityPainting,
  'pale_oak_boat': JsonEntityPaleOakBoat,
  'minecraft:pale_oak_boat': JsonEntityPaleOakBoat,
  'pale_oak_chest_boat': JsonEntityPaleOakChestBoat,
  'minecraft:pale_oak_chest_boat': JsonEntityPaleOakChestBoat,
  'panda': JsonEntityPanda,
  'minecraft:panda': JsonEntityPanda,
  'parched': JsonEntityParched,
  'minecraft:parched': JsonEntityParched,
  'parrot': JsonEntityParrot,
  'minecraft:parrot': JsonEntityParrot,
  'phantom': JsonEntityPhantom,
  'minecraft:phantom': JsonEntityPhantom,
  'pig': JsonEntityPig,
  'minecraft:pig': JsonEntityPig,
  'piglin': JsonEntityPiglin,
  'minecraft:piglin': JsonEntityPiglin,
  'piglin_brute': JsonEntityPiglinBrute,
  'minecraft:piglin_brute': JsonEntityPiglinBrute,
  'pillager': JsonEntityPillager,
  'minecraft:pillager': JsonEntityPillager,
  'player': JsonEntityPlayer,
  'minecraft:player': JsonEntityPlayer,
  'polar_bear': JsonEntityPolarBear,
  'minecraft:polar_bear': JsonEntityPolarBear,
  'poplar_boat': JsonEntityPoplarBoat,
  'minecraft:poplar_boat': JsonEntityPoplarBoat,
  'popolar_chest_boat': JsonEntityPopolarChestBoat,
  'minecraft:popolar_chest_boat': JsonEntityPopolarChestBoat,
  'potion': JsonEntityPotion,
  'minecraft:potion': JsonEntityPotion,
  'pufferfish': JsonEntityPufferfish,
  'minecraft:pufferfish': JsonEntityPufferfish,
  'rabbit': JsonEntityRabbit,
  'minecraft:rabbit': JsonEntityRabbit,
  'ravager': JsonEntityRavager,
  'minecraft:ravager': JsonEntityRavager,
  'salmon': JsonEntitySalmon,
  'minecraft:salmon': JsonEntitySalmon,
  'sheep': JsonEntitySheep,
  'minecraft:sheep': JsonEntitySheep,
  'shulker': JsonEntityShulker,
  'minecraft:shulker': JsonEntityShulker,
  'shulker_bullet': JsonEntityShulkerBullet,
  'minecraft:shulker_bullet': JsonEntityShulkerBullet,
  'silverfish': JsonEntitySilverfish,
  'minecraft:silverfish': JsonEntitySilverfish,
  'skeleton': JsonEntitySkeleton,
  'minecraft:skeleton': JsonEntitySkeleton,
  'skeleton_horse': JsonEntitySkeletonHorse,
  'minecraft:skeleton_horse': JsonEntitySkeletonHorse,
  'slime': JsonEntitySlime,
  'minecraft:slime': JsonEntitySlime,
  'small_fireball': JsonEntitySmallFireball,
  'minecraft:small_fireball': JsonEntitySmallFireball,
  'sniffer': JsonEntitySniffer,
  'minecraft:sniffer': JsonEntitySniffer,
  'snow_golem': JsonEntitySnowGolem,
  'minecraft:snow_golem': JsonEntitySnowGolem,
  'snowball': JsonEntitySnowball,
  'minecraft:snowball': JsonEntitySnowball,
  'spawner_minecart': JsonEntitySpawnerMinecart,
  'minecraft:spawner_minecart': JsonEntitySpawnerMinecart,
  'spectral_arrow': JsonEntitySpectralArrow,
  'minecraft:spectral_arrow': JsonEntitySpectralArrow,
  'spider': JsonEntitySpider,
  'minecraft:spider': JsonEntitySpider,
  'splash_potion': JsonEntitySplashPotion,
  'minecraft:splash_potion': JsonEntitySplashPotion,
  'spruce_boat': JsonEntitySpruceBoat,
  'minecraft:spruce_boat': JsonEntitySpruceBoat,
  'spruce_chest_boat': JsonEntitySpruceChestBoat,
  'minecraft:spruce_chest_boat': JsonEntitySpruceChestBoat,
  'squid': JsonEntitySquid,
  'minecraft:squid': JsonEntitySquid,
  'stray': JsonEntityStray,
  'minecraft:stray': JsonEntityStray,
  'strider': JsonEntityStrider,
  'minecraft:strider': JsonEntityStrider,
  'sulfur_cube': JsonEntitySulfurCube,
  'minecraft:sulfur_cube': JsonEntitySulfurCube,
  'tadpole': JsonEntityTadpole,
  'minecraft:tadpole': JsonEntityTadpole,
  'text_display': JsonEntityTextDisplay,
  'minecraft:text_display': JsonEntityTextDisplay,
  'tnt': JsonEntityTnt,
  'minecraft:tnt': JsonEntityTnt,
  'tnt_minecart': JsonEntityTntMinecart,
  'minecraft:tnt_minecart': JsonEntityTntMinecart,
  'trader_llama': JsonEntityTraderLlama,
  'minecraft:trader_llama': JsonEntityTraderLlama,
  'trident': JsonEntityTrident,
  'minecraft:trident': JsonEntityTrident,
  'tropical_fish': JsonEntityTropicalFish,
  'minecraft:tropical_fish': JsonEntityTropicalFish,
  'turtle': JsonEntityTurtle,
  'minecraft:turtle': JsonEntityTurtle,
  'vex': JsonEntityVex,
  'minecraft:vex': JsonEntityVex,
  'villager': JsonEntityVillager,
  'minecraft:villager': JsonEntityVillager,
  'vindicator': JsonEntityVindicator,
  'minecraft:vindicator': JsonEntityVindicator,
  'wandering_trader': JsonEntityWanderingTrader,
  'minecraft:wandering_trader': JsonEntityWanderingTrader,
  'warden': JsonEntityWarden,
  'minecraft:warden': JsonEntityWarden,
  'witch': JsonEntityWitch,
  'minecraft:witch': JsonEntityWitch,
  'wither': JsonEntityWither,
  'minecraft:wither': JsonEntityWither,
  'wither_skeleton': JsonEntityWitherSkeleton,
  'minecraft:wither_skeleton': JsonEntityWitherSkeleton,
  'wither_skull': JsonEntityWitherSkull,
  'minecraft:wither_skull': JsonEntityWitherSkull,
  'wolf': JsonEntityWolf,
  'minecraft:wolf': JsonEntityWolf,
  'zoglin': JsonEntityZoglin,
  'minecraft:zoglin': JsonEntityZoglin,
  'zombie': JsonEntityZombie,
  'minecraft:zombie': JsonEntityZombie,
  'zombie_horse': JsonEntityZombieHorse,
  'minecraft:zombie_horse': JsonEntityZombieHorse,
  'zombie_nautilus': JsonEntityZombieNautilus,
  'minecraft:zombie_nautilus': JsonEntityZombieNautilus,
  'zombie_villager': JsonEntityZombieVillager,
  'minecraft:zombie_villager': JsonEntityZombieVillager,
  'zombified_piglin': JsonEntityZombifiedPiglin,
  'minecraft:zombified_piglin': JsonEntityZombifiedPiglin,
}
type JsonEntityKeys = keyof JsonEntityDispatcherMap
type JsonEntityFallback = (
  | JsonEntityAcaciaBoat
  | JsonEntityAcaciaChestBoat
  | JsonEntityAllay
  | JsonEntityAreaEffectCloud
  | JsonEntityArmadillo
  | JsonEntityArmorStand
  | JsonEntityArrow
  | JsonEntityAxolotl
  | JsonEntityBambooChestRaft
  | JsonEntityBambooRaft
  | JsonEntityBat
  | JsonEntityBee
  | JsonEntityBirchBoat
  | JsonEntityBirchChestBoat
  | JsonEntityBlaze
  | JsonEntityBlockDisplay
  | JsonEntityBogged
  | JsonEntityBreeze
  | JsonEntityBreezeWindCharge
  | JsonEntityCamel
  | JsonEntityCamelHusk
  | JsonEntityCat
  | JsonEntityCaveSpider
  | JsonEntityCherryBoat
  | JsonEntityCherryChestBoat
  | JsonEntityChestMinecart
  | JsonEntityChicken
  | JsonEntityCod
  | JsonEntityCommandBlockMinecart
  | JsonEntityCopperGolem
  | JsonEntityCow
  | JsonEntityCreaking
  | JsonEntityCreeper
  | JsonEntityCushion
  | JsonEntityDarkOakBoat
  | JsonEntityDarkOakChestBoat
  | JsonEntityDolphin
  | JsonEntityDonkey
  | JsonEntityDragonFireball
  | JsonEntityDrowned
  | JsonEntityEgg
  | JsonEntityElderGuardian
  | JsonEntityEndCrystal
  | JsonEntityEnderDragon
  | JsonEntityEnderPearl
  | JsonEntityEnderman
  | JsonEntityEndermite
  | JsonEntityEvoker
  | JsonEntityEvokerFangs
  | JsonEntityExperienceBottle
  | JsonEntityExperienceOrb
  | JsonEntityEyeOfEnder
  | JsonEntityFallingBlock
  | JsonEntityFireball
  | JsonEntityFireworkRocket
  | JsonEntityFox
  | JsonEntityFrog
  | JsonEntityFurnaceMinecart
  | JsonEntityGhast
  | JsonEntityGiant
  | JsonEntityGlowItemFrame
  | JsonEntityGlowSquid
  | JsonEntityGoat
  | JsonEntityGuardian
  | JsonEntityHappyGhast
  | JsonEntityHoglin
  | JsonEntityHopperMinecart
  | JsonEntityHorse
  | JsonEntityHusk
  | JsonEntityIllusioner
  | JsonEntityInteraction
  | JsonEntityIronGolem
  | JsonEntityItem
  | JsonEntityItemDisplay
  | JsonEntityItemFrame
  | JsonEntityJungleBoat
  | JsonEntityJungleChestBoat
  | JsonEntityLeashKnot
  | JsonEntityLingeringPotion
  | JsonEntityLlama
  | JsonEntityLlamaSpit
  | JsonEntityMagmaCube
  | JsonEntityMangroveBoat
  | JsonEntityMangroveChestBoat
  | JsonEntityMannequin
  | JsonEntityMarker
  | JsonEntityMinecart
  | JsonEntityMooshroom
  | JsonEntityMule
  | JsonEntityNautilus
  | JsonEntityOakBoat
  | JsonEntityOakChestBoat
  | JsonEntityOcelot
  | JsonEntityOminousItemSpawner
  | JsonEntityPainting
  | JsonEntityPaleOakBoat
  | JsonEntityPaleOakChestBoat
  | JsonEntityPanda
  | JsonEntityParched
  | JsonEntityParrot
  | JsonEntityPhantom
  | JsonEntityPig
  | JsonEntityPiglin
  | JsonEntityPiglinBrute
  | JsonEntityPillager
  | JsonEntityPlayer
  | JsonEntityPolarBear
  | JsonEntityPoplarBoat
  | JsonEntityPopolarChestBoat
  | JsonEntityPotion
  | JsonEntityPufferfish
  | JsonEntityRabbit
  | JsonEntityRavager
  | JsonEntitySalmon
  | JsonEntitySheep
  | JsonEntityShulker
  | JsonEntityShulkerBullet
  | JsonEntitySilverfish
  | JsonEntitySkeleton
  | JsonEntitySkeletonHorse
  | JsonEntitySlime
  | JsonEntitySmallFireball
  | JsonEntitySniffer
  | JsonEntitySnowGolem
  | JsonEntitySnowball
  | JsonEntitySpawnerMinecart
  | JsonEntitySpectralArrow
  | JsonEntitySpider
  | JsonEntitySplashPotion
  | JsonEntitySpruceBoat
  | JsonEntitySpruceChestBoat
  | JsonEntitySquid
  | JsonEntityStray
  | JsonEntityStrider
  | JsonEntitySulfurCube
  | JsonEntityTadpole
  | JsonEntityTextDisplay
  | JsonEntityTnt
  | JsonEntityTntMinecart
  | JsonEntityTraderLlama
  | JsonEntityTrident
  | JsonEntityTropicalFish
  | JsonEntityTurtle
  | JsonEntityVex
  | JsonEntityVillager
  | JsonEntityVindicator
  | JsonEntityWanderingTrader
  | JsonEntityWarden
  | JsonEntityWitch
  | JsonEntityWither
  | JsonEntityWitherSkeleton
  | JsonEntityWitherSkull
  | JsonEntityWolf
  | JsonEntityZoglin
  | JsonEntityZombie
  | JsonEntityZombieHorse
  | JsonEntityZombieNautilus
  | JsonEntityZombieVillager
  | JsonEntityZombifiedPiglin)
type JsonEntityAcaciaBoat = JsonBoat
type JsonEntityAcaciaChestBoat = JsonChestBoat
type JsonEntityAllay = JsonAllay
type JsonEntityAreaEffectCloud = JsonAreaEffectCloud
type JsonEntityArmadillo = JsonArmadillo
type JsonEntityArmorStand = JsonArmorStand
type JsonEntityArrow = JsonArrow
type JsonEntityAxolotl = JsonAxolotl
type JsonEntityBambooChestRaft = JsonChestBoat
type JsonEntityBambooRaft = JsonBoat
type JsonEntityBat = JsonBat
type JsonEntityBee = JsonBee
type JsonEntityBirchBoat = JsonBoat
type JsonEntityBirchChestBoat = JsonChestBoat
type JsonEntityBlaze = JsonMobBase
type JsonEntityBlockDisplay = JsonBlockDisplay
type JsonEntityBogged = JsonBogged
type JsonEntityBreeze = JsonMobBase
type JsonEntityBreezeWindCharge = JsonAcceleratingProjectileBase
type JsonEntityCamel = JsonCamel
type JsonEntityCamelHusk = JsonCamel
type JsonEntityCat = JsonCat
type JsonEntityCaveSpider = JsonMobBase
type JsonEntityCherryBoat = JsonBoat
type JsonEntityCherryChestBoat = JsonChestBoat
type JsonEntityChestMinecart = JsonChestMinecart
type JsonEntityChicken = JsonChicken
type JsonEntityCod = JsonFish
type JsonEntityCommandBlockMinecart = JsonCommandBlockMinecart
type JsonEntityCopperGolem = JsonCopperGolem
type JsonEntityCow = JsonCow
type JsonEntityCreaking = JsonCreaking
type JsonEntityCreeper = JsonCreeper
type JsonEntityCushion = JsonCushion
type JsonEntityDarkOakBoat = JsonBoat
type JsonEntityDarkOakChestBoat = JsonChestBoat
type JsonEntityDolphin = JsonDolphin
type JsonEntityDonkey = JsonChestedHorse
type JsonEntityDragonFireball = JsonDespawnableProjectileBase
type JsonEntityDrowned = JsonZombie
type JsonEntityEgg = JsonThrowableItem
type JsonEntityElderGuardian = JsonMobBase
type JsonEntityEndCrystal = JsonEndCrystal
type JsonEntityEnderDragon = JsonEnderDragon
type JsonEntityEnderPearl = JsonThrowableItem
type JsonEntityEnderman = JsonEnderman
type JsonEntityEndermite = JsonEndermite
type JsonEntityEvoker = JsonSpellcaster
type JsonEntityEvokerFangs = JsonEvokerFangs
type JsonEntityExperienceBottle = JsonThrowableItem
type JsonEntityExperienceOrb = JsonExperienceOrb
type JsonEntityEyeOfEnder = JsonEyeOfEnder
type JsonEntityFallingBlock = JsonFallingBlock
type JsonEntityFireball = JsonLargeFireball
type JsonEntityFireworkRocket = JsonFireWorkRocket
type JsonEntityFox = JsonFox
type JsonEntityFrog = JsonFrog
type JsonEntityFurnaceMinecart = JsonFurnaceMinecart
type JsonEntityGhast = JsonGhast
type JsonEntityGiant = JsonMobBase
type JsonEntityGlowItemFrame = JsonItemFrame
type JsonEntityGlowSquid = JsonGlowSquid
type JsonEntityGoat = JsonGoat
type JsonEntityGuardian = JsonMobBase
type JsonEntityHappyGhast = JsonHappyGhast
type JsonEntityHoglin = JsonHoglin
type JsonEntityHopperMinecart = JsonHopperMinecart
type JsonEntityHorse = JsonHorse
type JsonEntityHusk = JsonZombie
type JsonEntityIllusioner = JsonSpellcaster
type JsonEntityInteraction = JsonInteraction
type JsonEntityIronGolem = JsonIronGolem
type JsonEntityItem = JsonItem
type JsonEntityItemDisplay = JsonItemDisplay
type JsonEntityItemFrame = JsonItemFrame
type JsonEntityJungleBoat = JsonBoat
type JsonEntityJungleChestBoat = JsonChestBoat
type JsonEntityLeashKnot = JsonBlockAttachedEntity
type JsonEntityLingeringPotion = JsonPotion
type JsonEntityLlama = JsonLlama
type JsonEntityLlamaSpit = JsonLlamaSpit
type JsonEntityMagmaCube = JsonSlime
type JsonEntityMangroveBoat = JsonBoat
type JsonEntityMangroveChestBoat = JsonChestBoat
type JsonEntityMannequin = JsonMannequin
type JsonEntityMarker = JsonMarker
type JsonEntityMinecart = JsonMinecart
type JsonEntityMooshroom = JsonMooshroom
type JsonEntityMule = JsonChestedHorse
type JsonEntityNautilus = JsonTamable
type JsonEntityOakBoat = JsonBoat
type JsonEntityOakChestBoat = JsonChestBoat
type JsonEntityOcelot = JsonOcelot
type JsonEntityOminousItemSpawner = JsonOminousItemSpawner
type JsonEntityPainting = JsonPainting
type JsonEntityPaleOakBoat = JsonBoat
type JsonEntityPaleOakChestBoat = JsonChestBoat
type JsonEntityPanda = JsonPanda
type JsonEntityParched = JsonMobBase
type JsonEntityParrot = JsonParrot
type JsonEntityPhantom = JsonPhantom
type JsonEntityPig = JsonPig
type JsonEntityPiglin = JsonPiglin
type JsonEntityPiglinBrute = JsonPiglinBase
type JsonEntityPillager = JsonPillager
type JsonEntityPlayer = JsonPlayer
type JsonEntityPolarBear = JsonPolarBear
type JsonEntityPoplarBoat = JsonBoat
type JsonEntityPopolarChestBoat = JsonChestBoat
type JsonEntityPotion = JsonPotion
type JsonEntityPufferfish = JsonPufferfish
type JsonEntityRabbit = JsonRabbit
type JsonEntityRavager = JsonRavager
type JsonEntitySalmon = JsonSalmon
type JsonEntitySheep = JsonSheep
type JsonEntityShulker = JsonShulker
type JsonEntityShulkerBullet = JsonShulkerBullet
type JsonEntitySilverfish = JsonMobBase
type JsonEntitySkeleton = JsonSkeleton
type JsonEntitySkeletonHorse = JsonSkeletonHorse
type JsonEntitySlime = JsonSlime
type JsonEntitySmallFireball = JsonFireballBase
type JsonEntitySniffer = JsonBreedable
type JsonEntitySnowGolem = JsonSnowGolem
type JsonEntitySnowball = JsonThrowableItem
type JsonEntitySpawnerMinecart = JsonSpawnerMinecart
type JsonEntitySpectralArrow = JsonSpectralArrow
type JsonEntitySpider = JsonMobBase
type JsonEntitySplashPotion = JsonPotion
type JsonEntitySpruceBoat = JsonBoat
type JsonEntitySpruceChestBoat = JsonChestBoat
type JsonEntitySquid = JsonSquid
type JsonEntityStray = JsonMobBase
type JsonEntityStrider = JsonSaddled
type JsonEntitySulfurCube = JsonSulfurCube
type JsonEntityTadpole = JsonTadpole
type JsonEntityTextDisplay = JsonTextDisplay
type JsonEntityTnt = JsonTnt
type JsonEntityTntMinecart = JsonTntMinecart
type JsonEntityTraderLlama = JsonTraderLlama
type JsonEntityTrident = JsonTrident
type JsonEntityTropicalFish = JsonTropicalFish
type JsonEntityTurtle = JsonTurtle
type JsonEntityVex = JsonVex
type JsonEntityVillager = JsonVillager
type JsonEntityVindicator = JsonVindicator
type JsonEntityWanderingTrader = JsonWanderingTrader
type JsonEntityWarden = JsonWarden
type JsonEntityWitch = JsonRaiderBase
type JsonEntityWither = JsonWither
type JsonEntityWitherSkeleton = JsonMobBase
type JsonEntityWitherSkull = JsonWitherSkull
type JsonEntityWolf = JsonWolf
type JsonEntityZoglin = JsonZoglin
type JsonEntityZombie = JsonZombie
type JsonEntityZombieHorse = JsonHorseBase
type JsonEntityZombieNautilus = JsonTamable
type JsonEntityZombieVillager = JsonZombieVillager
type JsonEntityZombifiedPiglin = JsonZombiePigman
export type JsonSymbolEntity<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEntityDispatcherMap
  : CASE extends 'keys' ? JsonEntityKeys : CASE extends '%fallback' ? JsonEntityFallback : never
