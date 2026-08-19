import type { JsonSymbolBlockEntity } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonSkull } from 'sandstone/arguments/generated/_json/world/block/head.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'

type JsonBlockDispatcherMap = {
  'acacia_hanging_sign': JsonBlockAcaciaHangingSign,
  'minecraft:acacia_hanging_sign': JsonBlockAcaciaHangingSign,
  'acacia_shelf': JsonBlockAcaciaShelf,
  'minecraft:acacia_shelf': JsonBlockAcaciaShelf,
  'acacia_sign': JsonBlockAcaciaSign,
  'minecraft:acacia_sign': JsonBlockAcaciaSign,
  'acacia_wall_hanging_sign': JsonBlockAcaciaWallHangingSign,
  'minecraft:acacia_wall_hanging_sign': JsonBlockAcaciaWallHangingSign,
  'acacia_wall_sign': JsonBlockAcaciaWallSign,
  'minecraft:acacia_wall_sign': JsonBlockAcaciaWallSign,
  'bamboo_hanging_sign': JsonBlockBambooHangingSign,
  'minecraft:bamboo_hanging_sign': JsonBlockBambooHangingSign,
  'bamboo_shelf': JsonBlockBambooShelf,
  'minecraft:bamboo_shelf': JsonBlockBambooShelf,
  'bamboo_sign': JsonBlockBambooSign,
  'minecraft:bamboo_sign': JsonBlockBambooSign,
  'bamboo_wall_hanging_sign': JsonBlockBambooWallHangingSign,
  'minecraft:bamboo_wall_hanging_sign': JsonBlockBambooWallHangingSign,
  'bamboo_wall_sign': JsonBlockBambooWallSign,
  'minecraft:bamboo_wall_sign': JsonBlockBambooWallSign,
  'barrel': JsonBlockBarrel,
  'minecraft:barrel': JsonBlockBarrel,
  'beacon': JsonBlockBeacon,
  'minecraft:beacon': JsonBlockBeacon,
  'bee_nest': JsonBlockBeeNest,
  'minecraft:bee_nest': JsonBlockBeeNest,
  'beehive': JsonBlockBeehive,
  'minecraft:beehive': JsonBlockBeehive,
  'bell': JsonBlockBell,
  'minecraft:bell': JsonBlockBell,
  'birch_hanging_sign': JsonBlockBirchHangingSign,
  'minecraft:birch_hanging_sign': JsonBlockBirchHangingSign,
  'birch_shelf': JsonBlockBirchShelf,
  'minecraft:birch_shelf': JsonBlockBirchShelf,
  'birch_sign': JsonBlockBirchSign,
  'minecraft:birch_sign': JsonBlockBirchSign,
  'birch_wall_hanging_sign': JsonBlockBirchWallHangingSign,
  'minecraft:birch_wall_hanging_sign': JsonBlockBirchWallHangingSign,
  'birch_wall_sign': JsonBlockBirchWallSign,
  'minecraft:birch_wall_sign': JsonBlockBirchWallSign,
  'black_banner': JsonBlockBlackBanner,
  'minecraft:black_banner': JsonBlockBlackBanner,
  'black_shulker_box': JsonBlockBlackShulkerBox,
  'minecraft:black_shulker_box': JsonBlockBlackShulkerBox,
  'black_wall_banner': JsonBlockBlackWallBanner,
  'minecraft:black_wall_banner': JsonBlockBlackWallBanner,
  'blast_furnace': JsonBlockBlastFurnace,
  'minecraft:blast_furnace': JsonBlockBlastFurnace,
  'blue_banner': JsonBlockBlueBanner,
  'minecraft:blue_banner': JsonBlockBlueBanner,
  'blue_shulker_box': JsonBlockBlueShulkerBox,
  'minecraft:blue_shulker_box': JsonBlockBlueShulkerBox,
  'blue_wall_banner': JsonBlockBlueWallBanner,
  'minecraft:blue_wall_banner': JsonBlockBlueWallBanner,
  'brewing_stand': JsonBlockBrewingStand,
  'minecraft:brewing_stand': JsonBlockBrewingStand,
  'brown_banner': JsonBlockBrownBanner,
  'minecraft:brown_banner': JsonBlockBrownBanner,
  'brown_shulker_box': JsonBlockBrownShulkerBox,
  'minecraft:brown_shulker_box': JsonBlockBrownShulkerBox,
  'brown_wall_banner': JsonBlockBrownWallBanner,
  'minecraft:brown_wall_banner': JsonBlockBrownWallBanner,
  'calibrated_sculk_sensor': JsonBlockCalibratedSculkSensor,
  'minecraft:calibrated_sculk_sensor': JsonBlockCalibratedSculkSensor,
  'campfire': JsonBlockCampfire,
  'minecraft:campfire': JsonBlockCampfire,
  'chain_command_block': JsonBlockChainCommandBlock,
  'minecraft:chain_command_block': JsonBlockChainCommandBlock,
  'cherry_hanging_sign': JsonBlockCherryHangingSign,
  'minecraft:cherry_hanging_sign': JsonBlockCherryHangingSign,
  'cherry_shelf': JsonBlockCherryShelf,
  'minecraft:cherry_shelf': JsonBlockCherryShelf,
  'cherry_sign': JsonBlockCherrySign,
  'minecraft:cherry_sign': JsonBlockCherrySign,
  'cherry_wall_hanging_sign': JsonBlockCherryWallHangingSign,
  'minecraft:cherry_wall_hanging_sign': JsonBlockCherryWallHangingSign,
  'cherry_wall_sign': JsonBlockCherryWallSign,
  'minecraft:cherry_wall_sign': JsonBlockCherryWallSign,
  'chest': JsonBlockChest,
  'minecraft:chest': JsonBlockChest,
  'chiseled_bookshelf': JsonBlockChiseledBookshelf,
  'minecraft:chiseled_bookshelf': JsonBlockChiseledBookshelf,
  'command_block': JsonBlockCommandBlock,
  'minecraft:command_block': JsonBlockCommandBlock,
  'comparator': JsonBlockComparator,
  'minecraft:comparator': JsonBlockComparator,
  'conduit': JsonBlockConduit,
  'minecraft:conduit': JsonBlockConduit,
  'copper_chest': JsonBlockCopperChest,
  'minecraft:copper_chest': JsonBlockCopperChest,
  'copper_golem_statue': JsonBlockCopperGolemStatue,
  'minecraft:copper_golem_statue': JsonBlockCopperGolemStatue,
  'crafter': JsonBlockCrafter,
  'minecraft:crafter': JsonBlockCrafter,
  'creeper_head': JsonBlockCreeperHead,
  'minecraft:creeper_head': JsonBlockCreeperHead,
  'creeper_wall_head': JsonBlockCreeperWallHead,
  'minecraft:creeper_wall_head': JsonBlockCreeperWallHead,
  'crimson_hanging_sign': JsonBlockCrimsonHangingSign,
  'minecraft:crimson_hanging_sign': JsonBlockCrimsonHangingSign,
  'crimson_shelf': JsonBlockCrimsonShelf,
  'minecraft:crimson_shelf': JsonBlockCrimsonShelf,
  'crimson_sign': JsonBlockCrimsonSign,
  'minecraft:crimson_sign': JsonBlockCrimsonSign,
  'crimson_wall_hanging_sign': JsonBlockCrimsonWallHangingSign,
  'minecraft:crimson_wall_hanging_sign': JsonBlockCrimsonWallHangingSign,
  'crimson_wall_sign': JsonBlockCrimsonWallSign,
  'minecraft:crimson_wall_sign': JsonBlockCrimsonWallSign,
  'cyan_banner': JsonBlockCyanBanner,
  'minecraft:cyan_banner': JsonBlockCyanBanner,
  'cyan_shulker_box': JsonBlockCyanShulkerBox,
  'minecraft:cyan_shulker_box': JsonBlockCyanShulkerBox,
  'cyan_wall_banner': JsonBlockCyanWallBanner,
  'minecraft:cyan_wall_banner': JsonBlockCyanWallBanner,
  'dark_oak_hanging_sign': JsonBlockDarkOakHangingSign,
  'minecraft:dark_oak_hanging_sign': JsonBlockDarkOakHangingSign,
  'dark_oak_shelf': JsonBlockDarkOakShelf,
  'minecraft:dark_oak_shelf': JsonBlockDarkOakShelf,
  'dark_oak_sign': JsonBlockDarkOakSign,
  'minecraft:dark_oak_sign': JsonBlockDarkOakSign,
  'dark_oak_wall_hanging_sign': JsonBlockDarkOakWallHangingSign,
  'minecraft:dark_oak_wall_hanging_sign': JsonBlockDarkOakWallHangingSign,
  'dark_oak_wall_sign': JsonBlockDarkOakWallSign,
  'minecraft:dark_oak_wall_sign': JsonBlockDarkOakWallSign,
  'daylight_detector': JsonBlockDaylightDetector,
  'minecraft:daylight_detector': JsonBlockDaylightDetector,
  'decorated_pot': JsonBlockDecoratedPot,
  'minecraft:decorated_pot': JsonBlockDecoratedPot,
  'dispenser': JsonBlockDispenser,
  'minecraft:dispenser': JsonBlockDispenser,
  'dragon_head': JsonBlockDragonHead,
  'minecraft:dragon_head': JsonBlockDragonHead,
  'dragon_wall_head': JsonBlockDragonWallHead,
  'minecraft:dragon_wall_head': JsonBlockDragonWallHead,
  'dropper': JsonBlockDropper,
  'minecraft:dropper': JsonBlockDropper,
  'enchanting_table': JsonBlockEnchantingTable,
  'minecraft:enchanting_table': JsonBlockEnchantingTable,
  'end_gateway': JsonBlockEndGateway,
  'minecraft:end_gateway': JsonBlockEndGateway,
  'end_portal': JsonBlockEndPortal,
  'minecraft:end_portal': JsonBlockEndPortal,
  'ender_chest': JsonBlockEnderChest,
  'minecraft:ender_chest': JsonBlockEnderChest,
  'exposed_copper_chest': JsonBlockExposedCopperChest,
  'minecraft:exposed_copper_chest': JsonBlockExposedCopperChest,
  'exposed_copper_golem_statue': JsonBlockExposedCopperGolemStatue,
  'minecraft:exposed_copper_golem_statue': JsonBlockExposedCopperGolemStatue,
  'furnace': JsonBlockFurnace,
  'minecraft:furnace': JsonBlockFurnace,
  'gray_banner': JsonBlockGrayBanner,
  'minecraft:gray_banner': JsonBlockGrayBanner,
  'gray_shulker_box': JsonBlockGrayShulkerBox,
  'minecraft:gray_shulker_box': JsonBlockGrayShulkerBox,
  'gray_wall_banner': JsonBlockGrayWallBanner,
  'minecraft:gray_wall_banner': JsonBlockGrayWallBanner,
  'green_banner': JsonBlockGreenBanner,
  'minecraft:green_banner': JsonBlockGreenBanner,
  'green_shulker_box': JsonBlockGreenShulkerBox,
  'minecraft:green_shulker_box': JsonBlockGreenShulkerBox,
  'green_wall_banner': JsonBlockGreenWallBanner,
  'minecraft:green_wall_banner': JsonBlockGreenWallBanner,
  'hopper': JsonBlockHopper,
  'minecraft:hopper': JsonBlockHopper,
  'jigsaw': JsonBlockJigsaw,
  'minecraft:jigsaw': JsonBlockJigsaw,
  'jukebox': JsonBlockJukebox,
  'minecraft:jukebox': JsonBlockJukebox,
  'jungle_hanging_sign': JsonBlockJungleHangingSign,
  'minecraft:jungle_hanging_sign': JsonBlockJungleHangingSign,
  'jungle_shelf': JsonBlockJungleShelf,
  'minecraft:jungle_shelf': JsonBlockJungleShelf,
  'jungle_sign': JsonBlockJungleSign,
  'minecraft:jungle_sign': JsonBlockJungleSign,
  'jungle_wall_hanging_sign': JsonBlockJungleWallHangingSign,
  'minecraft:jungle_wall_hanging_sign': JsonBlockJungleWallHangingSign,
  'jungle_wall_sign': JsonBlockJungleWallSign,
  'minecraft:jungle_wall_sign': JsonBlockJungleWallSign,
  'lectern': JsonBlockLectern,
  'minecraft:lectern': JsonBlockLectern,
  'light_blue_banner': JsonBlockLightBlueBanner,
  'minecraft:light_blue_banner': JsonBlockLightBlueBanner,
  'light_blue_shulker_box': JsonBlockLightBlueShulkerBox,
  'minecraft:light_blue_shulker_box': JsonBlockLightBlueShulkerBox,
  'light_blue_wall_banner': JsonBlockLightBlueWallBanner,
  'minecraft:light_blue_wall_banner': JsonBlockLightBlueWallBanner,
  'light_gray_banner': JsonBlockLightGrayBanner,
  'minecraft:light_gray_banner': JsonBlockLightGrayBanner,
  'light_gray_shulker_box': JsonBlockLightGrayShulkerBox,
  'minecraft:light_gray_shulker_box': JsonBlockLightGrayShulkerBox,
  'light_gray_wall_banner': JsonBlockLightGrayWallBanner,
  'minecraft:light_gray_wall_banner': JsonBlockLightGrayWallBanner,
  'lime_banner': JsonBlockLimeBanner,
  'minecraft:lime_banner': JsonBlockLimeBanner,
  'lime_shulker_box': JsonBlockLimeShulkerBox,
  'minecraft:lime_shulker_box': JsonBlockLimeShulkerBox,
  'lime_wall_banner': JsonBlockLimeWallBanner,
  'minecraft:lime_wall_banner': JsonBlockLimeWallBanner,
  'magenta_banner': JsonBlockMagentaBanner,
  'minecraft:magenta_banner': JsonBlockMagentaBanner,
  'magenta_shulker_box': JsonBlockMagentaShulkerBox,
  'minecraft:magenta_shulker_box': JsonBlockMagentaShulkerBox,
  'magenta_wall_banner': JsonBlockMagentaWallBanner,
  'minecraft:magenta_wall_banner': JsonBlockMagentaWallBanner,
  'mangrove_hanging_sign': JsonBlockMangroveHangingSign,
  'minecraft:mangrove_hanging_sign': JsonBlockMangroveHangingSign,
  'mangrove_shelf': JsonBlockMangroveShelf,
  'minecraft:mangrove_shelf': JsonBlockMangroveShelf,
  'mangrove_sign': JsonBlockMangroveSign,
  'minecraft:mangrove_sign': JsonBlockMangroveSign,
  'mangrove_wall_hanging_sign': JsonBlockMangroveWallHangingSign,
  'minecraft:mangrove_wall_hanging_sign': JsonBlockMangroveWallHangingSign,
  'mangrove_wall_sign': JsonBlockMangroveWallSign,
  'minecraft:mangrove_wall_sign': JsonBlockMangroveWallSign,
  'moving_piston': JsonBlockMovingPiston,
  'minecraft:moving_piston': JsonBlockMovingPiston,
  'oak_hanging_sign': JsonBlockOakHangingSign,
  'minecraft:oak_hanging_sign': JsonBlockOakHangingSign,
  'oak_shelf': JsonBlockOakShelf,
  'minecraft:oak_shelf': JsonBlockOakShelf,
  'oak_sign': JsonBlockOakSign,
  'minecraft:oak_sign': JsonBlockOakSign,
  'oak_wall_hanging_sign': JsonBlockOakWallHangingSign,
  'minecraft:oak_wall_hanging_sign': JsonBlockOakWallHangingSign,
  'oak_wall_sign': JsonBlockOakWallSign,
  'minecraft:oak_wall_sign': JsonBlockOakWallSign,
  'orange_banner': JsonBlockOrangeBanner,
  'minecraft:orange_banner': JsonBlockOrangeBanner,
  'orange_shulker_box': JsonBlockOrangeShulkerBox,
  'minecraft:orange_shulker_box': JsonBlockOrangeShulkerBox,
  'orange_wall_banner': JsonBlockOrangeWallBanner,
  'minecraft:orange_wall_banner': JsonBlockOrangeWallBanner,
  'oxidized_copper_chest': JsonBlockOxidizedCopperChest,
  'minecraft:oxidized_copper_chest': JsonBlockOxidizedCopperChest,
  'oxidized_copper_golem_statue': JsonBlockOxidizedCopperGolemStatue,
  'minecraft:oxidized_copper_golem_statue': JsonBlockOxidizedCopperGolemStatue,
  'pale_oak_hanging_sign': JsonBlockPaleOakHangingSign,
  'minecraft:pale_oak_hanging_sign': JsonBlockPaleOakHangingSign,
  'pale_oak_shelf': JsonBlockPaleOakShelf,
  'minecraft:pale_oak_shelf': JsonBlockPaleOakShelf,
  'pale_oak_sign': JsonBlockPaleOakSign,
  'minecraft:pale_oak_sign': JsonBlockPaleOakSign,
  'pale_oak_wall_hanging_sign': JsonBlockPaleOakWallHangingSign,
  'minecraft:pale_oak_wall_hanging_sign': JsonBlockPaleOakWallHangingSign,
  'pale_oak_wall_sign': JsonBlockPaleOakWallSign,
  'minecraft:pale_oak_wall_sign': JsonBlockPaleOakWallSign,
  'pink_banner': JsonBlockPinkBanner,
  'minecraft:pink_banner': JsonBlockPinkBanner,
  'pink_shulker_box': JsonBlockPinkShulkerBox,
  'minecraft:pink_shulker_box': JsonBlockPinkShulkerBox,
  'pink_wall_banner': JsonBlockPinkWallBanner,
  'minecraft:pink_wall_banner': JsonBlockPinkWallBanner,
  'player_head': JsonBlockPlayerHead,
  'minecraft:player_head': JsonBlockPlayerHead,
  'player_wall_head': JsonBlockPlayerWallHead,
  'minecraft:player_wall_head': JsonBlockPlayerWallHead,
  'poplar_hanging_sign': JsonBlockPoplarHangingSign,
  'minecraft:poplar_hanging_sign': JsonBlockPoplarHangingSign,
  'poplar_shelf': JsonBlockPoplarShelf,
  'minecraft:poplar_shelf': JsonBlockPoplarShelf,
  'poplar_sign': JsonBlockPoplarSign,
  'minecraft:poplar_sign': JsonBlockPoplarSign,
  'poplar_wall_hanging_sign': JsonBlockPoplarWallHangingSign,
  'minecraft:poplar_wall_hanging_sign': JsonBlockPoplarWallHangingSign,
  'poplar_wall_sign': JsonBlockPoplarWallSign,
  'minecraft:poplar_wall_sign': JsonBlockPoplarWallSign,
  'potent_sulfur': JsonBlockPotentSulfur,
  'minecraft:potent_sulfur': JsonBlockPotentSulfur,
  'purple_banner': JsonBlockPurpleBanner,
  'minecraft:purple_banner': JsonBlockPurpleBanner,
  'purple_shulker_box': JsonBlockPurpleShulkerBox,
  'minecraft:purple_shulker_box': JsonBlockPurpleShulkerBox,
  'purple_wall_banner': JsonBlockPurpleWallBanner,
  'minecraft:purple_wall_banner': JsonBlockPurpleWallBanner,
  'red_banner': JsonBlockRedBanner,
  'minecraft:red_banner': JsonBlockRedBanner,
  'red_shulker_box': JsonBlockRedShulkerBox,
  'minecraft:red_shulker_box': JsonBlockRedShulkerBox,
  'red_wall_banner': JsonBlockRedWallBanner,
  'minecraft:red_wall_banner': JsonBlockRedWallBanner,
  'repeating_command_block': JsonBlockRepeatingCommandBlock,
  'minecraft:repeating_command_block': JsonBlockRepeatingCommandBlock,
  'sculk_catalyst': JsonBlockSculkCatalyst,
  'minecraft:sculk_catalyst': JsonBlockSculkCatalyst,
  'sculk_sensor': JsonBlockSculkSensor,
  'minecraft:sculk_sensor': JsonBlockSculkSensor,
  'sculk_shrieker': JsonBlockSculkShrieker,
  'minecraft:sculk_shrieker': JsonBlockSculkShrieker,
  'shulker_box': JsonBlockShulkerBox,
  'minecraft:shulker_box': JsonBlockShulkerBox,
  'skeleton_skull': JsonBlockSkeletonSkull,
  'minecraft:skeleton_skull': JsonBlockSkeletonSkull,
  'skeleton_wall_skull': JsonBlockSkeletonWallSkull,
  'minecraft:skeleton_wall_skull': JsonBlockSkeletonWallSkull,
  'smoker': JsonBlockSmoker,
  'minecraft:smoker': JsonBlockSmoker,
  'soul_campfire': JsonBlockSoulCampfire,
  'minecraft:soul_campfire': JsonBlockSoulCampfire,
  'spawner': JsonBlockSpawner,
  'minecraft:spawner': JsonBlockSpawner,
  'spruce_hanging_sign': JsonBlockSpruceHangingSign,
  'minecraft:spruce_hanging_sign': JsonBlockSpruceHangingSign,
  'spruce_shelf': JsonBlockSpruceShelf,
  'minecraft:spruce_shelf': JsonBlockSpruceShelf,
  'spruce_sign': JsonBlockSpruceSign,
  'minecraft:spruce_sign': JsonBlockSpruceSign,
  'spruce_wall_hanging_sign': JsonBlockSpruceWallHangingSign,
  'minecraft:spruce_wall_hanging_sign': JsonBlockSpruceWallHangingSign,
  'spruce_wall_sign': JsonBlockSpruceWallSign,
  'minecraft:spruce_wall_sign': JsonBlockSpruceWallSign,
  'structure_block': JsonBlockStructureBlock,
  'minecraft:structure_block': JsonBlockStructureBlock,
  'suspicious_gravel': JsonBlockSuspiciousGravel,
  'minecraft:suspicious_gravel': JsonBlockSuspiciousGravel,
  'suspicious_sand': JsonBlockSuspiciousSand,
  'minecraft:suspicious_sand': JsonBlockSuspiciousSand,
  'test_block': JsonBlockTestBlock,
  'minecraft:test_block': JsonBlockTestBlock,
  'test_instance_block': JsonBlockTestInstanceBlock,
  'minecraft:test_instance_block': JsonBlockTestInstanceBlock,
  'trapped_chest': JsonBlockTrappedChest,
  'minecraft:trapped_chest': JsonBlockTrappedChest,
  'trial_spawner': JsonBlockTrialSpawner,
  'minecraft:trial_spawner': JsonBlockTrialSpawner,
  'vault': JsonBlockVault,
  'minecraft:vault': JsonBlockVault,
  'warped_hanging_sign': JsonBlockWarpedHangingSign,
  'minecraft:warped_hanging_sign': JsonBlockWarpedHangingSign,
  'warped_shelf': JsonBlockWarpedShelf,
  'minecraft:warped_shelf': JsonBlockWarpedShelf,
  'warped_sign': JsonBlockWarpedSign,
  'minecraft:warped_sign': JsonBlockWarpedSign,
  'warped_wall_hanging_sign': JsonBlockWarpedWallHangingSign,
  'minecraft:warped_wall_hanging_sign': JsonBlockWarpedWallHangingSign,
  'warped_wall_sign': JsonBlockWarpedWallSign,
  'minecraft:warped_wall_sign': JsonBlockWarpedWallSign,
  'waxed_copper_chest': JsonBlockWaxedCopperChest,
  'minecraft:waxed_copper_chest': JsonBlockWaxedCopperChest,
  'waxed_copper_golem_statue': JsonBlockWaxedCopperGolemStatue,
  'minecraft:waxed_copper_golem_statue': JsonBlockWaxedCopperGolemStatue,
  'waxed_exposed_copper_chest': JsonBlockWaxedExposedCopperChest,
  'minecraft:waxed_exposed_copper_chest': JsonBlockWaxedExposedCopperChest,
  'waxed_exposed_copper_golem_statue': JsonBlockWaxedExposedCopperGolemStatue,
  'minecraft:waxed_exposed_copper_golem_statue': JsonBlockWaxedExposedCopperGolemStatue,
  'waxed_oxidized_copper_chest': JsonBlockWaxedOxidizedCopperChest,
  'minecraft:waxed_oxidized_copper_chest': JsonBlockWaxedOxidizedCopperChest,
  'waxed_oxidized_copper_golem_statue': JsonBlockWaxedOxidizedCopperGolemStatue,
  'minecraft:waxed_oxidized_copper_golem_statue': JsonBlockWaxedOxidizedCopperGolemStatue,
  'waxed_weathered_copper_chest': JsonBlockWaxedWeatheredCopperChest,
  'minecraft:waxed_weathered_copper_chest': JsonBlockWaxedWeatheredCopperChest,
  'waxed_weathered_copper_golem_statue': JsonBlockWaxedWeatheredCopperGolemStatue,
  'minecraft:waxed_weathered_copper_golem_statue': JsonBlockWaxedWeatheredCopperGolemStatue,
  'weathered_copper_chest': JsonBlockWeatheredCopperChest,
  'minecraft:weathered_copper_chest': JsonBlockWeatheredCopperChest,
  'weathered_copper_golem_statue': JsonBlockWeatheredCopperGolemStatue,
  'minecraft:weathered_copper_golem_statue': JsonBlockWeatheredCopperGolemStatue,
  'white_banner': JsonBlockWhiteBanner,
  'minecraft:white_banner': JsonBlockWhiteBanner,
  'white_shulker_box': JsonBlockWhiteShulkerBox,
  'minecraft:white_shulker_box': JsonBlockWhiteShulkerBox,
  'white_wall_banner': JsonBlockWhiteWallBanner,
  'minecraft:white_wall_banner': JsonBlockWhiteWallBanner,
  'wither_skeleton_skull': JsonBlockWitherSkeletonSkull,
  'minecraft:wither_skeleton_skull': JsonBlockWitherSkeletonSkull,
  'wither_skeleton_wall_skull': JsonBlockWitherSkeletonWallSkull,
  'minecraft:wither_skeleton_wall_skull': JsonBlockWitherSkeletonWallSkull,
  'yellow_banner': JsonBlockYellowBanner,
  'minecraft:yellow_banner': JsonBlockYellowBanner,
  'yellow_shulker_box': JsonBlockYellowShulkerBox,
  'minecraft:yellow_shulker_box': JsonBlockYellowShulkerBox,
  'yellow_wall_banner': JsonBlockYellowWallBanner,
  'minecraft:yellow_wall_banner': JsonBlockYellowWallBanner,
  'zombie_head': JsonBlockZombieHead,
  'minecraft:zombie_head': JsonBlockZombieHead,
  'zombie_wall_head': JsonBlockZombieWallHead,
  'minecraft:zombie_wall_head': JsonBlockZombieWallHead,
}
type JsonBlockKeys = keyof JsonBlockDispatcherMap
type JsonBlockFallback = (
  | JsonBlockAcaciaHangingSign
  | JsonBlockAcaciaShelf
  | JsonBlockAcaciaSign
  | JsonBlockAcaciaWallHangingSign
  | JsonBlockAcaciaWallSign
  | JsonBlockBambooHangingSign
  | JsonBlockBambooShelf
  | JsonBlockBambooSign
  | JsonBlockBambooWallHangingSign
  | JsonBlockBambooWallSign
  | JsonBlockBarrel
  | JsonBlockBeacon
  | JsonBlockBeeNest
  | JsonBlockBeehive
  | JsonBlockBell
  | JsonBlockBirchHangingSign
  | JsonBlockBirchShelf
  | JsonBlockBirchSign
  | JsonBlockBirchWallHangingSign
  | JsonBlockBirchWallSign
  | JsonBlockBlackBanner
  | JsonBlockBlackShulkerBox
  | JsonBlockBlackWallBanner
  | JsonBlockBlastFurnace
  | JsonBlockBlueBanner
  | JsonBlockBlueShulkerBox
  | JsonBlockBlueWallBanner
  | JsonBlockBrewingStand
  | JsonBlockBrownBanner
  | JsonBlockBrownShulkerBox
  | JsonBlockBrownWallBanner
  | JsonBlockCalibratedSculkSensor
  | JsonBlockCampfire
  | JsonBlockChainCommandBlock
  | JsonBlockCherryHangingSign
  | JsonBlockCherryShelf
  | JsonBlockCherrySign
  | JsonBlockCherryWallHangingSign
  | JsonBlockCherryWallSign
  | JsonBlockChest
  | JsonBlockChiseledBookshelf
  | JsonBlockCommandBlock
  | JsonBlockComparator
  | JsonBlockConduit
  | JsonBlockCopperChest
  | JsonBlockCopperGolemStatue
  | JsonBlockCrafter
  | JsonBlockCreeperHead
  | JsonBlockCreeperWallHead
  | JsonBlockCrimsonHangingSign
  | JsonBlockCrimsonShelf
  | JsonBlockCrimsonSign
  | JsonBlockCrimsonWallHangingSign
  | JsonBlockCrimsonWallSign
  | JsonBlockCyanBanner
  | JsonBlockCyanShulkerBox
  | JsonBlockCyanWallBanner
  | JsonBlockDarkOakHangingSign
  | JsonBlockDarkOakShelf
  | JsonBlockDarkOakSign
  | JsonBlockDarkOakWallHangingSign
  | JsonBlockDarkOakWallSign
  | JsonBlockDaylightDetector
  | JsonBlockDecoratedPot
  | JsonBlockDispenser
  | JsonBlockDragonHead
  | JsonBlockDragonWallHead
  | JsonBlockDropper
  | JsonBlockEnchantingTable
  | JsonBlockEndGateway
  | JsonBlockEndPortal
  | JsonBlockEnderChest
  | JsonBlockExposedCopperChest
  | JsonBlockExposedCopperGolemStatue
  | JsonBlockFurnace
  | JsonBlockGrayBanner
  | JsonBlockGrayShulkerBox
  | JsonBlockGrayWallBanner
  | JsonBlockGreenBanner
  | JsonBlockGreenShulkerBox
  | JsonBlockGreenWallBanner
  | JsonBlockHopper
  | JsonBlockJigsaw
  | JsonBlockJukebox
  | JsonBlockJungleHangingSign
  | JsonBlockJungleShelf
  | JsonBlockJungleSign
  | JsonBlockJungleWallHangingSign
  | JsonBlockJungleWallSign
  | JsonBlockLectern
  | JsonBlockLightBlueBanner
  | JsonBlockLightBlueShulkerBox
  | JsonBlockLightBlueWallBanner
  | JsonBlockLightGrayBanner
  | JsonBlockLightGrayShulkerBox
  | JsonBlockLightGrayWallBanner
  | JsonBlockLimeBanner
  | JsonBlockLimeShulkerBox
  | JsonBlockLimeWallBanner
  | JsonBlockMagentaBanner
  | JsonBlockMagentaShulkerBox
  | JsonBlockMagentaWallBanner
  | JsonBlockMangroveHangingSign
  | JsonBlockMangroveShelf
  | JsonBlockMangroveSign
  | JsonBlockMangroveWallHangingSign
  | JsonBlockMangroveWallSign
  | JsonBlockMovingPiston
  | JsonBlockOakHangingSign
  | JsonBlockOakShelf
  | JsonBlockOakSign
  | JsonBlockOakWallHangingSign
  | JsonBlockOakWallSign
  | JsonBlockOrangeBanner
  | JsonBlockOrangeShulkerBox
  | JsonBlockOrangeWallBanner
  | JsonBlockOxidizedCopperChest
  | JsonBlockOxidizedCopperGolemStatue
  | JsonBlockPaleOakHangingSign
  | JsonBlockPaleOakShelf
  | JsonBlockPaleOakSign
  | JsonBlockPaleOakWallHangingSign
  | JsonBlockPaleOakWallSign
  | JsonBlockPinkBanner
  | JsonBlockPinkShulkerBox
  | JsonBlockPinkWallBanner
  | JsonBlockPlayerHead
  | JsonBlockPlayerWallHead
  | JsonBlockPoplarHangingSign
  | JsonBlockPoplarShelf
  | JsonBlockPoplarSign
  | JsonBlockPoplarWallHangingSign
  | JsonBlockPoplarWallSign
  | JsonBlockPotentSulfur
  | JsonBlockPurpleBanner
  | JsonBlockPurpleShulkerBox
  | JsonBlockPurpleWallBanner
  | JsonBlockRedBanner
  | JsonBlockRedShulkerBox
  | JsonBlockRedWallBanner
  | JsonBlockRepeatingCommandBlock
  | JsonBlockSculkCatalyst
  | JsonBlockSculkSensor
  | JsonBlockSculkShrieker
  | JsonBlockShulkerBox
  | JsonBlockSkeletonSkull
  | JsonBlockSkeletonWallSkull
  | JsonBlockSmoker
  | JsonBlockSoulCampfire
  | JsonBlockSpawner
  | JsonBlockSpruceHangingSign
  | JsonBlockSpruceShelf
  | JsonBlockSpruceSign
  | JsonBlockSpruceWallHangingSign
  | JsonBlockSpruceWallSign
  | JsonBlockStructureBlock
  | JsonBlockSuspiciousGravel
  | JsonBlockSuspiciousSand
  | JsonBlockTestBlock
  | JsonBlockTestInstanceBlock
  | JsonBlockTrappedChest
  | JsonBlockTrialSpawner
  | JsonBlockVault
  | JsonBlockWarpedHangingSign
  | JsonBlockWarpedShelf
  | JsonBlockWarpedSign
  | JsonBlockWarpedWallHangingSign
  | JsonBlockWarpedWallSign
  | JsonBlockWaxedCopperChest
  | JsonBlockWaxedCopperGolemStatue
  | JsonBlockWaxedExposedCopperChest
  | JsonBlockWaxedExposedCopperGolemStatue
  | JsonBlockWaxedOxidizedCopperChest
  | JsonBlockWaxedOxidizedCopperGolemStatue
  | JsonBlockWaxedWeatheredCopperChest
  | JsonBlockWaxedWeatheredCopperGolemStatue
  | JsonBlockWeatheredCopperChest
  | JsonBlockWeatheredCopperGolemStatue
  | JsonBlockWhiteBanner
  | JsonBlockWhiteShulkerBox
  | JsonBlockWhiteWallBanner
  | JsonBlockWitherSkeletonSkull
  | JsonBlockWitherSkeletonWallSkull
  | JsonBlockYellowBanner
  | JsonBlockYellowShulkerBox
  | JsonBlockYellowWallBanner
  | JsonBlockZombieHead
  | JsonBlockZombieWallHead
  | JsonBlockFallbackType)
export type JsonBlockFallbackType = Record<string, never>
type JsonBlockAcaciaHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockAcaciaShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockAcaciaSign = JsonSymbolBlockEntity['sign']
type JsonBlockAcaciaWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockAcaciaWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockBambooHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockBambooShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockBambooSign = JsonSymbolBlockEntity['sign']
type JsonBlockBambooWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockBambooWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockBarrel = JsonSymbolBlockEntity['barrel']
type JsonBlockBeacon = JsonSymbolBlockEntity['beacon']
type JsonBlockBeeNest = JsonSymbolBlockEntity['beehive']
type JsonBlockBeehive = JsonSymbolBlockEntity['beehive']
type JsonBlockBell = JsonBlockEntity
type JsonBlockBirchHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockBirchShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockBirchSign = JsonSymbolBlockEntity['sign']
type JsonBlockBirchWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockBirchWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockBlackBanner = JsonSymbolBlockEntity['banner']
type JsonBlockBlackShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockBlackWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockBlastFurnace = JsonSymbolBlockEntity['blast_furnace']
type JsonBlockBlueBanner = JsonSymbolBlockEntity['banner']
type JsonBlockBlueShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockBlueWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockBrewingStand = JsonSymbolBlockEntity['brewing_stand']
type JsonBlockBrownBanner = JsonSymbolBlockEntity['banner']
type JsonBlockBrownShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockBrownWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockCalibratedSculkSensor = JsonSymbolBlockEntity['sculk_sensor']
type JsonBlockCampfire = JsonSymbolBlockEntity['campfire']
type JsonBlockChainCommandBlock = JsonSymbolBlockEntity['command_block']
type JsonBlockCherryHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockCherryShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockCherrySign = JsonSymbolBlockEntity['sign']
type JsonBlockCherryWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockCherryWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockChest = JsonSymbolBlockEntity['chest']
type JsonBlockChiseledBookshelf = JsonSymbolBlockEntity['chiseled_bookshelf']
type JsonBlockCommandBlock = JsonSymbolBlockEntity['command_block']
type JsonBlockComparator = JsonSymbolBlockEntity['comparator']
type JsonBlockConduit = JsonSymbolBlockEntity['conduit']
type JsonBlockCopperChest = JsonSymbolBlockEntity['chest']
type JsonBlockCopperGolemStatue = JsonBlockEntity
type JsonBlockCrafter = JsonSymbolBlockEntity['crafter']
type JsonBlockCreeperHead = JsonSkull
type JsonBlockCreeperWallHead = JsonSkull
type JsonBlockCrimsonHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockCrimsonShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockCrimsonSign = JsonSymbolBlockEntity['sign']
type JsonBlockCrimsonWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockCrimsonWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockCyanBanner = JsonSymbolBlockEntity['banner']
type JsonBlockCyanShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockCyanWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockDarkOakHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockDarkOakShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockDarkOakSign = JsonSymbolBlockEntity['sign']
type JsonBlockDarkOakWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockDarkOakWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockDaylightDetector = JsonBlockEntity
type JsonBlockDecoratedPot = JsonSymbolBlockEntity['decorated_pot']
type JsonBlockDispenser = JsonSymbolBlockEntity['dispenser']
type JsonBlockDragonHead = JsonSkull
type JsonBlockDragonWallHead = JsonSkull
type JsonBlockDropper = JsonSymbolBlockEntity['dispenser']
type JsonBlockEnchantingTable = JsonSymbolBlockEntity['enchanting_table']
type JsonBlockEndGateway = JsonSymbolBlockEntity['end_gateway']
type JsonBlockEndPortal = JsonBlockEntity
type JsonBlockEnderChest = JsonBlockEntity
type JsonBlockExposedCopperChest = JsonSymbolBlockEntity['chest']
type JsonBlockExposedCopperGolemStatue = JsonBlockEntity
type JsonBlockFurnace = JsonSymbolBlockEntity['furnace']
type JsonBlockGrayBanner = JsonSymbolBlockEntity['banner']
type JsonBlockGrayShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockGrayWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockGreenBanner = JsonSymbolBlockEntity['banner']
type JsonBlockGreenShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockGreenWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockHopper = JsonSymbolBlockEntity['hopper']
type JsonBlockJigsaw = JsonSymbolBlockEntity['jigsaw']
type JsonBlockJukebox = JsonSymbolBlockEntity['jukebox']
type JsonBlockJungleHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockJungleShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockJungleSign = JsonSymbolBlockEntity['sign']
type JsonBlockJungleWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockJungleWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockLectern = JsonSymbolBlockEntity['lectern']
type JsonBlockLightBlueBanner = JsonSymbolBlockEntity['banner']
type JsonBlockLightBlueShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockLightBlueWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockLightGrayBanner = JsonSymbolBlockEntity['banner']
type JsonBlockLightGrayShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockLightGrayWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockLimeBanner = JsonSymbolBlockEntity['banner']
type JsonBlockLimeShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockLimeWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockMagentaBanner = JsonSymbolBlockEntity['banner']
type JsonBlockMagentaShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockMagentaWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockMangroveHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockMangroveShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockMangroveSign = JsonSymbolBlockEntity['sign']
type JsonBlockMangroveWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockMangroveWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockMovingPiston = JsonSymbolBlockEntity['moving_piston']
type JsonBlockOakHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockOakShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockOakSign = JsonSymbolBlockEntity['sign']
type JsonBlockOakWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockOakWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockOrangeBanner = JsonSymbolBlockEntity['banner']
type JsonBlockOrangeShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockOrangeWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockOxidizedCopperChest = JsonSymbolBlockEntity['chest']
type JsonBlockOxidizedCopperGolemStatue = JsonBlockEntity
type JsonBlockPaleOakHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockPaleOakShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockPaleOakSign = JsonSymbolBlockEntity['sign']
type JsonBlockPaleOakWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockPaleOakWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockPinkBanner = JsonSymbolBlockEntity['banner']
type JsonBlockPinkShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockPinkWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockPlayerHead = JsonSymbolBlockEntity['skull']
type JsonBlockPlayerWallHead = JsonSymbolBlockEntity['skull']
type JsonBlockPoplarHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockPoplarShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockPoplarSign = JsonSymbolBlockEntity['sign']
type JsonBlockPoplarWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockPoplarWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockPotentSulfur = JsonSymbolBlockEntity['potent_sulfur']
type JsonBlockPurpleBanner = JsonSymbolBlockEntity['banner']
type JsonBlockPurpleShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockPurpleWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockRedBanner = JsonSymbolBlockEntity['banner']
type JsonBlockRedShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockRedWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockRepeatingCommandBlock = JsonSymbolBlockEntity['command_block']
type JsonBlockSculkCatalyst = JsonSymbolBlockEntity['sculk_catalyst']
type JsonBlockSculkSensor = JsonSymbolBlockEntity['sculk_sensor']
type JsonBlockSculkShrieker = JsonSymbolBlockEntity['sculk_shrieker']
type JsonBlockShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockSkeletonSkull = JsonSkull
type JsonBlockSkeletonWallSkull = JsonSkull
type JsonBlockSmoker = JsonSymbolBlockEntity['smoker']
type JsonBlockSoulCampfire = JsonSymbolBlockEntity['campfire']
type JsonBlockSpawner = JsonSymbolBlockEntity['mob_spawner']
type JsonBlockSpruceHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockSpruceShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockSpruceSign = JsonSymbolBlockEntity['sign']
type JsonBlockSpruceWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockSpruceWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockStructureBlock = JsonSymbolBlockEntity['structure_block']
type JsonBlockSuspiciousGravel = JsonSymbolBlockEntity['brushable_block']
type JsonBlockSuspiciousSand = JsonSymbolBlockEntity['brushable_block']
type JsonBlockTestBlock = JsonSymbolBlockEntity['test_block']
type JsonBlockTestInstanceBlock = JsonSymbolBlockEntity['test_instance_block']
type JsonBlockTrappedChest = JsonSymbolBlockEntity['trapped_chest']
type JsonBlockTrialSpawner = JsonSymbolBlockEntity['trial_spawner']
type JsonBlockVault = JsonSymbolBlockEntity['vault']
type JsonBlockWarpedHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockWarpedShelf = JsonSymbolBlockEntity['shelf']
type JsonBlockWarpedSign = JsonSymbolBlockEntity['sign']
type JsonBlockWarpedWallHangingSign = JsonSymbolBlockEntity['hanging_sign']
type JsonBlockWarpedWallSign = JsonSymbolBlockEntity['sign']
type JsonBlockWaxedCopperChest = JsonSymbolBlockEntity['chest']
type JsonBlockWaxedCopperGolemStatue = JsonBlockEntity
type JsonBlockWaxedExposedCopperChest = JsonSymbolBlockEntity['chest']
type JsonBlockWaxedExposedCopperGolemStatue = JsonBlockEntity
type JsonBlockWaxedOxidizedCopperChest = JsonSymbolBlockEntity['chest']
type JsonBlockWaxedOxidizedCopperGolemStatue = JsonBlockEntity
type JsonBlockWaxedWeatheredCopperChest = JsonSymbolBlockEntity['chest']
type JsonBlockWaxedWeatheredCopperGolemStatue = JsonBlockEntity
type JsonBlockWeatheredCopperChest = JsonSymbolBlockEntity['chest']
type JsonBlockWeatheredCopperGolemStatue = JsonBlockEntity
type JsonBlockWhiteBanner = JsonSymbolBlockEntity['banner']
type JsonBlockWhiteShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockWhiteWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockWitherSkeletonSkull = JsonSkull
type JsonBlockWitherSkeletonWallSkull = JsonSkull
type JsonBlockYellowBanner = JsonSymbolBlockEntity['banner']
type JsonBlockYellowShulkerBox = JsonSymbolBlockEntity['shulker_box']
type JsonBlockYellowWallBanner = JsonSymbolBlockEntity['banner']
type JsonBlockZombieHead = JsonSkull
type JsonBlockZombieWallHead = JsonSkull
export type JsonSymbolBlock<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonBlockDispatcherMap
  : CASE extends 'keys'
    ? JsonBlockKeys
    : CASE extends '%fallback' ? JsonBlockFallback : CASE extends '%unknown' ? JsonBlockFallbackType : never
