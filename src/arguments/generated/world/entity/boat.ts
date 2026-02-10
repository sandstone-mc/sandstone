import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { SlottedItem } from 'sandstone/arguments/generated/util/slot.ts'
import type { AreaEffectCloud } from 'sandstone/arguments/generated/world/entity/area_effect_cloud.ts'
import type { BlockAttachedEntity, EntityBase } from 'sandstone/arguments/generated/world/entity.ts'
import type { BlockDisplay, ItemDisplay, TextDisplay } from 'sandstone/arguments/generated/world/entity/display.ts'
import type { EndCrystal } from 'sandstone/arguments/generated/world/entity/end_crystal.ts'
import type { EvokerFangs } from 'sandstone/arguments/generated/world/entity/evoker_fangs.ts'
import type { ExperienceOrb } from 'sandstone/arguments/generated/world/entity/experience_orb.ts'
import type { EyeOfEnder } from 'sandstone/arguments/generated/world/entity/eye_of_ender.ts'
import type { FallingBlock } from 'sandstone/arguments/generated/world/entity/falling_block.ts'
import type { Interaction } from 'sandstone/arguments/generated/world/entity/interaction.ts'
import type { ItemFrame } from 'sandstone/arguments/generated/world/entity/item_frame.ts'
import type { Item } from 'sandstone/arguments/generated/world/entity/item.ts'
import type { Marker } from 'sandstone/arguments/generated/world/entity/marker.ts'
import type {
  ChestMinecart,
  CommandBlockMinecart,
  FurnaceMinecart,
  HopperMinecart,
  Minecart,
  SpawnerMinecart,
  TntMinecart,
} from 'sandstone/arguments/generated/world/entity/minecart.ts'
import type { Allay } from 'sandstone/arguments/generated/world/entity/mob/allay.ts'
import type { ArmorStand } from 'sandstone/arguments/generated/world/entity/mob/armor_stand.ts'
import type { Bat } from 'sandstone/arguments/generated/world/entity/mob/bat.ts'
import type { Bogged } from 'sandstone/arguments/generated/world/entity/mob/bogged.ts'
import type { Armadillo } from 'sandstone/arguments/generated/world/entity/mob/breedable/armadillo.ts'
import type { Axolotl } from 'sandstone/arguments/generated/world/entity/mob/breedable/axolotl.ts'
import type { Bee } from 'sandstone/arguments/generated/world/entity/mob/breedable/bee.ts'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'
import type { Chicken } from 'sandstone/arguments/generated/world/entity/mob/breedable/chicken.ts'
import type { Cow } from 'sandstone/arguments/generated/world/entity/mob/breedable/cow.ts'
import type { Fox } from 'sandstone/arguments/generated/world/entity/mob/breedable/fox.ts'
import type { Frog } from 'sandstone/arguments/generated/world/entity/mob/breedable/frog.ts'
import type { Goat } from 'sandstone/arguments/generated/world/entity/mob/breedable/goat.ts'
import type { Hoglin } from 'sandstone/arguments/generated/world/entity/mob/breedable/hoglin.ts'
import type {
  Camel,
  ChestedHorse,
  Horse,
  HorseBase,
  Llama,
  SkeletonHorse,
  TraderLlama,
} from 'sandstone/arguments/generated/world/entity/mob/breedable/horse.ts'
import type { Mooshroom } from 'sandstone/arguments/generated/world/entity/mob/breedable/mooshroom.ts'
import type { Ocelot } from 'sandstone/arguments/generated/world/entity/mob/breedable/ocelot.ts'
import type { Panda } from 'sandstone/arguments/generated/world/entity/mob/breedable/panda.ts'
import type { PolarBear } from 'sandstone/arguments/generated/world/entity/mob/breedable/polar_bear.ts'
import type { Rabbit } from 'sandstone/arguments/generated/world/entity/mob/breedable/rabbit.ts'
import type { Pig, Saddled } from 'sandstone/arguments/generated/world/entity/mob/breedable/saddled.ts'
import type { Sheep } from 'sandstone/arguments/generated/world/entity/mob/breedable/sheep.ts'
import type { Cat, Parrot, Tamable, Wolf } from 'sandstone/arguments/generated/world/entity/mob/breedable/tamable.ts'
import type { Turtle } from 'sandstone/arguments/generated/world/entity/mob/breedable/turtle.ts'
import type { Villager, WanderingTrader } from 'sandstone/arguments/generated/world/entity/mob/breedable/villager.ts'
import type { CopperGolem } from 'sandstone/arguments/generated/world/entity/mob/copper_golem.ts'
import type { Creaking } from 'sandstone/arguments/generated/world/entity/mob/creaking.ts'
import type { Creeper } from 'sandstone/arguments/generated/world/entity/mob/creeper.ts'
import type { Dolphin } from 'sandstone/arguments/generated/world/entity/mob/dolphin.ts'
import type { EnderDragon } from 'sandstone/arguments/generated/world/entity/mob/ender_dragon.ts'
import type { Enderman } from 'sandstone/arguments/generated/world/entity/mob/enderman.ts'
import type { Endermite } from 'sandstone/arguments/generated/world/entity/mob/endermite.ts'
import type { Fish, Pufferfish, Salmon, TropicalFish } from 'sandstone/arguments/generated/world/entity/mob/fish.ts'
import type { Ghast } from 'sandstone/arguments/generated/world/entity/mob/ghast.ts'
import type { GlowSquid } from 'sandstone/arguments/generated/world/entity/mob/glow_squid.ts'
import type { IronGolem } from 'sandstone/arguments/generated/world/entity/mob/iron_golem.ts'
import type { Mannequin } from 'sandstone/arguments/generated/world/entity/mob/mannequin.ts'
import type { MobBase, Squid } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { Phantom } from 'sandstone/arguments/generated/world/entity/mob/phantom.ts'
import type { Piglin, PiglinBase } from 'sandstone/arguments/generated/world/entity/mob/piglin.ts'
import type { Player } from 'sandstone/arguments/generated/world/entity/mob/player.ts'
import type {
  Pillager,
  RaiderBase,
  Ravager,
  Spellcaster,
  Vindicator,
} from 'sandstone/arguments/generated/world/entity/mob/raider.ts'
import type { Shulker } from 'sandstone/arguments/generated/world/entity/mob/shulker.ts'
import type { Skeleton } from 'sandstone/arguments/generated/world/entity/mob/skeleton.ts'
import type { Slime } from 'sandstone/arguments/generated/world/entity/mob/slime.ts'
import type { SnowGolem } from 'sandstone/arguments/generated/world/entity/mob/snow_golem.ts'
import type { Tadpole } from 'sandstone/arguments/generated/world/entity/mob/tadpole.ts'
import type { Vex } from 'sandstone/arguments/generated/world/entity/mob/vex.ts'
import type { Warden } from 'sandstone/arguments/generated/world/entity/mob/warden.ts'
import type { Wither } from 'sandstone/arguments/generated/world/entity/mob/wither.ts'
import type { Zoglin } from 'sandstone/arguments/generated/world/entity/mob/zoglin.ts'
import type { Zombie, ZombieVillager } from 'sandstone/arguments/generated/world/entity/mob/zombie.ts'
import type { ZombiePigman } from 'sandstone/arguments/generated/world/entity/mob/zombified_piglin.ts'
import type { OminousItemSpawner } from 'sandstone/arguments/generated/world/entity/ominous_item_spawner.ts'
import type { Painting } from 'sandstone/arguments/generated/world/entity/painting.ts'
import type { Arrow, SpectralArrow, Trident } from 'sandstone/arguments/generated/world/entity/projectile/arrow.ts'
import type {
  AcceleratingProjectileBase,
  DespawnableProjectileBase,
  FireballBase,
  LargeFireball,
  WitherSkull,
} from 'sandstone/arguments/generated/world/entity/projectile/fireball.ts'
import type { FireWorkRocket } from 'sandstone/arguments/generated/world/entity/projectile/firework_rocket.ts'
import type { LlamaSpit } from 'sandstone/arguments/generated/world/entity/projectile.ts'
import type { ShulkerBullet } from 'sandstone/arguments/generated/world/entity/projectile/shulker_bullet.ts'
import type { Potion, ThrowableItem } from 'sandstone/arguments/generated/world/entity/projectile/throwable.ts'
import type { Tnt } from 'sandstone/arguments/generated/world/entity/tnt.ts'
import type { LootTableClass, NBTByte, NBTList, NBTLong } from 'sandstone'

export type Boat = EntityBase

export type BoatType = (
  | 'oak'
  | 'spruce'
  | 'birch'
  | 'jungle'
  | 'acacia'
  | 'dark_oak'
  | 'mangrove'
  | 'bamboo'
  | 'cherry')

export type ChestBoat = (Boat & {
  /**
   * Loot table that will populate this chest boat.
   */
  LootTable?: (Registry['minecraft:loot_table'] | '' | LootTableClass),
  /**
   * Seed of the loot table.
   */
  LootTableSeed?: NBTLong,
  /**
   * Slots from 0 to 26.
   *
   * Value:
   * List length range: 0..27
   */
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0,
    max: 26,
  }>>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 27,
  }>,
})
type EntityDispatcherMap = {
  'acacia_boat': EntityAcaciaBoat,
  'minecraft:acacia_boat': EntityAcaciaBoat,
  'acacia_chest_boat': EntityAcaciaChestBoat,
  'minecraft:acacia_chest_boat': EntityAcaciaChestBoat,
  'allay': EntityAllay,
  'minecraft:allay': EntityAllay,
  'area_effect_cloud': EntityAreaEffectCloud,
  'minecraft:area_effect_cloud': EntityAreaEffectCloud,
  'armadillo': EntityArmadillo,
  'minecraft:armadillo': EntityArmadillo,
  'armor_stand': EntityArmorStand,
  'minecraft:armor_stand': EntityArmorStand,
  'arrow': EntityArrow,
  'minecraft:arrow': EntityArrow,
  'axolotl': EntityAxolotl,
  'minecraft:axolotl': EntityAxolotl,
  'bamboo_chest_raft': EntityBambooChestRaft,
  'minecraft:bamboo_chest_raft': EntityBambooChestRaft,
  'bamboo_raft': EntityBambooRaft,
  'minecraft:bamboo_raft': EntityBambooRaft,
  'bat': EntityBat,
  'minecraft:bat': EntityBat,
  'bee': EntityBee,
  'minecraft:bee': EntityBee,
  'birch_boat': EntityBirchBoat,
  'minecraft:birch_boat': EntityBirchBoat,
  'birch_chest_boat': EntityBirchChestBoat,
  'minecraft:birch_chest_boat': EntityBirchChestBoat,
  'blaze': EntityBlaze,
  'minecraft:blaze': EntityBlaze,
  'block_display': EntityBlockDisplay,
  'minecraft:block_display': EntityBlockDisplay,
  'boat': EntityBoat,
  'minecraft:boat': EntityBoat,
  'bogged': EntityBogged,
  'minecraft:bogged': EntityBogged,
  'breeze': EntityBreeze,
  'minecraft:breeze': EntityBreeze,
  'breeze_wind_charge': EntityBreezeWindCharge,
  'minecraft:breeze_wind_charge': EntityBreezeWindCharge,
  'camel': EntityCamel,
  'minecraft:camel': EntityCamel,
  'camel_husk': EntityCamelHusk,
  'minecraft:camel_husk': EntityCamelHusk,
  'cat': EntityCat,
  'minecraft:cat': EntityCat,
  'cave_spider': EntityCaveSpider,
  'minecraft:cave_spider': EntityCaveSpider,
  'cherry_boat': EntityCherryBoat,
  'minecraft:cherry_boat': EntityCherryBoat,
  'cherry_chest_boat': EntityCherryChestBoat,
  'minecraft:cherry_chest_boat': EntityCherryChestBoat,
  'chest_boat': EntityChestBoat,
  'minecraft:chest_boat': EntityChestBoat,
  'chest_minecart': EntityChestMinecart,
  'minecraft:chest_minecart': EntityChestMinecart,
  'chicken': EntityChicken,
  'minecraft:chicken': EntityChicken,
  'cod': EntityCod,
  'minecraft:cod': EntityCod,
  'command_block_minecart': EntityCommandBlockMinecart,
  'minecraft:command_block_minecart': EntityCommandBlockMinecart,
  'copper_golem': EntityCopperGolem,
  'minecraft:copper_golem': EntityCopperGolem,
  'cow': EntityCow,
  'minecraft:cow': EntityCow,
  'creaking': EntityCreaking,
  'minecraft:creaking': EntityCreaking,
  'creaking_transient': EntityCreakingTransient,
  'minecraft:creaking_transient': EntityCreakingTransient,
  'creeper': EntityCreeper,
  'minecraft:creeper': EntityCreeper,
  'dark_oak_boat': EntityDarkOakBoat,
  'minecraft:dark_oak_boat': EntityDarkOakBoat,
  'dark_oak_chest_boat': EntityDarkOakChestBoat,
  'minecraft:dark_oak_chest_boat': EntityDarkOakChestBoat,
  'dolphin': EntityDolphin,
  'minecraft:dolphin': EntityDolphin,
  'donkey': EntityDonkey,
  'minecraft:donkey': EntityDonkey,
  'dragon_fireball': EntityDragonFireball,
  'minecraft:dragon_fireball': EntityDragonFireball,
  'drowned': EntityDrowned,
  'minecraft:drowned': EntityDrowned,
  'egg': EntityEgg,
  'minecraft:egg': EntityEgg,
  'elder_guardian': EntityElderGuardian,
  'minecraft:elder_guardian': EntityElderGuardian,
  'end_crystal': EntityEndCrystal,
  'minecraft:end_crystal': EntityEndCrystal,
  'ender_dragon': EntityEnderDragon,
  'minecraft:ender_dragon': EntityEnderDragon,
  'ender_pearl': EntityEnderPearl,
  'minecraft:ender_pearl': EntityEnderPearl,
  'enderman': EntityEnderman,
  'minecraft:enderman': EntityEnderman,
  'endermite': EntityEndermite,
  'minecraft:endermite': EntityEndermite,
  'evoker': EntityEvoker,
  'minecraft:evoker': EntityEvoker,
  'evoker_fangs': EntityEvokerFangs,
  'minecraft:evoker_fangs': EntityEvokerFangs,
  'experience_bottle': EntityExperienceBottle,
  'minecraft:experience_bottle': EntityExperienceBottle,
  'experience_orb': EntityExperienceOrb,
  'minecraft:experience_orb': EntityExperienceOrb,
  'eye_of_ender': EntityEyeOfEnder,
  'minecraft:eye_of_ender': EntityEyeOfEnder,
  'falling_block': EntityFallingBlock,
  'minecraft:falling_block': EntityFallingBlock,
  'fireball': EntityFireball,
  'minecraft:fireball': EntityFireball,
  'firework_rocket': EntityFireworkRocket,
  'minecraft:firework_rocket': EntityFireworkRocket,
  'fox': EntityFox,
  'minecraft:fox': EntityFox,
  'frog': EntityFrog,
  'minecraft:frog': EntityFrog,
  'furnace_minecart': EntityFurnaceMinecart,
  'minecraft:furnace_minecart': EntityFurnaceMinecart,
  'ghast': EntityGhast,
  'minecraft:ghast': EntityGhast,
  'giant': EntityGiant,
  'minecraft:giant': EntityGiant,
  'glow_item_frame': EntityGlowItemFrame,
  'minecraft:glow_item_frame': EntityGlowItemFrame,
  'glow_squid': EntityGlowSquid,
  'minecraft:glow_squid': EntityGlowSquid,
  'goat': EntityGoat,
  'minecraft:goat': EntityGoat,
  'guardian': EntityGuardian,
  'minecraft:guardian': EntityGuardian,
  'hoglin': EntityHoglin,
  'minecraft:hoglin': EntityHoglin,
  'hopper_minecart': EntityHopperMinecart,
  'minecraft:hopper_minecart': EntityHopperMinecart,
  'horse': EntityHorse,
  'minecraft:horse': EntityHorse,
  'husk': EntityHusk,
  'minecraft:husk': EntityHusk,
  'illusioner': EntityIllusioner,
  'minecraft:illusioner': EntityIllusioner,
  'interaction': EntityInteraction,
  'minecraft:interaction': EntityInteraction,
  'iron_golem': EntityIronGolem,
  'minecraft:iron_golem': EntityIronGolem,
  'item': EntityItem,
  'minecraft:item': EntityItem,
  'item_display': EntityItemDisplay,
  'minecraft:item_display': EntityItemDisplay,
  'item_frame': EntityItemFrame,
  'minecraft:item_frame': EntityItemFrame,
  'jungle_boat': EntityJungleBoat,
  'minecraft:jungle_boat': EntityJungleBoat,
  'jungle_chest_boat': EntityJungleChestBoat,
  'minecraft:jungle_chest_boat': EntityJungleChestBoat,
  'leash_knot': EntityLeashKnot,
  'minecraft:leash_knot': EntityLeashKnot,
  'lingering_potion': EntityLingeringPotion,
  'minecraft:lingering_potion': EntityLingeringPotion,
  'llama': EntityLlama,
  'minecraft:llama': EntityLlama,
  'llama_spit': EntityLlamaSpit,
  'minecraft:llama_spit': EntityLlamaSpit,
  'magma_cube': EntityMagmaCube,
  'minecraft:magma_cube': EntityMagmaCube,
  'mangrove_boat': EntityMangroveBoat,
  'minecraft:mangrove_boat': EntityMangroveBoat,
  'mangrove_chest_boat': EntityMangroveChestBoat,
  'minecraft:mangrove_chest_boat': EntityMangroveChestBoat,
  'mannequin': EntityMannequin,
  'minecraft:mannequin': EntityMannequin,
  'marker': EntityMarker,
  'minecraft:marker': EntityMarker,
  'minecart': EntityMinecart,
  'minecraft:minecart': EntityMinecart,
  'mooshroom': EntityMooshroom,
  'minecraft:mooshroom': EntityMooshroom,
  'mule': EntityMule,
  'minecraft:mule': EntityMule,
  'nautilus': EntityNautilus,
  'minecraft:nautilus': EntityNautilus,
  'oak_boat': EntityOakBoat,
  'minecraft:oak_boat': EntityOakBoat,
  'oak_chest_boat': EntityOakChestBoat,
  'minecraft:oak_chest_boat': EntityOakChestBoat,
  'ocelot': EntityOcelot,
  'minecraft:ocelot': EntityOcelot,
  'ominous_item_spawner': EntityOminousItemSpawner,
  'minecraft:ominous_item_spawner': EntityOminousItemSpawner,
  'painting': EntityPainting,
  'minecraft:painting': EntityPainting,
  'pale_oak_boat': EntityPaleOakBoat,
  'minecraft:pale_oak_boat': EntityPaleOakBoat,
  'pale_oak_chest_boat': EntityPaleOakChestBoat,
  'minecraft:pale_oak_chest_boat': EntityPaleOakChestBoat,
  'panda': EntityPanda,
  'minecraft:panda': EntityPanda,
  'parched': EntityParched,
  'minecraft:parched': EntityParched,
  'parrot': EntityParrot,
  'minecraft:parrot': EntityParrot,
  'phantom': EntityPhantom,
  'minecraft:phantom': EntityPhantom,
  'pig': EntityPig,
  'minecraft:pig': EntityPig,
  'piglin': EntityPiglin,
  'minecraft:piglin': EntityPiglin,
  'piglin_brute': EntityPiglinBrute,
  'minecraft:piglin_brute': EntityPiglinBrute,
  'pillager': EntityPillager,
  'minecraft:pillager': EntityPillager,
  'player': EntityPlayer,
  'minecraft:player': EntityPlayer,
  'polar_bear': EntityPolarBear,
  'minecraft:polar_bear': EntityPolarBear,
  'potion': EntityPotion,
  'minecraft:potion': EntityPotion,
  'pufferfish': EntityPufferfish,
  'minecraft:pufferfish': EntityPufferfish,
  'rabbit': EntityRabbit,
  'minecraft:rabbit': EntityRabbit,
  'ravager': EntityRavager,
  'minecraft:ravager': EntityRavager,
  'salmon': EntitySalmon,
  'minecraft:salmon': EntitySalmon,
  'sheep': EntitySheep,
  'minecraft:sheep': EntitySheep,
  'shulker': EntityShulker,
  'minecraft:shulker': EntityShulker,
  'shulker_bullet': EntityShulkerBullet,
  'minecraft:shulker_bullet': EntityShulkerBullet,
  'silverfish': EntitySilverfish,
  'minecraft:silverfish': EntitySilverfish,
  'skeleton': EntitySkeleton,
  'minecraft:skeleton': EntitySkeleton,
  'skeleton_horse': EntitySkeletonHorse,
  'minecraft:skeleton_horse': EntitySkeletonHorse,
  'slime': EntitySlime,
  'minecraft:slime': EntitySlime,
  'small_fireball': EntitySmallFireball,
  'minecraft:small_fireball': EntitySmallFireball,
  'sniffer': EntitySniffer,
  'minecraft:sniffer': EntitySniffer,
  'snow_golem': EntitySnowGolem,
  'minecraft:snow_golem': EntitySnowGolem,
  'snowball': EntitySnowball,
  'minecraft:snowball': EntitySnowball,
  'spawner_minecart': EntitySpawnerMinecart,
  'minecraft:spawner_minecart': EntitySpawnerMinecart,
  'spectral_arrow': EntitySpectralArrow,
  'minecraft:spectral_arrow': EntitySpectralArrow,
  'spider': EntitySpider,
  'minecraft:spider': EntitySpider,
  'splash_potion': EntitySplashPotion,
  'minecraft:splash_potion': EntitySplashPotion,
  'spruce_boat': EntitySpruceBoat,
  'minecraft:spruce_boat': EntitySpruceBoat,
  'spruce_chest_boat': EntitySpruceChestBoat,
  'minecraft:spruce_chest_boat': EntitySpruceChestBoat,
  'squid': EntitySquid,
  'minecraft:squid': EntitySquid,
  'stray': EntityStray,
  'minecraft:stray': EntityStray,
  'strider': EntityStrider,
  'minecraft:strider': EntityStrider,
  'tadpole': EntityTadpole,
  'minecraft:tadpole': EntityTadpole,
  'text_display': EntityTextDisplay,
  'minecraft:text_display': EntityTextDisplay,
  'tnt': EntityTnt,
  'minecraft:tnt': EntityTnt,
  'tnt_minecart': EntityTntMinecart,
  'minecraft:tnt_minecart': EntityTntMinecart,
  'trader_llama': EntityTraderLlama,
  'minecraft:trader_llama': EntityTraderLlama,
  'trident': EntityTrident,
  'minecraft:trident': EntityTrident,
  'tropical_fish': EntityTropicalFish,
  'minecraft:tropical_fish': EntityTropicalFish,
  'turtle': EntityTurtle,
  'minecraft:turtle': EntityTurtle,
  'vex': EntityVex,
  'minecraft:vex': EntityVex,
  'villager': EntityVillager,
  'minecraft:villager': EntityVillager,
  'vindicator': EntityVindicator,
  'minecraft:vindicator': EntityVindicator,
  'wandering_trader': EntityWanderingTrader,
  'minecraft:wandering_trader': EntityWanderingTrader,
  'warden': EntityWarden,
  'minecraft:warden': EntityWarden,
  'witch': EntityWitch,
  'minecraft:witch': EntityWitch,
  'wither': EntityWither,
  'minecraft:wither': EntityWither,
  'wither_skeleton': EntityWitherSkeleton,
  'minecraft:wither_skeleton': EntityWitherSkeleton,
  'wither_skull': EntityWitherSkull,
  'minecraft:wither_skull': EntityWitherSkull,
  'wolf': EntityWolf,
  'minecraft:wolf': EntityWolf,
  'zoglin': EntityZoglin,
  'minecraft:zoglin': EntityZoglin,
  'zombie': EntityZombie,
  'minecraft:zombie': EntityZombie,
  'zombie_horse': EntityZombieHorse,
  'minecraft:zombie_horse': EntityZombieHorse,
  'zombie_nautilus': EntityZombieNautilus,
  'minecraft:zombie_nautilus': EntityZombieNautilus,
  'zombie_pigman': EntityZombiePigman,
  'minecraft:zombie_pigman': EntityZombiePigman,
  'zombie_villager': EntityZombieVillager,
  'minecraft:zombie_villager': EntityZombieVillager,
  'zombified_piglin': EntityZombifiedPiglin,
  'minecraft:zombified_piglin': EntityZombifiedPiglin,
}
type EntityKeys = keyof EntityDispatcherMap
type EntityFallback = (
  | EntityAcaciaBoat
  | EntityAcaciaChestBoat
  | EntityAllay
  | EntityAreaEffectCloud
  | EntityArmadillo
  | EntityArmorStand
  | EntityArrow
  | EntityAxolotl
  | EntityBambooChestRaft
  | EntityBambooRaft
  | EntityBat
  | EntityBee
  | EntityBirchBoat
  | EntityBirchChestBoat
  | EntityBlaze
  | EntityBlockDisplay
  | EntityBoat
  | EntityBogged
  | EntityBreeze
  | EntityBreezeWindCharge
  | EntityCamel
  | EntityCamelHusk
  | EntityCat
  | EntityCaveSpider
  | EntityCherryBoat
  | EntityCherryChestBoat
  | EntityChestBoat
  | EntityChestMinecart
  | EntityChicken
  | EntityCod
  | EntityCommandBlockMinecart
  | EntityCopperGolem
  | EntityCow
  | EntityCreaking
  | EntityCreakingTransient
  | EntityCreeper
  | EntityDarkOakBoat
  | EntityDarkOakChestBoat
  | EntityDolphin
  | EntityDonkey
  | EntityDragonFireball
  | EntityDrowned
  | EntityEgg
  | EntityElderGuardian
  | EntityEndCrystal
  | EntityEnderDragon
  | EntityEnderPearl
  | EntityEnderman
  | EntityEndermite
  | EntityEvoker
  | EntityEvokerFangs
  | EntityExperienceBottle
  | EntityExperienceOrb
  | EntityEyeOfEnder
  | EntityFallingBlock
  | EntityFireball
  | EntityFireworkRocket
  | EntityFox
  | EntityFrog
  | EntityFurnaceMinecart
  | EntityGhast
  | EntityGiant
  | EntityGlowItemFrame
  | EntityGlowSquid
  | EntityGoat
  | EntityGuardian
  | EntityHoglin
  | EntityHopperMinecart
  | EntityHorse
  | EntityHusk
  | EntityIllusioner
  | EntityInteraction
  | EntityIronGolem
  | EntityItem
  | EntityItemDisplay
  | EntityItemFrame
  | EntityJungleBoat
  | EntityJungleChestBoat
  | EntityLeashKnot
  | EntityLingeringPotion
  | EntityLlama
  | EntityLlamaSpit
  | EntityMagmaCube
  | EntityMangroveBoat
  | EntityMangroveChestBoat
  | EntityMannequin
  | EntityMarker
  | EntityMinecart
  | EntityMooshroom
  | EntityMule
  | EntityNautilus
  | EntityOakBoat
  | EntityOakChestBoat
  | EntityOcelot
  | EntityOminousItemSpawner
  | EntityPainting
  | EntityPaleOakBoat
  | EntityPaleOakChestBoat
  | EntityPanda
  | EntityParched
  | EntityParrot
  | EntityPhantom
  | EntityPig
  | EntityPiglin
  | EntityPiglinBrute
  | EntityPillager
  | EntityPlayer
  | EntityPolarBear
  | EntityPotion
  | EntityPufferfish
  | EntityRabbit
  | EntityRavager
  | EntitySalmon
  | EntitySheep
  | EntityShulker
  | EntityShulkerBullet
  | EntitySilverfish
  | EntitySkeleton
  | EntitySkeletonHorse
  | EntitySlime
  | EntitySmallFireball
  | EntitySniffer
  | EntitySnowGolem
  | EntitySnowball
  | EntitySpawnerMinecart
  | EntitySpectralArrow
  | EntitySpider
  | EntitySplashPotion
  | EntitySpruceBoat
  | EntitySpruceChestBoat
  | EntitySquid
  | EntityStray
  | EntityStrider
  | EntityTadpole
  | EntityTextDisplay
  | EntityTnt
  | EntityTntMinecart
  | EntityTraderLlama
  | EntityTrident
  | EntityTropicalFish
  | EntityTurtle
  | EntityVex
  | EntityVillager
  | EntityVindicator
  | EntityWanderingTrader
  | EntityWarden
  | EntityWitch
  | EntityWither
  | EntityWitherSkeleton
  | EntityWitherSkull
  | EntityWolf
  | EntityZoglin
  | EntityZombie
  | EntityZombieHorse
  | EntityZombieNautilus
  | EntityZombiePigman
  | EntityZombieVillager
  | EntityZombifiedPiglin)
type EntityAcaciaBoat = Boat
type EntityAcaciaChestBoat = ChestBoat
type EntityAllay = Allay
type EntityAreaEffectCloud = AreaEffectCloud
type EntityArmadillo = Armadillo
type EntityArmorStand = ArmorStand
type EntityArrow = Arrow
type EntityAxolotl = Axolotl
type EntityBambooChestRaft = ChestBoat
type EntityBambooRaft = Boat
type EntityBat = Bat
type EntityBee = Bee
type EntityBirchBoat = Boat
type EntityBirchChestBoat = ChestBoat
type EntityBlaze = MobBase
type EntityBlockDisplay = BlockDisplay
type EntityBoat = Boat
type EntityBogged = Bogged
type EntityBreeze = MobBase
type EntityBreezeWindCharge = AcceleratingProjectileBase
type EntityCamel = Camel
type EntityCamelHusk = Camel
type EntityCat = Cat
type EntityCaveSpider = MobBase
type EntityCherryBoat = Boat
type EntityCherryChestBoat = ChestBoat
type EntityChestBoat = ChestBoat
type EntityChestMinecart = ChestMinecart
type EntityChicken = Chicken
type EntityCod = Fish
type EntityCommandBlockMinecart = CommandBlockMinecart
type EntityCopperGolem = CopperGolem
type EntityCow = Cow
type EntityCreaking = Creaking
type EntityCreakingTransient = Creaking
type EntityCreeper = Creeper
type EntityDarkOakBoat = Boat
type EntityDarkOakChestBoat = ChestBoat
type EntityDolphin = Dolphin
type EntityDonkey = ChestedHorse
type EntityDragonFireball = DespawnableProjectileBase
type EntityDrowned = Zombie
type EntityEgg = ThrowableItem
type EntityElderGuardian = MobBase
type EntityEndCrystal = EndCrystal
type EntityEnderDragon = EnderDragon
type EntityEnderPearl = ThrowableItem
type EntityEnderman = Enderman
type EntityEndermite = Endermite
type EntityEvoker = Spellcaster
type EntityEvokerFangs = EvokerFangs
type EntityExperienceBottle = ThrowableItem
type EntityExperienceOrb = ExperienceOrb
type EntityEyeOfEnder = EyeOfEnder
type EntityFallingBlock = FallingBlock
type EntityFireball = LargeFireball
type EntityFireworkRocket = FireWorkRocket
type EntityFox = Fox
type EntityFrog = Frog
type EntityFurnaceMinecart = FurnaceMinecart
type EntityGhast = Ghast
type EntityGiant = MobBase
type EntityGlowItemFrame = ItemFrame
type EntityGlowSquid = GlowSquid
type EntityGoat = Goat
type EntityGuardian = MobBase
type EntityHoglin = Hoglin
type EntityHopperMinecart = HopperMinecart
type EntityHorse = Horse
type EntityHusk = Zombie
type EntityIllusioner = Spellcaster
type EntityInteraction = Interaction
type EntityIronGolem = IronGolem
type EntityItem = Item
type EntityItemDisplay = ItemDisplay
type EntityItemFrame = ItemFrame
type EntityJungleBoat = Boat
type EntityJungleChestBoat = ChestBoat
type EntityLeashKnot = BlockAttachedEntity
type EntityLingeringPotion = Potion
type EntityLlama = Llama
type EntityLlamaSpit = LlamaSpit
type EntityMagmaCube = Slime
type EntityMangroveBoat = Boat
type EntityMangroveChestBoat = ChestBoat
type EntityMannequin = Mannequin
type EntityMarker = Marker
type EntityMinecart = Minecart
type EntityMooshroom = Mooshroom
type EntityMule = ChestedHorse
type EntityNautilus = Tamable
type EntityOakBoat = Boat
type EntityOakChestBoat = ChestBoat
type EntityOcelot = Ocelot
type EntityOminousItemSpawner = OminousItemSpawner
type EntityPainting = Painting
type EntityPaleOakBoat = Boat
type EntityPaleOakChestBoat = ChestBoat
type EntityPanda = Panda
type EntityParched = MobBase
type EntityParrot = Parrot
type EntityPhantom = Phantom
type EntityPig = Pig
type EntityPiglin = Piglin
type EntityPiglinBrute = PiglinBase
type EntityPillager = Pillager
type EntityPlayer = Player
type EntityPolarBear = PolarBear
type EntityPotion = Potion
type EntityPufferfish = Pufferfish
type EntityRabbit = Rabbit
type EntityRavager = Ravager
type EntitySalmon = Salmon
type EntitySheep = Sheep
type EntityShulker = Shulker
type EntityShulkerBullet = ShulkerBullet
type EntitySilverfish = MobBase
type EntitySkeleton = Skeleton
type EntitySkeletonHorse = SkeletonHorse
type EntitySlime = Slime
type EntitySmallFireball = FireballBase
type EntitySniffer = Breedable
type EntitySnowGolem = SnowGolem
type EntitySnowball = ThrowableItem
type EntitySpawnerMinecart = SpawnerMinecart
type EntitySpectralArrow = SpectralArrow
type EntitySpider = MobBase
type EntitySplashPotion = Potion
type EntitySpruceBoat = Boat
type EntitySpruceChestBoat = ChestBoat
type EntitySquid = Squid
type EntityStray = MobBase
type EntityStrider = Saddled
type EntityTadpole = Tadpole
type EntityTextDisplay = TextDisplay
type EntityTnt = Tnt
type EntityTntMinecart = TntMinecart
type EntityTraderLlama = TraderLlama
type EntityTrident = Trident
type EntityTropicalFish = TropicalFish
type EntityTurtle = Turtle
type EntityVex = Vex
type EntityVillager = Villager
type EntityVindicator = Vindicator
type EntityWanderingTrader = WanderingTrader
type EntityWarden = Warden
type EntityWitch = RaiderBase
type EntityWither = Wither
type EntityWitherSkeleton = MobBase
type EntityWitherSkull = WitherSkull
type EntityWolf = Wolf
type EntityZoglin = Zoglin
type EntityZombie = Zombie
type EntityZombieHorse = HorseBase
type EntityZombieNautilus = Tamable
type EntityZombiePigman = ZombiePigman
type EntityZombieVillager = ZombieVillager
type EntityZombifiedPiglin = ZombiePigman
export type SymbolEntity<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? EntityDispatcherMap
  : CASE extends 'keys' ? EntityKeys : CASE extends '%fallback' ? EntityFallback : never
