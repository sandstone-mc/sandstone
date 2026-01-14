import type { SymbolBlockEntity } from 'sandstone/arguments/generated/dispatcher.ts'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { Skull } from 'sandstone/arguments/generated/world/block/head.ts'

type BlockDispatcherMap = {
  'acacia_hanging_sign': BlockAcaciaHangingSign
  'minecraft:acacia_hanging_sign': BlockAcaciaHangingSign
  'acacia_shelf': BlockAcaciaShelf
  'minecraft:acacia_shelf': BlockAcaciaShelf
  'acacia_sign': BlockAcaciaSign
  'minecraft:acacia_sign': BlockAcaciaSign
  'acacia_wall_hanging_sign': BlockAcaciaWallHangingSign
  'minecraft:acacia_wall_hanging_sign': BlockAcaciaWallHangingSign
  'acacia_wall_sign': BlockAcaciaWallSign
  'minecraft:acacia_wall_sign': BlockAcaciaWallSign
  'bamboo_hanging_sign': BlockBambooHangingSign
  'minecraft:bamboo_hanging_sign': BlockBambooHangingSign
  'bamboo_shelf': BlockBambooShelf
  'minecraft:bamboo_shelf': BlockBambooShelf
  'bamboo_sign': BlockBambooSign
  'minecraft:bamboo_sign': BlockBambooSign
  'bamboo_wall_hanging_sign': BlockBambooWallHangingSign
  'minecraft:bamboo_wall_hanging_sign': BlockBambooWallHangingSign
  'bamboo_wall_sign': BlockBambooWallSign
  'minecraft:bamboo_wall_sign': BlockBambooWallSign
  'barrel': BlockBarrel
  'minecraft:barrel': BlockBarrel
  'beacon': BlockBeacon
  'minecraft:beacon': BlockBeacon
  'bed': BlockBed
  'minecraft:bed': BlockBed
  'bee_nest': BlockBeeNest
  'minecraft:bee_nest': BlockBeeNest
  'beehive': BlockBeehive
  'minecraft:beehive': BlockBeehive
  'bell': BlockBell
  'minecraft:bell': BlockBell
  'birch_hanging_sign': BlockBirchHangingSign
  'minecraft:birch_hanging_sign': BlockBirchHangingSign
  'birch_shelf': BlockBirchShelf
  'minecraft:birch_shelf': BlockBirchShelf
  'birch_sign': BlockBirchSign
  'minecraft:birch_sign': BlockBirchSign
  'birch_wall_hanging_sign': BlockBirchWallHangingSign
  'minecraft:birch_wall_hanging_sign': BlockBirchWallHangingSign
  'birch_wall_sign': BlockBirchWallSign
  'minecraft:birch_wall_sign': BlockBirchWallSign
  'black_banner': BlockBlackBanner
  'minecraft:black_banner': BlockBlackBanner
  'black_shulker_box': BlockBlackShulkerBox
  'minecraft:black_shulker_box': BlockBlackShulkerBox
  'black_wall_banner': BlockBlackWallBanner
  'minecraft:black_wall_banner': BlockBlackWallBanner
  'blast_furnace': BlockBlastFurnace
  'minecraft:blast_furnace': BlockBlastFurnace
  'blue_banner': BlockBlueBanner
  'minecraft:blue_banner': BlockBlueBanner
  'blue_shulker_box': BlockBlueShulkerBox
  'minecraft:blue_shulker_box': BlockBlueShulkerBox
  'blue_wall_banner': BlockBlueWallBanner
  'minecraft:blue_wall_banner': BlockBlueWallBanner
  'brewing_stand': BlockBrewingStand
  'minecraft:brewing_stand': BlockBrewingStand
  'brown_banner': BlockBrownBanner
  'minecraft:brown_banner': BlockBrownBanner
  'brown_shulker_box': BlockBrownShulkerBox
  'minecraft:brown_shulker_box': BlockBrownShulkerBox
  'brown_wall_banner': BlockBrownWallBanner
  'minecraft:brown_wall_banner': BlockBrownWallBanner
  'calibrated_sculk_sensor': BlockCalibratedSculkSensor
  'minecraft:calibrated_sculk_sensor': BlockCalibratedSculkSensor
  'campfire': BlockCampfire
  'minecraft:campfire': BlockCampfire
  'chain_command_block': BlockChainCommandBlock
  'minecraft:chain_command_block': BlockChainCommandBlock
  'cherry_shelf': BlockCherryShelf
  'minecraft:cherry_shelf': BlockCherryShelf
  'cherry_sign': BlockCherrySign
  'minecraft:cherry_sign': BlockCherrySign
  'cherry_wall_sign': BlockCherryWallSign
  'minecraft:cherry_wall_sign': BlockCherryWallSign
  'chest': BlockChest
  'minecraft:chest': BlockChest
  'chiseled_bookshelf': BlockChiseledBookshelf
  'minecraft:chiseled_bookshelf': BlockChiseledBookshelf
  'command_block': BlockCommandBlock
  'minecraft:command_block': BlockCommandBlock
  'comparator': BlockComparator
  'minecraft:comparator': BlockComparator
  'conduit': BlockConduit
  'minecraft:conduit': BlockConduit
  'copper_chest': BlockCopperChest
  'minecraft:copper_chest': BlockCopperChest
  'copper_golem_statue': BlockCopperGolemStatue
  'minecraft:copper_golem_statue': BlockCopperGolemStatue
  'creeper_head': BlockCreeperHead
  'minecraft:creeper_head': BlockCreeperHead
  'creeper_wall_head': BlockCreeperWallHead
  'minecraft:creeper_wall_head': BlockCreeperWallHead
  'crimson_hanging_sign': BlockCrimsonHangingSign
  'minecraft:crimson_hanging_sign': BlockCrimsonHangingSign
  'crimson_shelf': BlockCrimsonShelf
  'minecraft:crimson_shelf': BlockCrimsonShelf
  'crimson_sign': BlockCrimsonSign
  'minecraft:crimson_sign': BlockCrimsonSign
  'crimson_wall_hanging_sign': BlockCrimsonWallHangingSign
  'minecraft:crimson_wall_hanging_sign': BlockCrimsonWallHangingSign
  'crimson_wall_sign': BlockCrimsonWallSign
  'minecraft:crimson_wall_sign': BlockCrimsonWallSign
  'cyan_banner': BlockCyanBanner
  'minecraft:cyan_banner': BlockCyanBanner
  'cyan_shulker_box': BlockCyanShulkerBox
  'minecraft:cyan_shulker_box': BlockCyanShulkerBox
  'cyan_wall_banner': BlockCyanWallBanner
  'minecraft:cyan_wall_banner': BlockCyanWallBanner
  'dark_oak_hanging_sign': BlockDarkOakHangingSign
  'minecraft:dark_oak_hanging_sign': BlockDarkOakHangingSign
  'dark_oak_shelf': BlockDarkOakShelf
  'minecraft:dark_oak_shelf': BlockDarkOakShelf
  'dark_oak_sign': BlockDarkOakSign
  'minecraft:dark_oak_sign': BlockDarkOakSign
  'dark_oak_wall_hanging_sign': BlockDarkOakWallHangingSign
  'minecraft:dark_oak_wall_hanging_sign': BlockDarkOakWallHangingSign
  'dark_oak_wall_sign': BlockDarkOakWallSign
  'minecraft:dark_oak_wall_sign': BlockDarkOakWallSign
  'daylight_detector': BlockDaylightDetector
  'minecraft:daylight_detector': BlockDaylightDetector
  'decorated_pot': BlockDecoratedPot
  'minecraft:decorated_pot': BlockDecoratedPot
  'dispenser': BlockDispenser
  'minecraft:dispenser': BlockDispenser
  'dragon_head': BlockDragonHead
  'minecraft:dragon_head': BlockDragonHead
  'dragon_wall_head': BlockDragonWallHead
  'minecraft:dragon_wall_head': BlockDragonWallHead
  'dropper': BlockDropper
  'minecraft:dropper': BlockDropper
  'enchanting_table': BlockEnchantingTable
  'minecraft:enchanting_table': BlockEnchantingTable
  'end_gateway': BlockEndGateway
  'minecraft:end_gateway': BlockEndGateway
  'end_portal': BlockEndPortal
  'minecraft:end_portal': BlockEndPortal
  'ender_chest': BlockEnderChest
  'minecraft:ender_chest': BlockEnderChest
  'exposed_copper_chest': BlockExposedCopperChest
  'minecraft:exposed_copper_chest': BlockExposedCopperChest
  'exposed_copper_golem_statue': BlockExposedCopperGolemStatue
  'minecraft:exposed_copper_golem_statue': BlockExposedCopperGolemStatue
  'furnace': BlockFurnace
  'minecraft:furnace': BlockFurnace
  'gray_banner': BlockGrayBanner
  'minecraft:gray_banner': BlockGrayBanner
  'gray_shulker_box': BlockGrayShulkerBox
  'minecraft:gray_shulker_box': BlockGrayShulkerBox
  'gray_wall_banner': BlockGrayWallBanner
  'minecraft:gray_wall_banner': BlockGrayWallBanner
  'green_banner': BlockGreenBanner
  'minecraft:green_banner': BlockGreenBanner
  'green_shulker_box': BlockGreenShulkerBox
  'minecraft:green_shulker_box': BlockGreenShulkerBox
  'green_wall_banner': BlockGreenWallBanner
  'minecraft:green_wall_banner': BlockGreenWallBanner
  'hopper': BlockHopper
  'minecraft:hopper': BlockHopper
  'jigsaw': BlockJigsaw
  'minecraft:jigsaw': BlockJigsaw
  'jukebox': BlockJukebox
  'minecraft:jukebox': BlockJukebox
  'jungle_hanging_sign': BlockJungleHangingSign
  'minecraft:jungle_hanging_sign': BlockJungleHangingSign
  'jungle_shelf': BlockJungleShelf
  'minecraft:jungle_shelf': BlockJungleShelf
  'jungle_sign': BlockJungleSign
  'minecraft:jungle_sign': BlockJungleSign
  'jungle_wall_hanging_sign': BlockJungleWallHangingSign
  'minecraft:jungle_wall_hanging_sign': BlockJungleWallHangingSign
  'jungle_wall_sign': BlockJungleWallSign
  'minecraft:jungle_wall_sign': BlockJungleWallSign
  'lectern': BlockLectern
  'minecraft:lectern': BlockLectern
  'light_blue_banner': BlockLightBlueBanner
  'minecraft:light_blue_banner': BlockLightBlueBanner
  'light_blue_shulker_box': BlockLightBlueShulkerBox
  'minecraft:light_blue_shulker_box': BlockLightBlueShulkerBox
  'light_blue_wall_banner': BlockLightBlueWallBanner
  'minecraft:light_blue_wall_banner': BlockLightBlueWallBanner
  'light_gray_banner': BlockLightGrayBanner
  'minecraft:light_gray_banner': BlockLightGrayBanner
  'light_gray_shulker_box': BlockLightGrayShulkerBox
  'minecraft:light_gray_shulker_box': BlockLightGrayShulkerBox
  'light_gray_wall_banner': BlockLightGrayWallBanner
  'minecraft:light_gray_wall_banner': BlockLightGrayWallBanner
  'lime_banner': BlockLimeBanner
  'minecraft:lime_banner': BlockLimeBanner
  'lime_shulker_box': BlockLimeShulkerBox
  'minecraft:lime_shulker_box': BlockLimeShulkerBox
  'lime_wall_banner': BlockLimeWallBanner
  'minecraft:lime_wall_banner': BlockLimeWallBanner
  'magenta_banner': BlockMagentaBanner
  'minecraft:magenta_banner': BlockMagentaBanner
  'magenta_shulker_box': BlockMagentaShulkerBox
  'minecraft:magenta_shulker_box': BlockMagentaShulkerBox
  'magenta_wall_banner': BlockMagentaWallBanner
  'minecraft:magenta_wall_banner': BlockMagentaWallBanner
  'mangrove_hanging_sign': BlockMangroveHangingSign
  'minecraft:mangrove_hanging_sign': BlockMangroveHangingSign
  'mangrove_shelf': BlockMangroveShelf
  'minecraft:mangrove_shelf': BlockMangroveShelf
  'mangrove_sign': BlockMangroveSign
  'minecraft:mangrove_sign': BlockMangroveSign
  'mangrove_wall_hanging_sign': BlockMangroveWallHangingSign
  'minecraft:mangrove_wall_hanging_sign': BlockMangroveWallHangingSign
  'mangrove_wall_sign': BlockMangroveWallSign
  'minecraft:mangrove_wall_sign': BlockMangroveWallSign
  'moving_piston': BlockMovingPiston
  'minecraft:moving_piston': BlockMovingPiston
  'oak_hanging_sign': BlockOakHangingSign
  'minecraft:oak_hanging_sign': BlockOakHangingSign
  'oak_shelf': BlockOakShelf
  'minecraft:oak_shelf': BlockOakShelf
  'oak_sign': BlockOakSign
  'minecraft:oak_sign': BlockOakSign
  'oak_wall_hanging_sign': BlockOakWallHangingSign
  'minecraft:oak_wall_hanging_sign': BlockOakWallHangingSign
  'oak_wall_sign': BlockOakWallSign
  'minecraft:oak_wall_sign': BlockOakWallSign
  'orange_banner': BlockOrangeBanner
  'minecraft:orange_banner': BlockOrangeBanner
  'orange_shulker_box': BlockOrangeShulkerBox
  'minecraft:orange_shulker_box': BlockOrangeShulkerBox
  'orange_wall_banner': BlockOrangeWallBanner
  'minecraft:orange_wall_banner': BlockOrangeWallBanner
  'oxidized_copper_chest': BlockOxidizedCopperChest
  'minecraft:oxidized_copper_chest': BlockOxidizedCopperChest
  'oxidized_copper_golem_statue': BlockOxidizedCopperGolemStatue
  'minecraft:oxidized_copper_golem_statue': BlockOxidizedCopperGolemStatue
  'pale_oak_shelf': BlockPaleOakShelf
  'minecraft:pale_oak_shelf': BlockPaleOakShelf
  'pink_banner': BlockPinkBanner
  'minecraft:pink_banner': BlockPinkBanner
  'pink_shulker_box': BlockPinkShulkerBox
  'minecraft:pink_shulker_box': BlockPinkShulkerBox
  'pink_wall_banner': BlockPinkWallBanner
  'minecraft:pink_wall_banner': BlockPinkWallBanner
  'player_head': BlockPlayerHead
  'minecraft:player_head': BlockPlayerHead
  'player_wall_head': BlockPlayerWallHead
  'minecraft:player_wall_head': BlockPlayerWallHead
  'purple_banner': BlockPurpleBanner
  'minecraft:purple_banner': BlockPurpleBanner
  'purple_shulker_box': BlockPurpleShulkerBox
  'minecraft:purple_shulker_box': BlockPurpleShulkerBox
  'purple_wall_banner': BlockPurpleWallBanner
  'minecraft:purple_wall_banner': BlockPurpleWallBanner
  'red_banner': BlockRedBanner
  'minecraft:red_banner': BlockRedBanner
  'red_shulker_box': BlockRedShulkerBox
  'minecraft:red_shulker_box': BlockRedShulkerBox
  'red_wall_banner': BlockRedWallBanner
  'minecraft:red_wall_banner': BlockRedWallBanner
  'repeating_command_block': BlockRepeatingCommandBlock
  'minecraft:repeating_command_block': BlockRepeatingCommandBlock
  'sculk_catalyst': BlockSculkCatalyst
  'minecraft:sculk_catalyst': BlockSculkCatalyst
  'sculk_sensor': BlockSculkSensor
  'minecraft:sculk_sensor': BlockSculkSensor
  'sculk_shrieker': BlockSculkShrieker
  'minecraft:sculk_shrieker': BlockSculkShrieker
  'shulker_box': BlockShulkerBox
  'minecraft:shulker_box': BlockShulkerBox
  'skeleton_skull': BlockSkeletonSkull
  'minecraft:skeleton_skull': BlockSkeletonSkull
  'skeleton_wall_skull': BlockSkeletonWallSkull
  'minecraft:skeleton_wall_skull': BlockSkeletonWallSkull
  'smoker': BlockSmoker
  'minecraft:smoker': BlockSmoker
  'soul_campfire': BlockSoulCampfire
  'minecraft:soul_campfire': BlockSoulCampfire
  'spawner': BlockSpawner
  'minecraft:spawner': BlockSpawner
  'spruce_hanging_sign': BlockSpruceHangingSign
  'minecraft:spruce_hanging_sign': BlockSpruceHangingSign
  'spruce_shelf': BlockSpruceShelf
  'minecraft:spruce_shelf': BlockSpruceShelf
  'spruce_sign': BlockSpruceSign
  'minecraft:spruce_sign': BlockSpruceSign
  'spruce_wall_hanging_sign': BlockSpruceWallHangingSign
  'minecraft:spruce_wall_hanging_sign': BlockSpruceWallHangingSign
  'spruce_wall_sign': BlockSpruceWallSign
  'minecraft:spruce_wall_sign': BlockSpruceWallSign
  'structure_block': BlockStructureBlock
  'minecraft:structure_block': BlockStructureBlock
  'suspicious_gravel': BlockSuspiciousGravel
  'minecraft:suspicious_gravel': BlockSuspiciousGravel
  'suspicious_sand': BlockSuspiciousSand
  'minecraft:suspicious_sand': BlockSuspiciousSand
  'test_block': BlockTestBlock
  'minecraft:test_block': BlockTestBlock
  'test_instance_block': BlockTestInstanceBlock
  'minecraft:test_instance_block': BlockTestInstanceBlock
  'trapped_chest': BlockTrappedChest
  'minecraft:trapped_chest': BlockTrappedChest
  'trial_spawner': BlockTrialSpawner
  'minecraft:trial_spawner': BlockTrialSpawner
  'vault': BlockVault
  'minecraft:vault': BlockVault
  'warped_hanging_sign': BlockWarpedHangingSign
  'minecraft:warped_hanging_sign': BlockWarpedHangingSign
  'warped_shelf': BlockWarpedShelf
  'minecraft:warped_shelf': BlockWarpedShelf
  'warped_sign': BlockWarpedSign
  'minecraft:warped_sign': BlockWarpedSign
  'warped_wall_hanging_sign': BlockWarpedWallHangingSign
  'minecraft:warped_wall_hanging_sign': BlockWarpedWallHangingSign
  'warped_wall_sign': BlockWarpedWallSign
  'minecraft:warped_wall_sign': BlockWarpedWallSign
  'waxed_copper_chest': BlockWaxedCopperChest
  'minecraft:waxed_copper_chest': BlockWaxedCopperChest
  'waxed_copper_golem_statue': BlockWaxedCopperGolemStatue
  'minecraft:waxed_copper_golem_statue': BlockWaxedCopperGolemStatue
  'waxed_exposed_copper_chest': BlockWaxedExposedCopperChest
  'minecraft:waxed_exposed_copper_chest': BlockWaxedExposedCopperChest
  'waxed_exposed_copper_golem_statue': BlockWaxedExposedCopperGolemStatue
  'minecraft:waxed_exposed_copper_golem_statue': BlockWaxedExposedCopperGolemStatue
  'waxed_oxidized_copper_chest': BlockWaxedOxidizedCopperChest
  'minecraft:waxed_oxidized_copper_chest': BlockWaxedOxidizedCopperChest
  'waxed_oxidized_copper_golem_statue': BlockWaxedOxidizedCopperGolemStatue
  'minecraft:waxed_oxidized_copper_golem_statue': BlockWaxedOxidizedCopperGolemStatue
  'waxed_weathered_copper_chest': BlockWaxedWeatheredCopperChest
  'minecraft:waxed_weathered_copper_chest': BlockWaxedWeatheredCopperChest
  'waxed_weathered_copper_golem_statue': BlockWaxedWeatheredCopperGolemStatue
  'minecraft:waxed_weathered_copper_golem_statue': BlockWaxedWeatheredCopperGolemStatue
  'weathered_copper_chest': BlockWeatheredCopperChest
  'minecraft:weathered_copper_chest': BlockWeatheredCopperChest
  'weathered_copper_golem_statue': BlockWeatheredCopperGolemStatue
  'minecraft:weathered_copper_golem_statue': BlockWeatheredCopperGolemStatue
  'white_banner': BlockWhiteBanner
  'minecraft:white_banner': BlockWhiteBanner
  'white_shulker_box': BlockWhiteShulkerBox
  'minecraft:white_shulker_box': BlockWhiteShulkerBox
  'white_wall_banner': BlockWhiteWallBanner
  'minecraft:white_wall_banner': BlockWhiteWallBanner
  'wither_skeleton_skull': BlockWitherSkeletonSkull
  'minecraft:wither_skeleton_skull': BlockWitherSkeletonSkull
  'wither_skeleton_wall_skull': BlockWitherSkeletonWallSkull
  'minecraft:wither_skeleton_wall_skull': BlockWitherSkeletonWallSkull
  'yellow_banner': BlockYellowBanner
  'minecraft:yellow_banner': BlockYellowBanner
  'yellow_shulker_box': BlockYellowShulkerBox
  'minecraft:yellow_shulker_box': BlockYellowShulkerBox
  'yellow_wall_banner': BlockYellowWallBanner
  'minecraft:yellow_wall_banner': BlockYellowWallBanner
  'zombie_head': BlockZombieHead
  'minecraft:zombie_head': BlockZombieHead
  'zombie_wall_head': BlockZombieWallHead
  'minecraft:zombie_wall_head': BlockZombieWallHead
}
type BlockKeys = keyof BlockDispatcherMap
type BlockFallback = (
  | BlockAcaciaHangingSign
  | BlockAcaciaShelf
  | BlockAcaciaSign
  | BlockAcaciaWallHangingSign
  | BlockAcaciaWallSign
  | BlockBambooHangingSign
  | BlockBambooShelf
  | BlockBambooSign
  | BlockBambooWallHangingSign
  | BlockBambooWallSign
  | BlockBarrel
  | BlockBeacon
  | BlockBed
  | BlockBeeNest
  | BlockBeehive
  | BlockBell
  | BlockBirchHangingSign
  | BlockBirchShelf
  | BlockBirchSign
  | BlockBirchWallHangingSign
  | BlockBirchWallSign
  | BlockBlackBanner
  | BlockBlackShulkerBox
  | BlockBlackWallBanner
  | BlockBlastFurnace
  | BlockBlueBanner
  | BlockBlueShulkerBox
  | BlockBlueWallBanner
  | BlockBrewingStand
  | BlockBrownBanner
  | BlockBrownShulkerBox
  | BlockBrownWallBanner
  | BlockCalibratedSculkSensor
  | BlockCampfire
  | BlockChainCommandBlock
  | BlockCherryShelf
  | BlockCherrySign
  | BlockCherryWallSign
  | BlockChest
  | BlockChiseledBookshelf
  | BlockCommandBlock
  | BlockComparator
  | BlockConduit
  | BlockCopperChest
  | BlockCopperGolemStatue
  | BlockCreeperHead
  | BlockCreeperWallHead
  | BlockCrimsonHangingSign
  | BlockCrimsonShelf
  | BlockCrimsonSign
  | BlockCrimsonWallHangingSign
  | BlockCrimsonWallSign
  | BlockCyanBanner
  | BlockCyanShulkerBox
  | BlockCyanWallBanner
  | BlockDarkOakHangingSign
  | BlockDarkOakShelf
  | BlockDarkOakSign
  | BlockDarkOakWallHangingSign
  | BlockDarkOakWallSign
  | BlockDaylightDetector
  | BlockDecoratedPot
  | BlockDispenser
  | BlockDragonHead
  | BlockDragonWallHead
  | BlockDropper
  | BlockEnchantingTable
  | BlockEndGateway
  | BlockEndPortal
  | BlockEnderChest
  | BlockExposedCopperChest
  | BlockExposedCopperGolemStatue
  | BlockFurnace
  | BlockGrayBanner
  | BlockGrayShulkerBox
  | BlockGrayWallBanner
  | BlockGreenBanner
  | BlockGreenShulkerBox
  | BlockGreenWallBanner
  | BlockHopper
  | BlockJigsaw
  | BlockJukebox
  | BlockJungleHangingSign
  | BlockJungleShelf
  | BlockJungleSign
  | BlockJungleWallHangingSign
  | BlockJungleWallSign
  | BlockLectern
  | BlockLightBlueBanner
  | BlockLightBlueShulkerBox
  | BlockLightBlueWallBanner
  | BlockLightGrayBanner
  | BlockLightGrayShulkerBox
  | BlockLightGrayWallBanner
  | BlockLimeBanner
  | BlockLimeShulkerBox
  | BlockLimeWallBanner
  | BlockMagentaBanner
  | BlockMagentaShulkerBox
  | BlockMagentaWallBanner
  | BlockMangroveHangingSign
  | BlockMangroveShelf
  | BlockMangroveSign
  | BlockMangroveWallHangingSign
  | BlockMangroveWallSign
  | BlockMovingPiston
  | BlockOakHangingSign
  | BlockOakShelf
  | BlockOakSign
  | BlockOakWallHangingSign
  | BlockOakWallSign
  | BlockOrangeBanner
  | BlockOrangeShulkerBox
  | BlockOrangeWallBanner
  | BlockOxidizedCopperChest
  | BlockOxidizedCopperGolemStatue
  | BlockPaleOakShelf
  | BlockPinkBanner
  | BlockPinkShulkerBox
  | BlockPinkWallBanner
  | BlockPlayerHead
  | BlockPlayerWallHead
  | BlockPurpleBanner
  | BlockPurpleShulkerBox
  | BlockPurpleWallBanner
  | BlockRedBanner
  | BlockRedShulkerBox
  | BlockRedWallBanner
  | BlockRepeatingCommandBlock
  | BlockSculkCatalyst
  | BlockSculkSensor
  | BlockSculkShrieker
  | BlockShulkerBox
  | BlockSkeletonSkull
  | BlockSkeletonWallSkull
  | BlockSmoker
  | BlockSoulCampfire
  | BlockSpawner
  | BlockSpruceHangingSign
  | BlockSpruceShelf
  | BlockSpruceSign
  | BlockSpruceWallHangingSign
  | BlockSpruceWallSign
  | BlockStructureBlock
  | BlockSuspiciousGravel
  | BlockSuspiciousSand
  | BlockTestBlock
  | BlockTestInstanceBlock
  | BlockTrappedChest
  | BlockTrialSpawner
  | BlockVault
  | BlockWarpedHangingSign
  | BlockWarpedShelf
  | BlockWarpedSign
  | BlockWarpedWallHangingSign
  | BlockWarpedWallSign
  | BlockWaxedCopperChest
  | BlockWaxedCopperGolemStatue
  | BlockWaxedExposedCopperChest
  | BlockWaxedExposedCopperGolemStatue
  | BlockWaxedOxidizedCopperChest
  | BlockWaxedOxidizedCopperGolemStatue
  | BlockWaxedWeatheredCopperChest
  | BlockWaxedWeatheredCopperGolemStatue
  | BlockWeatheredCopperChest
  | BlockWeatheredCopperGolemStatue
  | BlockWhiteBanner
  | BlockWhiteShulkerBox
  | BlockWhiteWallBanner
  | BlockWitherSkeletonSkull
  | BlockWitherSkeletonWallSkull
  | BlockYellowBanner
  | BlockYellowShulkerBox
  | BlockYellowWallBanner
  | BlockZombieHead
  | BlockZombieWallHead)
type BlockAcaciaHangingSign = SymbolBlockEntity['sign']
type BlockAcaciaShelf = SymbolBlockEntity['shelf']
type BlockAcaciaSign = SymbolBlockEntity['sign']
type BlockAcaciaWallHangingSign = SymbolBlockEntity['sign']
type BlockAcaciaWallSign = SymbolBlockEntity['sign']
type BlockBambooHangingSign = SymbolBlockEntity['sign']
type BlockBambooShelf = SymbolBlockEntity['shelf']
type BlockBambooSign = SymbolBlockEntity['sign']
type BlockBambooWallHangingSign = SymbolBlockEntity['sign']
type BlockBambooWallSign = SymbolBlockEntity['sign']
type BlockBarrel = SymbolBlockEntity['barrel']
type BlockBeacon = SymbolBlockEntity['beacon']
type BlockBed = BlockEntity
type BlockBeeNest = SymbolBlockEntity['beehive']
type BlockBeehive = SymbolBlockEntity['beehive']
type BlockBell = BlockEntity
type BlockBirchHangingSign = SymbolBlockEntity['sign']
type BlockBirchShelf = SymbolBlockEntity['shelf']
type BlockBirchSign = SymbolBlockEntity['sign']
type BlockBirchWallHangingSign = SymbolBlockEntity['sign']
type BlockBirchWallSign = SymbolBlockEntity['sign']
type BlockBlackBanner = SymbolBlockEntity['banner']
type BlockBlackShulkerBox = SymbolBlockEntity['shulker_box']
type BlockBlackWallBanner = SymbolBlockEntity['banner']
type BlockBlastFurnace = SymbolBlockEntity['furnace']
type BlockBlueBanner = SymbolBlockEntity['banner']
type BlockBlueShulkerBox = SymbolBlockEntity['shulker_box']
type BlockBlueWallBanner = SymbolBlockEntity['banner']
type BlockBrewingStand = SymbolBlockEntity['brewing_stand']
type BlockBrownBanner = SymbolBlockEntity['banner']
type BlockBrownShulkerBox = SymbolBlockEntity['shulker_box']
type BlockBrownWallBanner = SymbolBlockEntity['banner']
type BlockCalibratedSculkSensor = SymbolBlockEntity['sculk_sensor']
type BlockCampfire = SymbolBlockEntity['campfire']
type BlockChainCommandBlock = SymbolBlockEntity['command_block']
type BlockCherryShelf = SymbolBlockEntity['shelf']
type BlockCherrySign = SymbolBlockEntity['sign']
type BlockCherryWallSign = SymbolBlockEntity['sign']
type BlockChest = SymbolBlockEntity['chest']
type BlockChiseledBookshelf = SymbolBlockEntity['chiseled_bookshelf']
type BlockCommandBlock = SymbolBlockEntity['command_block']
type BlockComparator = SymbolBlockEntity['comparator']
type BlockConduit = SymbolBlockEntity['conduit']
type BlockCopperChest = SymbolBlockEntity['chest']
type BlockCopperGolemStatue = BlockEntity
type BlockCreeperHead = Skull
type BlockCreeperWallHead = Skull
type BlockCrimsonHangingSign = SymbolBlockEntity['sign']
type BlockCrimsonShelf = SymbolBlockEntity['shelf']
type BlockCrimsonSign = SymbolBlockEntity['sign']
type BlockCrimsonWallHangingSign = SymbolBlockEntity['sign']
type BlockCrimsonWallSign = SymbolBlockEntity['sign']
type BlockCyanBanner = SymbolBlockEntity['banner']
type BlockCyanShulkerBox = SymbolBlockEntity['shulker_box']
type BlockCyanWallBanner = SymbolBlockEntity['banner']
type BlockDarkOakHangingSign = SymbolBlockEntity['sign']
type BlockDarkOakShelf = SymbolBlockEntity['shelf']
type BlockDarkOakSign = SymbolBlockEntity['sign']
type BlockDarkOakWallHangingSign = SymbolBlockEntity['sign']
type BlockDarkOakWallSign = SymbolBlockEntity['sign']
type BlockDaylightDetector = BlockEntity
type BlockDecoratedPot = SymbolBlockEntity['decorated_pot']
type BlockDispenser = SymbolBlockEntity['dispenser']
type BlockDragonHead = Skull
type BlockDragonWallHead = Skull
type BlockDropper = SymbolBlockEntity['dispenser']
type BlockEnchantingTable = SymbolBlockEntity['enchanting_table']
type BlockEndGateway = SymbolBlockEntity['end_gateway']
type BlockEndPortal = BlockEntity
type BlockEnderChest = BlockEntity
type BlockExposedCopperChest = SymbolBlockEntity['chest']
type BlockExposedCopperGolemStatue = BlockEntity
type BlockFurnace = SymbolBlockEntity['furnace']
type BlockGrayBanner = SymbolBlockEntity['banner']
type BlockGrayShulkerBox = SymbolBlockEntity['shulker_box']
type BlockGrayWallBanner = SymbolBlockEntity['banner']
type BlockGreenBanner = SymbolBlockEntity['banner']
type BlockGreenShulkerBox = SymbolBlockEntity['shulker_box']
type BlockGreenWallBanner = SymbolBlockEntity['banner']
type BlockHopper = SymbolBlockEntity['hopper']
type BlockJigsaw = SymbolBlockEntity['jigsaw']
type BlockJukebox = SymbolBlockEntity['jukebox']
type BlockJungleHangingSign = SymbolBlockEntity['sign']
type BlockJungleShelf = SymbolBlockEntity['shelf']
type BlockJungleSign = SymbolBlockEntity['sign']
type BlockJungleWallHangingSign = SymbolBlockEntity['sign']
type BlockJungleWallSign = SymbolBlockEntity['sign']
type BlockLectern = SymbolBlockEntity['lectern']
type BlockLightBlueBanner = SymbolBlockEntity['banner']
type BlockLightBlueShulkerBox = SymbolBlockEntity['shulker_box']
type BlockLightBlueWallBanner = SymbolBlockEntity['banner']
type BlockLightGrayBanner = SymbolBlockEntity['banner']
type BlockLightGrayShulkerBox = SymbolBlockEntity['shulker_box']
type BlockLightGrayWallBanner = SymbolBlockEntity['banner']
type BlockLimeBanner = SymbolBlockEntity['banner']
type BlockLimeShulkerBox = SymbolBlockEntity['shulker_box']
type BlockLimeWallBanner = SymbolBlockEntity['banner']
type BlockMagentaBanner = SymbolBlockEntity['banner']
type BlockMagentaShulkerBox = SymbolBlockEntity['shulker_box']
type BlockMagentaWallBanner = SymbolBlockEntity['banner']
type BlockMangroveHangingSign = SymbolBlockEntity['sign']
type BlockMangroveShelf = SymbolBlockEntity['shelf']
type BlockMangroveSign = SymbolBlockEntity['sign']
type BlockMangroveWallHangingSign = SymbolBlockEntity['sign']
type BlockMangroveWallSign = SymbolBlockEntity['sign']
type BlockMovingPiston = SymbolBlockEntity['moving_piston']
type BlockOakHangingSign = SymbolBlockEntity['sign']
type BlockOakShelf = SymbolBlockEntity['shelf']
type BlockOakSign = SymbolBlockEntity['sign']
type BlockOakWallHangingSign = SymbolBlockEntity['sign']
type BlockOakWallSign = SymbolBlockEntity['sign']
type BlockOrangeBanner = SymbolBlockEntity['banner']
type BlockOrangeShulkerBox = SymbolBlockEntity['shulker_box']
type BlockOrangeWallBanner = SymbolBlockEntity['banner']
type BlockOxidizedCopperChest = SymbolBlockEntity['chest']
type BlockOxidizedCopperGolemStatue = BlockEntity
type BlockPaleOakShelf = SymbolBlockEntity['shelf']
type BlockPinkBanner = SymbolBlockEntity['banner']
type BlockPinkShulkerBox = SymbolBlockEntity['shulker_box']
type BlockPinkWallBanner = SymbolBlockEntity['banner']
type BlockPlayerHead = SymbolBlockEntity['skull']
type BlockPlayerWallHead = SymbolBlockEntity['skull']
type BlockPurpleBanner = SymbolBlockEntity['banner']
type BlockPurpleShulkerBox = SymbolBlockEntity['shulker_box']
type BlockPurpleWallBanner = SymbolBlockEntity['banner']
type BlockRedBanner = SymbolBlockEntity['banner']
type BlockRedShulkerBox = SymbolBlockEntity['shulker_box']
type BlockRedWallBanner = SymbolBlockEntity['banner']
type BlockRepeatingCommandBlock = SymbolBlockEntity['command_block']
type BlockSculkCatalyst = SymbolBlockEntity['sculk_catalyst']
type BlockSculkSensor = SymbolBlockEntity['sculk_sensor']
type BlockSculkShrieker = SymbolBlockEntity['sculk_shrieker']
type BlockShulkerBox = SymbolBlockEntity['shulker_box']
type BlockSkeletonSkull = Skull
type BlockSkeletonWallSkull = Skull
type BlockSmoker = SymbolBlockEntity['furnace']
type BlockSoulCampfire = SymbolBlockEntity['campfire']
type BlockSpawner = SymbolBlockEntity['mob_spawner']
type BlockSpruceHangingSign = SymbolBlockEntity['sign']
type BlockSpruceShelf = SymbolBlockEntity['shelf']
type BlockSpruceSign = SymbolBlockEntity['sign']
type BlockSpruceWallHangingSign = SymbolBlockEntity['sign']
type BlockSpruceWallSign = SymbolBlockEntity['sign']
type BlockStructureBlock = SymbolBlockEntity['structure_block']
type BlockSuspiciousGravel = SymbolBlockEntity['brushable_block']
type BlockSuspiciousSand = SymbolBlockEntity['brushable_block']
type BlockTestBlock = SymbolBlockEntity['test_block']
type BlockTestInstanceBlock = SymbolBlockEntity['test_instance_block']
type BlockTrappedChest = SymbolBlockEntity['trapped_chest']
type BlockTrialSpawner = SymbolBlockEntity['trial_spawner']
type BlockVault = SymbolBlockEntity['vault']
type BlockWarpedHangingSign = SymbolBlockEntity['sign']
type BlockWarpedShelf = SymbolBlockEntity['shelf']
type BlockWarpedSign = SymbolBlockEntity['sign']
type BlockWarpedWallHangingSign = SymbolBlockEntity['sign']
type BlockWarpedWallSign = SymbolBlockEntity['sign']
type BlockWaxedCopperChest = SymbolBlockEntity['chest']
type BlockWaxedCopperGolemStatue = BlockEntity
type BlockWaxedExposedCopperChest = SymbolBlockEntity['chest']
type BlockWaxedExposedCopperGolemStatue = BlockEntity
type BlockWaxedOxidizedCopperChest = SymbolBlockEntity['chest']
type BlockWaxedOxidizedCopperGolemStatue = BlockEntity
type BlockWaxedWeatheredCopperChest = SymbolBlockEntity['chest']
type BlockWaxedWeatheredCopperGolemStatue = BlockEntity
type BlockWeatheredCopperChest = SymbolBlockEntity['chest']
type BlockWeatheredCopperGolemStatue = BlockEntity
type BlockWhiteBanner = SymbolBlockEntity['banner']
type BlockWhiteShulkerBox = SymbolBlockEntity['shulker_box']
type BlockWhiteWallBanner = SymbolBlockEntity['banner']
type BlockWitherSkeletonSkull = Skull
type BlockWitherSkeletonWallSkull = Skull
type BlockYellowBanner = SymbolBlockEntity['banner']
type BlockYellowShulkerBox = SymbolBlockEntity['shulker_box']
type BlockYellowWallBanner = SymbolBlockEntity['banner']
type BlockZombieHead = Skull
type BlockZombieWallHead = Skull
export type SymbolBlock<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? BlockDispatcherMap
  : CASE extends 'keys' ? BlockKeys : CASE extends '%fallback' ? BlockFallback : never
