import type { NonEmptyString } from 'sandstone'

type JsonMcdocBlockStatesDispatcherMap = {
  'acacia_button': JsonMcdocBlockStatesAcaciaButton,
  'minecraft:acacia_button': JsonMcdocBlockStatesAcaciaButton,
  'acacia_door': JsonMcdocBlockStatesAcaciaDoor,
  'minecraft:acacia_door': JsonMcdocBlockStatesAcaciaDoor,
  'acacia_fence': JsonMcdocBlockStatesAcaciaFence,
  'minecraft:acacia_fence': JsonMcdocBlockStatesAcaciaFence,
  'acacia_fence_gate': JsonMcdocBlockStatesAcaciaFenceGate,
  'minecraft:acacia_fence_gate': JsonMcdocBlockStatesAcaciaFenceGate,
  'acacia_hanging_sign': JsonMcdocBlockStatesAcaciaHangingSign,
  'minecraft:acacia_hanging_sign': JsonMcdocBlockStatesAcaciaHangingSign,
  'acacia_leaves': JsonMcdocBlockStatesAcaciaLeaves,
  'minecraft:acacia_leaves': JsonMcdocBlockStatesAcaciaLeaves,
  'acacia_log': JsonMcdocBlockStatesAcaciaLog,
  'minecraft:acacia_log': JsonMcdocBlockStatesAcaciaLog,
  'acacia_planks': JsonMcdocBlockStatesAcaciaPlanks,
  'minecraft:acacia_planks': JsonMcdocBlockStatesAcaciaPlanks,
  'acacia_pressure_plate': JsonMcdocBlockStatesAcaciaPressurePlate,
  'minecraft:acacia_pressure_plate': JsonMcdocBlockStatesAcaciaPressurePlate,
  'acacia_sapling': JsonMcdocBlockStatesAcaciaSapling,
  'minecraft:acacia_sapling': JsonMcdocBlockStatesAcaciaSapling,
  'acacia_shelf': JsonMcdocBlockStatesAcaciaShelf,
  'minecraft:acacia_shelf': JsonMcdocBlockStatesAcaciaShelf,
  'acacia_sign': JsonMcdocBlockStatesAcaciaSign,
  'minecraft:acacia_sign': JsonMcdocBlockStatesAcaciaSign,
  'acacia_slab': JsonMcdocBlockStatesAcaciaSlab,
  'minecraft:acacia_slab': JsonMcdocBlockStatesAcaciaSlab,
  'acacia_stairs': JsonMcdocBlockStatesAcaciaStairs,
  'minecraft:acacia_stairs': JsonMcdocBlockStatesAcaciaStairs,
  'acacia_trapdoor': JsonMcdocBlockStatesAcaciaTrapdoor,
  'minecraft:acacia_trapdoor': JsonMcdocBlockStatesAcaciaTrapdoor,
  'acacia_wall_hanging_sign': JsonMcdocBlockStatesAcaciaWallHangingSign,
  'minecraft:acacia_wall_hanging_sign': JsonMcdocBlockStatesAcaciaWallHangingSign,
  'acacia_wall_sign': JsonMcdocBlockStatesAcaciaWallSign,
  'minecraft:acacia_wall_sign': JsonMcdocBlockStatesAcaciaWallSign,
  'acacia_wood': JsonMcdocBlockStatesAcaciaWood,
  'minecraft:acacia_wood': JsonMcdocBlockStatesAcaciaWood,
  'activator_rail': JsonMcdocBlockStatesActivatorRail,
  'minecraft:activator_rail': JsonMcdocBlockStatesActivatorRail,
  'air': JsonMcdocBlockStatesAir,
  'minecraft:air': JsonMcdocBlockStatesAir,
  'allium': JsonMcdocBlockStatesAllium,
  'minecraft:allium': JsonMcdocBlockStatesAllium,
  'amethyst_block': JsonMcdocBlockStatesAmethystBlock,
  'minecraft:amethyst_block': JsonMcdocBlockStatesAmethystBlock,
  'amethyst_cluster': JsonMcdocBlockStatesAmethystCluster,
  'minecraft:amethyst_cluster': JsonMcdocBlockStatesAmethystCluster,
  'ancient_debris': JsonMcdocBlockStatesAncientDebris,
  'minecraft:ancient_debris': JsonMcdocBlockStatesAncientDebris,
  'andesite': JsonMcdocBlockStatesAndesite,
  'minecraft:andesite': JsonMcdocBlockStatesAndesite,
  'andesite_slab': JsonMcdocBlockStatesAndesiteSlab,
  'minecraft:andesite_slab': JsonMcdocBlockStatesAndesiteSlab,
  'andesite_stairs': JsonMcdocBlockStatesAndesiteStairs,
  'minecraft:andesite_stairs': JsonMcdocBlockStatesAndesiteStairs,
  'andesite_wall': JsonMcdocBlockStatesAndesiteWall,
  'minecraft:andesite_wall': JsonMcdocBlockStatesAndesiteWall,
  'anvil': JsonMcdocBlockStatesAnvil,
  'minecraft:anvil': JsonMcdocBlockStatesAnvil,
  'attached_melon_stem': JsonMcdocBlockStatesAttachedMelonStem,
  'minecraft:attached_melon_stem': JsonMcdocBlockStatesAttachedMelonStem,
  'attached_pumpkin_stem': JsonMcdocBlockStatesAttachedPumpkinStem,
  'minecraft:attached_pumpkin_stem': JsonMcdocBlockStatesAttachedPumpkinStem,
  'azalea': JsonMcdocBlockStatesAzalea,
  'minecraft:azalea': JsonMcdocBlockStatesAzalea,
  'azalea_leaves': JsonMcdocBlockStatesAzaleaLeaves,
  'minecraft:azalea_leaves': JsonMcdocBlockStatesAzaleaLeaves,
  'azure_bluet': JsonMcdocBlockStatesAzureBluet,
  'minecraft:azure_bluet': JsonMcdocBlockStatesAzureBluet,
  'bamboo': JsonMcdocBlockStatesBamboo,
  'minecraft:bamboo': JsonMcdocBlockStatesBamboo,
  'bamboo_block': JsonMcdocBlockStatesBambooBlock,
  'minecraft:bamboo_block': JsonMcdocBlockStatesBambooBlock,
  'bamboo_button': JsonMcdocBlockStatesBambooButton,
  'minecraft:bamboo_button': JsonMcdocBlockStatesBambooButton,
  'bamboo_door': JsonMcdocBlockStatesBambooDoor,
  'minecraft:bamboo_door': JsonMcdocBlockStatesBambooDoor,
  'bamboo_fence': JsonMcdocBlockStatesBambooFence,
  'minecraft:bamboo_fence': JsonMcdocBlockStatesBambooFence,
  'bamboo_fence_gate': JsonMcdocBlockStatesBambooFenceGate,
  'minecraft:bamboo_fence_gate': JsonMcdocBlockStatesBambooFenceGate,
  'bamboo_hanging_sign': JsonMcdocBlockStatesBambooHangingSign,
  'minecraft:bamboo_hanging_sign': JsonMcdocBlockStatesBambooHangingSign,
  'bamboo_mosaic': JsonMcdocBlockStatesBambooMosaic,
  'minecraft:bamboo_mosaic': JsonMcdocBlockStatesBambooMosaic,
  'bamboo_mosaic_slab': JsonMcdocBlockStatesBambooMosaicSlab,
  'minecraft:bamboo_mosaic_slab': JsonMcdocBlockStatesBambooMosaicSlab,
  'bamboo_mosaic_stairs': JsonMcdocBlockStatesBambooMosaicStairs,
  'minecraft:bamboo_mosaic_stairs': JsonMcdocBlockStatesBambooMosaicStairs,
  'bamboo_planks': JsonMcdocBlockStatesBambooPlanks,
  'minecraft:bamboo_planks': JsonMcdocBlockStatesBambooPlanks,
  'bamboo_pressure_plate': JsonMcdocBlockStatesBambooPressurePlate,
  'minecraft:bamboo_pressure_plate': JsonMcdocBlockStatesBambooPressurePlate,
  'bamboo_sapling': JsonMcdocBlockStatesBambooSapling,
  'minecraft:bamboo_sapling': JsonMcdocBlockStatesBambooSapling,
  'bamboo_shelf': JsonMcdocBlockStatesBambooShelf,
  'minecraft:bamboo_shelf': JsonMcdocBlockStatesBambooShelf,
  'bamboo_sign': JsonMcdocBlockStatesBambooSign,
  'minecraft:bamboo_sign': JsonMcdocBlockStatesBambooSign,
  'bamboo_slab': JsonMcdocBlockStatesBambooSlab,
  'minecraft:bamboo_slab': JsonMcdocBlockStatesBambooSlab,
  'bamboo_stairs': JsonMcdocBlockStatesBambooStairs,
  'minecraft:bamboo_stairs': JsonMcdocBlockStatesBambooStairs,
  'bamboo_trapdoor': JsonMcdocBlockStatesBambooTrapdoor,
  'minecraft:bamboo_trapdoor': JsonMcdocBlockStatesBambooTrapdoor,
  'bamboo_wall_hanging_sign': JsonMcdocBlockStatesBambooWallHangingSign,
  'minecraft:bamboo_wall_hanging_sign': JsonMcdocBlockStatesBambooWallHangingSign,
  'bamboo_wall_sign': JsonMcdocBlockStatesBambooWallSign,
  'minecraft:bamboo_wall_sign': JsonMcdocBlockStatesBambooWallSign,
  'barrel': JsonMcdocBlockStatesBarrel,
  'minecraft:barrel': JsonMcdocBlockStatesBarrel,
  'barrier': JsonMcdocBlockStatesBarrier,
  'minecraft:barrier': JsonMcdocBlockStatesBarrier,
  'basalt': JsonMcdocBlockStatesBasalt,
  'minecraft:basalt': JsonMcdocBlockStatesBasalt,
  'beacon': JsonMcdocBlockStatesBeacon,
  'minecraft:beacon': JsonMcdocBlockStatesBeacon,
  'bedrock': JsonMcdocBlockStatesBedrock,
  'minecraft:bedrock': JsonMcdocBlockStatesBedrock,
  'bee_nest': JsonMcdocBlockStatesBeeNest,
  'minecraft:bee_nest': JsonMcdocBlockStatesBeeNest,
  'beehive': JsonMcdocBlockStatesBeehive,
  'minecraft:beehive': JsonMcdocBlockStatesBeehive,
  'beetroots': JsonMcdocBlockStatesBeetroots,
  'minecraft:beetroots': JsonMcdocBlockStatesBeetroots,
  'bell': JsonMcdocBlockStatesBell,
  'minecraft:bell': JsonMcdocBlockStatesBell,
  'big_dripleaf': JsonMcdocBlockStatesBigDripleaf,
  'minecraft:big_dripleaf': JsonMcdocBlockStatesBigDripleaf,
  'big_dripleaf_stem': JsonMcdocBlockStatesBigDripleafStem,
  'minecraft:big_dripleaf_stem': JsonMcdocBlockStatesBigDripleafStem,
  'birch_button': JsonMcdocBlockStatesBirchButton,
  'minecraft:birch_button': JsonMcdocBlockStatesBirchButton,
  'birch_door': JsonMcdocBlockStatesBirchDoor,
  'minecraft:birch_door': JsonMcdocBlockStatesBirchDoor,
  'birch_fence': JsonMcdocBlockStatesBirchFence,
  'minecraft:birch_fence': JsonMcdocBlockStatesBirchFence,
  'birch_fence_gate': JsonMcdocBlockStatesBirchFenceGate,
  'minecraft:birch_fence_gate': JsonMcdocBlockStatesBirchFenceGate,
  'birch_hanging_sign': JsonMcdocBlockStatesBirchHangingSign,
  'minecraft:birch_hanging_sign': JsonMcdocBlockStatesBirchHangingSign,
  'birch_leaves': JsonMcdocBlockStatesBirchLeaves,
  'minecraft:birch_leaves': JsonMcdocBlockStatesBirchLeaves,
  'birch_log': JsonMcdocBlockStatesBirchLog,
  'minecraft:birch_log': JsonMcdocBlockStatesBirchLog,
  'birch_planks': JsonMcdocBlockStatesBirchPlanks,
  'minecraft:birch_planks': JsonMcdocBlockStatesBirchPlanks,
  'birch_pressure_plate': JsonMcdocBlockStatesBirchPressurePlate,
  'minecraft:birch_pressure_plate': JsonMcdocBlockStatesBirchPressurePlate,
  'birch_sapling': JsonMcdocBlockStatesBirchSapling,
  'minecraft:birch_sapling': JsonMcdocBlockStatesBirchSapling,
  'birch_shelf': JsonMcdocBlockStatesBirchShelf,
  'minecraft:birch_shelf': JsonMcdocBlockStatesBirchShelf,
  'birch_sign': JsonMcdocBlockStatesBirchSign,
  'minecraft:birch_sign': JsonMcdocBlockStatesBirchSign,
  'birch_slab': JsonMcdocBlockStatesBirchSlab,
  'minecraft:birch_slab': JsonMcdocBlockStatesBirchSlab,
  'birch_stairs': JsonMcdocBlockStatesBirchStairs,
  'minecraft:birch_stairs': JsonMcdocBlockStatesBirchStairs,
  'birch_trapdoor': JsonMcdocBlockStatesBirchTrapdoor,
  'minecraft:birch_trapdoor': JsonMcdocBlockStatesBirchTrapdoor,
  'birch_wall_hanging_sign': JsonMcdocBlockStatesBirchWallHangingSign,
  'minecraft:birch_wall_hanging_sign': JsonMcdocBlockStatesBirchWallHangingSign,
  'birch_wall_sign': JsonMcdocBlockStatesBirchWallSign,
  'minecraft:birch_wall_sign': JsonMcdocBlockStatesBirchWallSign,
  'birch_wood': JsonMcdocBlockStatesBirchWood,
  'minecraft:birch_wood': JsonMcdocBlockStatesBirchWood,
  'black_banner': JsonMcdocBlockStatesBlackBanner,
  'minecraft:black_banner': JsonMcdocBlockStatesBlackBanner,
  'black_bed': JsonMcdocBlockStatesBlackBed,
  'minecraft:black_bed': JsonMcdocBlockStatesBlackBed,
  'black_candle': JsonMcdocBlockStatesBlackCandle,
  'minecraft:black_candle': JsonMcdocBlockStatesBlackCandle,
  'black_candle_cake': JsonMcdocBlockStatesBlackCandleCake,
  'minecraft:black_candle_cake': JsonMcdocBlockStatesBlackCandleCake,
  'black_carpet': JsonMcdocBlockStatesBlackCarpet,
  'minecraft:black_carpet': JsonMcdocBlockStatesBlackCarpet,
  'black_concrete': JsonMcdocBlockStatesBlackConcrete,
  'minecraft:black_concrete': JsonMcdocBlockStatesBlackConcrete,
  'black_concrete_powder': JsonMcdocBlockStatesBlackConcretePowder,
  'minecraft:black_concrete_powder': JsonMcdocBlockStatesBlackConcretePowder,
  'black_concrete_slab': JsonMcdocBlockStatesBlackConcreteSlab,
  'minecraft:black_concrete_slab': JsonMcdocBlockStatesBlackConcreteSlab,
  'black_concrete_stairs': JsonMcdocBlockStatesBlackConcreteStairs,
  'minecraft:black_concrete_stairs': JsonMcdocBlockStatesBlackConcreteStairs,
  'black_glazed_terracotta': JsonMcdocBlockStatesBlackGlazedTerracotta,
  'minecraft:black_glazed_terracotta': JsonMcdocBlockStatesBlackGlazedTerracotta,
  'black_shulker_box': JsonMcdocBlockStatesBlackShulkerBox,
  'minecraft:black_shulker_box': JsonMcdocBlockStatesBlackShulkerBox,
  'black_stained_glass': JsonMcdocBlockStatesBlackStainedGlass,
  'minecraft:black_stained_glass': JsonMcdocBlockStatesBlackStainedGlass,
  'black_stained_glass_pane': JsonMcdocBlockStatesBlackStainedGlassPane,
  'minecraft:black_stained_glass_pane': JsonMcdocBlockStatesBlackStainedGlassPane,
  'black_terracotta': JsonMcdocBlockStatesBlackTerracotta,
  'minecraft:black_terracotta': JsonMcdocBlockStatesBlackTerracotta,
  'black_wall_banner': JsonMcdocBlockStatesBlackWallBanner,
  'minecraft:black_wall_banner': JsonMcdocBlockStatesBlackWallBanner,
  'black_wool': JsonMcdocBlockStatesBlackWool,
  'minecraft:black_wool': JsonMcdocBlockStatesBlackWool,
  'black_wool_slab': JsonMcdocBlockStatesBlackWoolSlab,
  'minecraft:black_wool_slab': JsonMcdocBlockStatesBlackWoolSlab,
  'black_wool_stairs': JsonMcdocBlockStatesBlackWoolStairs,
  'minecraft:black_wool_stairs': JsonMcdocBlockStatesBlackWoolStairs,
  'blackstone': JsonMcdocBlockStatesBlackstone,
  'minecraft:blackstone': JsonMcdocBlockStatesBlackstone,
  'blackstone_slab': JsonMcdocBlockStatesBlackstoneSlab,
  'minecraft:blackstone_slab': JsonMcdocBlockStatesBlackstoneSlab,
  'blackstone_stairs': JsonMcdocBlockStatesBlackstoneStairs,
  'minecraft:blackstone_stairs': JsonMcdocBlockStatesBlackstoneStairs,
  'blackstone_wall': JsonMcdocBlockStatesBlackstoneWall,
  'minecraft:blackstone_wall': JsonMcdocBlockStatesBlackstoneWall,
  'blast_furnace': JsonMcdocBlockStatesBlastFurnace,
  'minecraft:blast_furnace': JsonMcdocBlockStatesBlastFurnace,
  'blue_banner': JsonMcdocBlockStatesBlueBanner,
  'minecraft:blue_banner': JsonMcdocBlockStatesBlueBanner,
  'blue_bed': JsonMcdocBlockStatesBlueBed,
  'minecraft:blue_bed': JsonMcdocBlockStatesBlueBed,
  'blue_candle': JsonMcdocBlockStatesBlueCandle,
  'minecraft:blue_candle': JsonMcdocBlockStatesBlueCandle,
  'blue_candle_cake': JsonMcdocBlockStatesBlueCandleCake,
  'minecraft:blue_candle_cake': JsonMcdocBlockStatesBlueCandleCake,
  'blue_carpet': JsonMcdocBlockStatesBlueCarpet,
  'minecraft:blue_carpet': JsonMcdocBlockStatesBlueCarpet,
  'blue_concrete': JsonMcdocBlockStatesBlueConcrete,
  'minecraft:blue_concrete': JsonMcdocBlockStatesBlueConcrete,
  'blue_concrete_powder': JsonMcdocBlockStatesBlueConcretePowder,
  'minecraft:blue_concrete_powder': JsonMcdocBlockStatesBlueConcretePowder,
  'blue_concrete_slab': JsonMcdocBlockStatesBlueConcreteSlab,
  'minecraft:blue_concrete_slab': JsonMcdocBlockStatesBlueConcreteSlab,
  'blue_concrete_stairs': JsonMcdocBlockStatesBlueConcreteStairs,
  'minecraft:blue_concrete_stairs': JsonMcdocBlockStatesBlueConcreteStairs,
  'blue_glazed_terracotta': JsonMcdocBlockStatesBlueGlazedTerracotta,
  'minecraft:blue_glazed_terracotta': JsonMcdocBlockStatesBlueGlazedTerracotta,
  'blue_ice': JsonMcdocBlockStatesBlueIce,
  'minecraft:blue_ice': JsonMcdocBlockStatesBlueIce,
  'blue_orchid': JsonMcdocBlockStatesBlueOrchid,
  'minecraft:blue_orchid': JsonMcdocBlockStatesBlueOrchid,
  'blue_shulker_box': JsonMcdocBlockStatesBlueShulkerBox,
  'minecraft:blue_shulker_box': JsonMcdocBlockStatesBlueShulkerBox,
  'blue_stained_glass': JsonMcdocBlockStatesBlueStainedGlass,
  'minecraft:blue_stained_glass': JsonMcdocBlockStatesBlueStainedGlass,
  'blue_stained_glass_pane': JsonMcdocBlockStatesBlueStainedGlassPane,
  'minecraft:blue_stained_glass_pane': JsonMcdocBlockStatesBlueStainedGlassPane,
  'blue_terracotta': JsonMcdocBlockStatesBlueTerracotta,
  'minecraft:blue_terracotta': JsonMcdocBlockStatesBlueTerracotta,
  'blue_wall_banner': JsonMcdocBlockStatesBlueWallBanner,
  'minecraft:blue_wall_banner': JsonMcdocBlockStatesBlueWallBanner,
  'blue_wool': JsonMcdocBlockStatesBlueWool,
  'minecraft:blue_wool': JsonMcdocBlockStatesBlueWool,
  'blue_wool_slab': JsonMcdocBlockStatesBlueWoolSlab,
  'minecraft:blue_wool_slab': JsonMcdocBlockStatesBlueWoolSlab,
  'blue_wool_stairs': JsonMcdocBlockStatesBlueWoolStairs,
  'minecraft:blue_wool_stairs': JsonMcdocBlockStatesBlueWoolStairs,
  'bone_block': JsonMcdocBlockStatesBoneBlock,
  'minecraft:bone_block': JsonMcdocBlockStatesBoneBlock,
  'bookshelf': JsonMcdocBlockStatesBookshelf,
  'minecraft:bookshelf': JsonMcdocBlockStatesBookshelf,
  'brain_coral': JsonMcdocBlockStatesBrainCoral,
  'minecraft:brain_coral': JsonMcdocBlockStatesBrainCoral,
  'brain_coral_block': JsonMcdocBlockStatesBrainCoralBlock,
  'minecraft:brain_coral_block': JsonMcdocBlockStatesBrainCoralBlock,
  'brain_coral_fan': JsonMcdocBlockStatesBrainCoralFan,
  'minecraft:brain_coral_fan': JsonMcdocBlockStatesBrainCoralFan,
  'brain_coral_wall_fan': JsonMcdocBlockStatesBrainCoralWallFan,
  'minecraft:brain_coral_wall_fan': JsonMcdocBlockStatesBrainCoralWallFan,
  'brewing_stand': JsonMcdocBlockStatesBrewingStand,
  'minecraft:brewing_stand': JsonMcdocBlockStatesBrewingStand,
  'brick_slab': JsonMcdocBlockStatesBrickSlab,
  'minecraft:brick_slab': JsonMcdocBlockStatesBrickSlab,
  'brick_stairs': JsonMcdocBlockStatesBrickStairs,
  'minecraft:brick_stairs': JsonMcdocBlockStatesBrickStairs,
  'brick_wall': JsonMcdocBlockStatesBrickWall,
  'minecraft:brick_wall': JsonMcdocBlockStatesBrickWall,
  'bricks': JsonMcdocBlockStatesBricks,
  'minecraft:bricks': JsonMcdocBlockStatesBricks,
  'brown_banner': JsonMcdocBlockStatesBrownBanner,
  'minecraft:brown_banner': JsonMcdocBlockStatesBrownBanner,
  'brown_bed': JsonMcdocBlockStatesBrownBed,
  'minecraft:brown_bed': JsonMcdocBlockStatesBrownBed,
  'brown_candle': JsonMcdocBlockStatesBrownCandle,
  'minecraft:brown_candle': JsonMcdocBlockStatesBrownCandle,
  'brown_candle_cake': JsonMcdocBlockStatesBrownCandleCake,
  'minecraft:brown_candle_cake': JsonMcdocBlockStatesBrownCandleCake,
  'brown_carpet': JsonMcdocBlockStatesBrownCarpet,
  'minecraft:brown_carpet': JsonMcdocBlockStatesBrownCarpet,
  'brown_concrete': JsonMcdocBlockStatesBrownConcrete,
  'minecraft:brown_concrete': JsonMcdocBlockStatesBrownConcrete,
  'brown_concrete_powder': JsonMcdocBlockStatesBrownConcretePowder,
  'minecraft:brown_concrete_powder': JsonMcdocBlockStatesBrownConcretePowder,
  'brown_concrete_slab': JsonMcdocBlockStatesBrownConcreteSlab,
  'minecraft:brown_concrete_slab': JsonMcdocBlockStatesBrownConcreteSlab,
  'brown_concrete_stairs': JsonMcdocBlockStatesBrownConcreteStairs,
  'minecraft:brown_concrete_stairs': JsonMcdocBlockStatesBrownConcreteStairs,
  'brown_glazed_terracotta': JsonMcdocBlockStatesBrownGlazedTerracotta,
  'minecraft:brown_glazed_terracotta': JsonMcdocBlockStatesBrownGlazedTerracotta,
  'brown_mushroom': JsonMcdocBlockStatesBrownMushroom,
  'minecraft:brown_mushroom': JsonMcdocBlockStatesBrownMushroom,
  'brown_mushroom_block': JsonMcdocBlockStatesBrownMushroomBlock,
  'minecraft:brown_mushroom_block': JsonMcdocBlockStatesBrownMushroomBlock,
  'brown_shulker_box': JsonMcdocBlockStatesBrownShulkerBox,
  'minecraft:brown_shulker_box': JsonMcdocBlockStatesBrownShulkerBox,
  'brown_stained_glass': JsonMcdocBlockStatesBrownStainedGlass,
  'minecraft:brown_stained_glass': JsonMcdocBlockStatesBrownStainedGlass,
  'brown_stained_glass_pane': JsonMcdocBlockStatesBrownStainedGlassPane,
  'minecraft:brown_stained_glass_pane': JsonMcdocBlockStatesBrownStainedGlassPane,
  'brown_terracotta': JsonMcdocBlockStatesBrownTerracotta,
  'minecraft:brown_terracotta': JsonMcdocBlockStatesBrownTerracotta,
  'brown_wall_banner': JsonMcdocBlockStatesBrownWallBanner,
  'minecraft:brown_wall_banner': JsonMcdocBlockStatesBrownWallBanner,
  'brown_wool': JsonMcdocBlockStatesBrownWool,
  'minecraft:brown_wool': JsonMcdocBlockStatesBrownWool,
  'brown_wool_slab': JsonMcdocBlockStatesBrownWoolSlab,
  'minecraft:brown_wool_slab': JsonMcdocBlockStatesBrownWoolSlab,
  'brown_wool_stairs': JsonMcdocBlockStatesBrownWoolStairs,
  'minecraft:brown_wool_stairs': JsonMcdocBlockStatesBrownWoolStairs,
  'bubble_column': JsonMcdocBlockStatesBubbleColumn,
  'minecraft:bubble_column': JsonMcdocBlockStatesBubbleColumn,
  'bubble_coral': JsonMcdocBlockStatesBubbleCoral,
  'minecraft:bubble_coral': JsonMcdocBlockStatesBubbleCoral,
  'bubble_coral_block': JsonMcdocBlockStatesBubbleCoralBlock,
  'minecraft:bubble_coral_block': JsonMcdocBlockStatesBubbleCoralBlock,
  'bubble_coral_fan': JsonMcdocBlockStatesBubbleCoralFan,
  'minecraft:bubble_coral_fan': JsonMcdocBlockStatesBubbleCoralFan,
  'bubble_coral_wall_fan': JsonMcdocBlockStatesBubbleCoralWallFan,
  'minecraft:bubble_coral_wall_fan': JsonMcdocBlockStatesBubbleCoralWallFan,
  'budding_amethyst': JsonMcdocBlockStatesBuddingAmethyst,
  'minecraft:budding_amethyst': JsonMcdocBlockStatesBuddingAmethyst,
  'bush': JsonMcdocBlockStatesBush,
  'minecraft:bush': JsonMcdocBlockStatesBush,
  'cactus': JsonMcdocBlockStatesCactus,
  'minecraft:cactus': JsonMcdocBlockStatesCactus,
  'cactus_flower': JsonMcdocBlockStatesCactusFlower,
  'minecraft:cactus_flower': JsonMcdocBlockStatesCactusFlower,
  'cake': JsonMcdocBlockStatesCake,
  'minecraft:cake': JsonMcdocBlockStatesCake,
  'calcite': JsonMcdocBlockStatesCalcite,
  'minecraft:calcite': JsonMcdocBlockStatesCalcite,
  'calibrated_sculk_sensor': JsonMcdocBlockStatesCalibratedSculkSensor,
  'minecraft:calibrated_sculk_sensor': JsonMcdocBlockStatesCalibratedSculkSensor,
  'campfire': JsonMcdocBlockStatesCampfire,
  'minecraft:campfire': JsonMcdocBlockStatesCampfire,
  'candle': JsonMcdocBlockStatesCandle,
  'minecraft:candle': JsonMcdocBlockStatesCandle,
  'candle_cake': JsonMcdocBlockStatesCandleCake,
  'minecraft:candle_cake': JsonMcdocBlockStatesCandleCake,
  'carrots': JsonMcdocBlockStatesCarrots,
  'minecraft:carrots': JsonMcdocBlockStatesCarrots,
  'cartography_table': JsonMcdocBlockStatesCartographyTable,
  'minecraft:cartography_table': JsonMcdocBlockStatesCartographyTable,
  'carved_pumpkin': JsonMcdocBlockStatesCarvedPumpkin,
  'minecraft:carved_pumpkin': JsonMcdocBlockStatesCarvedPumpkin,
  'cauldron': JsonMcdocBlockStatesCauldron,
  'minecraft:cauldron': JsonMcdocBlockStatesCauldron,
  'cave_air': JsonMcdocBlockStatesCaveAir,
  'minecraft:cave_air': JsonMcdocBlockStatesCaveAir,
  'cave_vines': JsonMcdocBlockStatesCaveVines,
  'minecraft:cave_vines': JsonMcdocBlockStatesCaveVines,
  'cave_vines_plant': JsonMcdocBlockStatesCaveVinesPlant,
  'minecraft:cave_vines_plant': JsonMcdocBlockStatesCaveVinesPlant,
  'chain_command_block': JsonMcdocBlockStatesChainCommandBlock,
  'minecraft:chain_command_block': JsonMcdocBlockStatesChainCommandBlock,
  'cherry_button': JsonMcdocBlockStatesCherryButton,
  'minecraft:cherry_button': JsonMcdocBlockStatesCherryButton,
  'cherry_door': JsonMcdocBlockStatesCherryDoor,
  'minecraft:cherry_door': JsonMcdocBlockStatesCherryDoor,
  'cherry_fence': JsonMcdocBlockStatesCherryFence,
  'minecraft:cherry_fence': JsonMcdocBlockStatesCherryFence,
  'cherry_fence_gate': JsonMcdocBlockStatesCherryFenceGate,
  'minecraft:cherry_fence_gate': JsonMcdocBlockStatesCherryFenceGate,
  'cherry_hanging_sign': JsonMcdocBlockStatesCherryHangingSign,
  'minecraft:cherry_hanging_sign': JsonMcdocBlockStatesCherryHangingSign,
  'cherry_leaves': JsonMcdocBlockStatesCherryLeaves,
  'minecraft:cherry_leaves': JsonMcdocBlockStatesCherryLeaves,
  'cherry_log': JsonMcdocBlockStatesCherryLog,
  'minecraft:cherry_log': JsonMcdocBlockStatesCherryLog,
  'cherry_planks': JsonMcdocBlockStatesCherryPlanks,
  'minecraft:cherry_planks': JsonMcdocBlockStatesCherryPlanks,
  'cherry_pressure_plate': JsonMcdocBlockStatesCherryPressurePlate,
  'minecraft:cherry_pressure_plate': JsonMcdocBlockStatesCherryPressurePlate,
  'cherry_sapling': JsonMcdocBlockStatesCherrySapling,
  'minecraft:cherry_sapling': JsonMcdocBlockStatesCherrySapling,
  'cherry_shelf': JsonMcdocBlockStatesCherryShelf,
  'minecraft:cherry_shelf': JsonMcdocBlockStatesCherryShelf,
  'cherry_sign': JsonMcdocBlockStatesCherrySign,
  'minecraft:cherry_sign': JsonMcdocBlockStatesCherrySign,
  'cherry_slab': JsonMcdocBlockStatesCherrySlab,
  'minecraft:cherry_slab': JsonMcdocBlockStatesCherrySlab,
  'cherry_stairs': JsonMcdocBlockStatesCherryStairs,
  'minecraft:cherry_stairs': JsonMcdocBlockStatesCherryStairs,
  'cherry_trapdoor': JsonMcdocBlockStatesCherryTrapdoor,
  'minecraft:cherry_trapdoor': JsonMcdocBlockStatesCherryTrapdoor,
  'cherry_wall_hanging_sign': JsonMcdocBlockStatesCherryWallHangingSign,
  'minecraft:cherry_wall_hanging_sign': JsonMcdocBlockStatesCherryWallHangingSign,
  'cherry_wall_sign': JsonMcdocBlockStatesCherryWallSign,
  'minecraft:cherry_wall_sign': JsonMcdocBlockStatesCherryWallSign,
  'cherry_wood': JsonMcdocBlockStatesCherryWood,
  'minecraft:cherry_wood': JsonMcdocBlockStatesCherryWood,
  'chest': JsonMcdocBlockStatesChest,
  'minecraft:chest': JsonMcdocBlockStatesChest,
  'chipped_anvil': JsonMcdocBlockStatesChippedAnvil,
  'minecraft:chipped_anvil': JsonMcdocBlockStatesChippedAnvil,
  'chiseled_bookshelf': JsonMcdocBlockStatesChiseledBookshelf,
  'minecraft:chiseled_bookshelf': JsonMcdocBlockStatesChiseledBookshelf,
  'chiseled_cinnabar': JsonMcdocBlockStatesChiseledCinnabar,
  'minecraft:chiseled_cinnabar': JsonMcdocBlockStatesChiseledCinnabar,
  'chiseled_copper': JsonMcdocBlockStatesChiseledCopper,
  'minecraft:chiseled_copper': JsonMcdocBlockStatesChiseledCopper,
  'chiseled_deepslate': JsonMcdocBlockStatesChiseledDeepslate,
  'minecraft:chiseled_deepslate': JsonMcdocBlockStatesChiseledDeepslate,
  'chiseled_nether_bricks': JsonMcdocBlockStatesChiseledNetherBricks,
  'minecraft:chiseled_nether_bricks': JsonMcdocBlockStatesChiseledNetherBricks,
  'chiseled_polished_blackstone': JsonMcdocBlockStatesChiseledPolishedBlackstone,
  'minecraft:chiseled_polished_blackstone': JsonMcdocBlockStatesChiseledPolishedBlackstone,
  'chiseled_quartz_block': JsonMcdocBlockStatesChiseledQuartzBlock,
  'minecraft:chiseled_quartz_block': JsonMcdocBlockStatesChiseledQuartzBlock,
  'chiseled_red_sandstone': JsonMcdocBlockStatesChiseledRedSandstone,
  'minecraft:chiseled_red_sandstone': JsonMcdocBlockStatesChiseledRedSandstone,
  'chiseled_resin_bricks': JsonMcdocBlockStatesChiseledResinBricks,
  'minecraft:chiseled_resin_bricks': JsonMcdocBlockStatesChiseledResinBricks,
  'chiseled_sandstone': JsonMcdocBlockStatesChiseledSandstone,
  'minecraft:chiseled_sandstone': JsonMcdocBlockStatesChiseledSandstone,
  'chiseled_stone_bricks': JsonMcdocBlockStatesChiseledStoneBricks,
  'minecraft:chiseled_stone_bricks': JsonMcdocBlockStatesChiseledStoneBricks,
  'chiseled_sulfur': JsonMcdocBlockStatesChiseledSulfur,
  'minecraft:chiseled_sulfur': JsonMcdocBlockStatesChiseledSulfur,
  'chiseled_tuff': JsonMcdocBlockStatesChiseledTuff,
  'minecraft:chiseled_tuff': JsonMcdocBlockStatesChiseledTuff,
  'chiseled_tuff_bricks': JsonMcdocBlockStatesChiseledTuffBricks,
  'minecraft:chiseled_tuff_bricks': JsonMcdocBlockStatesChiseledTuffBricks,
  'chorus_flower': JsonMcdocBlockStatesChorusFlower,
  'minecraft:chorus_flower': JsonMcdocBlockStatesChorusFlower,
  'chorus_plant': JsonMcdocBlockStatesChorusPlant,
  'minecraft:chorus_plant': JsonMcdocBlockStatesChorusPlant,
  'cinnabar': JsonMcdocBlockStatesCinnabar,
  'minecraft:cinnabar': JsonMcdocBlockStatesCinnabar,
  'cinnabar_brick_slab': JsonMcdocBlockStatesCinnabarBrickSlab,
  'minecraft:cinnabar_brick_slab': JsonMcdocBlockStatesCinnabarBrickSlab,
  'cinnabar_brick_stairs': JsonMcdocBlockStatesCinnabarBrickStairs,
  'minecraft:cinnabar_brick_stairs': JsonMcdocBlockStatesCinnabarBrickStairs,
  'cinnabar_brick_wall': JsonMcdocBlockStatesCinnabarBrickWall,
  'minecraft:cinnabar_brick_wall': JsonMcdocBlockStatesCinnabarBrickWall,
  'cinnabar_bricks': JsonMcdocBlockStatesCinnabarBricks,
  'minecraft:cinnabar_bricks': JsonMcdocBlockStatesCinnabarBricks,
  'cinnabar_slab': JsonMcdocBlockStatesCinnabarSlab,
  'minecraft:cinnabar_slab': JsonMcdocBlockStatesCinnabarSlab,
  'cinnabar_stairs': JsonMcdocBlockStatesCinnabarStairs,
  'minecraft:cinnabar_stairs': JsonMcdocBlockStatesCinnabarStairs,
  'cinnabar_wall': JsonMcdocBlockStatesCinnabarWall,
  'minecraft:cinnabar_wall': JsonMcdocBlockStatesCinnabarWall,
  'clay': JsonMcdocBlockStatesClay,
  'minecraft:clay': JsonMcdocBlockStatesClay,
  'closed_eyeblossom': JsonMcdocBlockStatesClosedEyeblossom,
  'minecraft:closed_eyeblossom': JsonMcdocBlockStatesClosedEyeblossom,
  'coal_block': JsonMcdocBlockStatesCoalBlock,
  'minecraft:coal_block': JsonMcdocBlockStatesCoalBlock,
  'coal_ore': JsonMcdocBlockStatesCoalOre,
  'minecraft:coal_ore': JsonMcdocBlockStatesCoalOre,
  'coarse_dirt': JsonMcdocBlockStatesCoarseDirt,
  'minecraft:coarse_dirt': JsonMcdocBlockStatesCoarseDirt,
  'cobbled_deepslate': JsonMcdocBlockStatesCobbledDeepslate,
  'minecraft:cobbled_deepslate': JsonMcdocBlockStatesCobbledDeepslate,
  'cobbled_deepslate_slab': JsonMcdocBlockStatesCobbledDeepslateSlab,
  'minecraft:cobbled_deepslate_slab': JsonMcdocBlockStatesCobbledDeepslateSlab,
  'cobbled_deepslate_stairs': JsonMcdocBlockStatesCobbledDeepslateStairs,
  'minecraft:cobbled_deepslate_stairs': JsonMcdocBlockStatesCobbledDeepslateStairs,
  'cobbled_deepslate_wall': JsonMcdocBlockStatesCobbledDeepslateWall,
  'minecraft:cobbled_deepslate_wall': JsonMcdocBlockStatesCobbledDeepslateWall,
  'cobblestone': JsonMcdocBlockStatesCobblestone,
  'minecraft:cobblestone': JsonMcdocBlockStatesCobblestone,
  'cobblestone_slab': JsonMcdocBlockStatesCobblestoneSlab,
  'minecraft:cobblestone_slab': JsonMcdocBlockStatesCobblestoneSlab,
  'cobblestone_stairs': JsonMcdocBlockStatesCobblestoneStairs,
  'minecraft:cobblestone_stairs': JsonMcdocBlockStatesCobblestoneStairs,
  'cobblestone_wall': JsonMcdocBlockStatesCobblestoneWall,
  'minecraft:cobblestone_wall': JsonMcdocBlockStatesCobblestoneWall,
  'cobweb': JsonMcdocBlockStatesCobweb,
  'minecraft:cobweb': JsonMcdocBlockStatesCobweb,
  'cocoa': JsonMcdocBlockStatesCocoa,
  'minecraft:cocoa': JsonMcdocBlockStatesCocoa,
  'command_block': JsonMcdocBlockStatesCommandBlock,
  'minecraft:command_block': JsonMcdocBlockStatesCommandBlock,
  'comparator': JsonMcdocBlockStatesComparator,
  'minecraft:comparator': JsonMcdocBlockStatesComparator,
  'composter': JsonMcdocBlockStatesComposter,
  'minecraft:composter': JsonMcdocBlockStatesComposter,
  'conduit': JsonMcdocBlockStatesConduit,
  'minecraft:conduit': JsonMcdocBlockStatesConduit,
  'copper_bars': JsonMcdocBlockStatesCopperBars,
  'minecraft:copper_bars': JsonMcdocBlockStatesCopperBars,
  'copper_block': JsonMcdocBlockStatesCopperBlock,
  'minecraft:copper_block': JsonMcdocBlockStatesCopperBlock,
  'copper_bulb': JsonMcdocBlockStatesCopperBulb,
  'minecraft:copper_bulb': JsonMcdocBlockStatesCopperBulb,
  'copper_chain': JsonMcdocBlockStatesCopperChain,
  'minecraft:copper_chain': JsonMcdocBlockStatesCopperChain,
  'copper_chest': JsonMcdocBlockStatesCopperChest,
  'minecraft:copper_chest': JsonMcdocBlockStatesCopperChest,
  'copper_door': JsonMcdocBlockStatesCopperDoor,
  'minecraft:copper_door': JsonMcdocBlockStatesCopperDoor,
  'copper_golem_statue': JsonMcdocBlockStatesCopperGolemStatue,
  'minecraft:copper_golem_statue': JsonMcdocBlockStatesCopperGolemStatue,
  'copper_grate': JsonMcdocBlockStatesCopperGrate,
  'minecraft:copper_grate': JsonMcdocBlockStatesCopperGrate,
  'copper_lantern': JsonMcdocBlockStatesCopperLantern,
  'minecraft:copper_lantern': JsonMcdocBlockStatesCopperLantern,
  'copper_ore': JsonMcdocBlockStatesCopperOre,
  'minecraft:copper_ore': JsonMcdocBlockStatesCopperOre,
  'copper_torch': JsonMcdocBlockStatesCopperTorch,
  'minecraft:copper_torch': JsonMcdocBlockStatesCopperTorch,
  'copper_trapdoor': JsonMcdocBlockStatesCopperTrapdoor,
  'minecraft:copper_trapdoor': JsonMcdocBlockStatesCopperTrapdoor,
  'copper_wall_torch': JsonMcdocBlockStatesCopperWallTorch,
  'minecraft:copper_wall_torch': JsonMcdocBlockStatesCopperWallTorch,
  'cornflower': JsonMcdocBlockStatesCornflower,
  'minecraft:cornflower': JsonMcdocBlockStatesCornflower,
  'cracked_deepslate_bricks': JsonMcdocBlockStatesCrackedDeepslateBricks,
  'minecraft:cracked_deepslate_bricks': JsonMcdocBlockStatesCrackedDeepslateBricks,
  'cracked_deepslate_tiles': JsonMcdocBlockStatesCrackedDeepslateTiles,
  'minecraft:cracked_deepslate_tiles': JsonMcdocBlockStatesCrackedDeepslateTiles,
  'cracked_nether_bricks': JsonMcdocBlockStatesCrackedNetherBricks,
  'minecraft:cracked_nether_bricks': JsonMcdocBlockStatesCrackedNetherBricks,
  'cracked_polished_blackstone_bricks': JsonMcdocBlockStatesCrackedPolishedBlackstoneBricks,
  'minecraft:cracked_polished_blackstone_bricks': JsonMcdocBlockStatesCrackedPolishedBlackstoneBricks,
  'cracked_stone_bricks': JsonMcdocBlockStatesCrackedStoneBricks,
  'minecraft:cracked_stone_bricks': JsonMcdocBlockStatesCrackedStoneBricks,
  'crafter': JsonMcdocBlockStatesCrafter,
  'minecraft:crafter': JsonMcdocBlockStatesCrafter,
  'crafting_table': JsonMcdocBlockStatesCraftingTable,
  'minecraft:crafting_table': JsonMcdocBlockStatesCraftingTable,
  'creaking_heart': JsonMcdocBlockStatesCreakingHeart,
  'minecraft:creaking_heart': JsonMcdocBlockStatesCreakingHeart,
  'creeper_head': JsonMcdocBlockStatesCreeperHead,
  'minecraft:creeper_head': JsonMcdocBlockStatesCreeperHead,
  'creeper_wall_head': JsonMcdocBlockStatesCreeperWallHead,
  'minecraft:creeper_wall_head': JsonMcdocBlockStatesCreeperWallHead,
  'crimson_button': JsonMcdocBlockStatesCrimsonButton,
  'minecraft:crimson_button': JsonMcdocBlockStatesCrimsonButton,
  'crimson_door': JsonMcdocBlockStatesCrimsonDoor,
  'minecraft:crimson_door': JsonMcdocBlockStatesCrimsonDoor,
  'crimson_fence': JsonMcdocBlockStatesCrimsonFence,
  'minecraft:crimson_fence': JsonMcdocBlockStatesCrimsonFence,
  'crimson_fence_gate': JsonMcdocBlockStatesCrimsonFenceGate,
  'minecraft:crimson_fence_gate': JsonMcdocBlockStatesCrimsonFenceGate,
  'crimson_fungus': JsonMcdocBlockStatesCrimsonFungus,
  'minecraft:crimson_fungus': JsonMcdocBlockStatesCrimsonFungus,
  'crimson_hanging_sign': JsonMcdocBlockStatesCrimsonHangingSign,
  'minecraft:crimson_hanging_sign': JsonMcdocBlockStatesCrimsonHangingSign,
  'crimson_hyphae': JsonMcdocBlockStatesCrimsonHyphae,
  'minecraft:crimson_hyphae': JsonMcdocBlockStatesCrimsonHyphae,
  'crimson_nylium': JsonMcdocBlockStatesCrimsonNylium,
  'minecraft:crimson_nylium': JsonMcdocBlockStatesCrimsonNylium,
  'crimson_planks': JsonMcdocBlockStatesCrimsonPlanks,
  'minecraft:crimson_planks': JsonMcdocBlockStatesCrimsonPlanks,
  'crimson_pressure_plate': JsonMcdocBlockStatesCrimsonPressurePlate,
  'minecraft:crimson_pressure_plate': JsonMcdocBlockStatesCrimsonPressurePlate,
  'crimson_roots': JsonMcdocBlockStatesCrimsonRoots,
  'minecraft:crimson_roots': JsonMcdocBlockStatesCrimsonRoots,
  'crimson_shelf': JsonMcdocBlockStatesCrimsonShelf,
  'minecraft:crimson_shelf': JsonMcdocBlockStatesCrimsonShelf,
  'crimson_sign': JsonMcdocBlockStatesCrimsonSign,
  'minecraft:crimson_sign': JsonMcdocBlockStatesCrimsonSign,
  'crimson_slab': JsonMcdocBlockStatesCrimsonSlab,
  'minecraft:crimson_slab': JsonMcdocBlockStatesCrimsonSlab,
  'crimson_stairs': JsonMcdocBlockStatesCrimsonStairs,
  'minecraft:crimson_stairs': JsonMcdocBlockStatesCrimsonStairs,
  'crimson_stem': JsonMcdocBlockStatesCrimsonStem,
  'minecraft:crimson_stem': JsonMcdocBlockStatesCrimsonStem,
  'crimson_trapdoor': JsonMcdocBlockStatesCrimsonTrapdoor,
  'minecraft:crimson_trapdoor': JsonMcdocBlockStatesCrimsonTrapdoor,
  'crimson_wall_hanging_sign': JsonMcdocBlockStatesCrimsonWallHangingSign,
  'minecraft:crimson_wall_hanging_sign': JsonMcdocBlockStatesCrimsonWallHangingSign,
  'crimson_wall_sign': JsonMcdocBlockStatesCrimsonWallSign,
  'minecraft:crimson_wall_sign': JsonMcdocBlockStatesCrimsonWallSign,
  'crying_obsidian': JsonMcdocBlockStatesCryingObsidian,
  'minecraft:crying_obsidian': JsonMcdocBlockStatesCryingObsidian,
  'cut_copper': JsonMcdocBlockStatesCutCopper,
  'minecraft:cut_copper': JsonMcdocBlockStatesCutCopper,
  'cut_copper_slab': JsonMcdocBlockStatesCutCopperSlab,
  'minecraft:cut_copper_slab': JsonMcdocBlockStatesCutCopperSlab,
  'cut_copper_stairs': JsonMcdocBlockStatesCutCopperStairs,
  'minecraft:cut_copper_stairs': JsonMcdocBlockStatesCutCopperStairs,
  'cut_red_sandstone': JsonMcdocBlockStatesCutRedSandstone,
  'minecraft:cut_red_sandstone': JsonMcdocBlockStatesCutRedSandstone,
  'cut_red_sandstone_slab': JsonMcdocBlockStatesCutRedSandstoneSlab,
  'minecraft:cut_red_sandstone_slab': JsonMcdocBlockStatesCutRedSandstoneSlab,
  'cut_sandstone': JsonMcdocBlockStatesCutSandstone,
  'minecraft:cut_sandstone': JsonMcdocBlockStatesCutSandstone,
  'cut_sandstone_slab': JsonMcdocBlockStatesCutSandstoneSlab,
  'minecraft:cut_sandstone_slab': JsonMcdocBlockStatesCutSandstoneSlab,
  'cyan_banner': JsonMcdocBlockStatesCyanBanner,
  'minecraft:cyan_banner': JsonMcdocBlockStatesCyanBanner,
  'cyan_bed': JsonMcdocBlockStatesCyanBed,
  'minecraft:cyan_bed': JsonMcdocBlockStatesCyanBed,
  'cyan_candle': JsonMcdocBlockStatesCyanCandle,
  'minecraft:cyan_candle': JsonMcdocBlockStatesCyanCandle,
  'cyan_candle_cake': JsonMcdocBlockStatesCyanCandleCake,
  'minecraft:cyan_candle_cake': JsonMcdocBlockStatesCyanCandleCake,
  'cyan_carpet': JsonMcdocBlockStatesCyanCarpet,
  'minecraft:cyan_carpet': JsonMcdocBlockStatesCyanCarpet,
  'cyan_concrete': JsonMcdocBlockStatesCyanConcrete,
  'minecraft:cyan_concrete': JsonMcdocBlockStatesCyanConcrete,
  'cyan_concrete_powder': JsonMcdocBlockStatesCyanConcretePowder,
  'minecraft:cyan_concrete_powder': JsonMcdocBlockStatesCyanConcretePowder,
  'cyan_concrete_slab': JsonMcdocBlockStatesCyanConcreteSlab,
  'minecraft:cyan_concrete_slab': JsonMcdocBlockStatesCyanConcreteSlab,
  'cyan_concrete_stairs': JsonMcdocBlockStatesCyanConcreteStairs,
  'minecraft:cyan_concrete_stairs': JsonMcdocBlockStatesCyanConcreteStairs,
  'cyan_glazed_terracotta': JsonMcdocBlockStatesCyanGlazedTerracotta,
  'minecraft:cyan_glazed_terracotta': JsonMcdocBlockStatesCyanGlazedTerracotta,
  'cyan_shulker_box': JsonMcdocBlockStatesCyanShulkerBox,
  'minecraft:cyan_shulker_box': JsonMcdocBlockStatesCyanShulkerBox,
  'cyan_stained_glass': JsonMcdocBlockStatesCyanStainedGlass,
  'minecraft:cyan_stained_glass': JsonMcdocBlockStatesCyanStainedGlass,
  'cyan_stained_glass_pane': JsonMcdocBlockStatesCyanStainedGlassPane,
  'minecraft:cyan_stained_glass_pane': JsonMcdocBlockStatesCyanStainedGlassPane,
  'cyan_terracotta': JsonMcdocBlockStatesCyanTerracotta,
  'minecraft:cyan_terracotta': JsonMcdocBlockStatesCyanTerracotta,
  'cyan_wall_banner': JsonMcdocBlockStatesCyanWallBanner,
  'minecraft:cyan_wall_banner': JsonMcdocBlockStatesCyanWallBanner,
  'cyan_wool': JsonMcdocBlockStatesCyanWool,
  'minecraft:cyan_wool': JsonMcdocBlockStatesCyanWool,
  'cyan_wool_slab': JsonMcdocBlockStatesCyanWoolSlab,
  'minecraft:cyan_wool_slab': JsonMcdocBlockStatesCyanWoolSlab,
  'cyan_wool_stairs': JsonMcdocBlockStatesCyanWoolStairs,
  'minecraft:cyan_wool_stairs': JsonMcdocBlockStatesCyanWoolStairs,
  'damaged_anvil': JsonMcdocBlockStatesDamagedAnvil,
  'minecraft:damaged_anvil': JsonMcdocBlockStatesDamagedAnvil,
  'dandelion': JsonMcdocBlockStatesDandelion,
  'minecraft:dandelion': JsonMcdocBlockStatesDandelion,
  'dark_oak_button': JsonMcdocBlockStatesDarkOakButton,
  'minecraft:dark_oak_button': JsonMcdocBlockStatesDarkOakButton,
  'dark_oak_door': JsonMcdocBlockStatesDarkOakDoor,
  'minecraft:dark_oak_door': JsonMcdocBlockStatesDarkOakDoor,
  'dark_oak_fence': JsonMcdocBlockStatesDarkOakFence,
  'minecraft:dark_oak_fence': JsonMcdocBlockStatesDarkOakFence,
  'dark_oak_fence_gate': JsonMcdocBlockStatesDarkOakFenceGate,
  'minecraft:dark_oak_fence_gate': JsonMcdocBlockStatesDarkOakFenceGate,
  'dark_oak_hanging_sign': JsonMcdocBlockStatesDarkOakHangingSign,
  'minecraft:dark_oak_hanging_sign': JsonMcdocBlockStatesDarkOakHangingSign,
  'dark_oak_leaves': JsonMcdocBlockStatesDarkOakLeaves,
  'minecraft:dark_oak_leaves': JsonMcdocBlockStatesDarkOakLeaves,
  'dark_oak_log': JsonMcdocBlockStatesDarkOakLog,
  'minecraft:dark_oak_log': JsonMcdocBlockStatesDarkOakLog,
  'dark_oak_planks': JsonMcdocBlockStatesDarkOakPlanks,
  'minecraft:dark_oak_planks': JsonMcdocBlockStatesDarkOakPlanks,
  'dark_oak_pressure_plate': JsonMcdocBlockStatesDarkOakPressurePlate,
  'minecraft:dark_oak_pressure_plate': JsonMcdocBlockStatesDarkOakPressurePlate,
  'dark_oak_sapling': JsonMcdocBlockStatesDarkOakSapling,
  'minecraft:dark_oak_sapling': JsonMcdocBlockStatesDarkOakSapling,
  'dark_oak_shelf': JsonMcdocBlockStatesDarkOakShelf,
  'minecraft:dark_oak_shelf': JsonMcdocBlockStatesDarkOakShelf,
  'dark_oak_sign': JsonMcdocBlockStatesDarkOakSign,
  'minecraft:dark_oak_sign': JsonMcdocBlockStatesDarkOakSign,
  'dark_oak_slab': JsonMcdocBlockStatesDarkOakSlab,
  'minecraft:dark_oak_slab': JsonMcdocBlockStatesDarkOakSlab,
  'dark_oak_stairs': JsonMcdocBlockStatesDarkOakStairs,
  'minecraft:dark_oak_stairs': JsonMcdocBlockStatesDarkOakStairs,
  'dark_oak_trapdoor': JsonMcdocBlockStatesDarkOakTrapdoor,
  'minecraft:dark_oak_trapdoor': JsonMcdocBlockStatesDarkOakTrapdoor,
  'dark_oak_wall_hanging_sign': JsonMcdocBlockStatesDarkOakWallHangingSign,
  'minecraft:dark_oak_wall_hanging_sign': JsonMcdocBlockStatesDarkOakWallHangingSign,
  'dark_oak_wall_sign': JsonMcdocBlockStatesDarkOakWallSign,
  'minecraft:dark_oak_wall_sign': JsonMcdocBlockStatesDarkOakWallSign,
  'dark_oak_wood': JsonMcdocBlockStatesDarkOakWood,
  'minecraft:dark_oak_wood': JsonMcdocBlockStatesDarkOakWood,
  'dark_prismarine': JsonMcdocBlockStatesDarkPrismarine,
  'minecraft:dark_prismarine': JsonMcdocBlockStatesDarkPrismarine,
  'dark_prismarine_slab': JsonMcdocBlockStatesDarkPrismarineSlab,
  'minecraft:dark_prismarine_slab': JsonMcdocBlockStatesDarkPrismarineSlab,
  'dark_prismarine_stairs': JsonMcdocBlockStatesDarkPrismarineStairs,
  'minecraft:dark_prismarine_stairs': JsonMcdocBlockStatesDarkPrismarineStairs,
  'daylight_detector': JsonMcdocBlockStatesDaylightDetector,
  'minecraft:daylight_detector': JsonMcdocBlockStatesDaylightDetector,
  'dead_brain_coral': JsonMcdocBlockStatesDeadBrainCoral,
  'minecraft:dead_brain_coral': JsonMcdocBlockStatesDeadBrainCoral,
  'dead_brain_coral_block': JsonMcdocBlockStatesDeadBrainCoralBlock,
  'minecraft:dead_brain_coral_block': JsonMcdocBlockStatesDeadBrainCoralBlock,
  'dead_brain_coral_fan': JsonMcdocBlockStatesDeadBrainCoralFan,
  'minecraft:dead_brain_coral_fan': JsonMcdocBlockStatesDeadBrainCoralFan,
  'dead_brain_coral_wall_fan': JsonMcdocBlockStatesDeadBrainCoralWallFan,
  'minecraft:dead_brain_coral_wall_fan': JsonMcdocBlockStatesDeadBrainCoralWallFan,
  'dead_bubble_coral': JsonMcdocBlockStatesDeadBubbleCoral,
  'minecraft:dead_bubble_coral': JsonMcdocBlockStatesDeadBubbleCoral,
  'dead_bubble_coral_block': JsonMcdocBlockStatesDeadBubbleCoralBlock,
  'minecraft:dead_bubble_coral_block': JsonMcdocBlockStatesDeadBubbleCoralBlock,
  'dead_bubble_coral_fan': JsonMcdocBlockStatesDeadBubbleCoralFan,
  'minecraft:dead_bubble_coral_fan': JsonMcdocBlockStatesDeadBubbleCoralFan,
  'dead_bubble_coral_wall_fan': JsonMcdocBlockStatesDeadBubbleCoralWallFan,
  'minecraft:dead_bubble_coral_wall_fan': JsonMcdocBlockStatesDeadBubbleCoralWallFan,
  'dead_bush': JsonMcdocBlockStatesDeadBush,
  'minecraft:dead_bush': JsonMcdocBlockStatesDeadBush,
  'dead_fire_coral': JsonMcdocBlockStatesDeadFireCoral,
  'minecraft:dead_fire_coral': JsonMcdocBlockStatesDeadFireCoral,
  'dead_fire_coral_block': JsonMcdocBlockStatesDeadFireCoralBlock,
  'minecraft:dead_fire_coral_block': JsonMcdocBlockStatesDeadFireCoralBlock,
  'dead_fire_coral_fan': JsonMcdocBlockStatesDeadFireCoralFan,
  'minecraft:dead_fire_coral_fan': JsonMcdocBlockStatesDeadFireCoralFan,
  'dead_fire_coral_wall_fan': JsonMcdocBlockStatesDeadFireCoralWallFan,
  'minecraft:dead_fire_coral_wall_fan': JsonMcdocBlockStatesDeadFireCoralWallFan,
  'dead_horn_coral': JsonMcdocBlockStatesDeadHornCoral,
  'minecraft:dead_horn_coral': JsonMcdocBlockStatesDeadHornCoral,
  'dead_horn_coral_block': JsonMcdocBlockStatesDeadHornCoralBlock,
  'minecraft:dead_horn_coral_block': JsonMcdocBlockStatesDeadHornCoralBlock,
  'dead_horn_coral_fan': JsonMcdocBlockStatesDeadHornCoralFan,
  'minecraft:dead_horn_coral_fan': JsonMcdocBlockStatesDeadHornCoralFan,
  'dead_horn_coral_wall_fan': JsonMcdocBlockStatesDeadHornCoralWallFan,
  'minecraft:dead_horn_coral_wall_fan': JsonMcdocBlockStatesDeadHornCoralWallFan,
  'dead_tube_coral': JsonMcdocBlockStatesDeadTubeCoral,
  'minecraft:dead_tube_coral': JsonMcdocBlockStatesDeadTubeCoral,
  'dead_tube_coral_block': JsonMcdocBlockStatesDeadTubeCoralBlock,
  'minecraft:dead_tube_coral_block': JsonMcdocBlockStatesDeadTubeCoralBlock,
  'dead_tube_coral_fan': JsonMcdocBlockStatesDeadTubeCoralFan,
  'minecraft:dead_tube_coral_fan': JsonMcdocBlockStatesDeadTubeCoralFan,
  'dead_tube_coral_wall_fan': JsonMcdocBlockStatesDeadTubeCoralWallFan,
  'minecraft:dead_tube_coral_wall_fan': JsonMcdocBlockStatesDeadTubeCoralWallFan,
  'decorated_pot': JsonMcdocBlockStatesDecoratedPot,
  'minecraft:decorated_pot': JsonMcdocBlockStatesDecoratedPot,
  'deepslate': JsonMcdocBlockStatesDeepslate,
  'minecraft:deepslate': JsonMcdocBlockStatesDeepslate,
  'deepslate_brick_slab': JsonMcdocBlockStatesDeepslateBrickSlab,
  'minecraft:deepslate_brick_slab': JsonMcdocBlockStatesDeepslateBrickSlab,
  'deepslate_brick_stairs': JsonMcdocBlockStatesDeepslateBrickStairs,
  'minecraft:deepslate_brick_stairs': JsonMcdocBlockStatesDeepslateBrickStairs,
  'deepslate_brick_wall': JsonMcdocBlockStatesDeepslateBrickWall,
  'minecraft:deepslate_brick_wall': JsonMcdocBlockStatesDeepslateBrickWall,
  'deepslate_bricks': JsonMcdocBlockStatesDeepslateBricks,
  'minecraft:deepslate_bricks': JsonMcdocBlockStatesDeepslateBricks,
  'deepslate_coal_ore': JsonMcdocBlockStatesDeepslateCoalOre,
  'minecraft:deepslate_coal_ore': JsonMcdocBlockStatesDeepslateCoalOre,
  'deepslate_copper_ore': JsonMcdocBlockStatesDeepslateCopperOre,
  'minecraft:deepslate_copper_ore': JsonMcdocBlockStatesDeepslateCopperOre,
  'deepslate_diamond_ore': JsonMcdocBlockStatesDeepslateDiamondOre,
  'minecraft:deepslate_diamond_ore': JsonMcdocBlockStatesDeepslateDiamondOre,
  'deepslate_emerald_ore': JsonMcdocBlockStatesDeepslateEmeraldOre,
  'minecraft:deepslate_emerald_ore': JsonMcdocBlockStatesDeepslateEmeraldOre,
  'deepslate_gold_ore': JsonMcdocBlockStatesDeepslateGoldOre,
  'minecraft:deepslate_gold_ore': JsonMcdocBlockStatesDeepslateGoldOre,
  'deepslate_iron_ore': JsonMcdocBlockStatesDeepslateIronOre,
  'minecraft:deepslate_iron_ore': JsonMcdocBlockStatesDeepslateIronOre,
  'deepslate_lapis_ore': JsonMcdocBlockStatesDeepslateLapisOre,
  'minecraft:deepslate_lapis_ore': JsonMcdocBlockStatesDeepslateLapisOre,
  'deepslate_redstone_ore': JsonMcdocBlockStatesDeepslateRedstoneOre,
  'minecraft:deepslate_redstone_ore': JsonMcdocBlockStatesDeepslateRedstoneOre,
  'deepslate_tile_slab': JsonMcdocBlockStatesDeepslateTileSlab,
  'minecraft:deepslate_tile_slab': JsonMcdocBlockStatesDeepslateTileSlab,
  'deepslate_tile_stairs': JsonMcdocBlockStatesDeepslateTileStairs,
  'minecraft:deepslate_tile_stairs': JsonMcdocBlockStatesDeepslateTileStairs,
  'deepslate_tile_wall': JsonMcdocBlockStatesDeepslateTileWall,
  'minecraft:deepslate_tile_wall': JsonMcdocBlockStatesDeepslateTileWall,
  'deepslate_tiles': JsonMcdocBlockStatesDeepslateTiles,
  'minecraft:deepslate_tiles': JsonMcdocBlockStatesDeepslateTiles,
  'detector_rail': JsonMcdocBlockStatesDetectorRail,
  'minecraft:detector_rail': JsonMcdocBlockStatesDetectorRail,
  'diamond_block': JsonMcdocBlockStatesDiamondBlock,
  'minecraft:diamond_block': JsonMcdocBlockStatesDiamondBlock,
  'diamond_ore': JsonMcdocBlockStatesDiamondOre,
  'minecraft:diamond_ore': JsonMcdocBlockStatesDiamondOre,
  'diorite': JsonMcdocBlockStatesDiorite,
  'minecraft:diorite': JsonMcdocBlockStatesDiorite,
  'diorite_slab': JsonMcdocBlockStatesDioriteSlab,
  'minecraft:diorite_slab': JsonMcdocBlockStatesDioriteSlab,
  'diorite_stairs': JsonMcdocBlockStatesDioriteStairs,
  'minecraft:diorite_stairs': JsonMcdocBlockStatesDioriteStairs,
  'diorite_wall': JsonMcdocBlockStatesDioriteWall,
  'minecraft:diorite_wall': JsonMcdocBlockStatesDioriteWall,
  'dirt': JsonMcdocBlockStatesDirt,
  'minecraft:dirt': JsonMcdocBlockStatesDirt,
  'dirt_path': JsonMcdocBlockStatesDirtPath,
  'minecraft:dirt_path': JsonMcdocBlockStatesDirtPath,
  'dispenser': JsonMcdocBlockStatesDispenser,
  'minecraft:dispenser': JsonMcdocBlockStatesDispenser,
  'dragon_egg': JsonMcdocBlockStatesDragonEgg,
  'minecraft:dragon_egg': JsonMcdocBlockStatesDragonEgg,
  'dragon_head': JsonMcdocBlockStatesDragonHead,
  'minecraft:dragon_head': JsonMcdocBlockStatesDragonHead,
  'dragon_wall_head': JsonMcdocBlockStatesDragonWallHead,
  'minecraft:dragon_wall_head': JsonMcdocBlockStatesDragonWallHead,
  'dried_ghast': JsonMcdocBlockStatesDriedGhast,
  'minecraft:dried_ghast': JsonMcdocBlockStatesDriedGhast,
  'dried_kelp_block': JsonMcdocBlockStatesDriedKelpBlock,
  'minecraft:dried_kelp_block': JsonMcdocBlockStatesDriedKelpBlock,
  'dripstone_block': JsonMcdocBlockStatesDripstoneBlock,
  'minecraft:dripstone_block': JsonMcdocBlockStatesDripstoneBlock,
  'dropper': JsonMcdocBlockStatesDropper,
  'minecraft:dropper': JsonMcdocBlockStatesDropper,
  'emerald_block': JsonMcdocBlockStatesEmeraldBlock,
  'minecraft:emerald_block': JsonMcdocBlockStatesEmeraldBlock,
  'emerald_ore': JsonMcdocBlockStatesEmeraldOre,
  'minecraft:emerald_ore': JsonMcdocBlockStatesEmeraldOre,
  'enchanting_table': JsonMcdocBlockStatesEnchantingTable,
  'minecraft:enchanting_table': JsonMcdocBlockStatesEnchantingTable,
  'end_gateway': JsonMcdocBlockStatesEndGateway,
  'minecraft:end_gateway': JsonMcdocBlockStatesEndGateway,
  'end_portal': JsonMcdocBlockStatesEndPortal,
  'minecraft:end_portal': JsonMcdocBlockStatesEndPortal,
  'end_portal_frame': JsonMcdocBlockStatesEndPortalFrame,
  'minecraft:end_portal_frame': JsonMcdocBlockStatesEndPortalFrame,
  'end_rod': JsonMcdocBlockStatesEndRod,
  'minecraft:end_rod': JsonMcdocBlockStatesEndRod,
  'end_stone': JsonMcdocBlockStatesEndStone,
  'minecraft:end_stone': JsonMcdocBlockStatesEndStone,
  'end_stone_brick_slab': JsonMcdocBlockStatesEndStoneBrickSlab,
  'minecraft:end_stone_brick_slab': JsonMcdocBlockStatesEndStoneBrickSlab,
  'end_stone_brick_stairs': JsonMcdocBlockStatesEndStoneBrickStairs,
  'minecraft:end_stone_brick_stairs': JsonMcdocBlockStatesEndStoneBrickStairs,
  'end_stone_brick_wall': JsonMcdocBlockStatesEndStoneBrickWall,
  'minecraft:end_stone_brick_wall': JsonMcdocBlockStatesEndStoneBrickWall,
  'end_stone_bricks': JsonMcdocBlockStatesEndStoneBricks,
  'minecraft:end_stone_bricks': JsonMcdocBlockStatesEndStoneBricks,
  'ender_chest': JsonMcdocBlockStatesEnderChest,
  'minecraft:ender_chest': JsonMcdocBlockStatesEnderChest,
  'exposed_chiseled_copper': JsonMcdocBlockStatesExposedChiseledCopper,
  'minecraft:exposed_chiseled_copper': JsonMcdocBlockStatesExposedChiseledCopper,
  'exposed_copper': JsonMcdocBlockStatesExposedCopper,
  'minecraft:exposed_copper': JsonMcdocBlockStatesExposedCopper,
  'exposed_copper_bars': JsonMcdocBlockStatesExposedCopperBars,
  'minecraft:exposed_copper_bars': JsonMcdocBlockStatesExposedCopperBars,
  'exposed_copper_bulb': JsonMcdocBlockStatesExposedCopperBulb,
  'minecraft:exposed_copper_bulb': JsonMcdocBlockStatesExposedCopperBulb,
  'exposed_copper_chain': JsonMcdocBlockStatesExposedCopperChain,
  'minecraft:exposed_copper_chain': JsonMcdocBlockStatesExposedCopperChain,
  'exposed_copper_chest': JsonMcdocBlockStatesExposedCopperChest,
  'minecraft:exposed_copper_chest': JsonMcdocBlockStatesExposedCopperChest,
  'exposed_copper_door': JsonMcdocBlockStatesExposedCopperDoor,
  'minecraft:exposed_copper_door': JsonMcdocBlockStatesExposedCopperDoor,
  'exposed_copper_golem_statue': JsonMcdocBlockStatesExposedCopperGolemStatue,
  'minecraft:exposed_copper_golem_statue': JsonMcdocBlockStatesExposedCopperGolemStatue,
  'exposed_copper_grate': JsonMcdocBlockStatesExposedCopperGrate,
  'minecraft:exposed_copper_grate': JsonMcdocBlockStatesExposedCopperGrate,
  'exposed_copper_lantern': JsonMcdocBlockStatesExposedCopperLantern,
  'minecraft:exposed_copper_lantern': JsonMcdocBlockStatesExposedCopperLantern,
  'exposed_copper_trapdoor': JsonMcdocBlockStatesExposedCopperTrapdoor,
  'minecraft:exposed_copper_trapdoor': JsonMcdocBlockStatesExposedCopperTrapdoor,
  'exposed_cut_copper': JsonMcdocBlockStatesExposedCutCopper,
  'minecraft:exposed_cut_copper': JsonMcdocBlockStatesExposedCutCopper,
  'exposed_cut_copper_slab': JsonMcdocBlockStatesExposedCutCopperSlab,
  'minecraft:exposed_cut_copper_slab': JsonMcdocBlockStatesExposedCutCopperSlab,
  'exposed_cut_copper_stairs': JsonMcdocBlockStatesExposedCutCopperStairs,
  'minecraft:exposed_cut_copper_stairs': JsonMcdocBlockStatesExposedCutCopperStairs,
  'exposed_lightning_rod': JsonMcdocBlockStatesExposedLightningRod,
  'minecraft:exposed_lightning_rod': JsonMcdocBlockStatesExposedLightningRod,
  'farmland': JsonMcdocBlockStatesFarmland,
  'minecraft:farmland': JsonMcdocBlockStatesFarmland,
  'fern': JsonMcdocBlockStatesFern,
  'minecraft:fern': JsonMcdocBlockStatesFern,
  'fire': JsonMcdocBlockStatesFire,
  'minecraft:fire': JsonMcdocBlockStatesFire,
  'fire_coral': JsonMcdocBlockStatesFireCoral,
  'minecraft:fire_coral': JsonMcdocBlockStatesFireCoral,
  'fire_coral_block': JsonMcdocBlockStatesFireCoralBlock,
  'minecraft:fire_coral_block': JsonMcdocBlockStatesFireCoralBlock,
  'fire_coral_fan': JsonMcdocBlockStatesFireCoralFan,
  'minecraft:fire_coral_fan': JsonMcdocBlockStatesFireCoralFan,
  'fire_coral_wall_fan': JsonMcdocBlockStatesFireCoralWallFan,
  'minecraft:fire_coral_wall_fan': JsonMcdocBlockStatesFireCoralWallFan,
  'firefly_bush': JsonMcdocBlockStatesFireflyBush,
  'minecraft:firefly_bush': JsonMcdocBlockStatesFireflyBush,
  'fletching_table': JsonMcdocBlockStatesFletchingTable,
  'minecraft:fletching_table': JsonMcdocBlockStatesFletchingTable,
  'flower_pot': JsonMcdocBlockStatesFlowerPot,
  'minecraft:flower_pot': JsonMcdocBlockStatesFlowerPot,
  'flowering_azalea': JsonMcdocBlockStatesFloweringAzalea,
  'minecraft:flowering_azalea': JsonMcdocBlockStatesFloweringAzalea,
  'flowering_azalea_leaves': JsonMcdocBlockStatesFloweringAzaleaLeaves,
  'minecraft:flowering_azalea_leaves': JsonMcdocBlockStatesFloweringAzaleaLeaves,
  'frogspawn': JsonMcdocBlockStatesFrogspawn,
  'minecraft:frogspawn': JsonMcdocBlockStatesFrogspawn,
  'frosted_ice': JsonMcdocBlockStatesFrostedIce,
  'minecraft:frosted_ice': JsonMcdocBlockStatesFrostedIce,
  'furnace': JsonMcdocBlockStatesFurnace,
  'minecraft:furnace': JsonMcdocBlockStatesFurnace,
  'gilded_blackstone': JsonMcdocBlockStatesGildedBlackstone,
  'minecraft:gilded_blackstone': JsonMcdocBlockStatesGildedBlackstone,
  'glass': JsonMcdocBlockStatesGlass,
  'minecraft:glass': JsonMcdocBlockStatesGlass,
  'glass_pane': JsonMcdocBlockStatesGlassPane,
  'minecraft:glass_pane': JsonMcdocBlockStatesGlassPane,
  'glow_lichen': JsonMcdocBlockStatesGlowLichen,
  'minecraft:glow_lichen': JsonMcdocBlockStatesGlowLichen,
  'glowstone': JsonMcdocBlockStatesGlowstone,
  'minecraft:glowstone': JsonMcdocBlockStatesGlowstone,
  'gold_block': JsonMcdocBlockStatesGoldBlock,
  'minecraft:gold_block': JsonMcdocBlockStatesGoldBlock,
  'gold_ore': JsonMcdocBlockStatesGoldOre,
  'minecraft:gold_ore': JsonMcdocBlockStatesGoldOre,
  'golden_dandelion': JsonMcdocBlockStatesGoldenDandelion,
  'minecraft:golden_dandelion': JsonMcdocBlockStatesGoldenDandelion,
  'granite': JsonMcdocBlockStatesGranite,
  'minecraft:granite': JsonMcdocBlockStatesGranite,
  'granite_slab': JsonMcdocBlockStatesGraniteSlab,
  'minecraft:granite_slab': JsonMcdocBlockStatesGraniteSlab,
  'granite_stairs': JsonMcdocBlockStatesGraniteStairs,
  'minecraft:granite_stairs': JsonMcdocBlockStatesGraniteStairs,
  'granite_wall': JsonMcdocBlockStatesGraniteWall,
  'minecraft:granite_wall': JsonMcdocBlockStatesGraniteWall,
  'grass_block': JsonMcdocBlockStatesGrassBlock,
  'minecraft:grass_block': JsonMcdocBlockStatesGrassBlock,
  'gravel': JsonMcdocBlockStatesGravel,
  'minecraft:gravel': JsonMcdocBlockStatesGravel,
  'gray_banner': JsonMcdocBlockStatesGrayBanner,
  'minecraft:gray_banner': JsonMcdocBlockStatesGrayBanner,
  'gray_bed': JsonMcdocBlockStatesGrayBed,
  'minecraft:gray_bed': JsonMcdocBlockStatesGrayBed,
  'gray_candle': JsonMcdocBlockStatesGrayCandle,
  'minecraft:gray_candle': JsonMcdocBlockStatesGrayCandle,
  'gray_candle_cake': JsonMcdocBlockStatesGrayCandleCake,
  'minecraft:gray_candle_cake': JsonMcdocBlockStatesGrayCandleCake,
  'gray_carpet': JsonMcdocBlockStatesGrayCarpet,
  'minecraft:gray_carpet': JsonMcdocBlockStatesGrayCarpet,
  'gray_concrete': JsonMcdocBlockStatesGrayConcrete,
  'minecraft:gray_concrete': JsonMcdocBlockStatesGrayConcrete,
  'gray_concrete_powder': JsonMcdocBlockStatesGrayConcretePowder,
  'minecraft:gray_concrete_powder': JsonMcdocBlockStatesGrayConcretePowder,
  'gray_concrete_slab': JsonMcdocBlockStatesGrayConcreteSlab,
  'minecraft:gray_concrete_slab': JsonMcdocBlockStatesGrayConcreteSlab,
  'gray_concrete_stairs': JsonMcdocBlockStatesGrayConcreteStairs,
  'minecraft:gray_concrete_stairs': JsonMcdocBlockStatesGrayConcreteStairs,
  'gray_glazed_terracotta': JsonMcdocBlockStatesGrayGlazedTerracotta,
  'minecraft:gray_glazed_terracotta': JsonMcdocBlockStatesGrayGlazedTerracotta,
  'gray_shulker_box': JsonMcdocBlockStatesGrayShulkerBox,
  'minecraft:gray_shulker_box': JsonMcdocBlockStatesGrayShulkerBox,
  'gray_stained_glass': JsonMcdocBlockStatesGrayStainedGlass,
  'minecraft:gray_stained_glass': JsonMcdocBlockStatesGrayStainedGlass,
  'gray_stained_glass_pane': JsonMcdocBlockStatesGrayStainedGlassPane,
  'minecraft:gray_stained_glass_pane': JsonMcdocBlockStatesGrayStainedGlassPane,
  'gray_terracotta': JsonMcdocBlockStatesGrayTerracotta,
  'minecraft:gray_terracotta': JsonMcdocBlockStatesGrayTerracotta,
  'gray_wall_banner': JsonMcdocBlockStatesGrayWallBanner,
  'minecraft:gray_wall_banner': JsonMcdocBlockStatesGrayWallBanner,
  'gray_wool': JsonMcdocBlockStatesGrayWool,
  'minecraft:gray_wool': JsonMcdocBlockStatesGrayWool,
  'gray_wool_slab': JsonMcdocBlockStatesGrayWoolSlab,
  'minecraft:gray_wool_slab': JsonMcdocBlockStatesGrayWoolSlab,
  'gray_wool_stairs': JsonMcdocBlockStatesGrayWoolStairs,
  'minecraft:gray_wool_stairs': JsonMcdocBlockStatesGrayWoolStairs,
  'green_banner': JsonMcdocBlockStatesGreenBanner,
  'minecraft:green_banner': JsonMcdocBlockStatesGreenBanner,
  'green_bed': JsonMcdocBlockStatesGreenBed,
  'minecraft:green_bed': JsonMcdocBlockStatesGreenBed,
  'green_candle': JsonMcdocBlockStatesGreenCandle,
  'minecraft:green_candle': JsonMcdocBlockStatesGreenCandle,
  'green_candle_cake': JsonMcdocBlockStatesGreenCandleCake,
  'minecraft:green_candle_cake': JsonMcdocBlockStatesGreenCandleCake,
  'green_carpet': JsonMcdocBlockStatesGreenCarpet,
  'minecraft:green_carpet': JsonMcdocBlockStatesGreenCarpet,
  'green_concrete': JsonMcdocBlockStatesGreenConcrete,
  'minecraft:green_concrete': JsonMcdocBlockStatesGreenConcrete,
  'green_concrete_powder': JsonMcdocBlockStatesGreenConcretePowder,
  'minecraft:green_concrete_powder': JsonMcdocBlockStatesGreenConcretePowder,
  'green_concrete_slab': JsonMcdocBlockStatesGreenConcreteSlab,
  'minecraft:green_concrete_slab': JsonMcdocBlockStatesGreenConcreteSlab,
  'green_concrete_stairs': JsonMcdocBlockStatesGreenConcreteStairs,
  'minecraft:green_concrete_stairs': JsonMcdocBlockStatesGreenConcreteStairs,
  'green_glazed_terracotta': JsonMcdocBlockStatesGreenGlazedTerracotta,
  'minecraft:green_glazed_terracotta': JsonMcdocBlockStatesGreenGlazedTerracotta,
  'green_shulker_box': JsonMcdocBlockStatesGreenShulkerBox,
  'minecraft:green_shulker_box': JsonMcdocBlockStatesGreenShulkerBox,
  'green_stained_glass': JsonMcdocBlockStatesGreenStainedGlass,
  'minecraft:green_stained_glass': JsonMcdocBlockStatesGreenStainedGlass,
  'green_stained_glass_pane': JsonMcdocBlockStatesGreenStainedGlassPane,
  'minecraft:green_stained_glass_pane': JsonMcdocBlockStatesGreenStainedGlassPane,
  'green_terracotta': JsonMcdocBlockStatesGreenTerracotta,
  'minecraft:green_terracotta': JsonMcdocBlockStatesGreenTerracotta,
  'green_wall_banner': JsonMcdocBlockStatesGreenWallBanner,
  'minecraft:green_wall_banner': JsonMcdocBlockStatesGreenWallBanner,
  'green_wool': JsonMcdocBlockStatesGreenWool,
  'minecraft:green_wool': JsonMcdocBlockStatesGreenWool,
  'green_wool_slab': JsonMcdocBlockStatesGreenWoolSlab,
  'minecraft:green_wool_slab': JsonMcdocBlockStatesGreenWoolSlab,
  'green_wool_stairs': JsonMcdocBlockStatesGreenWoolStairs,
  'minecraft:green_wool_stairs': JsonMcdocBlockStatesGreenWoolStairs,
  'grindstone': JsonMcdocBlockStatesGrindstone,
  'minecraft:grindstone': JsonMcdocBlockStatesGrindstone,
  'hanging_roots': JsonMcdocBlockStatesHangingRoots,
  'minecraft:hanging_roots': JsonMcdocBlockStatesHangingRoots,
  'hay_block': JsonMcdocBlockStatesHayBlock,
  'minecraft:hay_block': JsonMcdocBlockStatesHayBlock,
  'heavy_core': JsonMcdocBlockStatesHeavyCore,
  'minecraft:heavy_core': JsonMcdocBlockStatesHeavyCore,
  'heavy_weighted_pressure_plate': JsonMcdocBlockStatesHeavyWeightedPressurePlate,
  'minecraft:heavy_weighted_pressure_plate': JsonMcdocBlockStatesHeavyWeightedPressurePlate,
  'honey_block': JsonMcdocBlockStatesHoneyBlock,
  'minecraft:honey_block': JsonMcdocBlockStatesHoneyBlock,
  'honeycomb_block': JsonMcdocBlockStatesHoneycombBlock,
  'minecraft:honeycomb_block': JsonMcdocBlockStatesHoneycombBlock,
  'hopper': JsonMcdocBlockStatesHopper,
  'minecraft:hopper': JsonMcdocBlockStatesHopper,
  'horn_coral': JsonMcdocBlockStatesHornCoral,
  'minecraft:horn_coral': JsonMcdocBlockStatesHornCoral,
  'horn_coral_block': JsonMcdocBlockStatesHornCoralBlock,
  'minecraft:horn_coral_block': JsonMcdocBlockStatesHornCoralBlock,
  'horn_coral_fan': JsonMcdocBlockStatesHornCoralFan,
  'minecraft:horn_coral_fan': JsonMcdocBlockStatesHornCoralFan,
  'horn_coral_wall_fan': JsonMcdocBlockStatesHornCoralWallFan,
  'minecraft:horn_coral_wall_fan': JsonMcdocBlockStatesHornCoralWallFan,
  'ice': JsonMcdocBlockStatesIce,
  'minecraft:ice': JsonMcdocBlockStatesIce,
  'infested_chiseled_stone_bricks': JsonMcdocBlockStatesInfestedChiseledStoneBricks,
  'minecraft:infested_chiseled_stone_bricks': JsonMcdocBlockStatesInfestedChiseledStoneBricks,
  'infested_cobblestone': JsonMcdocBlockStatesInfestedCobblestone,
  'minecraft:infested_cobblestone': JsonMcdocBlockStatesInfestedCobblestone,
  'infested_cracked_stone_bricks': JsonMcdocBlockStatesInfestedCrackedStoneBricks,
  'minecraft:infested_cracked_stone_bricks': JsonMcdocBlockStatesInfestedCrackedStoneBricks,
  'infested_deepslate': JsonMcdocBlockStatesInfestedDeepslate,
  'minecraft:infested_deepslate': JsonMcdocBlockStatesInfestedDeepslate,
  'infested_mossy_stone_bricks': JsonMcdocBlockStatesInfestedMossyStoneBricks,
  'minecraft:infested_mossy_stone_bricks': JsonMcdocBlockStatesInfestedMossyStoneBricks,
  'infested_stone': JsonMcdocBlockStatesInfestedStone,
  'minecraft:infested_stone': JsonMcdocBlockStatesInfestedStone,
  'infested_stone_bricks': JsonMcdocBlockStatesInfestedStoneBricks,
  'minecraft:infested_stone_bricks': JsonMcdocBlockStatesInfestedStoneBricks,
  'iron_bars': JsonMcdocBlockStatesIronBars,
  'minecraft:iron_bars': JsonMcdocBlockStatesIronBars,
  'iron_block': JsonMcdocBlockStatesIronBlock,
  'minecraft:iron_block': JsonMcdocBlockStatesIronBlock,
  'iron_chain': JsonMcdocBlockStatesIronChain,
  'minecraft:iron_chain': JsonMcdocBlockStatesIronChain,
  'iron_door': JsonMcdocBlockStatesIronDoor,
  'minecraft:iron_door': JsonMcdocBlockStatesIronDoor,
  'iron_ore': JsonMcdocBlockStatesIronOre,
  'minecraft:iron_ore': JsonMcdocBlockStatesIronOre,
  'iron_trapdoor': JsonMcdocBlockStatesIronTrapdoor,
  'minecraft:iron_trapdoor': JsonMcdocBlockStatesIronTrapdoor,
  'jack_o_lantern': JsonMcdocBlockStatesJackOLantern,
  'minecraft:jack_o_lantern': JsonMcdocBlockStatesJackOLantern,
  'jigsaw': JsonMcdocBlockStatesJigsaw,
  'minecraft:jigsaw': JsonMcdocBlockStatesJigsaw,
  'jukebox': JsonMcdocBlockStatesJukebox,
  'minecraft:jukebox': JsonMcdocBlockStatesJukebox,
  'jungle_button': JsonMcdocBlockStatesJungleButton,
  'minecraft:jungle_button': JsonMcdocBlockStatesJungleButton,
  'jungle_door': JsonMcdocBlockStatesJungleDoor,
  'minecraft:jungle_door': JsonMcdocBlockStatesJungleDoor,
  'jungle_fence': JsonMcdocBlockStatesJungleFence,
  'minecraft:jungle_fence': JsonMcdocBlockStatesJungleFence,
  'jungle_fence_gate': JsonMcdocBlockStatesJungleFenceGate,
  'minecraft:jungle_fence_gate': JsonMcdocBlockStatesJungleFenceGate,
  'jungle_hanging_sign': JsonMcdocBlockStatesJungleHangingSign,
  'minecraft:jungle_hanging_sign': JsonMcdocBlockStatesJungleHangingSign,
  'jungle_leaves': JsonMcdocBlockStatesJungleLeaves,
  'minecraft:jungle_leaves': JsonMcdocBlockStatesJungleLeaves,
  'jungle_log': JsonMcdocBlockStatesJungleLog,
  'minecraft:jungle_log': JsonMcdocBlockStatesJungleLog,
  'jungle_planks': JsonMcdocBlockStatesJunglePlanks,
  'minecraft:jungle_planks': JsonMcdocBlockStatesJunglePlanks,
  'jungle_pressure_plate': JsonMcdocBlockStatesJunglePressurePlate,
  'minecraft:jungle_pressure_plate': JsonMcdocBlockStatesJunglePressurePlate,
  'jungle_sapling': JsonMcdocBlockStatesJungleSapling,
  'minecraft:jungle_sapling': JsonMcdocBlockStatesJungleSapling,
  'jungle_shelf': JsonMcdocBlockStatesJungleShelf,
  'minecraft:jungle_shelf': JsonMcdocBlockStatesJungleShelf,
  'jungle_sign': JsonMcdocBlockStatesJungleSign,
  'minecraft:jungle_sign': JsonMcdocBlockStatesJungleSign,
  'jungle_slab': JsonMcdocBlockStatesJungleSlab,
  'minecraft:jungle_slab': JsonMcdocBlockStatesJungleSlab,
  'jungle_stairs': JsonMcdocBlockStatesJungleStairs,
  'minecraft:jungle_stairs': JsonMcdocBlockStatesJungleStairs,
  'jungle_trapdoor': JsonMcdocBlockStatesJungleTrapdoor,
  'minecraft:jungle_trapdoor': JsonMcdocBlockStatesJungleTrapdoor,
  'jungle_wall_hanging_sign': JsonMcdocBlockStatesJungleWallHangingSign,
  'minecraft:jungle_wall_hanging_sign': JsonMcdocBlockStatesJungleWallHangingSign,
  'jungle_wall_sign': JsonMcdocBlockStatesJungleWallSign,
  'minecraft:jungle_wall_sign': JsonMcdocBlockStatesJungleWallSign,
  'jungle_wood': JsonMcdocBlockStatesJungleWood,
  'minecraft:jungle_wood': JsonMcdocBlockStatesJungleWood,
  'kelp': JsonMcdocBlockStatesKelp,
  'minecraft:kelp': JsonMcdocBlockStatesKelp,
  'kelp_plant': JsonMcdocBlockStatesKelpPlant,
  'minecraft:kelp_plant': JsonMcdocBlockStatesKelpPlant,
  'ladder': JsonMcdocBlockStatesLadder,
  'minecraft:ladder': JsonMcdocBlockStatesLadder,
  'lantern': JsonMcdocBlockStatesLantern,
  'minecraft:lantern': JsonMcdocBlockStatesLantern,
  'lapis_block': JsonMcdocBlockStatesLapisBlock,
  'minecraft:lapis_block': JsonMcdocBlockStatesLapisBlock,
  'lapis_ore': JsonMcdocBlockStatesLapisOre,
  'minecraft:lapis_ore': JsonMcdocBlockStatesLapisOre,
  'large_amethyst_bud': JsonMcdocBlockStatesLargeAmethystBud,
  'minecraft:large_amethyst_bud': JsonMcdocBlockStatesLargeAmethystBud,
  'large_fern': JsonMcdocBlockStatesLargeFern,
  'minecraft:large_fern': JsonMcdocBlockStatesLargeFern,
  'lava': JsonMcdocBlockStatesLava,
  'minecraft:lava': JsonMcdocBlockStatesLava,
  'lava_cauldron': JsonMcdocBlockStatesLavaCauldron,
  'minecraft:lava_cauldron': JsonMcdocBlockStatesLavaCauldron,
  'leaf_litter': JsonMcdocBlockStatesLeafLitter,
  'minecraft:leaf_litter': JsonMcdocBlockStatesLeafLitter,
  'lectern': JsonMcdocBlockStatesLectern,
  'minecraft:lectern': JsonMcdocBlockStatesLectern,
  'lever': JsonMcdocBlockStatesLever,
  'minecraft:lever': JsonMcdocBlockStatesLever,
  'light': JsonMcdocBlockStatesLight,
  'minecraft:light': JsonMcdocBlockStatesLight,
  'light_blue_banner': JsonMcdocBlockStatesLightBlueBanner,
  'minecraft:light_blue_banner': JsonMcdocBlockStatesLightBlueBanner,
  'light_blue_bed': JsonMcdocBlockStatesLightBlueBed,
  'minecraft:light_blue_bed': JsonMcdocBlockStatesLightBlueBed,
  'light_blue_candle': JsonMcdocBlockStatesLightBlueCandle,
  'minecraft:light_blue_candle': JsonMcdocBlockStatesLightBlueCandle,
  'light_blue_candle_cake': JsonMcdocBlockStatesLightBlueCandleCake,
  'minecraft:light_blue_candle_cake': JsonMcdocBlockStatesLightBlueCandleCake,
  'light_blue_carpet': JsonMcdocBlockStatesLightBlueCarpet,
  'minecraft:light_blue_carpet': JsonMcdocBlockStatesLightBlueCarpet,
  'light_blue_concrete': JsonMcdocBlockStatesLightBlueConcrete,
  'minecraft:light_blue_concrete': JsonMcdocBlockStatesLightBlueConcrete,
  'light_blue_concrete_powder': JsonMcdocBlockStatesLightBlueConcretePowder,
  'minecraft:light_blue_concrete_powder': JsonMcdocBlockStatesLightBlueConcretePowder,
  'light_blue_concrete_slab': JsonMcdocBlockStatesLightBlueConcreteSlab,
  'minecraft:light_blue_concrete_slab': JsonMcdocBlockStatesLightBlueConcreteSlab,
  'light_blue_concrete_stairs': JsonMcdocBlockStatesLightBlueConcreteStairs,
  'minecraft:light_blue_concrete_stairs': JsonMcdocBlockStatesLightBlueConcreteStairs,
  'light_blue_glazed_terracotta': JsonMcdocBlockStatesLightBlueGlazedTerracotta,
  'minecraft:light_blue_glazed_terracotta': JsonMcdocBlockStatesLightBlueGlazedTerracotta,
  'light_blue_shulker_box': JsonMcdocBlockStatesLightBlueShulkerBox,
  'minecraft:light_blue_shulker_box': JsonMcdocBlockStatesLightBlueShulkerBox,
  'light_blue_stained_glass': JsonMcdocBlockStatesLightBlueStainedGlass,
  'minecraft:light_blue_stained_glass': JsonMcdocBlockStatesLightBlueStainedGlass,
  'light_blue_stained_glass_pane': JsonMcdocBlockStatesLightBlueStainedGlassPane,
  'minecraft:light_blue_stained_glass_pane': JsonMcdocBlockStatesLightBlueStainedGlassPane,
  'light_blue_terracotta': JsonMcdocBlockStatesLightBlueTerracotta,
  'minecraft:light_blue_terracotta': JsonMcdocBlockStatesLightBlueTerracotta,
  'light_blue_wall_banner': JsonMcdocBlockStatesLightBlueWallBanner,
  'minecraft:light_blue_wall_banner': JsonMcdocBlockStatesLightBlueWallBanner,
  'light_blue_wool': JsonMcdocBlockStatesLightBlueWool,
  'minecraft:light_blue_wool': JsonMcdocBlockStatesLightBlueWool,
  'light_blue_wool_slab': JsonMcdocBlockStatesLightBlueWoolSlab,
  'minecraft:light_blue_wool_slab': JsonMcdocBlockStatesLightBlueWoolSlab,
  'light_blue_wool_stairs': JsonMcdocBlockStatesLightBlueWoolStairs,
  'minecraft:light_blue_wool_stairs': JsonMcdocBlockStatesLightBlueWoolStairs,
  'light_gray_banner': JsonMcdocBlockStatesLightGrayBanner,
  'minecraft:light_gray_banner': JsonMcdocBlockStatesLightGrayBanner,
  'light_gray_bed': JsonMcdocBlockStatesLightGrayBed,
  'minecraft:light_gray_bed': JsonMcdocBlockStatesLightGrayBed,
  'light_gray_candle': JsonMcdocBlockStatesLightGrayCandle,
  'minecraft:light_gray_candle': JsonMcdocBlockStatesLightGrayCandle,
  'light_gray_candle_cake': JsonMcdocBlockStatesLightGrayCandleCake,
  'minecraft:light_gray_candle_cake': JsonMcdocBlockStatesLightGrayCandleCake,
  'light_gray_carpet': JsonMcdocBlockStatesLightGrayCarpet,
  'minecraft:light_gray_carpet': JsonMcdocBlockStatesLightGrayCarpet,
  'light_gray_concrete': JsonMcdocBlockStatesLightGrayConcrete,
  'minecraft:light_gray_concrete': JsonMcdocBlockStatesLightGrayConcrete,
  'light_gray_concrete_powder': JsonMcdocBlockStatesLightGrayConcretePowder,
  'minecraft:light_gray_concrete_powder': JsonMcdocBlockStatesLightGrayConcretePowder,
  'light_gray_concrete_slab': JsonMcdocBlockStatesLightGrayConcreteSlab,
  'minecraft:light_gray_concrete_slab': JsonMcdocBlockStatesLightGrayConcreteSlab,
  'light_gray_concrete_stairs': JsonMcdocBlockStatesLightGrayConcreteStairs,
  'minecraft:light_gray_concrete_stairs': JsonMcdocBlockStatesLightGrayConcreteStairs,
  'light_gray_glazed_terracotta': JsonMcdocBlockStatesLightGrayGlazedTerracotta,
  'minecraft:light_gray_glazed_terracotta': JsonMcdocBlockStatesLightGrayGlazedTerracotta,
  'light_gray_shulker_box': JsonMcdocBlockStatesLightGrayShulkerBox,
  'minecraft:light_gray_shulker_box': JsonMcdocBlockStatesLightGrayShulkerBox,
  'light_gray_stained_glass': JsonMcdocBlockStatesLightGrayStainedGlass,
  'minecraft:light_gray_stained_glass': JsonMcdocBlockStatesLightGrayStainedGlass,
  'light_gray_stained_glass_pane': JsonMcdocBlockStatesLightGrayStainedGlassPane,
  'minecraft:light_gray_stained_glass_pane': JsonMcdocBlockStatesLightGrayStainedGlassPane,
  'light_gray_terracotta': JsonMcdocBlockStatesLightGrayTerracotta,
  'minecraft:light_gray_terracotta': JsonMcdocBlockStatesLightGrayTerracotta,
  'light_gray_wall_banner': JsonMcdocBlockStatesLightGrayWallBanner,
  'minecraft:light_gray_wall_banner': JsonMcdocBlockStatesLightGrayWallBanner,
  'light_gray_wool': JsonMcdocBlockStatesLightGrayWool,
  'minecraft:light_gray_wool': JsonMcdocBlockStatesLightGrayWool,
  'light_gray_wool_slab': JsonMcdocBlockStatesLightGrayWoolSlab,
  'minecraft:light_gray_wool_slab': JsonMcdocBlockStatesLightGrayWoolSlab,
  'light_gray_wool_stairs': JsonMcdocBlockStatesLightGrayWoolStairs,
  'minecraft:light_gray_wool_stairs': JsonMcdocBlockStatesLightGrayWoolStairs,
  'light_weighted_pressure_plate': JsonMcdocBlockStatesLightWeightedPressurePlate,
  'minecraft:light_weighted_pressure_plate': JsonMcdocBlockStatesLightWeightedPressurePlate,
  'lightning_rod': JsonMcdocBlockStatesLightningRod,
  'minecraft:lightning_rod': JsonMcdocBlockStatesLightningRod,
  'lilac': JsonMcdocBlockStatesLilac,
  'minecraft:lilac': JsonMcdocBlockStatesLilac,
  'lily_of_the_valley': JsonMcdocBlockStatesLilyOfTheValley,
  'minecraft:lily_of_the_valley': JsonMcdocBlockStatesLilyOfTheValley,
  'lily_pad': JsonMcdocBlockStatesLilyPad,
  'minecraft:lily_pad': JsonMcdocBlockStatesLilyPad,
  'lime_banner': JsonMcdocBlockStatesLimeBanner,
  'minecraft:lime_banner': JsonMcdocBlockStatesLimeBanner,
  'lime_bed': JsonMcdocBlockStatesLimeBed,
  'minecraft:lime_bed': JsonMcdocBlockStatesLimeBed,
  'lime_candle': JsonMcdocBlockStatesLimeCandle,
  'minecraft:lime_candle': JsonMcdocBlockStatesLimeCandle,
  'lime_candle_cake': JsonMcdocBlockStatesLimeCandleCake,
  'minecraft:lime_candle_cake': JsonMcdocBlockStatesLimeCandleCake,
  'lime_carpet': JsonMcdocBlockStatesLimeCarpet,
  'minecraft:lime_carpet': JsonMcdocBlockStatesLimeCarpet,
  'lime_concrete': JsonMcdocBlockStatesLimeConcrete,
  'minecraft:lime_concrete': JsonMcdocBlockStatesLimeConcrete,
  'lime_concrete_powder': JsonMcdocBlockStatesLimeConcretePowder,
  'minecraft:lime_concrete_powder': JsonMcdocBlockStatesLimeConcretePowder,
  'lime_concrete_slab': JsonMcdocBlockStatesLimeConcreteSlab,
  'minecraft:lime_concrete_slab': JsonMcdocBlockStatesLimeConcreteSlab,
  'lime_concrete_stairs': JsonMcdocBlockStatesLimeConcreteStairs,
  'minecraft:lime_concrete_stairs': JsonMcdocBlockStatesLimeConcreteStairs,
  'lime_glazed_terracotta': JsonMcdocBlockStatesLimeGlazedTerracotta,
  'minecraft:lime_glazed_terracotta': JsonMcdocBlockStatesLimeGlazedTerracotta,
  'lime_shulker_box': JsonMcdocBlockStatesLimeShulkerBox,
  'minecraft:lime_shulker_box': JsonMcdocBlockStatesLimeShulkerBox,
  'lime_stained_glass': JsonMcdocBlockStatesLimeStainedGlass,
  'minecraft:lime_stained_glass': JsonMcdocBlockStatesLimeStainedGlass,
  'lime_stained_glass_pane': JsonMcdocBlockStatesLimeStainedGlassPane,
  'minecraft:lime_stained_glass_pane': JsonMcdocBlockStatesLimeStainedGlassPane,
  'lime_terracotta': JsonMcdocBlockStatesLimeTerracotta,
  'minecraft:lime_terracotta': JsonMcdocBlockStatesLimeTerracotta,
  'lime_wall_banner': JsonMcdocBlockStatesLimeWallBanner,
  'minecraft:lime_wall_banner': JsonMcdocBlockStatesLimeWallBanner,
  'lime_wool': JsonMcdocBlockStatesLimeWool,
  'minecraft:lime_wool': JsonMcdocBlockStatesLimeWool,
  'lime_wool_slab': JsonMcdocBlockStatesLimeWoolSlab,
  'minecraft:lime_wool_slab': JsonMcdocBlockStatesLimeWoolSlab,
  'lime_wool_stairs': JsonMcdocBlockStatesLimeWoolStairs,
  'minecraft:lime_wool_stairs': JsonMcdocBlockStatesLimeWoolStairs,
  'lodestone': JsonMcdocBlockStatesLodestone,
  'minecraft:lodestone': JsonMcdocBlockStatesLodestone,
  'loom': JsonMcdocBlockStatesLoom,
  'minecraft:loom': JsonMcdocBlockStatesLoom,
  'magenta_banner': JsonMcdocBlockStatesMagentaBanner,
  'minecraft:magenta_banner': JsonMcdocBlockStatesMagentaBanner,
  'magenta_bed': JsonMcdocBlockStatesMagentaBed,
  'minecraft:magenta_bed': JsonMcdocBlockStatesMagentaBed,
  'magenta_candle': JsonMcdocBlockStatesMagentaCandle,
  'minecraft:magenta_candle': JsonMcdocBlockStatesMagentaCandle,
  'magenta_candle_cake': JsonMcdocBlockStatesMagentaCandleCake,
  'minecraft:magenta_candle_cake': JsonMcdocBlockStatesMagentaCandleCake,
  'magenta_carpet': JsonMcdocBlockStatesMagentaCarpet,
  'minecraft:magenta_carpet': JsonMcdocBlockStatesMagentaCarpet,
  'magenta_concrete': JsonMcdocBlockStatesMagentaConcrete,
  'minecraft:magenta_concrete': JsonMcdocBlockStatesMagentaConcrete,
  'magenta_concrete_powder': JsonMcdocBlockStatesMagentaConcretePowder,
  'minecraft:magenta_concrete_powder': JsonMcdocBlockStatesMagentaConcretePowder,
  'magenta_concrete_slab': JsonMcdocBlockStatesMagentaConcreteSlab,
  'minecraft:magenta_concrete_slab': JsonMcdocBlockStatesMagentaConcreteSlab,
  'magenta_concrete_stairs': JsonMcdocBlockStatesMagentaConcreteStairs,
  'minecraft:magenta_concrete_stairs': JsonMcdocBlockStatesMagentaConcreteStairs,
  'magenta_glazed_terracotta': JsonMcdocBlockStatesMagentaGlazedTerracotta,
  'minecraft:magenta_glazed_terracotta': JsonMcdocBlockStatesMagentaGlazedTerracotta,
  'magenta_shulker_box': JsonMcdocBlockStatesMagentaShulkerBox,
  'minecraft:magenta_shulker_box': JsonMcdocBlockStatesMagentaShulkerBox,
  'magenta_stained_glass': JsonMcdocBlockStatesMagentaStainedGlass,
  'minecraft:magenta_stained_glass': JsonMcdocBlockStatesMagentaStainedGlass,
  'magenta_stained_glass_pane': JsonMcdocBlockStatesMagentaStainedGlassPane,
  'minecraft:magenta_stained_glass_pane': JsonMcdocBlockStatesMagentaStainedGlassPane,
  'magenta_terracotta': JsonMcdocBlockStatesMagentaTerracotta,
  'minecraft:magenta_terracotta': JsonMcdocBlockStatesMagentaTerracotta,
  'magenta_wall_banner': JsonMcdocBlockStatesMagentaWallBanner,
  'minecraft:magenta_wall_banner': JsonMcdocBlockStatesMagentaWallBanner,
  'magenta_wool': JsonMcdocBlockStatesMagentaWool,
  'minecraft:magenta_wool': JsonMcdocBlockStatesMagentaWool,
  'magenta_wool_slab': JsonMcdocBlockStatesMagentaWoolSlab,
  'minecraft:magenta_wool_slab': JsonMcdocBlockStatesMagentaWoolSlab,
  'magenta_wool_stairs': JsonMcdocBlockStatesMagentaWoolStairs,
  'minecraft:magenta_wool_stairs': JsonMcdocBlockStatesMagentaWoolStairs,
  'magma_block': JsonMcdocBlockStatesMagmaBlock,
  'minecraft:magma_block': JsonMcdocBlockStatesMagmaBlock,
  'mangrove_button': JsonMcdocBlockStatesMangroveButton,
  'minecraft:mangrove_button': JsonMcdocBlockStatesMangroveButton,
  'mangrove_door': JsonMcdocBlockStatesMangroveDoor,
  'minecraft:mangrove_door': JsonMcdocBlockStatesMangroveDoor,
  'mangrove_fence': JsonMcdocBlockStatesMangroveFence,
  'minecraft:mangrove_fence': JsonMcdocBlockStatesMangroveFence,
  'mangrove_fence_gate': JsonMcdocBlockStatesMangroveFenceGate,
  'minecraft:mangrove_fence_gate': JsonMcdocBlockStatesMangroveFenceGate,
  'mangrove_hanging_sign': JsonMcdocBlockStatesMangroveHangingSign,
  'minecraft:mangrove_hanging_sign': JsonMcdocBlockStatesMangroveHangingSign,
  'mangrove_leaves': JsonMcdocBlockStatesMangroveLeaves,
  'minecraft:mangrove_leaves': JsonMcdocBlockStatesMangroveLeaves,
  'mangrove_log': JsonMcdocBlockStatesMangroveLog,
  'minecraft:mangrove_log': JsonMcdocBlockStatesMangroveLog,
  'mangrove_planks': JsonMcdocBlockStatesMangrovePlanks,
  'minecraft:mangrove_planks': JsonMcdocBlockStatesMangrovePlanks,
  'mangrove_pressure_plate': JsonMcdocBlockStatesMangrovePressurePlate,
  'minecraft:mangrove_pressure_plate': JsonMcdocBlockStatesMangrovePressurePlate,
  'mangrove_propagule': JsonMcdocBlockStatesMangrovePropagule,
  'minecraft:mangrove_propagule': JsonMcdocBlockStatesMangrovePropagule,
  'mangrove_roots': JsonMcdocBlockStatesMangroveRoots,
  'minecraft:mangrove_roots': JsonMcdocBlockStatesMangroveRoots,
  'mangrove_shelf': JsonMcdocBlockStatesMangroveShelf,
  'minecraft:mangrove_shelf': JsonMcdocBlockStatesMangroveShelf,
  'mangrove_sign': JsonMcdocBlockStatesMangroveSign,
  'minecraft:mangrove_sign': JsonMcdocBlockStatesMangroveSign,
  'mangrove_slab': JsonMcdocBlockStatesMangroveSlab,
  'minecraft:mangrove_slab': JsonMcdocBlockStatesMangroveSlab,
  'mangrove_stairs': JsonMcdocBlockStatesMangroveStairs,
  'minecraft:mangrove_stairs': JsonMcdocBlockStatesMangroveStairs,
  'mangrove_trapdoor': JsonMcdocBlockStatesMangroveTrapdoor,
  'minecraft:mangrove_trapdoor': JsonMcdocBlockStatesMangroveTrapdoor,
  'mangrove_wall_hanging_sign': JsonMcdocBlockStatesMangroveWallHangingSign,
  'minecraft:mangrove_wall_hanging_sign': JsonMcdocBlockStatesMangroveWallHangingSign,
  'mangrove_wall_sign': JsonMcdocBlockStatesMangroveWallSign,
  'minecraft:mangrove_wall_sign': JsonMcdocBlockStatesMangroveWallSign,
  'mangrove_wood': JsonMcdocBlockStatesMangroveWood,
  'minecraft:mangrove_wood': JsonMcdocBlockStatesMangroveWood,
  'medium_amethyst_bud': JsonMcdocBlockStatesMediumAmethystBud,
  'minecraft:medium_amethyst_bud': JsonMcdocBlockStatesMediumAmethystBud,
  'melon': JsonMcdocBlockStatesMelon,
  'minecraft:melon': JsonMcdocBlockStatesMelon,
  'melon_stem': JsonMcdocBlockStatesMelonStem,
  'minecraft:melon_stem': JsonMcdocBlockStatesMelonStem,
  'moss_block': JsonMcdocBlockStatesMossBlock,
  'minecraft:moss_block': JsonMcdocBlockStatesMossBlock,
  'moss_carpet': JsonMcdocBlockStatesMossCarpet,
  'minecraft:moss_carpet': JsonMcdocBlockStatesMossCarpet,
  'mossy_cobblestone': JsonMcdocBlockStatesMossyCobblestone,
  'minecraft:mossy_cobblestone': JsonMcdocBlockStatesMossyCobblestone,
  'mossy_cobblestone_slab': JsonMcdocBlockStatesMossyCobblestoneSlab,
  'minecraft:mossy_cobblestone_slab': JsonMcdocBlockStatesMossyCobblestoneSlab,
  'mossy_cobblestone_stairs': JsonMcdocBlockStatesMossyCobblestoneStairs,
  'minecraft:mossy_cobblestone_stairs': JsonMcdocBlockStatesMossyCobblestoneStairs,
  'mossy_cobblestone_wall': JsonMcdocBlockStatesMossyCobblestoneWall,
  'minecraft:mossy_cobblestone_wall': JsonMcdocBlockStatesMossyCobblestoneWall,
  'mossy_stone_brick_slab': JsonMcdocBlockStatesMossyStoneBrickSlab,
  'minecraft:mossy_stone_brick_slab': JsonMcdocBlockStatesMossyStoneBrickSlab,
  'mossy_stone_brick_stairs': JsonMcdocBlockStatesMossyStoneBrickStairs,
  'minecraft:mossy_stone_brick_stairs': JsonMcdocBlockStatesMossyStoneBrickStairs,
  'mossy_stone_brick_wall': JsonMcdocBlockStatesMossyStoneBrickWall,
  'minecraft:mossy_stone_brick_wall': JsonMcdocBlockStatesMossyStoneBrickWall,
  'mossy_stone_bricks': JsonMcdocBlockStatesMossyStoneBricks,
  'minecraft:mossy_stone_bricks': JsonMcdocBlockStatesMossyStoneBricks,
  'moving_piston': JsonMcdocBlockStatesMovingPiston,
  'minecraft:moving_piston': JsonMcdocBlockStatesMovingPiston,
  'mud': JsonMcdocBlockStatesMud,
  'minecraft:mud': JsonMcdocBlockStatesMud,
  'mud_brick_slab': JsonMcdocBlockStatesMudBrickSlab,
  'minecraft:mud_brick_slab': JsonMcdocBlockStatesMudBrickSlab,
  'mud_brick_stairs': JsonMcdocBlockStatesMudBrickStairs,
  'minecraft:mud_brick_stairs': JsonMcdocBlockStatesMudBrickStairs,
  'mud_brick_wall': JsonMcdocBlockStatesMudBrickWall,
  'minecraft:mud_brick_wall': JsonMcdocBlockStatesMudBrickWall,
  'mud_bricks': JsonMcdocBlockStatesMudBricks,
  'minecraft:mud_bricks': JsonMcdocBlockStatesMudBricks,
  'muddy_mangrove_roots': JsonMcdocBlockStatesMuddyMangroveRoots,
  'minecraft:muddy_mangrove_roots': JsonMcdocBlockStatesMuddyMangroveRoots,
  'mushroom_stem': JsonMcdocBlockStatesMushroomStem,
  'minecraft:mushroom_stem': JsonMcdocBlockStatesMushroomStem,
  'mycelium': JsonMcdocBlockStatesMycelium,
  'minecraft:mycelium': JsonMcdocBlockStatesMycelium,
  'nether_brick_fence': JsonMcdocBlockStatesNetherBrickFence,
  'minecraft:nether_brick_fence': JsonMcdocBlockStatesNetherBrickFence,
  'nether_brick_slab': JsonMcdocBlockStatesNetherBrickSlab,
  'minecraft:nether_brick_slab': JsonMcdocBlockStatesNetherBrickSlab,
  'nether_brick_stairs': JsonMcdocBlockStatesNetherBrickStairs,
  'minecraft:nether_brick_stairs': JsonMcdocBlockStatesNetherBrickStairs,
  'nether_brick_wall': JsonMcdocBlockStatesNetherBrickWall,
  'minecraft:nether_brick_wall': JsonMcdocBlockStatesNetherBrickWall,
  'nether_bricks': JsonMcdocBlockStatesNetherBricks,
  'minecraft:nether_bricks': JsonMcdocBlockStatesNetherBricks,
  'nether_gold_ore': JsonMcdocBlockStatesNetherGoldOre,
  'minecraft:nether_gold_ore': JsonMcdocBlockStatesNetherGoldOre,
  'nether_portal': JsonMcdocBlockStatesNetherPortal,
  'minecraft:nether_portal': JsonMcdocBlockStatesNetherPortal,
  'nether_quartz_ore': JsonMcdocBlockStatesNetherQuartzOre,
  'minecraft:nether_quartz_ore': JsonMcdocBlockStatesNetherQuartzOre,
  'nether_sprouts': JsonMcdocBlockStatesNetherSprouts,
  'minecraft:nether_sprouts': JsonMcdocBlockStatesNetherSprouts,
  'nether_wart': JsonMcdocBlockStatesNetherWart,
  'minecraft:nether_wart': JsonMcdocBlockStatesNetherWart,
  'nether_wart_block': JsonMcdocBlockStatesNetherWartBlock,
  'minecraft:nether_wart_block': JsonMcdocBlockStatesNetherWartBlock,
  'netherite_block': JsonMcdocBlockStatesNetheriteBlock,
  'minecraft:netherite_block': JsonMcdocBlockStatesNetheriteBlock,
  'netherrack': JsonMcdocBlockStatesNetherrack,
  'minecraft:netherrack': JsonMcdocBlockStatesNetherrack,
  'note_block': JsonMcdocBlockStatesNoteBlock,
  'minecraft:note_block': JsonMcdocBlockStatesNoteBlock,
  'oak_button': JsonMcdocBlockStatesOakButton,
  'minecraft:oak_button': JsonMcdocBlockStatesOakButton,
  'oak_door': JsonMcdocBlockStatesOakDoor,
  'minecraft:oak_door': JsonMcdocBlockStatesOakDoor,
  'oak_fence': JsonMcdocBlockStatesOakFence,
  'minecraft:oak_fence': JsonMcdocBlockStatesOakFence,
  'oak_fence_gate': JsonMcdocBlockStatesOakFenceGate,
  'minecraft:oak_fence_gate': JsonMcdocBlockStatesOakFenceGate,
  'oak_hanging_sign': JsonMcdocBlockStatesOakHangingSign,
  'minecraft:oak_hanging_sign': JsonMcdocBlockStatesOakHangingSign,
  'oak_leaves': JsonMcdocBlockStatesOakLeaves,
  'minecraft:oak_leaves': JsonMcdocBlockStatesOakLeaves,
  'oak_log': JsonMcdocBlockStatesOakLog,
  'minecraft:oak_log': JsonMcdocBlockStatesOakLog,
  'oak_planks': JsonMcdocBlockStatesOakPlanks,
  'minecraft:oak_planks': JsonMcdocBlockStatesOakPlanks,
  'oak_pressure_plate': JsonMcdocBlockStatesOakPressurePlate,
  'minecraft:oak_pressure_plate': JsonMcdocBlockStatesOakPressurePlate,
  'oak_sapling': JsonMcdocBlockStatesOakSapling,
  'minecraft:oak_sapling': JsonMcdocBlockStatesOakSapling,
  'oak_shelf': JsonMcdocBlockStatesOakShelf,
  'minecraft:oak_shelf': JsonMcdocBlockStatesOakShelf,
  'oak_sign': JsonMcdocBlockStatesOakSign,
  'minecraft:oak_sign': JsonMcdocBlockStatesOakSign,
  'oak_slab': JsonMcdocBlockStatesOakSlab,
  'minecraft:oak_slab': JsonMcdocBlockStatesOakSlab,
  'oak_stairs': JsonMcdocBlockStatesOakStairs,
  'minecraft:oak_stairs': JsonMcdocBlockStatesOakStairs,
  'oak_trapdoor': JsonMcdocBlockStatesOakTrapdoor,
  'minecraft:oak_trapdoor': JsonMcdocBlockStatesOakTrapdoor,
  'oak_wall_hanging_sign': JsonMcdocBlockStatesOakWallHangingSign,
  'minecraft:oak_wall_hanging_sign': JsonMcdocBlockStatesOakWallHangingSign,
  'oak_wall_sign': JsonMcdocBlockStatesOakWallSign,
  'minecraft:oak_wall_sign': JsonMcdocBlockStatesOakWallSign,
  'oak_wood': JsonMcdocBlockStatesOakWood,
  'minecraft:oak_wood': JsonMcdocBlockStatesOakWood,
  'observer': JsonMcdocBlockStatesObserver,
  'minecraft:observer': JsonMcdocBlockStatesObserver,
  'obsidian': JsonMcdocBlockStatesObsidian,
  'minecraft:obsidian': JsonMcdocBlockStatesObsidian,
  'ochre_froglight': JsonMcdocBlockStatesOchreFroglight,
  'minecraft:ochre_froglight': JsonMcdocBlockStatesOchreFroglight,
  'open_eyeblossom': JsonMcdocBlockStatesOpenEyeblossom,
  'minecraft:open_eyeblossom': JsonMcdocBlockStatesOpenEyeblossom,
  'orange_banner': JsonMcdocBlockStatesOrangeBanner,
  'minecraft:orange_banner': JsonMcdocBlockStatesOrangeBanner,
  'orange_bed': JsonMcdocBlockStatesOrangeBed,
  'minecraft:orange_bed': JsonMcdocBlockStatesOrangeBed,
  'orange_candle': JsonMcdocBlockStatesOrangeCandle,
  'minecraft:orange_candle': JsonMcdocBlockStatesOrangeCandle,
  'orange_candle_cake': JsonMcdocBlockStatesOrangeCandleCake,
  'minecraft:orange_candle_cake': JsonMcdocBlockStatesOrangeCandleCake,
  'orange_carpet': JsonMcdocBlockStatesOrangeCarpet,
  'minecraft:orange_carpet': JsonMcdocBlockStatesOrangeCarpet,
  'orange_concrete': JsonMcdocBlockStatesOrangeConcrete,
  'minecraft:orange_concrete': JsonMcdocBlockStatesOrangeConcrete,
  'orange_concrete_powder': JsonMcdocBlockStatesOrangeConcretePowder,
  'minecraft:orange_concrete_powder': JsonMcdocBlockStatesOrangeConcretePowder,
  'orange_concrete_slab': JsonMcdocBlockStatesOrangeConcreteSlab,
  'minecraft:orange_concrete_slab': JsonMcdocBlockStatesOrangeConcreteSlab,
  'orange_concrete_stairs': JsonMcdocBlockStatesOrangeConcreteStairs,
  'minecraft:orange_concrete_stairs': JsonMcdocBlockStatesOrangeConcreteStairs,
  'orange_glazed_terracotta': JsonMcdocBlockStatesOrangeGlazedTerracotta,
  'minecraft:orange_glazed_terracotta': JsonMcdocBlockStatesOrangeGlazedTerracotta,
  'orange_poplar_leaves': JsonMcdocBlockStatesOrangePoplarLeaves,
  'minecraft:orange_poplar_leaves': JsonMcdocBlockStatesOrangePoplarLeaves,
  'orange_shulker_box': JsonMcdocBlockStatesOrangeShulkerBox,
  'minecraft:orange_shulker_box': JsonMcdocBlockStatesOrangeShulkerBox,
  'orange_stained_glass': JsonMcdocBlockStatesOrangeStainedGlass,
  'minecraft:orange_stained_glass': JsonMcdocBlockStatesOrangeStainedGlass,
  'orange_stained_glass_pane': JsonMcdocBlockStatesOrangeStainedGlassPane,
  'minecraft:orange_stained_glass_pane': JsonMcdocBlockStatesOrangeStainedGlassPane,
  'orange_terracotta': JsonMcdocBlockStatesOrangeTerracotta,
  'minecraft:orange_terracotta': JsonMcdocBlockStatesOrangeTerracotta,
  'orange_tulip': JsonMcdocBlockStatesOrangeTulip,
  'minecraft:orange_tulip': JsonMcdocBlockStatesOrangeTulip,
  'orange_wall_banner': JsonMcdocBlockStatesOrangeWallBanner,
  'minecraft:orange_wall_banner': JsonMcdocBlockStatesOrangeWallBanner,
  'orange_wool': JsonMcdocBlockStatesOrangeWool,
  'minecraft:orange_wool': JsonMcdocBlockStatesOrangeWool,
  'orange_wool_slab': JsonMcdocBlockStatesOrangeWoolSlab,
  'minecraft:orange_wool_slab': JsonMcdocBlockStatesOrangeWoolSlab,
  'orange_wool_stairs': JsonMcdocBlockStatesOrangeWoolStairs,
  'minecraft:orange_wool_stairs': JsonMcdocBlockStatesOrangeWoolStairs,
  'oxeye_daisy': JsonMcdocBlockStatesOxeyeDaisy,
  'minecraft:oxeye_daisy': JsonMcdocBlockStatesOxeyeDaisy,
  'oxidized_chiseled_copper': JsonMcdocBlockStatesOxidizedChiseledCopper,
  'minecraft:oxidized_chiseled_copper': JsonMcdocBlockStatesOxidizedChiseledCopper,
  'oxidized_copper': JsonMcdocBlockStatesOxidizedCopper,
  'minecraft:oxidized_copper': JsonMcdocBlockStatesOxidizedCopper,
  'oxidized_copper_bars': JsonMcdocBlockStatesOxidizedCopperBars,
  'minecraft:oxidized_copper_bars': JsonMcdocBlockStatesOxidizedCopperBars,
  'oxidized_copper_bulb': JsonMcdocBlockStatesOxidizedCopperBulb,
  'minecraft:oxidized_copper_bulb': JsonMcdocBlockStatesOxidizedCopperBulb,
  'oxidized_copper_chain': JsonMcdocBlockStatesOxidizedCopperChain,
  'minecraft:oxidized_copper_chain': JsonMcdocBlockStatesOxidizedCopperChain,
  'oxidized_copper_chest': JsonMcdocBlockStatesOxidizedCopperChest,
  'minecraft:oxidized_copper_chest': JsonMcdocBlockStatesOxidizedCopperChest,
  'oxidized_copper_door': JsonMcdocBlockStatesOxidizedCopperDoor,
  'minecraft:oxidized_copper_door': JsonMcdocBlockStatesOxidizedCopperDoor,
  'oxidized_copper_golem_statue': JsonMcdocBlockStatesOxidizedCopperGolemStatue,
  'minecraft:oxidized_copper_golem_statue': JsonMcdocBlockStatesOxidizedCopperGolemStatue,
  'oxidized_copper_grate': JsonMcdocBlockStatesOxidizedCopperGrate,
  'minecraft:oxidized_copper_grate': JsonMcdocBlockStatesOxidizedCopperGrate,
  'oxidized_copper_lantern': JsonMcdocBlockStatesOxidizedCopperLantern,
  'minecraft:oxidized_copper_lantern': JsonMcdocBlockStatesOxidizedCopperLantern,
  'oxidized_copper_trapdoor': JsonMcdocBlockStatesOxidizedCopperTrapdoor,
  'minecraft:oxidized_copper_trapdoor': JsonMcdocBlockStatesOxidizedCopperTrapdoor,
  'oxidized_cut_copper': JsonMcdocBlockStatesOxidizedCutCopper,
  'minecraft:oxidized_cut_copper': JsonMcdocBlockStatesOxidizedCutCopper,
  'oxidized_cut_copper_slab': JsonMcdocBlockStatesOxidizedCutCopperSlab,
  'minecraft:oxidized_cut_copper_slab': JsonMcdocBlockStatesOxidizedCutCopperSlab,
  'oxidized_cut_copper_stairs': JsonMcdocBlockStatesOxidizedCutCopperStairs,
  'minecraft:oxidized_cut_copper_stairs': JsonMcdocBlockStatesOxidizedCutCopperStairs,
  'oxidized_lightning_rod': JsonMcdocBlockStatesOxidizedLightningRod,
  'minecraft:oxidized_lightning_rod': JsonMcdocBlockStatesOxidizedLightningRod,
  'packed_ice': JsonMcdocBlockStatesPackedIce,
  'minecraft:packed_ice': JsonMcdocBlockStatesPackedIce,
  'packed_mud': JsonMcdocBlockStatesPackedMud,
  'minecraft:packed_mud': JsonMcdocBlockStatesPackedMud,
  'pale_hanging_moss': JsonMcdocBlockStatesPaleHangingMoss,
  'minecraft:pale_hanging_moss': JsonMcdocBlockStatesPaleHangingMoss,
  'pale_moss_block': JsonMcdocBlockStatesPaleMossBlock,
  'minecraft:pale_moss_block': JsonMcdocBlockStatesPaleMossBlock,
  'pale_moss_carpet': JsonMcdocBlockStatesPaleMossCarpet,
  'minecraft:pale_moss_carpet': JsonMcdocBlockStatesPaleMossCarpet,
  'pale_oak_button': JsonMcdocBlockStatesPaleOakButton,
  'minecraft:pale_oak_button': JsonMcdocBlockStatesPaleOakButton,
  'pale_oak_door': JsonMcdocBlockStatesPaleOakDoor,
  'minecraft:pale_oak_door': JsonMcdocBlockStatesPaleOakDoor,
  'pale_oak_fence': JsonMcdocBlockStatesPaleOakFence,
  'minecraft:pale_oak_fence': JsonMcdocBlockStatesPaleOakFence,
  'pale_oak_fence_gate': JsonMcdocBlockStatesPaleOakFenceGate,
  'minecraft:pale_oak_fence_gate': JsonMcdocBlockStatesPaleOakFenceGate,
  'pale_oak_hanging_sign': JsonMcdocBlockStatesPaleOakHangingSign,
  'minecraft:pale_oak_hanging_sign': JsonMcdocBlockStatesPaleOakHangingSign,
  'pale_oak_leaves': JsonMcdocBlockStatesPaleOakLeaves,
  'minecraft:pale_oak_leaves': JsonMcdocBlockStatesPaleOakLeaves,
  'pale_oak_log': JsonMcdocBlockStatesPaleOakLog,
  'minecraft:pale_oak_log': JsonMcdocBlockStatesPaleOakLog,
  'pale_oak_planks': JsonMcdocBlockStatesPaleOakPlanks,
  'minecraft:pale_oak_planks': JsonMcdocBlockStatesPaleOakPlanks,
  'pale_oak_pressure_plate': JsonMcdocBlockStatesPaleOakPressurePlate,
  'minecraft:pale_oak_pressure_plate': JsonMcdocBlockStatesPaleOakPressurePlate,
  'pale_oak_sapling': JsonMcdocBlockStatesPaleOakSapling,
  'minecraft:pale_oak_sapling': JsonMcdocBlockStatesPaleOakSapling,
  'pale_oak_shelf': JsonMcdocBlockStatesPaleOakShelf,
  'minecraft:pale_oak_shelf': JsonMcdocBlockStatesPaleOakShelf,
  'pale_oak_sign': JsonMcdocBlockStatesPaleOakSign,
  'minecraft:pale_oak_sign': JsonMcdocBlockStatesPaleOakSign,
  'pale_oak_slab': JsonMcdocBlockStatesPaleOakSlab,
  'minecraft:pale_oak_slab': JsonMcdocBlockStatesPaleOakSlab,
  'pale_oak_stairs': JsonMcdocBlockStatesPaleOakStairs,
  'minecraft:pale_oak_stairs': JsonMcdocBlockStatesPaleOakStairs,
  'pale_oak_trapdoor': JsonMcdocBlockStatesPaleOakTrapdoor,
  'minecraft:pale_oak_trapdoor': JsonMcdocBlockStatesPaleOakTrapdoor,
  'pale_oak_wall_hanging_sign': JsonMcdocBlockStatesPaleOakWallHangingSign,
  'minecraft:pale_oak_wall_hanging_sign': JsonMcdocBlockStatesPaleOakWallHangingSign,
  'pale_oak_wall_sign': JsonMcdocBlockStatesPaleOakWallSign,
  'minecraft:pale_oak_wall_sign': JsonMcdocBlockStatesPaleOakWallSign,
  'pale_oak_wood': JsonMcdocBlockStatesPaleOakWood,
  'minecraft:pale_oak_wood': JsonMcdocBlockStatesPaleOakWood,
  'pearlescent_froglight': JsonMcdocBlockStatesPearlescentFroglight,
  'minecraft:pearlescent_froglight': JsonMcdocBlockStatesPearlescentFroglight,
  'peony': JsonMcdocBlockStatesPeony,
  'minecraft:peony': JsonMcdocBlockStatesPeony,
  'petrified_oak_slab': JsonMcdocBlockStatesPetrifiedOakSlab,
  'minecraft:petrified_oak_slab': JsonMcdocBlockStatesPetrifiedOakSlab,
  'piglin_head': JsonMcdocBlockStatesPiglinHead,
  'minecraft:piglin_head': JsonMcdocBlockStatesPiglinHead,
  'piglin_wall_head': JsonMcdocBlockStatesPiglinWallHead,
  'minecraft:piglin_wall_head': JsonMcdocBlockStatesPiglinWallHead,
  'pink_banner': JsonMcdocBlockStatesPinkBanner,
  'minecraft:pink_banner': JsonMcdocBlockStatesPinkBanner,
  'pink_bed': JsonMcdocBlockStatesPinkBed,
  'minecraft:pink_bed': JsonMcdocBlockStatesPinkBed,
  'pink_candle': JsonMcdocBlockStatesPinkCandle,
  'minecraft:pink_candle': JsonMcdocBlockStatesPinkCandle,
  'pink_candle_cake': JsonMcdocBlockStatesPinkCandleCake,
  'minecraft:pink_candle_cake': JsonMcdocBlockStatesPinkCandleCake,
  'pink_carpet': JsonMcdocBlockStatesPinkCarpet,
  'minecraft:pink_carpet': JsonMcdocBlockStatesPinkCarpet,
  'pink_concrete': JsonMcdocBlockStatesPinkConcrete,
  'minecraft:pink_concrete': JsonMcdocBlockStatesPinkConcrete,
  'pink_concrete_powder': JsonMcdocBlockStatesPinkConcretePowder,
  'minecraft:pink_concrete_powder': JsonMcdocBlockStatesPinkConcretePowder,
  'pink_concrete_slab': JsonMcdocBlockStatesPinkConcreteSlab,
  'minecraft:pink_concrete_slab': JsonMcdocBlockStatesPinkConcreteSlab,
  'pink_concrete_stairs': JsonMcdocBlockStatesPinkConcreteStairs,
  'minecraft:pink_concrete_stairs': JsonMcdocBlockStatesPinkConcreteStairs,
  'pink_glazed_terracotta': JsonMcdocBlockStatesPinkGlazedTerracotta,
  'minecraft:pink_glazed_terracotta': JsonMcdocBlockStatesPinkGlazedTerracotta,
  'pink_petals': JsonMcdocBlockStatesPinkPetals,
  'minecraft:pink_petals': JsonMcdocBlockStatesPinkPetals,
  'pink_shulker_box': JsonMcdocBlockStatesPinkShulkerBox,
  'minecraft:pink_shulker_box': JsonMcdocBlockStatesPinkShulkerBox,
  'pink_stained_glass': JsonMcdocBlockStatesPinkStainedGlass,
  'minecraft:pink_stained_glass': JsonMcdocBlockStatesPinkStainedGlass,
  'pink_stained_glass_pane': JsonMcdocBlockStatesPinkStainedGlassPane,
  'minecraft:pink_stained_glass_pane': JsonMcdocBlockStatesPinkStainedGlassPane,
  'pink_terracotta': JsonMcdocBlockStatesPinkTerracotta,
  'minecraft:pink_terracotta': JsonMcdocBlockStatesPinkTerracotta,
  'pink_tulip': JsonMcdocBlockStatesPinkTulip,
  'minecraft:pink_tulip': JsonMcdocBlockStatesPinkTulip,
  'pink_wall_banner': JsonMcdocBlockStatesPinkWallBanner,
  'minecraft:pink_wall_banner': JsonMcdocBlockStatesPinkWallBanner,
  'pink_wool': JsonMcdocBlockStatesPinkWool,
  'minecraft:pink_wool': JsonMcdocBlockStatesPinkWool,
  'pink_wool_slab': JsonMcdocBlockStatesPinkWoolSlab,
  'minecraft:pink_wool_slab': JsonMcdocBlockStatesPinkWoolSlab,
  'pink_wool_stairs': JsonMcdocBlockStatesPinkWoolStairs,
  'minecraft:pink_wool_stairs': JsonMcdocBlockStatesPinkWoolStairs,
  'piston': JsonMcdocBlockStatesPiston,
  'minecraft:piston': JsonMcdocBlockStatesPiston,
  'piston_head': JsonMcdocBlockStatesPistonHead,
  'minecraft:piston_head': JsonMcdocBlockStatesPistonHead,
  'pitcher_crop': JsonMcdocBlockStatesPitcherCrop,
  'minecraft:pitcher_crop': JsonMcdocBlockStatesPitcherCrop,
  'pitcher_plant': JsonMcdocBlockStatesPitcherPlant,
  'minecraft:pitcher_plant': JsonMcdocBlockStatesPitcherPlant,
  'player_head': JsonMcdocBlockStatesPlayerHead,
  'minecraft:player_head': JsonMcdocBlockStatesPlayerHead,
  'player_wall_head': JsonMcdocBlockStatesPlayerWallHead,
  'minecraft:player_wall_head': JsonMcdocBlockStatesPlayerWallHead,
  'podzol': JsonMcdocBlockStatesPodzol,
  'minecraft:podzol': JsonMcdocBlockStatesPodzol,
  'pointed_dripstone': JsonMcdocBlockStatesPointedDripstone,
  'minecraft:pointed_dripstone': JsonMcdocBlockStatesPointedDripstone,
  'polished_andesite': JsonMcdocBlockStatesPolishedAndesite,
  'minecraft:polished_andesite': JsonMcdocBlockStatesPolishedAndesite,
  'polished_andesite_slab': JsonMcdocBlockStatesPolishedAndesiteSlab,
  'minecraft:polished_andesite_slab': JsonMcdocBlockStatesPolishedAndesiteSlab,
  'polished_andesite_stairs': JsonMcdocBlockStatesPolishedAndesiteStairs,
  'minecraft:polished_andesite_stairs': JsonMcdocBlockStatesPolishedAndesiteStairs,
  'polished_basalt': JsonMcdocBlockStatesPolishedBasalt,
  'minecraft:polished_basalt': JsonMcdocBlockStatesPolishedBasalt,
  'polished_blackstone': JsonMcdocBlockStatesPolishedBlackstone,
  'minecraft:polished_blackstone': JsonMcdocBlockStatesPolishedBlackstone,
  'polished_blackstone_brick_slab': JsonMcdocBlockStatesPolishedBlackstoneBrickSlab,
  'minecraft:polished_blackstone_brick_slab': JsonMcdocBlockStatesPolishedBlackstoneBrickSlab,
  'polished_blackstone_brick_stairs': JsonMcdocBlockStatesPolishedBlackstoneBrickStairs,
  'minecraft:polished_blackstone_brick_stairs': JsonMcdocBlockStatesPolishedBlackstoneBrickStairs,
  'polished_blackstone_brick_wall': JsonMcdocBlockStatesPolishedBlackstoneBrickWall,
  'minecraft:polished_blackstone_brick_wall': JsonMcdocBlockStatesPolishedBlackstoneBrickWall,
  'polished_blackstone_bricks': JsonMcdocBlockStatesPolishedBlackstoneBricks,
  'minecraft:polished_blackstone_bricks': JsonMcdocBlockStatesPolishedBlackstoneBricks,
  'polished_blackstone_button': JsonMcdocBlockStatesPolishedBlackstoneButton,
  'minecraft:polished_blackstone_button': JsonMcdocBlockStatesPolishedBlackstoneButton,
  'polished_blackstone_pressure_plate': JsonMcdocBlockStatesPolishedBlackstonePressurePlate,
  'minecraft:polished_blackstone_pressure_plate': JsonMcdocBlockStatesPolishedBlackstonePressurePlate,
  'polished_blackstone_slab': JsonMcdocBlockStatesPolishedBlackstoneSlab,
  'minecraft:polished_blackstone_slab': JsonMcdocBlockStatesPolishedBlackstoneSlab,
  'polished_blackstone_stairs': JsonMcdocBlockStatesPolishedBlackstoneStairs,
  'minecraft:polished_blackstone_stairs': JsonMcdocBlockStatesPolishedBlackstoneStairs,
  'polished_blackstone_wall': JsonMcdocBlockStatesPolishedBlackstoneWall,
  'minecraft:polished_blackstone_wall': JsonMcdocBlockStatesPolishedBlackstoneWall,
  'polished_cinnabar': JsonMcdocBlockStatesPolishedCinnabar,
  'minecraft:polished_cinnabar': JsonMcdocBlockStatesPolishedCinnabar,
  'polished_cinnabar_slab': JsonMcdocBlockStatesPolishedCinnabarSlab,
  'minecraft:polished_cinnabar_slab': JsonMcdocBlockStatesPolishedCinnabarSlab,
  'polished_cinnabar_stairs': JsonMcdocBlockStatesPolishedCinnabarStairs,
  'minecraft:polished_cinnabar_stairs': JsonMcdocBlockStatesPolishedCinnabarStairs,
  'polished_cinnabar_wall': JsonMcdocBlockStatesPolishedCinnabarWall,
  'minecraft:polished_cinnabar_wall': JsonMcdocBlockStatesPolishedCinnabarWall,
  'polished_deepslate': JsonMcdocBlockStatesPolishedDeepslate,
  'minecraft:polished_deepslate': JsonMcdocBlockStatesPolishedDeepslate,
  'polished_deepslate_slab': JsonMcdocBlockStatesPolishedDeepslateSlab,
  'minecraft:polished_deepslate_slab': JsonMcdocBlockStatesPolishedDeepslateSlab,
  'polished_deepslate_stairs': JsonMcdocBlockStatesPolishedDeepslateStairs,
  'minecraft:polished_deepslate_stairs': JsonMcdocBlockStatesPolishedDeepslateStairs,
  'polished_deepslate_wall': JsonMcdocBlockStatesPolishedDeepslateWall,
  'minecraft:polished_deepslate_wall': JsonMcdocBlockStatesPolishedDeepslateWall,
  'polished_diorite': JsonMcdocBlockStatesPolishedDiorite,
  'minecraft:polished_diorite': JsonMcdocBlockStatesPolishedDiorite,
  'polished_diorite_slab': JsonMcdocBlockStatesPolishedDioriteSlab,
  'minecraft:polished_diorite_slab': JsonMcdocBlockStatesPolishedDioriteSlab,
  'polished_diorite_stairs': JsonMcdocBlockStatesPolishedDioriteStairs,
  'minecraft:polished_diorite_stairs': JsonMcdocBlockStatesPolishedDioriteStairs,
  'polished_granite': JsonMcdocBlockStatesPolishedGranite,
  'minecraft:polished_granite': JsonMcdocBlockStatesPolishedGranite,
  'polished_granite_slab': JsonMcdocBlockStatesPolishedGraniteSlab,
  'minecraft:polished_granite_slab': JsonMcdocBlockStatesPolishedGraniteSlab,
  'polished_granite_stairs': JsonMcdocBlockStatesPolishedGraniteStairs,
  'minecraft:polished_granite_stairs': JsonMcdocBlockStatesPolishedGraniteStairs,
  'polished_sulfur': JsonMcdocBlockStatesPolishedSulfur,
  'minecraft:polished_sulfur': JsonMcdocBlockStatesPolishedSulfur,
  'polished_sulfur_slab': JsonMcdocBlockStatesPolishedSulfurSlab,
  'minecraft:polished_sulfur_slab': JsonMcdocBlockStatesPolishedSulfurSlab,
  'polished_sulfur_stairs': JsonMcdocBlockStatesPolishedSulfurStairs,
  'minecraft:polished_sulfur_stairs': JsonMcdocBlockStatesPolishedSulfurStairs,
  'polished_sulfur_wall': JsonMcdocBlockStatesPolishedSulfurWall,
  'minecraft:polished_sulfur_wall': JsonMcdocBlockStatesPolishedSulfurWall,
  'polished_tuff': JsonMcdocBlockStatesPolishedTuff,
  'minecraft:polished_tuff': JsonMcdocBlockStatesPolishedTuff,
  'polished_tuff_slab': JsonMcdocBlockStatesPolishedTuffSlab,
  'minecraft:polished_tuff_slab': JsonMcdocBlockStatesPolishedTuffSlab,
  'polished_tuff_stairs': JsonMcdocBlockStatesPolishedTuffStairs,
  'minecraft:polished_tuff_stairs': JsonMcdocBlockStatesPolishedTuffStairs,
  'polished_tuff_wall': JsonMcdocBlockStatesPolishedTuffWall,
  'minecraft:polished_tuff_wall': JsonMcdocBlockStatesPolishedTuffWall,
  'poplar_button': JsonMcdocBlockStatesPoplarButton,
  'minecraft:poplar_button': JsonMcdocBlockStatesPoplarButton,
  'poplar_door': JsonMcdocBlockStatesPoplarDoor,
  'minecraft:poplar_door': JsonMcdocBlockStatesPoplarDoor,
  'poplar_fence': JsonMcdocBlockStatesPoplarFence,
  'minecraft:poplar_fence': JsonMcdocBlockStatesPoplarFence,
  'poplar_fence_gate': JsonMcdocBlockStatesPoplarFenceGate,
  'minecraft:poplar_fence_gate': JsonMcdocBlockStatesPoplarFenceGate,
  'poplar_hanging_sign': JsonMcdocBlockStatesPoplarHangingSign,
  'minecraft:poplar_hanging_sign': JsonMcdocBlockStatesPoplarHangingSign,
  'poplar_log': JsonMcdocBlockStatesPoplarLog,
  'minecraft:poplar_log': JsonMcdocBlockStatesPoplarLog,
  'poplar_planks': JsonMcdocBlockStatesPoplarPlanks,
  'minecraft:poplar_planks': JsonMcdocBlockStatesPoplarPlanks,
  'poplar_pressure_plate': JsonMcdocBlockStatesPoplarPressurePlate,
  'minecraft:poplar_pressure_plate': JsonMcdocBlockStatesPoplarPressurePlate,
  'poplar_sapling': JsonMcdocBlockStatesPoplarSapling,
  'minecraft:poplar_sapling': JsonMcdocBlockStatesPoplarSapling,
  'poplar_shelf': JsonMcdocBlockStatesPoplarShelf,
  'minecraft:poplar_shelf': JsonMcdocBlockStatesPoplarShelf,
  'poplar_sign': JsonMcdocBlockStatesPoplarSign,
  'minecraft:poplar_sign': JsonMcdocBlockStatesPoplarSign,
  'poplar_slab': JsonMcdocBlockStatesPoplarSlab,
  'minecraft:poplar_slab': JsonMcdocBlockStatesPoplarSlab,
  'poplar_stairs': JsonMcdocBlockStatesPoplarStairs,
  'minecraft:poplar_stairs': JsonMcdocBlockStatesPoplarStairs,
  'poplar_trapdoor': JsonMcdocBlockStatesPoplarTrapdoor,
  'minecraft:poplar_trapdoor': JsonMcdocBlockStatesPoplarTrapdoor,
  'poplar_wall_hanging_sign': JsonMcdocBlockStatesPoplarWallHangingSign,
  'minecraft:poplar_wall_hanging_sign': JsonMcdocBlockStatesPoplarWallHangingSign,
  'poplar_wall_sign': JsonMcdocBlockStatesPoplarWallSign,
  'minecraft:poplar_wall_sign': JsonMcdocBlockStatesPoplarWallSign,
  'poplar_wood': JsonMcdocBlockStatesPoplarWood,
  'minecraft:poplar_wood': JsonMcdocBlockStatesPoplarWood,
  'poppy': JsonMcdocBlockStatesPoppy,
  'minecraft:poppy': JsonMcdocBlockStatesPoppy,
  'potatoes': JsonMcdocBlockStatesPotatoes,
  'minecraft:potatoes': JsonMcdocBlockStatesPotatoes,
  'potent_sulfur': JsonMcdocBlockStatesPotentSulfur,
  'minecraft:potent_sulfur': JsonMcdocBlockStatesPotentSulfur,
  'potted_acacia_sapling': JsonMcdocBlockStatesPottedAcaciaSapling,
  'minecraft:potted_acacia_sapling': JsonMcdocBlockStatesPottedAcaciaSapling,
  'potted_allium': JsonMcdocBlockStatesPottedAllium,
  'minecraft:potted_allium': JsonMcdocBlockStatesPottedAllium,
  'potted_azalea_bush': JsonMcdocBlockStatesPottedAzaleaBush,
  'minecraft:potted_azalea_bush': JsonMcdocBlockStatesPottedAzaleaBush,
  'potted_azure_bluet': JsonMcdocBlockStatesPottedAzureBluet,
  'minecraft:potted_azure_bluet': JsonMcdocBlockStatesPottedAzureBluet,
  'potted_bamboo': JsonMcdocBlockStatesPottedBamboo,
  'minecraft:potted_bamboo': JsonMcdocBlockStatesPottedBamboo,
  'potted_birch_sapling': JsonMcdocBlockStatesPottedBirchSapling,
  'minecraft:potted_birch_sapling': JsonMcdocBlockStatesPottedBirchSapling,
  'potted_blue_orchid': JsonMcdocBlockStatesPottedBlueOrchid,
  'minecraft:potted_blue_orchid': JsonMcdocBlockStatesPottedBlueOrchid,
  'potted_brown_mushroom': JsonMcdocBlockStatesPottedBrownMushroom,
  'minecraft:potted_brown_mushroom': JsonMcdocBlockStatesPottedBrownMushroom,
  'potted_cactus': JsonMcdocBlockStatesPottedCactus,
  'minecraft:potted_cactus': JsonMcdocBlockStatesPottedCactus,
  'potted_cherry_sapling': JsonMcdocBlockStatesPottedCherrySapling,
  'minecraft:potted_cherry_sapling': JsonMcdocBlockStatesPottedCherrySapling,
  'potted_closed_eyeblossom': JsonMcdocBlockStatesPottedClosedEyeblossom,
  'minecraft:potted_closed_eyeblossom': JsonMcdocBlockStatesPottedClosedEyeblossom,
  'potted_cornflower': JsonMcdocBlockStatesPottedCornflower,
  'minecraft:potted_cornflower': JsonMcdocBlockStatesPottedCornflower,
  'potted_crimson_fungus': JsonMcdocBlockStatesPottedCrimsonFungus,
  'minecraft:potted_crimson_fungus': JsonMcdocBlockStatesPottedCrimsonFungus,
  'potted_crimson_roots': JsonMcdocBlockStatesPottedCrimsonRoots,
  'minecraft:potted_crimson_roots': JsonMcdocBlockStatesPottedCrimsonRoots,
  'potted_dandelion': JsonMcdocBlockStatesPottedDandelion,
  'minecraft:potted_dandelion': JsonMcdocBlockStatesPottedDandelion,
  'potted_dark_oak_sapling': JsonMcdocBlockStatesPottedDarkOakSapling,
  'minecraft:potted_dark_oak_sapling': JsonMcdocBlockStatesPottedDarkOakSapling,
  'potted_dead_bush': JsonMcdocBlockStatesPottedDeadBush,
  'minecraft:potted_dead_bush': JsonMcdocBlockStatesPottedDeadBush,
  'potted_fern': JsonMcdocBlockStatesPottedFern,
  'minecraft:potted_fern': JsonMcdocBlockStatesPottedFern,
  'potted_flowering_azalea_bush': JsonMcdocBlockStatesPottedFloweringAzaleaBush,
  'minecraft:potted_flowering_azalea_bush': JsonMcdocBlockStatesPottedFloweringAzaleaBush,
  'potted_golden_dandelion': JsonMcdocBlockStatesPottedGoldenDandelion,
  'minecraft:potted_golden_dandelion': JsonMcdocBlockStatesPottedGoldenDandelion,
  'potted_jungle_sapling': JsonMcdocBlockStatesPottedJungleSapling,
  'minecraft:potted_jungle_sapling': JsonMcdocBlockStatesPottedJungleSapling,
  'potted_lily_of_the_valley': JsonMcdocBlockStatesPottedLilyOfTheValley,
  'minecraft:potted_lily_of_the_valley': JsonMcdocBlockStatesPottedLilyOfTheValley,
  'potted_mangrove_propagule': JsonMcdocBlockStatesPottedMangrovePropagule,
  'minecraft:potted_mangrove_propagule': JsonMcdocBlockStatesPottedMangrovePropagule,
  'potted_oak_sapling': JsonMcdocBlockStatesPottedOakSapling,
  'minecraft:potted_oak_sapling': JsonMcdocBlockStatesPottedOakSapling,
  'potted_open_eyeblossom': JsonMcdocBlockStatesPottedOpenEyeblossom,
  'minecraft:potted_open_eyeblossom': JsonMcdocBlockStatesPottedOpenEyeblossom,
  'potted_orange_tulip': JsonMcdocBlockStatesPottedOrangeTulip,
  'minecraft:potted_orange_tulip': JsonMcdocBlockStatesPottedOrangeTulip,
  'potted_oxeye_daisy': JsonMcdocBlockStatesPottedOxeyeDaisy,
  'minecraft:potted_oxeye_daisy': JsonMcdocBlockStatesPottedOxeyeDaisy,
  'potted_pale_oak_sapling': JsonMcdocBlockStatesPottedPaleOakSapling,
  'minecraft:potted_pale_oak_sapling': JsonMcdocBlockStatesPottedPaleOakSapling,
  'potted_pink_tulip': JsonMcdocBlockStatesPottedPinkTulip,
  'minecraft:potted_pink_tulip': JsonMcdocBlockStatesPottedPinkTulip,
  'potted_poplar_sapling': JsonMcdocBlockStatesPottedPoplarSapling,
  'minecraft:potted_poplar_sapling': JsonMcdocBlockStatesPottedPoplarSapling,
  'potted_poppy': JsonMcdocBlockStatesPottedPoppy,
  'minecraft:potted_poppy': JsonMcdocBlockStatesPottedPoppy,
  'potted_red_mushroom': JsonMcdocBlockStatesPottedRedMushroom,
  'minecraft:potted_red_mushroom': JsonMcdocBlockStatesPottedRedMushroom,
  'potted_red_tulip': JsonMcdocBlockStatesPottedRedTulip,
  'minecraft:potted_red_tulip': JsonMcdocBlockStatesPottedRedTulip,
  'potted_spruce_sapling': JsonMcdocBlockStatesPottedSpruceSapling,
  'minecraft:potted_spruce_sapling': JsonMcdocBlockStatesPottedSpruceSapling,
  'potted_torchflower': JsonMcdocBlockStatesPottedTorchflower,
  'minecraft:potted_torchflower': JsonMcdocBlockStatesPottedTorchflower,
  'potted_warped_fungus': JsonMcdocBlockStatesPottedWarpedFungus,
  'minecraft:potted_warped_fungus': JsonMcdocBlockStatesPottedWarpedFungus,
  'potted_warped_roots': JsonMcdocBlockStatesPottedWarpedRoots,
  'minecraft:potted_warped_roots': JsonMcdocBlockStatesPottedWarpedRoots,
  'potted_white_tulip': JsonMcdocBlockStatesPottedWhiteTulip,
  'minecraft:potted_white_tulip': JsonMcdocBlockStatesPottedWhiteTulip,
  'potted_wither_rose': JsonMcdocBlockStatesPottedWitherRose,
  'minecraft:potted_wither_rose': JsonMcdocBlockStatesPottedWitherRose,
  'powder_snow': JsonMcdocBlockStatesPowderSnow,
  'minecraft:powder_snow': JsonMcdocBlockStatesPowderSnow,
  'powder_snow_cauldron': JsonMcdocBlockStatesPowderSnowCauldron,
  'minecraft:powder_snow_cauldron': JsonMcdocBlockStatesPowderSnowCauldron,
  'powered_rail': JsonMcdocBlockStatesPoweredRail,
  'minecraft:powered_rail': JsonMcdocBlockStatesPoweredRail,
  'prismarine': JsonMcdocBlockStatesPrismarine,
  'minecraft:prismarine': JsonMcdocBlockStatesPrismarine,
  'prismarine_brick_slab': JsonMcdocBlockStatesPrismarineBrickSlab,
  'minecraft:prismarine_brick_slab': JsonMcdocBlockStatesPrismarineBrickSlab,
  'prismarine_brick_stairs': JsonMcdocBlockStatesPrismarineBrickStairs,
  'minecraft:prismarine_brick_stairs': JsonMcdocBlockStatesPrismarineBrickStairs,
  'prismarine_bricks': JsonMcdocBlockStatesPrismarineBricks,
  'minecraft:prismarine_bricks': JsonMcdocBlockStatesPrismarineBricks,
  'prismarine_slab': JsonMcdocBlockStatesPrismarineSlab,
  'minecraft:prismarine_slab': JsonMcdocBlockStatesPrismarineSlab,
  'prismarine_stairs': JsonMcdocBlockStatesPrismarineStairs,
  'minecraft:prismarine_stairs': JsonMcdocBlockStatesPrismarineStairs,
  'prismarine_wall': JsonMcdocBlockStatesPrismarineWall,
  'minecraft:prismarine_wall': JsonMcdocBlockStatesPrismarineWall,
  'pumpkin': JsonMcdocBlockStatesPumpkin,
  'minecraft:pumpkin': JsonMcdocBlockStatesPumpkin,
  'pumpkin_stem': JsonMcdocBlockStatesPumpkinStem,
  'minecraft:pumpkin_stem': JsonMcdocBlockStatesPumpkinStem,
  'purple_banner': JsonMcdocBlockStatesPurpleBanner,
  'minecraft:purple_banner': JsonMcdocBlockStatesPurpleBanner,
  'purple_bed': JsonMcdocBlockStatesPurpleBed,
  'minecraft:purple_bed': JsonMcdocBlockStatesPurpleBed,
  'purple_candle': JsonMcdocBlockStatesPurpleCandle,
  'minecraft:purple_candle': JsonMcdocBlockStatesPurpleCandle,
  'purple_candle_cake': JsonMcdocBlockStatesPurpleCandleCake,
  'minecraft:purple_candle_cake': JsonMcdocBlockStatesPurpleCandleCake,
  'purple_carpet': JsonMcdocBlockStatesPurpleCarpet,
  'minecraft:purple_carpet': JsonMcdocBlockStatesPurpleCarpet,
  'purple_concrete': JsonMcdocBlockStatesPurpleConcrete,
  'minecraft:purple_concrete': JsonMcdocBlockStatesPurpleConcrete,
  'purple_concrete_powder': JsonMcdocBlockStatesPurpleConcretePowder,
  'minecraft:purple_concrete_powder': JsonMcdocBlockStatesPurpleConcretePowder,
  'purple_concrete_slab': JsonMcdocBlockStatesPurpleConcreteSlab,
  'minecraft:purple_concrete_slab': JsonMcdocBlockStatesPurpleConcreteSlab,
  'purple_concrete_stairs': JsonMcdocBlockStatesPurpleConcreteStairs,
  'minecraft:purple_concrete_stairs': JsonMcdocBlockStatesPurpleConcreteStairs,
  'purple_glazed_terracotta': JsonMcdocBlockStatesPurpleGlazedTerracotta,
  'minecraft:purple_glazed_terracotta': JsonMcdocBlockStatesPurpleGlazedTerracotta,
  'purple_shulker_box': JsonMcdocBlockStatesPurpleShulkerBox,
  'minecraft:purple_shulker_box': JsonMcdocBlockStatesPurpleShulkerBox,
  'purple_stained_glass': JsonMcdocBlockStatesPurpleStainedGlass,
  'minecraft:purple_stained_glass': JsonMcdocBlockStatesPurpleStainedGlass,
  'purple_stained_glass_pane': JsonMcdocBlockStatesPurpleStainedGlassPane,
  'minecraft:purple_stained_glass_pane': JsonMcdocBlockStatesPurpleStainedGlassPane,
  'purple_terracotta': JsonMcdocBlockStatesPurpleTerracotta,
  'minecraft:purple_terracotta': JsonMcdocBlockStatesPurpleTerracotta,
  'purple_wall_banner': JsonMcdocBlockStatesPurpleWallBanner,
  'minecraft:purple_wall_banner': JsonMcdocBlockStatesPurpleWallBanner,
  'purple_wool': JsonMcdocBlockStatesPurpleWool,
  'minecraft:purple_wool': JsonMcdocBlockStatesPurpleWool,
  'purple_wool_slab': JsonMcdocBlockStatesPurpleWoolSlab,
  'minecraft:purple_wool_slab': JsonMcdocBlockStatesPurpleWoolSlab,
  'purple_wool_stairs': JsonMcdocBlockStatesPurpleWoolStairs,
  'minecraft:purple_wool_stairs': JsonMcdocBlockStatesPurpleWoolStairs,
  'purpur_block': JsonMcdocBlockStatesPurpurBlock,
  'minecraft:purpur_block': JsonMcdocBlockStatesPurpurBlock,
  'purpur_pillar': JsonMcdocBlockStatesPurpurPillar,
  'minecraft:purpur_pillar': JsonMcdocBlockStatesPurpurPillar,
  'purpur_slab': JsonMcdocBlockStatesPurpurSlab,
  'minecraft:purpur_slab': JsonMcdocBlockStatesPurpurSlab,
  'purpur_stairs': JsonMcdocBlockStatesPurpurStairs,
  'minecraft:purpur_stairs': JsonMcdocBlockStatesPurpurStairs,
  'quartz_block': JsonMcdocBlockStatesQuartzBlock,
  'minecraft:quartz_block': JsonMcdocBlockStatesQuartzBlock,
  'quartz_bricks': JsonMcdocBlockStatesQuartzBricks,
  'minecraft:quartz_bricks': JsonMcdocBlockStatesQuartzBricks,
  'quartz_pillar': JsonMcdocBlockStatesQuartzPillar,
  'minecraft:quartz_pillar': JsonMcdocBlockStatesQuartzPillar,
  'quartz_slab': JsonMcdocBlockStatesQuartzSlab,
  'minecraft:quartz_slab': JsonMcdocBlockStatesQuartzSlab,
  'quartz_stairs': JsonMcdocBlockStatesQuartzStairs,
  'minecraft:quartz_stairs': JsonMcdocBlockStatesQuartzStairs,
  'rail': JsonMcdocBlockStatesRail,
  'minecraft:rail': JsonMcdocBlockStatesRail,
  'raw_copper_block': JsonMcdocBlockStatesRawCopperBlock,
  'minecraft:raw_copper_block': JsonMcdocBlockStatesRawCopperBlock,
  'raw_gold_block': JsonMcdocBlockStatesRawGoldBlock,
  'minecraft:raw_gold_block': JsonMcdocBlockStatesRawGoldBlock,
  'raw_iron_block': JsonMcdocBlockStatesRawIronBlock,
  'minecraft:raw_iron_block': JsonMcdocBlockStatesRawIronBlock,
  'red_banner': JsonMcdocBlockStatesRedBanner,
  'minecraft:red_banner': JsonMcdocBlockStatesRedBanner,
  'red_bed': JsonMcdocBlockStatesRedBed,
  'minecraft:red_bed': JsonMcdocBlockStatesRedBed,
  'red_candle': JsonMcdocBlockStatesRedCandle,
  'minecraft:red_candle': JsonMcdocBlockStatesRedCandle,
  'red_candle_cake': JsonMcdocBlockStatesRedCandleCake,
  'minecraft:red_candle_cake': JsonMcdocBlockStatesRedCandleCake,
  'red_carpet': JsonMcdocBlockStatesRedCarpet,
  'minecraft:red_carpet': JsonMcdocBlockStatesRedCarpet,
  'red_concrete': JsonMcdocBlockStatesRedConcrete,
  'minecraft:red_concrete': JsonMcdocBlockStatesRedConcrete,
  'red_concrete_powder': JsonMcdocBlockStatesRedConcretePowder,
  'minecraft:red_concrete_powder': JsonMcdocBlockStatesRedConcretePowder,
  'red_concrete_slab': JsonMcdocBlockStatesRedConcreteSlab,
  'minecraft:red_concrete_slab': JsonMcdocBlockStatesRedConcreteSlab,
  'red_concrete_stairs': JsonMcdocBlockStatesRedConcreteStairs,
  'minecraft:red_concrete_stairs': JsonMcdocBlockStatesRedConcreteStairs,
  'red_glazed_terracotta': JsonMcdocBlockStatesRedGlazedTerracotta,
  'minecraft:red_glazed_terracotta': JsonMcdocBlockStatesRedGlazedTerracotta,
  'red_mushroom': JsonMcdocBlockStatesRedMushroom,
  'minecraft:red_mushroom': JsonMcdocBlockStatesRedMushroom,
  'red_mushroom_block': JsonMcdocBlockStatesRedMushroomBlock,
  'minecraft:red_mushroom_block': JsonMcdocBlockStatesRedMushroomBlock,
  'red_nether_brick_slab': JsonMcdocBlockStatesRedNetherBrickSlab,
  'minecraft:red_nether_brick_slab': JsonMcdocBlockStatesRedNetherBrickSlab,
  'red_nether_brick_stairs': JsonMcdocBlockStatesRedNetherBrickStairs,
  'minecraft:red_nether_brick_stairs': JsonMcdocBlockStatesRedNetherBrickStairs,
  'red_nether_brick_wall': JsonMcdocBlockStatesRedNetherBrickWall,
  'minecraft:red_nether_brick_wall': JsonMcdocBlockStatesRedNetherBrickWall,
  'red_nether_bricks': JsonMcdocBlockStatesRedNetherBricks,
  'minecraft:red_nether_bricks': JsonMcdocBlockStatesRedNetherBricks,
  'red_poplar_leaves': JsonMcdocBlockStatesRedPoplarLeaves,
  'minecraft:red_poplar_leaves': JsonMcdocBlockStatesRedPoplarLeaves,
  'red_sand': JsonMcdocBlockStatesRedSand,
  'minecraft:red_sand': JsonMcdocBlockStatesRedSand,
  'red_sandstone': JsonMcdocBlockStatesRedSandstone,
  'minecraft:red_sandstone': JsonMcdocBlockStatesRedSandstone,
  'red_sandstone_slab': JsonMcdocBlockStatesRedSandstoneSlab,
  'minecraft:red_sandstone_slab': JsonMcdocBlockStatesRedSandstoneSlab,
  'red_sandstone_stairs': JsonMcdocBlockStatesRedSandstoneStairs,
  'minecraft:red_sandstone_stairs': JsonMcdocBlockStatesRedSandstoneStairs,
  'red_sandstone_wall': JsonMcdocBlockStatesRedSandstoneWall,
  'minecraft:red_sandstone_wall': JsonMcdocBlockStatesRedSandstoneWall,
  'red_shrub': JsonMcdocBlockStatesRedShrub,
  'minecraft:red_shrub': JsonMcdocBlockStatesRedShrub,
  'red_shulker_box': JsonMcdocBlockStatesRedShulkerBox,
  'minecraft:red_shulker_box': JsonMcdocBlockStatesRedShulkerBox,
  'red_stained_glass': JsonMcdocBlockStatesRedStainedGlass,
  'minecraft:red_stained_glass': JsonMcdocBlockStatesRedStainedGlass,
  'red_stained_glass_pane': JsonMcdocBlockStatesRedStainedGlassPane,
  'minecraft:red_stained_glass_pane': JsonMcdocBlockStatesRedStainedGlassPane,
  'red_terracotta': JsonMcdocBlockStatesRedTerracotta,
  'minecraft:red_terracotta': JsonMcdocBlockStatesRedTerracotta,
  'red_tulip': JsonMcdocBlockStatesRedTulip,
  'minecraft:red_tulip': JsonMcdocBlockStatesRedTulip,
  'red_wall_banner': JsonMcdocBlockStatesRedWallBanner,
  'minecraft:red_wall_banner': JsonMcdocBlockStatesRedWallBanner,
  'red_wool': JsonMcdocBlockStatesRedWool,
  'minecraft:red_wool': JsonMcdocBlockStatesRedWool,
  'red_wool_slab': JsonMcdocBlockStatesRedWoolSlab,
  'minecraft:red_wool_slab': JsonMcdocBlockStatesRedWoolSlab,
  'red_wool_stairs': JsonMcdocBlockStatesRedWoolStairs,
  'minecraft:red_wool_stairs': JsonMcdocBlockStatesRedWoolStairs,
  'redstone_block': JsonMcdocBlockStatesRedstoneBlock,
  'minecraft:redstone_block': JsonMcdocBlockStatesRedstoneBlock,
  'redstone_lamp': JsonMcdocBlockStatesRedstoneLamp,
  'minecraft:redstone_lamp': JsonMcdocBlockStatesRedstoneLamp,
  'redstone_ore': JsonMcdocBlockStatesRedstoneOre,
  'minecraft:redstone_ore': JsonMcdocBlockStatesRedstoneOre,
  'redstone_torch': JsonMcdocBlockStatesRedstoneTorch,
  'minecraft:redstone_torch': JsonMcdocBlockStatesRedstoneTorch,
  'redstone_wall_torch': JsonMcdocBlockStatesRedstoneWallTorch,
  'minecraft:redstone_wall_torch': JsonMcdocBlockStatesRedstoneWallTorch,
  'redstone_wire': JsonMcdocBlockStatesRedstoneWire,
  'minecraft:redstone_wire': JsonMcdocBlockStatesRedstoneWire,
  'reinforced_deepslate': JsonMcdocBlockStatesReinforcedDeepslate,
  'minecraft:reinforced_deepslate': JsonMcdocBlockStatesReinforcedDeepslate,
  'repeater': JsonMcdocBlockStatesRepeater,
  'minecraft:repeater': JsonMcdocBlockStatesRepeater,
  'repeating_command_block': JsonMcdocBlockStatesRepeatingCommandBlock,
  'minecraft:repeating_command_block': JsonMcdocBlockStatesRepeatingCommandBlock,
  'resin_block': JsonMcdocBlockStatesResinBlock,
  'minecraft:resin_block': JsonMcdocBlockStatesResinBlock,
  'resin_brick_slab': JsonMcdocBlockStatesResinBrickSlab,
  'minecraft:resin_brick_slab': JsonMcdocBlockStatesResinBrickSlab,
  'resin_brick_stairs': JsonMcdocBlockStatesResinBrickStairs,
  'minecraft:resin_brick_stairs': JsonMcdocBlockStatesResinBrickStairs,
  'resin_brick_wall': JsonMcdocBlockStatesResinBrickWall,
  'minecraft:resin_brick_wall': JsonMcdocBlockStatesResinBrickWall,
  'resin_bricks': JsonMcdocBlockStatesResinBricks,
  'minecraft:resin_bricks': JsonMcdocBlockStatesResinBricks,
  'resin_clump': JsonMcdocBlockStatesResinClump,
  'minecraft:resin_clump': JsonMcdocBlockStatesResinClump,
  'respawn_anchor': JsonMcdocBlockStatesRespawnAnchor,
  'minecraft:respawn_anchor': JsonMcdocBlockStatesRespawnAnchor,
  'rooted_dirt': JsonMcdocBlockStatesRootedDirt,
  'minecraft:rooted_dirt': JsonMcdocBlockStatesRootedDirt,
  'rose_bush': JsonMcdocBlockStatesRoseBush,
  'minecraft:rose_bush': JsonMcdocBlockStatesRoseBush,
  'sand': JsonMcdocBlockStatesSand,
  'minecraft:sand': JsonMcdocBlockStatesSand,
  'sandstone': JsonMcdocBlockStatesSandstone,
  'minecraft:sandstone': JsonMcdocBlockStatesSandstone,
  'sandstone_slab': JsonMcdocBlockStatesSandstoneSlab,
  'minecraft:sandstone_slab': JsonMcdocBlockStatesSandstoneSlab,
  'sandstone_stairs': JsonMcdocBlockStatesSandstoneStairs,
  'minecraft:sandstone_stairs': JsonMcdocBlockStatesSandstoneStairs,
  'sandstone_wall': JsonMcdocBlockStatesSandstoneWall,
  'minecraft:sandstone_wall': JsonMcdocBlockStatesSandstoneWall,
  'scaffolding': JsonMcdocBlockStatesScaffolding,
  'minecraft:scaffolding': JsonMcdocBlockStatesScaffolding,
  'sculk': JsonMcdocBlockStatesSculk,
  'minecraft:sculk': JsonMcdocBlockStatesSculk,
  'sculk_catalyst': JsonMcdocBlockStatesSculkCatalyst,
  'minecraft:sculk_catalyst': JsonMcdocBlockStatesSculkCatalyst,
  'sculk_sensor': JsonMcdocBlockStatesSculkSensor,
  'minecraft:sculk_sensor': JsonMcdocBlockStatesSculkSensor,
  'sculk_shrieker': JsonMcdocBlockStatesSculkShrieker,
  'minecraft:sculk_shrieker': JsonMcdocBlockStatesSculkShrieker,
  'sculk_vein': JsonMcdocBlockStatesSculkVein,
  'minecraft:sculk_vein': JsonMcdocBlockStatesSculkVein,
  'sea_lantern': JsonMcdocBlockStatesSeaLantern,
  'minecraft:sea_lantern': JsonMcdocBlockStatesSeaLantern,
  'sea_pickle': JsonMcdocBlockStatesSeaPickle,
  'minecraft:sea_pickle': JsonMcdocBlockStatesSeaPickle,
  'seagrass': JsonMcdocBlockStatesSeagrass,
  'minecraft:seagrass': JsonMcdocBlockStatesSeagrass,
  'shelf_mushroom': JsonMcdocBlockStatesShelfMushroom,
  'minecraft:shelf_mushroom': JsonMcdocBlockStatesShelfMushroom,
  'short_dry_grass': JsonMcdocBlockStatesShortDryGrass,
  'minecraft:short_dry_grass': JsonMcdocBlockStatesShortDryGrass,
  'short_grass': JsonMcdocBlockStatesShortGrass,
  'minecraft:short_grass': JsonMcdocBlockStatesShortGrass,
  'shroomlight': JsonMcdocBlockStatesShroomlight,
  'minecraft:shroomlight': JsonMcdocBlockStatesShroomlight,
  'shulker_box': JsonMcdocBlockStatesShulkerBox,
  'minecraft:shulker_box': JsonMcdocBlockStatesShulkerBox,
  'skeleton_skull': JsonMcdocBlockStatesSkeletonSkull,
  'minecraft:skeleton_skull': JsonMcdocBlockStatesSkeletonSkull,
  'skeleton_wall_skull': JsonMcdocBlockStatesSkeletonWallSkull,
  'minecraft:skeleton_wall_skull': JsonMcdocBlockStatesSkeletonWallSkull,
  'slime_block': JsonMcdocBlockStatesSlimeBlock,
  'minecraft:slime_block': JsonMcdocBlockStatesSlimeBlock,
  'small_amethyst_bud': JsonMcdocBlockStatesSmallAmethystBud,
  'minecraft:small_amethyst_bud': JsonMcdocBlockStatesSmallAmethystBud,
  'small_dripleaf': JsonMcdocBlockStatesSmallDripleaf,
  'minecraft:small_dripleaf': JsonMcdocBlockStatesSmallDripleaf,
  'smithing_table': JsonMcdocBlockStatesSmithingTable,
  'minecraft:smithing_table': JsonMcdocBlockStatesSmithingTable,
  'smoker': JsonMcdocBlockStatesSmoker,
  'minecraft:smoker': JsonMcdocBlockStatesSmoker,
  'smooth_basalt': JsonMcdocBlockStatesSmoothBasalt,
  'minecraft:smooth_basalt': JsonMcdocBlockStatesSmoothBasalt,
  'smooth_quartz': JsonMcdocBlockStatesSmoothQuartz,
  'minecraft:smooth_quartz': JsonMcdocBlockStatesSmoothQuartz,
  'smooth_quartz_slab': JsonMcdocBlockStatesSmoothQuartzSlab,
  'minecraft:smooth_quartz_slab': JsonMcdocBlockStatesSmoothQuartzSlab,
  'smooth_quartz_stairs': JsonMcdocBlockStatesSmoothQuartzStairs,
  'minecraft:smooth_quartz_stairs': JsonMcdocBlockStatesSmoothQuartzStairs,
  'smooth_red_sandstone': JsonMcdocBlockStatesSmoothRedSandstone,
  'minecraft:smooth_red_sandstone': JsonMcdocBlockStatesSmoothRedSandstone,
  'smooth_red_sandstone_slab': JsonMcdocBlockStatesSmoothRedSandstoneSlab,
  'minecraft:smooth_red_sandstone_slab': JsonMcdocBlockStatesSmoothRedSandstoneSlab,
  'smooth_red_sandstone_stairs': JsonMcdocBlockStatesSmoothRedSandstoneStairs,
  'minecraft:smooth_red_sandstone_stairs': JsonMcdocBlockStatesSmoothRedSandstoneStairs,
  'smooth_sandstone': JsonMcdocBlockStatesSmoothSandstone,
  'minecraft:smooth_sandstone': JsonMcdocBlockStatesSmoothSandstone,
  'smooth_sandstone_slab': JsonMcdocBlockStatesSmoothSandstoneSlab,
  'minecraft:smooth_sandstone_slab': JsonMcdocBlockStatesSmoothSandstoneSlab,
  'smooth_sandstone_stairs': JsonMcdocBlockStatesSmoothSandstoneStairs,
  'minecraft:smooth_sandstone_stairs': JsonMcdocBlockStatesSmoothSandstoneStairs,
  'smooth_stone': JsonMcdocBlockStatesSmoothStone,
  'minecraft:smooth_stone': JsonMcdocBlockStatesSmoothStone,
  'smooth_stone_slab': JsonMcdocBlockStatesSmoothStoneSlab,
  'minecraft:smooth_stone_slab': JsonMcdocBlockStatesSmoothStoneSlab,
  'sniffer_egg': JsonMcdocBlockStatesSnifferEgg,
  'minecraft:sniffer_egg': JsonMcdocBlockStatesSnifferEgg,
  'snow': JsonMcdocBlockStatesSnow,
  'minecraft:snow': JsonMcdocBlockStatesSnow,
  'snow_block': JsonMcdocBlockStatesSnowBlock,
  'minecraft:snow_block': JsonMcdocBlockStatesSnowBlock,
  'soul_campfire': JsonMcdocBlockStatesSoulCampfire,
  'minecraft:soul_campfire': JsonMcdocBlockStatesSoulCampfire,
  'soul_fire': JsonMcdocBlockStatesSoulFire,
  'minecraft:soul_fire': JsonMcdocBlockStatesSoulFire,
  'soul_lantern': JsonMcdocBlockStatesSoulLantern,
  'minecraft:soul_lantern': JsonMcdocBlockStatesSoulLantern,
  'soul_sand': JsonMcdocBlockStatesSoulSand,
  'minecraft:soul_sand': JsonMcdocBlockStatesSoulSand,
  'soul_soil': JsonMcdocBlockStatesSoulSoil,
  'minecraft:soul_soil': JsonMcdocBlockStatesSoulSoil,
  'soul_torch': JsonMcdocBlockStatesSoulTorch,
  'minecraft:soul_torch': JsonMcdocBlockStatesSoulTorch,
  'soul_wall_torch': JsonMcdocBlockStatesSoulWallTorch,
  'minecraft:soul_wall_torch': JsonMcdocBlockStatesSoulWallTorch,
  'spawner': JsonMcdocBlockStatesSpawner,
  'minecraft:spawner': JsonMcdocBlockStatesSpawner,
  'sponge': JsonMcdocBlockStatesSponge,
  'minecraft:sponge': JsonMcdocBlockStatesSponge,
  'spore_blossom': JsonMcdocBlockStatesSporeBlossom,
  'minecraft:spore_blossom': JsonMcdocBlockStatesSporeBlossom,
  'spruce_button': JsonMcdocBlockStatesSpruceButton,
  'minecraft:spruce_button': JsonMcdocBlockStatesSpruceButton,
  'spruce_door': JsonMcdocBlockStatesSpruceDoor,
  'minecraft:spruce_door': JsonMcdocBlockStatesSpruceDoor,
  'spruce_fence': JsonMcdocBlockStatesSpruceFence,
  'minecraft:spruce_fence': JsonMcdocBlockStatesSpruceFence,
  'spruce_fence_gate': JsonMcdocBlockStatesSpruceFenceGate,
  'minecraft:spruce_fence_gate': JsonMcdocBlockStatesSpruceFenceGate,
  'spruce_hanging_sign': JsonMcdocBlockStatesSpruceHangingSign,
  'minecraft:spruce_hanging_sign': JsonMcdocBlockStatesSpruceHangingSign,
  'spruce_leaves': JsonMcdocBlockStatesSpruceLeaves,
  'minecraft:spruce_leaves': JsonMcdocBlockStatesSpruceLeaves,
  'spruce_log': JsonMcdocBlockStatesSpruceLog,
  'minecraft:spruce_log': JsonMcdocBlockStatesSpruceLog,
  'spruce_planks': JsonMcdocBlockStatesSprucePlanks,
  'minecraft:spruce_planks': JsonMcdocBlockStatesSprucePlanks,
  'spruce_pressure_plate': JsonMcdocBlockStatesSprucePressurePlate,
  'minecraft:spruce_pressure_plate': JsonMcdocBlockStatesSprucePressurePlate,
  'spruce_sapling': JsonMcdocBlockStatesSpruceSapling,
  'minecraft:spruce_sapling': JsonMcdocBlockStatesSpruceSapling,
  'spruce_shelf': JsonMcdocBlockStatesSpruceShelf,
  'minecraft:spruce_shelf': JsonMcdocBlockStatesSpruceShelf,
  'spruce_sign': JsonMcdocBlockStatesSpruceSign,
  'minecraft:spruce_sign': JsonMcdocBlockStatesSpruceSign,
  'spruce_slab': JsonMcdocBlockStatesSpruceSlab,
  'minecraft:spruce_slab': JsonMcdocBlockStatesSpruceSlab,
  'spruce_stairs': JsonMcdocBlockStatesSpruceStairs,
  'minecraft:spruce_stairs': JsonMcdocBlockStatesSpruceStairs,
  'spruce_trapdoor': JsonMcdocBlockStatesSpruceTrapdoor,
  'minecraft:spruce_trapdoor': JsonMcdocBlockStatesSpruceTrapdoor,
  'spruce_wall_hanging_sign': JsonMcdocBlockStatesSpruceWallHangingSign,
  'minecraft:spruce_wall_hanging_sign': JsonMcdocBlockStatesSpruceWallHangingSign,
  'spruce_wall_sign': JsonMcdocBlockStatesSpruceWallSign,
  'minecraft:spruce_wall_sign': JsonMcdocBlockStatesSpruceWallSign,
  'spruce_wood': JsonMcdocBlockStatesSpruceWood,
  'minecraft:spruce_wood': JsonMcdocBlockStatesSpruceWood,
  'sticky_piston': JsonMcdocBlockStatesStickyPiston,
  'minecraft:sticky_piston': JsonMcdocBlockStatesStickyPiston,
  'stone': JsonMcdocBlockStatesStone,
  'minecraft:stone': JsonMcdocBlockStatesStone,
  'stone_brick_slab': JsonMcdocBlockStatesStoneBrickSlab,
  'minecraft:stone_brick_slab': JsonMcdocBlockStatesStoneBrickSlab,
  'stone_brick_stairs': JsonMcdocBlockStatesStoneBrickStairs,
  'minecraft:stone_brick_stairs': JsonMcdocBlockStatesStoneBrickStairs,
  'stone_brick_wall': JsonMcdocBlockStatesStoneBrickWall,
  'minecraft:stone_brick_wall': JsonMcdocBlockStatesStoneBrickWall,
  'stone_bricks': JsonMcdocBlockStatesStoneBricks,
  'minecraft:stone_bricks': JsonMcdocBlockStatesStoneBricks,
  'stone_button': JsonMcdocBlockStatesStoneButton,
  'minecraft:stone_button': JsonMcdocBlockStatesStoneButton,
  'stone_pressure_plate': JsonMcdocBlockStatesStonePressurePlate,
  'minecraft:stone_pressure_plate': JsonMcdocBlockStatesStonePressurePlate,
  'stone_slab': JsonMcdocBlockStatesStoneSlab,
  'minecraft:stone_slab': JsonMcdocBlockStatesStoneSlab,
  'stone_stairs': JsonMcdocBlockStatesStoneStairs,
  'minecraft:stone_stairs': JsonMcdocBlockStatesStoneStairs,
  'stonecutter': JsonMcdocBlockStatesStonecutter,
  'minecraft:stonecutter': JsonMcdocBlockStatesStonecutter,
  'straw_bed': JsonMcdocBlockStatesStrawBed,
  'minecraft:straw_bed': JsonMcdocBlockStatesStrawBed,
  'stripped_acacia_log': JsonMcdocBlockStatesStrippedAcaciaLog,
  'minecraft:stripped_acacia_log': JsonMcdocBlockStatesStrippedAcaciaLog,
  'stripped_acacia_wood': JsonMcdocBlockStatesStrippedAcaciaWood,
  'minecraft:stripped_acacia_wood': JsonMcdocBlockStatesStrippedAcaciaWood,
  'stripped_bamboo_block': JsonMcdocBlockStatesStrippedBambooBlock,
  'minecraft:stripped_bamboo_block': JsonMcdocBlockStatesStrippedBambooBlock,
  'stripped_birch_log': JsonMcdocBlockStatesStrippedBirchLog,
  'minecraft:stripped_birch_log': JsonMcdocBlockStatesStrippedBirchLog,
  'stripped_birch_wood': JsonMcdocBlockStatesStrippedBirchWood,
  'minecraft:stripped_birch_wood': JsonMcdocBlockStatesStrippedBirchWood,
  'stripped_cherry_log': JsonMcdocBlockStatesStrippedCherryLog,
  'minecraft:stripped_cherry_log': JsonMcdocBlockStatesStrippedCherryLog,
  'stripped_cherry_wood': JsonMcdocBlockStatesStrippedCherryWood,
  'minecraft:stripped_cherry_wood': JsonMcdocBlockStatesStrippedCherryWood,
  'stripped_crimson_hyphae': JsonMcdocBlockStatesStrippedCrimsonHyphae,
  'minecraft:stripped_crimson_hyphae': JsonMcdocBlockStatesStrippedCrimsonHyphae,
  'stripped_crimson_stem': JsonMcdocBlockStatesStrippedCrimsonStem,
  'minecraft:stripped_crimson_stem': JsonMcdocBlockStatesStrippedCrimsonStem,
  'stripped_dark_oak_log': JsonMcdocBlockStatesStrippedDarkOakLog,
  'minecraft:stripped_dark_oak_log': JsonMcdocBlockStatesStrippedDarkOakLog,
  'stripped_dark_oak_wood': JsonMcdocBlockStatesStrippedDarkOakWood,
  'minecraft:stripped_dark_oak_wood': JsonMcdocBlockStatesStrippedDarkOakWood,
  'stripped_jungle_log': JsonMcdocBlockStatesStrippedJungleLog,
  'minecraft:stripped_jungle_log': JsonMcdocBlockStatesStrippedJungleLog,
  'stripped_jungle_wood': JsonMcdocBlockStatesStrippedJungleWood,
  'minecraft:stripped_jungle_wood': JsonMcdocBlockStatesStrippedJungleWood,
  'stripped_mangrove_log': JsonMcdocBlockStatesStrippedMangroveLog,
  'minecraft:stripped_mangrove_log': JsonMcdocBlockStatesStrippedMangroveLog,
  'stripped_mangrove_wood': JsonMcdocBlockStatesStrippedMangroveWood,
  'minecraft:stripped_mangrove_wood': JsonMcdocBlockStatesStrippedMangroveWood,
  'stripped_oak_log': JsonMcdocBlockStatesStrippedOakLog,
  'minecraft:stripped_oak_log': JsonMcdocBlockStatesStrippedOakLog,
  'stripped_oak_wood': JsonMcdocBlockStatesStrippedOakWood,
  'minecraft:stripped_oak_wood': JsonMcdocBlockStatesStrippedOakWood,
  'stripped_pale_oak_log': JsonMcdocBlockStatesStrippedPaleOakLog,
  'minecraft:stripped_pale_oak_log': JsonMcdocBlockStatesStrippedPaleOakLog,
  'stripped_pale_oak_wood': JsonMcdocBlockStatesStrippedPaleOakWood,
  'minecraft:stripped_pale_oak_wood': JsonMcdocBlockStatesStrippedPaleOakWood,
  'stripped_poplar_log': JsonMcdocBlockStatesStrippedPoplarLog,
  'minecraft:stripped_poplar_log': JsonMcdocBlockStatesStrippedPoplarLog,
  'stripped_poplar_wood': JsonMcdocBlockStatesStrippedPoplarWood,
  'minecraft:stripped_poplar_wood': JsonMcdocBlockStatesStrippedPoplarWood,
  'stripped_spruce_log': JsonMcdocBlockStatesStrippedSpruceLog,
  'minecraft:stripped_spruce_log': JsonMcdocBlockStatesStrippedSpruceLog,
  'stripped_spruce_wood': JsonMcdocBlockStatesStrippedSpruceWood,
  'minecraft:stripped_spruce_wood': JsonMcdocBlockStatesStrippedSpruceWood,
  'stripped_warped_hyphae': JsonMcdocBlockStatesStrippedWarpedHyphae,
  'minecraft:stripped_warped_hyphae': JsonMcdocBlockStatesStrippedWarpedHyphae,
  'stripped_warped_stem': JsonMcdocBlockStatesStrippedWarpedStem,
  'minecraft:stripped_warped_stem': JsonMcdocBlockStatesStrippedWarpedStem,
  'structure_block': JsonMcdocBlockStatesStructureBlock,
  'minecraft:structure_block': JsonMcdocBlockStatesStructureBlock,
  'structure_void': JsonMcdocBlockStatesStructureVoid,
  'minecraft:structure_void': JsonMcdocBlockStatesStructureVoid,
  'sugar_cane': JsonMcdocBlockStatesSugarCane,
  'minecraft:sugar_cane': JsonMcdocBlockStatesSugarCane,
  'sulfur': JsonMcdocBlockStatesSulfur,
  'minecraft:sulfur': JsonMcdocBlockStatesSulfur,
  'sulfur_brick_slab': JsonMcdocBlockStatesSulfurBrickSlab,
  'minecraft:sulfur_brick_slab': JsonMcdocBlockStatesSulfurBrickSlab,
  'sulfur_brick_stairs': JsonMcdocBlockStatesSulfurBrickStairs,
  'minecraft:sulfur_brick_stairs': JsonMcdocBlockStatesSulfurBrickStairs,
  'sulfur_brick_wall': JsonMcdocBlockStatesSulfurBrickWall,
  'minecraft:sulfur_brick_wall': JsonMcdocBlockStatesSulfurBrickWall,
  'sulfur_bricks': JsonMcdocBlockStatesSulfurBricks,
  'minecraft:sulfur_bricks': JsonMcdocBlockStatesSulfurBricks,
  'sulfur_slab': JsonMcdocBlockStatesSulfurSlab,
  'minecraft:sulfur_slab': JsonMcdocBlockStatesSulfurSlab,
  'sulfur_spike': JsonMcdocBlockStatesSulfurSpike,
  'minecraft:sulfur_spike': JsonMcdocBlockStatesSulfurSpike,
  'sulfur_stairs': JsonMcdocBlockStatesSulfurStairs,
  'minecraft:sulfur_stairs': JsonMcdocBlockStatesSulfurStairs,
  'sulfur_wall': JsonMcdocBlockStatesSulfurWall,
  'minecraft:sulfur_wall': JsonMcdocBlockStatesSulfurWall,
  'sunflower': JsonMcdocBlockStatesSunflower,
  'minecraft:sunflower': JsonMcdocBlockStatesSunflower,
  'suspicious_gravel': JsonMcdocBlockStatesSuspiciousGravel,
  'minecraft:suspicious_gravel': JsonMcdocBlockStatesSuspiciousGravel,
  'suspicious_sand': JsonMcdocBlockStatesSuspiciousSand,
  'minecraft:suspicious_sand': JsonMcdocBlockStatesSuspiciousSand,
  'sweet_berry_bush': JsonMcdocBlockStatesSweetBerryBush,
  'minecraft:sweet_berry_bush': JsonMcdocBlockStatesSweetBerryBush,
  'tall_dry_grass': JsonMcdocBlockStatesTallDryGrass,
  'minecraft:tall_dry_grass': JsonMcdocBlockStatesTallDryGrass,
  'tall_grass': JsonMcdocBlockStatesTallGrass,
  'minecraft:tall_grass': JsonMcdocBlockStatesTallGrass,
  'tall_seagrass': JsonMcdocBlockStatesTallSeagrass,
  'minecraft:tall_seagrass': JsonMcdocBlockStatesTallSeagrass,
  'target': JsonMcdocBlockStatesTarget,
  'minecraft:target': JsonMcdocBlockStatesTarget,
  'terracotta': JsonMcdocBlockStatesTerracotta,
  'minecraft:terracotta': JsonMcdocBlockStatesTerracotta,
  'test_block': JsonMcdocBlockStatesTestBlock,
  'minecraft:test_block': JsonMcdocBlockStatesTestBlock,
  'test_instance_block': JsonMcdocBlockStatesTestInstanceBlock,
  'minecraft:test_instance_block': JsonMcdocBlockStatesTestInstanceBlock,
  'tinted_glass': JsonMcdocBlockStatesTintedGlass,
  'minecraft:tinted_glass': JsonMcdocBlockStatesTintedGlass,
  'tnt': JsonMcdocBlockStatesTnt,
  'minecraft:tnt': JsonMcdocBlockStatesTnt,
  'torch': JsonMcdocBlockStatesTorch,
  'minecraft:torch': JsonMcdocBlockStatesTorch,
  'torchflower': JsonMcdocBlockStatesTorchflower,
  'minecraft:torchflower': JsonMcdocBlockStatesTorchflower,
  'torchflower_crop': JsonMcdocBlockStatesTorchflowerCrop,
  'minecraft:torchflower_crop': JsonMcdocBlockStatesTorchflowerCrop,
  'trapped_chest': JsonMcdocBlockStatesTrappedChest,
  'minecraft:trapped_chest': JsonMcdocBlockStatesTrappedChest,
  'trial_spawner': JsonMcdocBlockStatesTrialSpawner,
  'minecraft:trial_spawner': JsonMcdocBlockStatesTrialSpawner,
  'tripwire': JsonMcdocBlockStatesTripwire,
  'minecraft:tripwire': JsonMcdocBlockStatesTripwire,
  'tripwire_hook': JsonMcdocBlockStatesTripwireHook,
  'minecraft:tripwire_hook': JsonMcdocBlockStatesTripwireHook,
  'tube_coral': JsonMcdocBlockStatesTubeCoral,
  'minecraft:tube_coral': JsonMcdocBlockStatesTubeCoral,
  'tube_coral_block': JsonMcdocBlockStatesTubeCoralBlock,
  'minecraft:tube_coral_block': JsonMcdocBlockStatesTubeCoralBlock,
  'tube_coral_fan': JsonMcdocBlockStatesTubeCoralFan,
  'minecraft:tube_coral_fan': JsonMcdocBlockStatesTubeCoralFan,
  'tube_coral_wall_fan': JsonMcdocBlockStatesTubeCoralWallFan,
  'minecraft:tube_coral_wall_fan': JsonMcdocBlockStatesTubeCoralWallFan,
  'tuff': JsonMcdocBlockStatesTuff,
  'minecraft:tuff': JsonMcdocBlockStatesTuff,
  'tuff_brick_slab': JsonMcdocBlockStatesTuffBrickSlab,
  'minecraft:tuff_brick_slab': JsonMcdocBlockStatesTuffBrickSlab,
  'tuff_brick_stairs': JsonMcdocBlockStatesTuffBrickStairs,
  'minecraft:tuff_brick_stairs': JsonMcdocBlockStatesTuffBrickStairs,
  'tuff_brick_wall': JsonMcdocBlockStatesTuffBrickWall,
  'minecraft:tuff_brick_wall': JsonMcdocBlockStatesTuffBrickWall,
  'tuff_bricks': JsonMcdocBlockStatesTuffBricks,
  'minecraft:tuff_bricks': JsonMcdocBlockStatesTuffBricks,
  'tuff_slab': JsonMcdocBlockStatesTuffSlab,
  'minecraft:tuff_slab': JsonMcdocBlockStatesTuffSlab,
  'tuff_stairs': JsonMcdocBlockStatesTuffStairs,
  'minecraft:tuff_stairs': JsonMcdocBlockStatesTuffStairs,
  'tuff_wall': JsonMcdocBlockStatesTuffWall,
  'minecraft:tuff_wall': JsonMcdocBlockStatesTuffWall,
  'turtle_egg': JsonMcdocBlockStatesTurtleEgg,
  'minecraft:turtle_egg': JsonMcdocBlockStatesTurtleEgg,
  'twisting_vines': JsonMcdocBlockStatesTwistingVines,
  'minecraft:twisting_vines': JsonMcdocBlockStatesTwistingVines,
  'twisting_vines_plant': JsonMcdocBlockStatesTwistingVinesPlant,
  'minecraft:twisting_vines_plant': JsonMcdocBlockStatesTwistingVinesPlant,
  'vault': JsonMcdocBlockStatesVault,
  'minecraft:vault': JsonMcdocBlockStatesVault,
  'verdant_froglight': JsonMcdocBlockStatesVerdantFroglight,
  'minecraft:verdant_froglight': JsonMcdocBlockStatesVerdantFroglight,
  'vine': JsonMcdocBlockStatesVine,
  'minecraft:vine': JsonMcdocBlockStatesVine,
  'void_air': JsonMcdocBlockStatesVoidAir,
  'minecraft:void_air': JsonMcdocBlockStatesVoidAir,
  'wall_torch': JsonMcdocBlockStatesWallTorch,
  'minecraft:wall_torch': JsonMcdocBlockStatesWallTorch,
  'warped_button': JsonMcdocBlockStatesWarpedButton,
  'minecraft:warped_button': JsonMcdocBlockStatesWarpedButton,
  'warped_door': JsonMcdocBlockStatesWarpedDoor,
  'minecraft:warped_door': JsonMcdocBlockStatesWarpedDoor,
  'warped_fence': JsonMcdocBlockStatesWarpedFence,
  'minecraft:warped_fence': JsonMcdocBlockStatesWarpedFence,
  'warped_fence_gate': JsonMcdocBlockStatesWarpedFenceGate,
  'minecraft:warped_fence_gate': JsonMcdocBlockStatesWarpedFenceGate,
  'warped_fungus': JsonMcdocBlockStatesWarpedFungus,
  'minecraft:warped_fungus': JsonMcdocBlockStatesWarpedFungus,
  'warped_hanging_sign': JsonMcdocBlockStatesWarpedHangingSign,
  'minecraft:warped_hanging_sign': JsonMcdocBlockStatesWarpedHangingSign,
  'warped_hyphae': JsonMcdocBlockStatesWarpedHyphae,
  'minecraft:warped_hyphae': JsonMcdocBlockStatesWarpedHyphae,
  'warped_nylium': JsonMcdocBlockStatesWarpedNylium,
  'minecraft:warped_nylium': JsonMcdocBlockStatesWarpedNylium,
  'warped_planks': JsonMcdocBlockStatesWarpedPlanks,
  'minecraft:warped_planks': JsonMcdocBlockStatesWarpedPlanks,
  'warped_pressure_plate': JsonMcdocBlockStatesWarpedPressurePlate,
  'minecraft:warped_pressure_plate': JsonMcdocBlockStatesWarpedPressurePlate,
  'warped_roots': JsonMcdocBlockStatesWarpedRoots,
  'minecraft:warped_roots': JsonMcdocBlockStatesWarpedRoots,
  'warped_shelf': JsonMcdocBlockStatesWarpedShelf,
  'minecraft:warped_shelf': JsonMcdocBlockStatesWarpedShelf,
  'warped_sign': JsonMcdocBlockStatesWarpedSign,
  'minecraft:warped_sign': JsonMcdocBlockStatesWarpedSign,
  'warped_slab': JsonMcdocBlockStatesWarpedSlab,
  'minecraft:warped_slab': JsonMcdocBlockStatesWarpedSlab,
  'warped_stairs': JsonMcdocBlockStatesWarpedStairs,
  'minecraft:warped_stairs': JsonMcdocBlockStatesWarpedStairs,
  'warped_stem': JsonMcdocBlockStatesWarpedStem,
  'minecraft:warped_stem': JsonMcdocBlockStatesWarpedStem,
  'warped_trapdoor': JsonMcdocBlockStatesWarpedTrapdoor,
  'minecraft:warped_trapdoor': JsonMcdocBlockStatesWarpedTrapdoor,
  'warped_wall_hanging_sign': JsonMcdocBlockStatesWarpedWallHangingSign,
  'minecraft:warped_wall_hanging_sign': JsonMcdocBlockStatesWarpedWallHangingSign,
  'warped_wall_sign': JsonMcdocBlockStatesWarpedWallSign,
  'minecraft:warped_wall_sign': JsonMcdocBlockStatesWarpedWallSign,
  'warped_wart_block': JsonMcdocBlockStatesWarpedWartBlock,
  'minecraft:warped_wart_block': JsonMcdocBlockStatesWarpedWartBlock,
  'water': JsonMcdocBlockStatesWater,
  'minecraft:water': JsonMcdocBlockStatesWater,
  'water_cauldron': JsonMcdocBlockStatesWaterCauldron,
  'minecraft:water_cauldron': JsonMcdocBlockStatesWaterCauldron,
  'waxed_chiseled_copper': JsonMcdocBlockStatesWaxedChiseledCopper,
  'minecraft:waxed_chiseled_copper': JsonMcdocBlockStatesWaxedChiseledCopper,
  'waxed_copper_bars': JsonMcdocBlockStatesWaxedCopperBars,
  'minecraft:waxed_copper_bars': JsonMcdocBlockStatesWaxedCopperBars,
  'waxed_copper_block': JsonMcdocBlockStatesWaxedCopperBlock,
  'minecraft:waxed_copper_block': JsonMcdocBlockStatesWaxedCopperBlock,
  'waxed_copper_bulb': JsonMcdocBlockStatesWaxedCopperBulb,
  'minecraft:waxed_copper_bulb': JsonMcdocBlockStatesWaxedCopperBulb,
  'waxed_copper_chain': JsonMcdocBlockStatesWaxedCopperChain,
  'minecraft:waxed_copper_chain': JsonMcdocBlockStatesWaxedCopperChain,
  'waxed_copper_chest': JsonMcdocBlockStatesWaxedCopperChest,
  'minecraft:waxed_copper_chest': JsonMcdocBlockStatesWaxedCopperChest,
  'waxed_copper_door': JsonMcdocBlockStatesWaxedCopperDoor,
  'minecraft:waxed_copper_door': JsonMcdocBlockStatesWaxedCopperDoor,
  'waxed_copper_golem_statue': JsonMcdocBlockStatesWaxedCopperGolemStatue,
  'minecraft:waxed_copper_golem_statue': JsonMcdocBlockStatesWaxedCopperGolemStatue,
  'waxed_copper_grate': JsonMcdocBlockStatesWaxedCopperGrate,
  'minecraft:waxed_copper_grate': JsonMcdocBlockStatesWaxedCopperGrate,
  'waxed_copper_lantern': JsonMcdocBlockStatesWaxedCopperLantern,
  'minecraft:waxed_copper_lantern': JsonMcdocBlockStatesWaxedCopperLantern,
  'waxed_copper_trapdoor': JsonMcdocBlockStatesWaxedCopperTrapdoor,
  'minecraft:waxed_copper_trapdoor': JsonMcdocBlockStatesWaxedCopperTrapdoor,
  'waxed_cut_copper': JsonMcdocBlockStatesWaxedCutCopper,
  'minecraft:waxed_cut_copper': JsonMcdocBlockStatesWaxedCutCopper,
  'waxed_cut_copper_slab': JsonMcdocBlockStatesWaxedCutCopperSlab,
  'minecraft:waxed_cut_copper_slab': JsonMcdocBlockStatesWaxedCutCopperSlab,
  'waxed_cut_copper_stairs': JsonMcdocBlockStatesWaxedCutCopperStairs,
  'minecraft:waxed_cut_copper_stairs': JsonMcdocBlockStatesWaxedCutCopperStairs,
  'waxed_exposed_chiseled_copper': JsonMcdocBlockStatesWaxedExposedChiseledCopper,
  'minecraft:waxed_exposed_chiseled_copper': JsonMcdocBlockStatesWaxedExposedChiseledCopper,
  'waxed_exposed_copper': JsonMcdocBlockStatesWaxedExposedCopper,
  'minecraft:waxed_exposed_copper': JsonMcdocBlockStatesWaxedExposedCopper,
  'waxed_exposed_copper_bars': JsonMcdocBlockStatesWaxedExposedCopperBars,
  'minecraft:waxed_exposed_copper_bars': JsonMcdocBlockStatesWaxedExposedCopperBars,
  'waxed_exposed_copper_bulb': JsonMcdocBlockStatesWaxedExposedCopperBulb,
  'minecraft:waxed_exposed_copper_bulb': JsonMcdocBlockStatesWaxedExposedCopperBulb,
  'waxed_exposed_copper_chain': JsonMcdocBlockStatesWaxedExposedCopperChain,
  'minecraft:waxed_exposed_copper_chain': JsonMcdocBlockStatesWaxedExposedCopperChain,
  'waxed_exposed_copper_chest': JsonMcdocBlockStatesWaxedExposedCopperChest,
  'minecraft:waxed_exposed_copper_chest': JsonMcdocBlockStatesWaxedExposedCopperChest,
  'waxed_exposed_copper_door': JsonMcdocBlockStatesWaxedExposedCopperDoor,
  'minecraft:waxed_exposed_copper_door': JsonMcdocBlockStatesWaxedExposedCopperDoor,
  'waxed_exposed_copper_golem_statue': JsonMcdocBlockStatesWaxedExposedCopperGolemStatue,
  'minecraft:waxed_exposed_copper_golem_statue': JsonMcdocBlockStatesWaxedExposedCopperGolemStatue,
  'waxed_exposed_copper_grate': JsonMcdocBlockStatesWaxedExposedCopperGrate,
  'minecraft:waxed_exposed_copper_grate': JsonMcdocBlockStatesWaxedExposedCopperGrate,
  'waxed_exposed_copper_lantern': JsonMcdocBlockStatesWaxedExposedCopperLantern,
  'minecraft:waxed_exposed_copper_lantern': JsonMcdocBlockStatesWaxedExposedCopperLantern,
  'waxed_exposed_copper_trapdoor': JsonMcdocBlockStatesWaxedExposedCopperTrapdoor,
  'minecraft:waxed_exposed_copper_trapdoor': JsonMcdocBlockStatesWaxedExposedCopperTrapdoor,
  'waxed_exposed_cut_copper': JsonMcdocBlockStatesWaxedExposedCutCopper,
  'minecraft:waxed_exposed_cut_copper': JsonMcdocBlockStatesWaxedExposedCutCopper,
  'waxed_exposed_cut_copper_slab': JsonMcdocBlockStatesWaxedExposedCutCopperSlab,
  'minecraft:waxed_exposed_cut_copper_slab': JsonMcdocBlockStatesWaxedExposedCutCopperSlab,
  'waxed_exposed_cut_copper_stairs': JsonMcdocBlockStatesWaxedExposedCutCopperStairs,
  'minecraft:waxed_exposed_cut_copper_stairs': JsonMcdocBlockStatesWaxedExposedCutCopperStairs,
  'waxed_exposed_lightning_rod': JsonMcdocBlockStatesWaxedExposedLightningRod,
  'minecraft:waxed_exposed_lightning_rod': JsonMcdocBlockStatesWaxedExposedLightningRod,
  'waxed_lightning_rod': JsonMcdocBlockStatesWaxedLightningRod,
  'minecraft:waxed_lightning_rod': JsonMcdocBlockStatesWaxedLightningRod,
  'waxed_oxidized_chiseled_copper': JsonMcdocBlockStatesWaxedOxidizedChiseledCopper,
  'minecraft:waxed_oxidized_chiseled_copper': JsonMcdocBlockStatesWaxedOxidizedChiseledCopper,
  'waxed_oxidized_copper': JsonMcdocBlockStatesWaxedOxidizedCopper,
  'minecraft:waxed_oxidized_copper': JsonMcdocBlockStatesWaxedOxidizedCopper,
  'waxed_oxidized_copper_bars': JsonMcdocBlockStatesWaxedOxidizedCopperBars,
  'minecraft:waxed_oxidized_copper_bars': JsonMcdocBlockStatesWaxedOxidizedCopperBars,
  'waxed_oxidized_copper_bulb': JsonMcdocBlockStatesWaxedOxidizedCopperBulb,
  'minecraft:waxed_oxidized_copper_bulb': JsonMcdocBlockStatesWaxedOxidizedCopperBulb,
  'waxed_oxidized_copper_chain': JsonMcdocBlockStatesWaxedOxidizedCopperChain,
  'minecraft:waxed_oxidized_copper_chain': JsonMcdocBlockStatesWaxedOxidizedCopperChain,
  'waxed_oxidized_copper_chest': JsonMcdocBlockStatesWaxedOxidizedCopperChest,
  'minecraft:waxed_oxidized_copper_chest': JsonMcdocBlockStatesWaxedOxidizedCopperChest,
  'waxed_oxidized_copper_door': JsonMcdocBlockStatesWaxedOxidizedCopperDoor,
  'minecraft:waxed_oxidized_copper_door': JsonMcdocBlockStatesWaxedOxidizedCopperDoor,
  'waxed_oxidized_copper_golem_statue': JsonMcdocBlockStatesWaxedOxidizedCopperGolemStatue,
  'minecraft:waxed_oxidized_copper_golem_statue': JsonMcdocBlockStatesWaxedOxidizedCopperGolemStatue,
  'waxed_oxidized_copper_grate': JsonMcdocBlockStatesWaxedOxidizedCopperGrate,
  'minecraft:waxed_oxidized_copper_grate': JsonMcdocBlockStatesWaxedOxidizedCopperGrate,
  'waxed_oxidized_copper_lantern': JsonMcdocBlockStatesWaxedOxidizedCopperLantern,
  'minecraft:waxed_oxidized_copper_lantern': JsonMcdocBlockStatesWaxedOxidizedCopperLantern,
  'waxed_oxidized_copper_trapdoor': JsonMcdocBlockStatesWaxedOxidizedCopperTrapdoor,
  'minecraft:waxed_oxidized_copper_trapdoor': JsonMcdocBlockStatesWaxedOxidizedCopperTrapdoor,
  'waxed_oxidized_cut_copper': JsonMcdocBlockStatesWaxedOxidizedCutCopper,
  'minecraft:waxed_oxidized_cut_copper': JsonMcdocBlockStatesWaxedOxidizedCutCopper,
  'waxed_oxidized_cut_copper_slab': JsonMcdocBlockStatesWaxedOxidizedCutCopperSlab,
  'minecraft:waxed_oxidized_cut_copper_slab': JsonMcdocBlockStatesWaxedOxidizedCutCopperSlab,
  'waxed_oxidized_cut_copper_stairs': JsonMcdocBlockStatesWaxedOxidizedCutCopperStairs,
  'minecraft:waxed_oxidized_cut_copper_stairs': JsonMcdocBlockStatesWaxedOxidizedCutCopperStairs,
  'waxed_oxidized_lightning_rod': JsonMcdocBlockStatesWaxedOxidizedLightningRod,
  'minecraft:waxed_oxidized_lightning_rod': JsonMcdocBlockStatesWaxedOxidizedLightningRod,
  'waxed_weathered_chiseled_copper': JsonMcdocBlockStatesWaxedWeatheredChiseledCopper,
  'minecraft:waxed_weathered_chiseled_copper': JsonMcdocBlockStatesWaxedWeatheredChiseledCopper,
  'waxed_weathered_copper': JsonMcdocBlockStatesWaxedWeatheredCopper,
  'minecraft:waxed_weathered_copper': JsonMcdocBlockStatesWaxedWeatheredCopper,
  'waxed_weathered_copper_bars': JsonMcdocBlockStatesWaxedWeatheredCopperBars,
  'minecraft:waxed_weathered_copper_bars': JsonMcdocBlockStatesWaxedWeatheredCopperBars,
  'waxed_weathered_copper_bulb': JsonMcdocBlockStatesWaxedWeatheredCopperBulb,
  'minecraft:waxed_weathered_copper_bulb': JsonMcdocBlockStatesWaxedWeatheredCopperBulb,
  'waxed_weathered_copper_chain': JsonMcdocBlockStatesWaxedWeatheredCopperChain,
  'minecraft:waxed_weathered_copper_chain': JsonMcdocBlockStatesWaxedWeatheredCopperChain,
  'waxed_weathered_copper_chest': JsonMcdocBlockStatesWaxedWeatheredCopperChest,
  'minecraft:waxed_weathered_copper_chest': JsonMcdocBlockStatesWaxedWeatheredCopperChest,
  'waxed_weathered_copper_door': JsonMcdocBlockStatesWaxedWeatheredCopperDoor,
  'minecraft:waxed_weathered_copper_door': JsonMcdocBlockStatesWaxedWeatheredCopperDoor,
  'waxed_weathered_copper_golem_statue': JsonMcdocBlockStatesWaxedWeatheredCopperGolemStatue,
  'minecraft:waxed_weathered_copper_golem_statue': JsonMcdocBlockStatesWaxedWeatheredCopperGolemStatue,
  'waxed_weathered_copper_grate': JsonMcdocBlockStatesWaxedWeatheredCopperGrate,
  'minecraft:waxed_weathered_copper_grate': JsonMcdocBlockStatesWaxedWeatheredCopperGrate,
  'waxed_weathered_copper_lantern': JsonMcdocBlockStatesWaxedWeatheredCopperLantern,
  'minecraft:waxed_weathered_copper_lantern': JsonMcdocBlockStatesWaxedWeatheredCopperLantern,
  'waxed_weathered_copper_trapdoor': JsonMcdocBlockStatesWaxedWeatheredCopperTrapdoor,
  'minecraft:waxed_weathered_copper_trapdoor': JsonMcdocBlockStatesWaxedWeatheredCopperTrapdoor,
  'waxed_weathered_cut_copper': JsonMcdocBlockStatesWaxedWeatheredCutCopper,
  'minecraft:waxed_weathered_cut_copper': JsonMcdocBlockStatesWaxedWeatheredCutCopper,
  'waxed_weathered_cut_copper_slab': JsonMcdocBlockStatesWaxedWeatheredCutCopperSlab,
  'minecraft:waxed_weathered_cut_copper_slab': JsonMcdocBlockStatesWaxedWeatheredCutCopperSlab,
  'waxed_weathered_cut_copper_stairs': JsonMcdocBlockStatesWaxedWeatheredCutCopperStairs,
  'minecraft:waxed_weathered_cut_copper_stairs': JsonMcdocBlockStatesWaxedWeatheredCutCopperStairs,
  'waxed_weathered_lightning_rod': JsonMcdocBlockStatesWaxedWeatheredLightningRod,
  'minecraft:waxed_weathered_lightning_rod': JsonMcdocBlockStatesWaxedWeatheredLightningRod,
  'weathered_chiseled_copper': JsonMcdocBlockStatesWeatheredChiseledCopper,
  'minecraft:weathered_chiseled_copper': JsonMcdocBlockStatesWeatheredChiseledCopper,
  'weathered_copper': JsonMcdocBlockStatesWeatheredCopper,
  'minecraft:weathered_copper': JsonMcdocBlockStatesWeatheredCopper,
  'weathered_copper_bars': JsonMcdocBlockStatesWeatheredCopperBars,
  'minecraft:weathered_copper_bars': JsonMcdocBlockStatesWeatheredCopperBars,
  'weathered_copper_bulb': JsonMcdocBlockStatesWeatheredCopperBulb,
  'minecraft:weathered_copper_bulb': JsonMcdocBlockStatesWeatheredCopperBulb,
  'weathered_copper_chain': JsonMcdocBlockStatesWeatheredCopperChain,
  'minecraft:weathered_copper_chain': JsonMcdocBlockStatesWeatheredCopperChain,
  'weathered_copper_chest': JsonMcdocBlockStatesWeatheredCopperChest,
  'minecraft:weathered_copper_chest': JsonMcdocBlockStatesWeatheredCopperChest,
  'weathered_copper_door': JsonMcdocBlockStatesWeatheredCopperDoor,
  'minecraft:weathered_copper_door': JsonMcdocBlockStatesWeatheredCopperDoor,
  'weathered_copper_golem_statue': JsonMcdocBlockStatesWeatheredCopperGolemStatue,
  'minecraft:weathered_copper_golem_statue': JsonMcdocBlockStatesWeatheredCopperGolemStatue,
  'weathered_copper_grate': JsonMcdocBlockStatesWeatheredCopperGrate,
  'minecraft:weathered_copper_grate': JsonMcdocBlockStatesWeatheredCopperGrate,
  'weathered_copper_lantern': JsonMcdocBlockStatesWeatheredCopperLantern,
  'minecraft:weathered_copper_lantern': JsonMcdocBlockStatesWeatheredCopperLantern,
  'weathered_copper_trapdoor': JsonMcdocBlockStatesWeatheredCopperTrapdoor,
  'minecraft:weathered_copper_trapdoor': JsonMcdocBlockStatesWeatheredCopperTrapdoor,
  'weathered_cut_copper': JsonMcdocBlockStatesWeatheredCutCopper,
  'minecraft:weathered_cut_copper': JsonMcdocBlockStatesWeatheredCutCopper,
  'weathered_cut_copper_slab': JsonMcdocBlockStatesWeatheredCutCopperSlab,
  'minecraft:weathered_cut_copper_slab': JsonMcdocBlockStatesWeatheredCutCopperSlab,
  'weathered_cut_copper_stairs': JsonMcdocBlockStatesWeatheredCutCopperStairs,
  'minecraft:weathered_cut_copper_stairs': JsonMcdocBlockStatesWeatheredCutCopperStairs,
  'weathered_lightning_rod': JsonMcdocBlockStatesWeatheredLightningRod,
  'minecraft:weathered_lightning_rod': JsonMcdocBlockStatesWeatheredLightningRod,
  'weeping_vines': JsonMcdocBlockStatesWeepingVines,
  'minecraft:weeping_vines': JsonMcdocBlockStatesWeepingVines,
  'weeping_vines_plant': JsonMcdocBlockStatesWeepingVinesPlant,
  'minecraft:weeping_vines_plant': JsonMcdocBlockStatesWeepingVinesPlant,
  'wet_sponge': JsonMcdocBlockStatesWetSponge,
  'minecraft:wet_sponge': JsonMcdocBlockStatesWetSponge,
  'wheat': JsonMcdocBlockStatesWheat,
  'minecraft:wheat': JsonMcdocBlockStatesWheat,
  'white_banner': JsonMcdocBlockStatesWhiteBanner,
  'minecraft:white_banner': JsonMcdocBlockStatesWhiteBanner,
  'white_bed': JsonMcdocBlockStatesWhiteBed,
  'minecraft:white_bed': JsonMcdocBlockStatesWhiteBed,
  'white_candle': JsonMcdocBlockStatesWhiteCandle,
  'minecraft:white_candle': JsonMcdocBlockStatesWhiteCandle,
  'white_candle_cake': JsonMcdocBlockStatesWhiteCandleCake,
  'minecraft:white_candle_cake': JsonMcdocBlockStatesWhiteCandleCake,
  'white_carpet': JsonMcdocBlockStatesWhiteCarpet,
  'minecraft:white_carpet': JsonMcdocBlockStatesWhiteCarpet,
  'white_concrete': JsonMcdocBlockStatesWhiteConcrete,
  'minecraft:white_concrete': JsonMcdocBlockStatesWhiteConcrete,
  'white_concrete_powder': JsonMcdocBlockStatesWhiteConcretePowder,
  'minecraft:white_concrete_powder': JsonMcdocBlockStatesWhiteConcretePowder,
  'white_concrete_slab': JsonMcdocBlockStatesWhiteConcreteSlab,
  'minecraft:white_concrete_slab': JsonMcdocBlockStatesWhiteConcreteSlab,
  'white_concrete_stairs': JsonMcdocBlockStatesWhiteConcreteStairs,
  'minecraft:white_concrete_stairs': JsonMcdocBlockStatesWhiteConcreteStairs,
  'white_glazed_terracotta': JsonMcdocBlockStatesWhiteGlazedTerracotta,
  'minecraft:white_glazed_terracotta': JsonMcdocBlockStatesWhiteGlazedTerracotta,
  'white_shulker_box': JsonMcdocBlockStatesWhiteShulkerBox,
  'minecraft:white_shulker_box': JsonMcdocBlockStatesWhiteShulkerBox,
  'white_stained_glass': JsonMcdocBlockStatesWhiteStainedGlass,
  'minecraft:white_stained_glass': JsonMcdocBlockStatesWhiteStainedGlass,
  'white_stained_glass_pane': JsonMcdocBlockStatesWhiteStainedGlassPane,
  'minecraft:white_stained_glass_pane': JsonMcdocBlockStatesWhiteStainedGlassPane,
  'white_terracotta': JsonMcdocBlockStatesWhiteTerracotta,
  'minecraft:white_terracotta': JsonMcdocBlockStatesWhiteTerracotta,
  'white_tulip': JsonMcdocBlockStatesWhiteTulip,
  'minecraft:white_tulip': JsonMcdocBlockStatesWhiteTulip,
  'white_wall_banner': JsonMcdocBlockStatesWhiteWallBanner,
  'minecraft:white_wall_banner': JsonMcdocBlockStatesWhiteWallBanner,
  'white_wool': JsonMcdocBlockStatesWhiteWool,
  'minecraft:white_wool': JsonMcdocBlockStatesWhiteWool,
  'white_wool_slab': JsonMcdocBlockStatesWhiteWoolSlab,
  'minecraft:white_wool_slab': JsonMcdocBlockStatesWhiteWoolSlab,
  'white_wool_stairs': JsonMcdocBlockStatesWhiteWoolStairs,
  'minecraft:white_wool_stairs': JsonMcdocBlockStatesWhiteWoolStairs,
  'wildflowers': JsonMcdocBlockStatesWildflowers,
  'minecraft:wildflowers': JsonMcdocBlockStatesWildflowers,
  'wither_rose': JsonMcdocBlockStatesWitherRose,
  'minecraft:wither_rose': JsonMcdocBlockStatesWitherRose,
  'wither_skeleton_skull': JsonMcdocBlockStatesWitherSkeletonSkull,
  'minecraft:wither_skeleton_skull': JsonMcdocBlockStatesWitherSkeletonSkull,
  'wither_skeleton_wall_skull': JsonMcdocBlockStatesWitherSkeletonWallSkull,
  'minecraft:wither_skeleton_wall_skull': JsonMcdocBlockStatesWitherSkeletonWallSkull,
  'yellow_banner': JsonMcdocBlockStatesYellowBanner,
  'minecraft:yellow_banner': JsonMcdocBlockStatesYellowBanner,
  'yellow_bed': JsonMcdocBlockStatesYellowBed,
  'minecraft:yellow_bed': JsonMcdocBlockStatesYellowBed,
  'yellow_candle': JsonMcdocBlockStatesYellowCandle,
  'minecraft:yellow_candle': JsonMcdocBlockStatesYellowCandle,
  'yellow_candle_cake': JsonMcdocBlockStatesYellowCandleCake,
  'minecraft:yellow_candle_cake': JsonMcdocBlockStatesYellowCandleCake,
  'yellow_carpet': JsonMcdocBlockStatesYellowCarpet,
  'minecraft:yellow_carpet': JsonMcdocBlockStatesYellowCarpet,
  'yellow_concrete': JsonMcdocBlockStatesYellowConcrete,
  'minecraft:yellow_concrete': JsonMcdocBlockStatesYellowConcrete,
  'yellow_concrete_powder': JsonMcdocBlockStatesYellowConcretePowder,
  'minecraft:yellow_concrete_powder': JsonMcdocBlockStatesYellowConcretePowder,
  'yellow_concrete_slab': JsonMcdocBlockStatesYellowConcreteSlab,
  'minecraft:yellow_concrete_slab': JsonMcdocBlockStatesYellowConcreteSlab,
  'yellow_concrete_stairs': JsonMcdocBlockStatesYellowConcreteStairs,
  'minecraft:yellow_concrete_stairs': JsonMcdocBlockStatesYellowConcreteStairs,
  'yellow_glazed_terracotta': JsonMcdocBlockStatesYellowGlazedTerracotta,
  'minecraft:yellow_glazed_terracotta': JsonMcdocBlockStatesYellowGlazedTerracotta,
  'yellow_poplar_leaves': JsonMcdocBlockStatesYellowPoplarLeaves,
  'minecraft:yellow_poplar_leaves': JsonMcdocBlockStatesYellowPoplarLeaves,
  'yellow_shulker_box': JsonMcdocBlockStatesYellowShulkerBox,
  'minecraft:yellow_shulker_box': JsonMcdocBlockStatesYellowShulkerBox,
  'yellow_stained_glass': JsonMcdocBlockStatesYellowStainedGlass,
  'minecraft:yellow_stained_glass': JsonMcdocBlockStatesYellowStainedGlass,
  'yellow_stained_glass_pane': JsonMcdocBlockStatesYellowStainedGlassPane,
  'minecraft:yellow_stained_glass_pane': JsonMcdocBlockStatesYellowStainedGlassPane,
  'yellow_terracotta': JsonMcdocBlockStatesYellowTerracotta,
  'minecraft:yellow_terracotta': JsonMcdocBlockStatesYellowTerracotta,
  'yellow_wall_banner': JsonMcdocBlockStatesYellowWallBanner,
  'minecraft:yellow_wall_banner': JsonMcdocBlockStatesYellowWallBanner,
  'yellow_wool': JsonMcdocBlockStatesYellowWool,
  'minecraft:yellow_wool': JsonMcdocBlockStatesYellowWool,
  'yellow_wool_slab': JsonMcdocBlockStatesYellowWoolSlab,
  'minecraft:yellow_wool_slab': JsonMcdocBlockStatesYellowWoolSlab,
  'yellow_wool_stairs': JsonMcdocBlockStatesYellowWoolStairs,
  'minecraft:yellow_wool_stairs': JsonMcdocBlockStatesYellowWoolStairs,
  'zombie_head': JsonMcdocBlockStatesZombieHead,
  'minecraft:zombie_head': JsonMcdocBlockStatesZombieHead,
  'zombie_wall_head': JsonMcdocBlockStatesZombieWallHead,
  'minecraft:zombie_wall_head': JsonMcdocBlockStatesZombieWallHead,
}
type JsonMcdocBlockStatesKeys = keyof JsonMcdocBlockStatesDispatcherMap
type JsonMcdocBlockStatesFallback = (
  | JsonMcdocBlockStatesAcaciaButton
  | JsonMcdocBlockStatesAcaciaDoor
  | JsonMcdocBlockStatesAcaciaFence
  | JsonMcdocBlockStatesAcaciaFenceGate
  | JsonMcdocBlockStatesAcaciaHangingSign
  | JsonMcdocBlockStatesAcaciaLeaves
  | JsonMcdocBlockStatesAcaciaLog
  | JsonMcdocBlockStatesAcaciaPlanks
  | JsonMcdocBlockStatesAcaciaPressurePlate
  | JsonMcdocBlockStatesAcaciaSapling
  | JsonMcdocBlockStatesAcaciaShelf
  | JsonMcdocBlockStatesAcaciaSign
  | JsonMcdocBlockStatesAcaciaSlab
  | JsonMcdocBlockStatesAcaciaStairs
  | JsonMcdocBlockStatesAcaciaTrapdoor
  | JsonMcdocBlockStatesAcaciaWallHangingSign
  | JsonMcdocBlockStatesAcaciaWallSign
  | JsonMcdocBlockStatesAcaciaWood
  | JsonMcdocBlockStatesActivatorRail
  | JsonMcdocBlockStatesAir
  | JsonMcdocBlockStatesAllium
  | JsonMcdocBlockStatesAmethystBlock
  | JsonMcdocBlockStatesAmethystCluster
  | JsonMcdocBlockStatesAncientDebris
  | JsonMcdocBlockStatesAndesite
  | JsonMcdocBlockStatesAndesiteSlab
  | JsonMcdocBlockStatesAndesiteStairs
  | JsonMcdocBlockStatesAndesiteWall
  | JsonMcdocBlockStatesAnvil
  | JsonMcdocBlockStatesAttachedMelonStem
  | JsonMcdocBlockStatesAttachedPumpkinStem
  | JsonMcdocBlockStatesAzalea
  | JsonMcdocBlockStatesAzaleaLeaves
  | JsonMcdocBlockStatesAzureBluet
  | JsonMcdocBlockStatesBamboo
  | JsonMcdocBlockStatesBambooBlock
  | JsonMcdocBlockStatesBambooButton
  | JsonMcdocBlockStatesBambooDoor
  | JsonMcdocBlockStatesBambooFence
  | JsonMcdocBlockStatesBambooFenceGate
  | JsonMcdocBlockStatesBambooHangingSign
  | JsonMcdocBlockStatesBambooMosaic
  | JsonMcdocBlockStatesBambooMosaicSlab
  | JsonMcdocBlockStatesBambooMosaicStairs
  | JsonMcdocBlockStatesBambooPlanks
  | JsonMcdocBlockStatesBambooPressurePlate
  | JsonMcdocBlockStatesBambooSapling
  | JsonMcdocBlockStatesBambooShelf
  | JsonMcdocBlockStatesBambooSign
  | JsonMcdocBlockStatesBambooSlab
  | JsonMcdocBlockStatesBambooStairs
  | JsonMcdocBlockStatesBambooTrapdoor
  | JsonMcdocBlockStatesBambooWallHangingSign
  | JsonMcdocBlockStatesBambooWallSign
  | JsonMcdocBlockStatesBarrel
  | JsonMcdocBlockStatesBarrier
  | JsonMcdocBlockStatesBasalt
  | JsonMcdocBlockStatesBeacon
  | JsonMcdocBlockStatesBedrock
  | JsonMcdocBlockStatesBeeNest
  | JsonMcdocBlockStatesBeehive
  | JsonMcdocBlockStatesBeetroots
  | JsonMcdocBlockStatesBell
  | JsonMcdocBlockStatesBigDripleaf
  | JsonMcdocBlockStatesBigDripleafStem
  | JsonMcdocBlockStatesBirchButton
  | JsonMcdocBlockStatesBirchDoor
  | JsonMcdocBlockStatesBirchFence
  | JsonMcdocBlockStatesBirchFenceGate
  | JsonMcdocBlockStatesBirchHangingSign
  | JsonMcdocBlockStatesBirchLeaves
  | JsonMcdocBlockStatesBirchLog
  | JsonMcdocBlockStatesBirchPlanks
  | JsonMcdocBlockStatesBirchPressurePlate
  | JsonMcdocBlockStatesBirchSapling
  | JsonMcdocBlockStatesBirchShelf
  | JsonMcdocBlockStatesBirchSign
  | JsonMcdocBlockStatesBirchSlab
  | JsonMcdocBlockStatesBirchStairs
  | JsonMcdocBlockStatesBirchTrapdoor
  | JsonMcdocBlockStatesBirchWallHangingSign
  | JsonMcdocBlockStatesBirchWallSign
  | JsonMcdocBlockStatesBirchWood
  | JsonMcdocBlockStatesBlackBanner
  | JsonMcdocBlockStatesBlackBed
  | JsonMcdocBlockStatesBlackCandle
  | JsonMcdocBlockStatesBlackCandleCake
  | JsonMcdocBlockStatesBlackCarpet
  | JsonMcdocBlockStatesBlackConcrete
  | JsonMcdocBlockStatesBlackConcretePowder
  | JsonMcdocBlockStatesBlackConcreteSlab
  | JsonMcdocBlockStatesBlackConcreteStairs
  | JsonMcdocBlockStatesBlackGlazedTerracotta
  | JsonMcdocBlockStatesBlackShulkerBox
  | JsonMcdocBlockStatesBlackStainedGlass
  | JsonMcdocBlockStatesBlackStainedGlassPane
  | JsonMcdocBlockStatesBlackTerracotta
  | JsonMcdocBlockStatesBlackWallBanner
  | JsonMcdocBlockStatesBlackWool
  | JsonMcdocBlockStatesBlackWoolSlab
  | JsonMcdocBlockStatesBlackWoolStairs
  | JsonMcdocBlockStatesBlackstone
  | JsonMcdocBlockStatesBlackstoneSlab
  | JsonMcdocBlockStatesBlackstoneStairs
  | JsonMcdocBlockStatesBlackstoneWall
  | JsonMcdocBlockStatesBlastFurnace
  | JsonMcdocBlockStatesBlueBanner
  | JsonMcdocBlockStatesBlueBed
  | JsonMcdocBlockStatesBlueCandle
  | JsonMcdocBlockStatesBlueCandleCake
  | JsonMcdocBlockStatesBlueCarpet
  | JsonMcdocBlockStatesBlueConcrete
  | JsonMcdocBlockStatesBlueConcretePowder
  | JsonMcdocBlockStatesBlueConcreteSlab
  | JsonMcdocBlockStatesBlueConcreteStairs
  | JsonMcdocBlockStatesBlueGlazedTerracotta
  | JsonMcdocBlockStatesBlueIce
  | JsonMcdocBlockStatesBlueOrchid
  | JsonMcdocBlockStatesBlueShulkerBox
  | JsonMcdocBlockStatesBlueStainedGlass
  | JsonMcdocBlockStatesBlueStainedGlassPane
  | JsonMcdocBlockStatesBlueTerracotta
  | JsonMcdocBlockStatesBlueWallBanner
  | JsonMcdocBlockStatesBlueWool
  | JsonMcdocBlockStatesBlueWoolSlab
  | JsonMcdocBlockStatesBlueWoolStairs
  | JsonMcdocBlockStatesBoneBlock
  | JsonMcdocBlockStatesBookshelf
  | JsonMcdocBlockStatesBrainCoral
  | JsonMcdocBlockStatesBrainCoralBlock
  | JsonMcdocBlockStatesBrainCoralFan
  | JsonMcdocBlockStatesBrainCoralWallFan
  | JsonMcdocBlockStatesBrewingStand
  | JsonMcdocBlockStatesBrickSlab
  | JsonMcdocBlockStatesBrickStairs
  | JsonMcdocBlockStatesBrickWall
  | JsonMcdocBlockStatesBricks
  | JsonMcdocBlockStatesBrownBanner
  | JsonMcdocBlockStatesBrownBed
  | JsonMcdocBlockStatesBrownCandle
  | JsonMcdocBlockStatesBrownCandleCake
  | JsonMcdocBlockStatesBrownCarpet
  | JsonMcdocBlockStatesBrownConcrete
  | JsonMcdocBlockStatesBrownConcretePowder
  | JsonMcdocBlockStatesBrownConcreteSlab
  | JsonMcdocBlockStatesBrownConcreteStairs
  | JsonMcdocBlockStatesBrownGlazedTerracotta
  | JsonMcdocBlockStatesBrownMushroom
  | JsonMcdocBlockStatesBrownMushroomBlock
  | JsonMcdocBlockStatesBrownShulkerBox
  | JsonMcdocBlockStatesBrownStainedGlass
  | JsonMcdocBlockStatesBrownStainedGlassPane
  | JsonMcdocBlockStatesBrownTerracotta
  | JsonMcdocBlockStatesBrownWallBanner
  | JsonMcdocBlockStatesBrownWool
  | JsonMcdocBlockStatesBrownWoolSlab
  | JsonMcdocBlockStatesBrownWoolStairs
  | JsonMcdocBlockStatesBubbleColumn
  | JsonMcdocBlockStatesBubbleCoral
  | JsonMcdocBlockStatesBubbleCoralBlock
  | JsonMcdocBlockStatesBubbleCoralFan
  | JsonMcdocBlockStatesBubbleCoralWallFan
  | JsonMcdocBlockStatesBuddingAmethyst
  | JsonMcdocBlockStatesBush
  | JsonMcdocBlockStatesCactus
  | JsonMcdocBlockStatesCactusFlower
  | JsonMcdocBlockStatesCake
  | JsonMcdocBlockStatesCalcite
  | JsonMcdocBlockStatesCalibratedSculkSensor
  | JsonMcdocBlockStatesCampfire
  | JsonMcdocBlockStatesCandle
  | JsonMcdocBlockStatesCandleCake
  | JsonMcdocBlockStatesCarrots
  | JsonMcdocBlockStatesCartographyTable
  | JsonMcdocBlockStatesCarvedPumpkin
  | JsonMcdocBlockStatesCauldron
  | JsonMcdocBlockStatesCaveAir
  | JsonMcdocBlockStatesCaveVines
  | JsonMcdocBlockStatesCaveVinesPlant
  | JsonMcdocBlockStatesChainCommandBlock
  | JsonMcdocBlockStatesCherryButton
  | JsonMcdocBlockStatesCherryDoor
  | JsonMcdocBlockStatesCherryFence
  | JsonMcdocBlockStatesCherryFenceGate
  | JsonMcdocBlockStatesCherryHangingSign
  | JsonMcdocBlockStatesCherryLeaves
  | JsonMcdocBlockStatesCherryLog
  | JsonMcdocBlockStatesCherryPlanks
  | JsonMcdocBlockStatesCherryPressurePlate
  | JsonMcdocBlockStatesCherrySapling
  | JsonMcdocBlockStatesCherryShelf
  | JsonMcdocBlockStatesCherrySign
  | JsonMcdocBlockStatesCherrySlab
  | JsonMcdocBlockStatesCherryStairs
  | JsonMcdocBlockStatesCherryTrapdoor
  | JsonMcdocBlockStatesCherryWallHangingSign
  | JsonMcdocBlockStatesCherryWallSign
  | JsonMcdocBlockStatesCherryWood
  | JsonMcdocBlockStatesChest
  | JsonMcdocBlockStatesChippedAnvil
  | JsonMcdocBlockStatesChiseledBookshelf
  | JsonMcdocBlockStatesChiseledCinnabar
  | JsonMcdocBlockStatesChiseledCopper
  | JsonMcdocBlockStatesChiseledDeepslate
  | JsonMcdocBlockStatesChiseledNetherBricks
  | JsonMcdocBlockStatesChiseledPolishedBlackstone
  | JsonMcdocBlockStatesChiseledQuartzBlock
  | JsonMcdocBlockStatesChiseledRedSandstone
  | JsonMcdocBlockStatesChiseledResinBricks
  | JsonMcdocBlockStatesChiseledSandstone
  | JsonMcdocBlockStatesChiseledStoneBricks
  | JsonMcdocBlockStatesChiseledSulfur
  | JsonMcdocBlockStatesChiseledTuff
  | JsonMcdocBlockStatesChiseledTuffBricks
  | JsonMcdocBlockStatesChorusFlower
  | JsonMcdocBlockStatesChorusPlant
  | JsonMcdocBlockStatesCinnabar
  | JsonMcdocBlockStatesCinnabarBrickSlab
  | JsonMcdocBlockStatesCinnabarBrickStairs
  | JsonMcdocBlockStatesCinnabarBrickWall
  | JsonMcdocBlockStatesCinnabarBricks
  | JsonMcdocBlockStatesCinnabarSlab
  | JsonMcdocBlockStatesCinnabarStairs
  | JsonMcdocBlockStatesCinnabarWall
  | JsonMcdocBlockStatesClay
  | JsonMcdocBlockStatesClosedEyeblossom
  | JsonMcdocBlockStatesCoalBlock
  | JsonMcdocBlockStatesCoalOre
  | JsonMcdocBlockStatesCoarseDirt
  | JsonMcdocBlockStatesCobbledDeepslate
  | JsonMcdocBlockStatesCobbledDeepslateSlab
  | JsonMcdocBlockStatesCobbledDeepslateStairs
  | JsonMcdocBlockStatesCobbledDeepslateWall
  | JsonMcdocBlockStatesCobblestone
  | JsonMcdocBlockStatesCobblestoneSlab
  | JsonMcdocBlockStatesCobblestoneStairs
  | JsonMcdocBlockStatesCobblestoneWall
  | JsonMcdocBlockStatesCobweb
  | JsonMcdocBlockStatesCocoa
  | JsonMcdocBlockStatesCommandBlock
  | JsonMcdocBlockStatesComparator
  | JsonMcdocBlockStatesComposter
  | JsonMcdocBlockStatesConduit
  | JsonMcdocBlockStatesCopperBars
  | JsonMcdocBlockStatesCopperBlock
  | JsonMcdocBlockStatesCopperBulb
  | JsonMcdocBlockStatesCopperChain
  | JsonMcdocBlockStatesCopperChest
  | JsonMcdocBlockStatesCopperDoor
  | JsonMcdocBlockStatesCopperGolemStatue
  | JsonMcdocBlockStatesCopperGrate
  | JsonMcdocBlockStatesCopperLantern
  | JsonMcdocBlockStatesCopperOre
  | JsonMcdocBlockStatesCopperTorch
  | JsonMcdocBlockStatesCopperTrapdoor
  | JsonMcdocBlockStatesCopperWallTorch
  | JsonMcdocBlockStatesCornflower
  | JsonMcdocBlockStatesCrackedDeepslateBricks
  | JsonMcdocBlockStatesCrackedDeepslateTiles
  | JsonMcdocBlockStatesCrackedNetherBricks
  | JsonMcdocBlockStatesCrackedPolishedBlackstoneBricks
  | JsonMcdocBlockStatesCrackedStoneBricks
  | JsonMcdocBlockStatesCrafter
  | JsonMcdocBlockStatesCraftingTable
  | JsonMcdocBlockStatesCreakingHeart
  | JsonMcdocBlockStatesCreeperHead
  | JsonMcdocBlockStatesCreeperWallHead
  | JsonMcdocBlockStatesCrimsonButton
  | JsonMcdocBlockStatesCrimsonDoor
  | JsonMcdocBlockStatesCrimsonFence
  | JsonMcdocBlockStatesCrimsonFenceGate
  | JsonMcdocBlockStatesCrimsonFungus
  | JsonMcdocBlockStatesCrimsonHangingSign
  | JsonMcdocBlockStatesCrimsonHyphae
  | JsonMcdocBlockStatesCrimsonNylium
  | JsonMcdocBlockStatesCrimsonPlanks
  | JsonMcdocBlockStatesCrimsonPressurePlate
  | JsonMcdocBlockStatesCrimsonRoots
  | JsonMcdocBlockStatesCrimsonShelf
  | JsonMcdocBlockStatesCrimsonSign
  | JsonMcdocBlockStatesCrimsonSlab
  | JsonMcdocBlockStatesCrimsonStairs
  | JsonMcdocBlockStatesCrimsonStem
  | JsonMcdocBlockStatesCrimsonTrapdoor
  | JsonMcdocBlockStatesCrimsonWallHangingSign
  | JsonMcdocBlockStatesCrimsonWallSign
  | JsonMcdocBlockStatesCryingObsidian
  | JsonMcdocBlockStatesCutCopper
  | JsonMcdocBlockStatesCutCopperSlab
  | JsonMcdocBlockStatesCutCopperStairs
  | JsonMcdocBlockStatesCutRedSandstone
  | JsonMcdocBlockStatesCutRedSandstoneSlab
  | JsonMcdocBlockStatesCutSandstone
  | JsonMcdocBlockStatesCutSandstoneSlab
  | JsonMcdocBlockStatesCyanBanner
  | JsonMcdocBlockStatesCyanBed
  | JsonMcdocBlockStatesCyanCandle
  | JsonMcdocBlockStatesCyanCandleCake
  | JsonMcdocBlockStatesCyanCarpet
  | JsonMcdocBlockStatesCyanConcrete
  | JsonMcdocBlockStatesCyanConcretePowder
  | JsonMcdocBlockStatesCyanConcreteSlab
  | JsonMcdocBlockStatesCyanConcreteStairs
  | JsonMcdocBlockStatesCyanGlazedTerracotta
  | JsonMcdocBlockStatesCyanShulkerBox
  | JsonMcdocBlockStatesCyanStainedGlass
  | JsonMcdocBlockStatesCyanStainedGlassPane
  | JsonMcdocBlockStatesCyanTerracotta
  | JsonMcdocBlockStatesCyanWallBanner
  | JsonMcdocBlockStatesCyanWool
  | JsonMcdocBlockStatesCyanWoolSlab
  | JsonMcdocBlockStatesCyanWoolStairs
  | JsonMcdocBlockStatesDamagedAnvil
  | JsonMcdocBlockStatesDandelion
  | JsonMcdocBlockStatesDarkOakButton
  | JsonMcdocBlockStatesDarkOakDoor
  | JsonMcdocBlockStatesDarkOakFence
  | JsonMcdocBlockStatesDarkOakFenceGate
  | JsonMcdocBlockStatesDarkOakHangingSign
  | JsonMcdocBlockStatesDarkOakLeaves
  | JsonMcdocBlockStatesDarkOakLog
  | JsonMcdocBlockStatesDarkOakPlanks
  | JsonMcdocBlockStatesDarkOakPressurePlate
  | JsonMcdocBlockStatesDarkOakSapling
  | JsonMcdocBlockStatesDarkOakShelf
  | JsonMcdocBlockStatesDarkOakSign
  | JsonMcdocBlockStatesDarkOakSlab
  | JsonMcdocBlockStatesDarkOakStairs
  | JsonMcdocBlockStatesDarkOakTrapdoor
  | JsonMcdocBlockStatesDarkOakWallHangingSign
  | JsonMcdocBlockStatesDarkOakWallSign
  | JsonMcdocBlockStatesDarkOakWood
  | JsonMcdocBlockStatesDarkPrismarine
  | JsonMcdocBlockStatesDarkPrismarineSlab
  | JsonMcdocBlockStatesDarkPrismarineStairs
  | JsonMcdocBlockStatesDaylightDetector
  | JsonMcdocBlockStatesDeadBrainCoral
  | JsonMcdocBlockStatesDeadBrainCoralBlock
  | JsonMcdocBlockStatesDeadBrainCoralFan
  | JsonMcdocBlockStatesDeadBrainCoralWallFan
  | JsonMcdocBlockStatesDeadBubbleCoral
  | JsonMcdocBlockStatesDeadBubbleCoralBlock
  | JsonMcdocBlockStatesDeadBubbleCoralFan
  | JsonMcdocBlockStatesDeadBubbleCoralWallFan
  | JsonMcdocBlockStatesDeadBush
  | JsonMcdocBlockStatesDeadFireCoral
  | JsonMcdocBlockStatesDeadFireCoralBlock
  | JsonMcdocBlockStatesDeadFireCoralFan
  | JsonMcdocBlockStatesDeadFireCoralWallFan
  | JsonMcdocBlockStatesDeadHornCoral
  | JsonMcdocBlockStatesDeadHornCoralBlock
  | JsonMcdocBlockStatesDeadHornCoralFan
  | JsonMcdocBlockStatesDeadHornCoralWallFan
  | JsonMcdocBlockStatesDeadTubeCoral
  | JsonMcdocBlockStatesDeadTubeCoralBlock
  | JsonMcdocBlockStatesDeadTubeCoralFan
  | JsonMcdocBlockStatesDeadTubeCoralWallFan
  | JsonMcdocBlockStatesDecoratedPot
  | JsonMcdocBlockStatesDeepslate
  | JsonMcdocBlockStatesDeepslateBrickSlab
  | JsonMcdocBlockStatesDeepslateBrickStairs
  | JsonMcdocBlockStatesDeepslateBrickWall
  | JsonMcdocBlockStatesDeepslateBricks
  | JsonMcdocBlockStatesDeepslateCoalOre
  | JsonMcdocBlockStatesDeepslateCopperOre
  | JsonMcdocBlockStatesDeepslateDiamondOre
  | JsonMcdocBlockStatesDeepslateEmeraldOre
  | JsonMcdocBlockStatesDeepslateGoldOre
  | JsonMcdocBlockStatesDeepslateIronOre
  | JsonMcdocBlockStatesDeepslateLapisOre
  | JsonMcdocBlockStatesDeepslateRedstoneOre
  | JsonMcdocBlockStatesDeepslateTileSlab
  | JsonMcdocBlockStatesDeepslateTileStairs
  | JsonMcdocBlockStatesDeepslateTileWall
  | JsonMcdocBlockStatesDeepslateTiles
  | JsonMcdocBlockStatesDetectorRail
  | JsonMcdocBlockStatesDiamondBlock
  | JsonMcdocBlockStatesDiamondOre
  | JsonMcdocBlockStatesDiorite
  | JsonMcdocBlockStatesDioriteSlab
  | JsonMcdocBlockStatesDioriteStairs
  | JsonMcdocBlockStatesDioriteWall
  | JsonMcdocBlockStatesDirt
  | JsonMcdocBlockStatesDirtPath
  | JsonMcdocBlockStatesDispenser
  | JsonMcdocBlockStatesDragonEgg
  | JsonMcdocBlockStatesDragonHead
  | JsonMcdocBlockStatesDragonWallHead
  | JsonMcdocBlockStatesDriedGhast
  | JsonMcdocBlockStatesDriedKelpBlock
  | JsonMcdocBlockStatesDripstoneBlock
  | JsonMcdocBlockStatesDropper
  | JsonMcdocBlockStatesEmeraldBlock
  | JsonMcdocBlockStatesEmeraldOre
  | JsonMcdocBlockStatesEnchantingTable
  | JsonMcdocBlockStatesEndGateway
  | JsonMcdocBlockStatesEndPortal
  | JsonMcdocBlockStatesEndPortalFrame
  | JsonMcdocBlockStatesEndRod
  | JsonMcdocBlockStatesEndStone
  | JsonMcdocBlockStatesEndStoneBrickSlab
  | JsonMcdocBlockStatesEndStoneBrickStairs
  | JsonMcdocBlockStatesEndStoneBrickWall
  | JsonMcdocBlockStatesEndStoneBricks
  | JsonMcdocBlockStatesEnderChest
  | JsonMcdocBlockStatesExposedChiseledCopper
  | JsonMcdocBlockStatesExposedCopper
  | JsonMcdocBlockStatesExposedCopperBars
  | JsonMcdocBlockStatesExposedCopperBulb
  | JsonMcdocBlockStatesExposedCopperChain
  | JsonMcdocBlockStatesExposedCopperChest
  | JsonMcdocBlockStatesExposedCopperDoor
  | JsonMcdocBlockStatesExposedCopperGolemStatue
  | JsonMcdocBlockStatesExposedCopperGrate
  | JsonMcdocBlockStatesExposedCopperLantern
  | JsonMcdocBlockStatesExposedCopperTrapdoor
  | JsonMcdocBlockStatesExposedCutCopper
  | JsonMcdocBlockStatesExposedCutCopperSlab
  | JsonMcdocBlockStatesExposedCutCopperStairs
  | JsonMcdocBlockStatesExposedLightningRod
  | JsonMcdocBlockStatesFarmland
  | JsonMcdocBlockStatesFern
  | JsonMcdocBlockStatesFire
  | JsonMcdocBlockStatesFireCoral
  | JsonMcdocBlockStatesFireCoralBlock
  | JsonMcdocBlockStatesFireCoralFan
  | JsonMcdocBlockStatesFireCoralWallFan
  | JsonMcdocBlockStatesFireflyBush
  | JsonMcdocBlockStatesFletchingTable
  | JsonMcdocBlockStatesFlowerPot
  | JsonMcdocBlockStatesFloweringAzalea
  | JsonMcdocBlockStatesFloweringAzaleaLeaves
  | JsonMcdocBlockStatesFrogspawn
  | JsonMcdocBlockStatesFrostedIce
  | JsonMcdocBlockStatesFurnace
  | JsonMcdocBlockStatesGildedBlackstone
  | JsonMcdocBlockStatesGlass
  | JsonMcdocBlockStatesGlassPane
  | JsonMcdocBlockStatesGlowLichen
  | JsonMcdocBlockStatesGlowstone
  | JsonMcdocBlockStatesGoldBlock
  | JsonMcdocBlockStatesGoldOre
  | JsonMcdocBlockStatesGoldenDandelion
  | JsonMcdocBlockStatesGranite
  | JsonMcdocBlockStatesGraniteSlab
  | JsonMcdocBlockStatesGraniteStairs
  | JsonMcdocBlockStatesGraniteWall
  | JsonMcdocBlockStatesGrassBlock
  | JsonMcdocBlockStatesGravel
  | JsonMcdocBlockStatesGrayBanner
  | JsonMcdocBlockStatesGrayBed
  | JsonMcdocBlockStatesGrayCandle
  | JsonMcdocBlockStatesGrayCandleCake
  | JsonMcdocBlockStatesGrayCarpet
  | JsonMcdocBlockStatesGrayConcrete
  | JsonMcdocBlockStatesGrayConcretePowder
  | JsonMcdocBlockStatesGrayConcreteSlab
  | JsonMcdocBlockStatesGrayConcreteStairs
  | JsonMcdocBlockStatesGrayGlazedTerracotta
  | JsonMcdocBlockStatesGrayShulkerBox
  | JsonMcdocBlockStatesGrayStainedGlass
  | JsonMcdocBlockStatesGrayStainedGlassPane
  | JsonMcdocBlockStatesGrayTerracotta
  | JsonMcdocBlockStatesGrayWallBanner
  | JsonMcdocBlockStatesGrayWool
  | JsonMcdocBlockStatesGrayWoolSlab
  | JsonMcdocBlockStatesGrayWoolStairs
  | JsonMcdocBlockStatesGreenBanner
  | JsonMcdocBlockStatesGreenBed
  | JsonMcdocBlockStatesGreenCandle
  | JsonMcdocBlockStatesGreenCandleCake
  | JsonMcdocBlockStatesGreenCarpet
  | JsonMcdocBlockStatesGreenConcrete
  | JsonMcdocBlockStatesGreenConcretePowder
  | JsonMcdocBlockStatesGreenConcreteSlab
  | JsonMcdocBlockStatesGreenConcreteStairs
  | JsonMcdocBlockStatesGreenGlazedTerracotta
  | JsonMcdocBlockStatesGreenShulkerBox
  | JsonMcdocBlockStatesGreenStainedGlass
  | JsonMcdocBlockStatesGreenStainedGlassPane
  | JsonMcdocBlockStatesGreenTerracotta
  | JsonMcdocBlockStatesGreenWallBanner
  | JsonMcdocBlockStatesGreenWool
  | JsonMcdocBlockStatesGreenWoolSlab
  | JsonMcdocBlockStatesGreenWoolStairs
  | JsonMcdocBlockStatesGrindstone
  | JsonMcdocBlockStatesHangingRoots
  | JsonMcdocBlockStatesHayBlock
  | JsonMcdocBlockStatesHeavyCore
  | JsonMcdocBlockStatesHeavyWeightedPressurePlate
  | JsonMcdocBlockStatesHoneyBlock
  | JsonMcdocBlockStatesHoneycombBlock
  | JsonMcdocBlockStatesHopper
  | JsonMcdocBlockStatesHornCoral
  | JsonMcdocBlockStatesHornCoralBlock
  | JsonMcdocBlockStatesHornCoralFan
  | JsonMcdocBlockStatesHornCoralWallFan
  | JsonMcdocBlockStatesIce
  | JsonMcdocBlockStatesInfestedChiseledStoneBricks
  | JsonMcdocBlockStatesInfestedCobblestone
  | JsonMcdocBlockStatesInfestedCrackedStoneBricks
  | JsonMcdocBlockStatesInfestedDeepslate
  | JsonMcdocBlockStatesInfestedMossyStoneBricks
  | JsonMcdocBlockStatesInfestedStone
  | JsonMcdocBlockStatesInfestedStoneBricks
  | JsonMcdocBlockStatesIronBars
  | JsonMcdocBlockStatesIronBlock
  | JsonMcdocBlockStatesIronChain
  | JsonMcdocBlockStatesIronDoor
  | JsonMcdocBlockStatesIronOre
  | JsonMcdocBlockStatesIronTrapdoor
  | JsonMcdocBlockStatesJackOLantern
  | JsonMcdocBlockStatesJigsaw
  | JsonMcdocBlockStatesJukebox
  | JsonMcdocBlockStatesJungleButton
  | JsonMcdocBlockStatesJungleDoor
  | JsonMcdocBlockStatesJungleFence
  | JsonMcdocBlockStatesJungleFenceGate
  | JsonMcdocBlockStatesJungleHangingSign
  | JsonMcdocBlockStatesJungleLeaves
  | JsonMcdocBlockStatesJungleLog
  | JsonMcdocBlockStatesJunglePlanks
  | JsonMcdocBlockStatesJunglePressurePlate
  | JsonMcdocBlockStatesJungleSapling
  | JsonMcdocBlockStatesJungleShelf
  | JsonMcdocBlockStatesJungleSign
  | JsonMcdocBlockStatesJungleSlab
  | JsonMcdocBlockStatesJungleStairs
  | JsonMcdocBlockStatesJungleTrapdoor
  | JsonMcdocBlockStatesJungleWallHangingSign
  | JsonMcdocBlockStatesJungleWallSign
  | JsonMcdocBlockStatesJungleWood
  | JsonMcdocBlockStatesKelp
  | JsonMcdocBlockStatesKelpPlant
  | JsonMcdocBlockStatesLadder
  | JsonMcdocBlockStatesLantern
  | JsonMcdocBlockStatesLapisBlock
  | JsonMcdocBlockStatesLapisOre
  | JsonMcdocBlockStatesLargeAmethystBud
  | JsonMcdocBlockStatesLargeFern
  | JsonMcdocBlockStatesLava
  | JsonMcdocBlockStatesLavaCauldron
  | JsonMcdocBlockStatesLeafLitter
  | JsonMcdocBlockStatesLectern
  | JsonMcdocBlockStatesLever
  | JsonMcdocBlockStatesLight
  | JsonMcdocBlockStatesLightBlueBanner
  | JsonMcdocBlockStatesLightBlueBed
  | JsonMcdocBlockStatesLightBlueCandle
  | JsonMcdocBlockStatesLightBlueCandleCake
  | JsonMcdocBlockStatesLightBlueCarpet
  | JsonMcdocBlockStatesLightBlueConcrete
  | JsonMcdocBlockStatesLightBlueConcretePowder
  | JsonMcdocBlockStatesLightBlueConcreteSlab
  | JsonMcdocBlockStatesLightBlueConcreteStairs
  | JsonMcdocBlockStatesLightBlueGlazedTerracotta
  | JsonMcdocBlockStatesLightBlueShulkerBox
  | JsonMcdocBlockStatesLightBlueStainedGlass
  | JsonMcdocBlockStatesLightBlueStainedGlassPane
  | JsonMcdocBlockStatesLightBlueTerracotta
  | JsonMcdocBlockStatesLightBlueWallBanner
  | JsonMcdocBlockStatesLightBlueWool
  | JsonMcdocBlockStatesLightBlueWoolSlab
  | JsonMcdocBlockStatesLightBlueWoolStairs
  | JsonMcdocBlockStatesLightGrayBanner
  | JsonMcdocBlockStatesLightGrayBed
  | JsonMcdocBlockStatesLightGrayCandle
  | JsonMcdocBlockStatesLightGrayCandleCake
  | JsonMcdocBlockStatesLightGrayCarpet
  | JsonMcdocBlockStatesLightGrayConcrete
  | JsonMcdocBlockStatesLightGrayConcretePowder
  | JsonMcdocBlockStatesLightGrayConcreteSlab
  | JsonMcdocBlockStatesLightGrayConcreteStairs
  | JsonMcdocBlockStatesLightGrayGlazedTerracotta
  | JsonMcdocBlockStatesLightGrayShulkerBox
  | JsonMcdocBlockStatesLightGrayStainedGlass
  | JsonMcdocBlockStatesLightGrayStainedGlassPane
  | JsonMcdocBlockStatesLightGrayTerracotta
  | JsonMcdocBlockStatesLightGrayWallBanner
  | JsonMcdocBlockStatesLightGrayWool
  | JsonMcdocBlockStatesLightGrayWoolSlab
  | JsonMcdocBlockStatesLightGrayWoolStairs
  | JsonMcdocBlockStatesLightWeightedPressurePlate
  | JsonMcdocBlockStatesLightningRod
  | JsonMcdocBlockStatesLilac
  | JsonMcdocBlockStatesLilyOfTheValley
  | JsonMcdocBlockStatesLilyPad
  | JsonMcdocBlockStatesLimeBanner
  | JsonMcdocBlockStatesLimeBed
  | JsonMcdocBlockStatesLimeCandle
  | JsonMcdocBlockStatesLimeCandleCake
  | JsonMcdocBlockStatesLimeCarpet
  | JsonMcdocBlockStatesLimeConcrete
  | JsonMcdocBlockStatesLimeConcretePowder
  | JsonMcdocBlockStatesLimeConcreteSlab
  | JsonMcdocBlockStatesLimeConcreteStairs
  | JsonMcdocBlockStatesLimeGlazedTerracotta
  | JsonMcdocBlockStatesLimeShulkerBox
  | JsonMcdocBlockStatesLimeStainedGlass
  | JsonMcdocBlockStatesLimeStainedGlassPane
  | JsonMcdocBlockStatesLimeTerracotta
  | JsonMcdocBlockStatesLimeWallBanner
  | JsonMcdocBlockStatesLimeWool
  | JsonMcdocBlockStatesLimeWoolSlab
  | JsonMcdocBlockStatesLimeWoolStairs
  | JsonMcdocBlockStatesLodestone
  | JsonMcdocBlockStatesLoom
  | JsonMcdocBlockStatesMagentaBanner
  | JsonMcdocBlockStatesMagentaBed
  | JsonMcdocBlockStatesMagentaCandle
  | JsonMcdocBlockStatesMagentaCandleCake
  | JsonMcdocBlockStatesMagentaCarpet
  | JsonMcdocBlockStatesMagentaConcrete
  | JsonMcdocBlockStatesMagentaConcretePowder
  | JsonMcdocBlockStatesMagentaConcreteSlab
  | JsonMcdocBlockStatesMagentaConcreteStairs
  | JsonMcdocBlockStatesMagentaGlazedTerracotta
  | JsonMcdocBlockStatesMagentaShulkerBox
  | JsonMcdocBlockStatesMagentaStainedGlass
  | JsonMcdocBlockStatesMagentaStainedGlassPane
  | JsonMcdocBlockStatesMagentaTerracotta
  | JsonMcdocBlockStatesMagentaWallBanner
  | JsonMcdocBlockStatesMagentaWool
  | JsonMcdocBlockStatesMagentaWoolSlab
  | JsonMcdocBlockStatesMagentaWoolStairs
  | JsonMcdocBlockStatesMagmaBlock
  | JsonMcdocBlockStatesMangroveButton
  | JsonMcdocBlockStatesMangroveDoor
  | JsonMcdocBlockStatesMangroveFence
  | JsonMcdocBlockStatesMangroveFenceGate
  | JsonMcdocBlockStatesMangroveHangingSign
  | JsonMcdocBlockStatesMangroveLeaves
  | JsonMcdocBlockStatesMangroveLog
  | JsonMcdocBlockStatesMangrovePlanks
  | JsonMcdocBlockStatesMangrovePressurePlate
  | JsonMcdocBlockStatesMangrovePropagule
  | JsonMcdocBlockStatesMangroveRoots
  | JsonMcdocBlockStatesMangroveShelf
  | JsonMcdocBlockStatesMangroveSign
  | JsonMcdocBlockStatesMangroveSlab
  | JsonMcdocBlockStatesMangroveStairs
  | JsonMcdocBlockStatesMangroveTrapdoor
  | JsonMcdocBlockStatesMangroveWallHangingSign
  | JsonMcdocBlockStatesMangroveWallSign
  | JsonMcdocBlockStatesMangroveWood
  | JsonMcdocBlockStatesMediumAmethystBud
  | JsonMcdocBlockStatesMelon
  | JsonMcdocBlockStatesMelonStem
  | JsonMcdocBlockStatesMossBlock
  | JsonMcdocBlockStatesMossCarpet
  | JsonMcdocBlockStatesMossyCobblestone
  | JsonMcdocBlockStatesMossyCobblestoneSlab
  | JsonMcdocBlockStatesMossyCobblestoneStairs
  | JsonMcdocBlockStatesMossyCobblestoneWall
  | JsonMcdocBlockStatesMossyStoneBrickSlab
  | JsonMcdocBlockStatesMossyStoneBrickStairs
  | JsonMcdocBlockStatesMossyStoneBrickWall
  | JsonMcdocBlockStatesMossyStoneBricks
  | JsonMcdocBlockStatesMovingPiston
  | JsonMcdocBlockStatesMud
  | JsonMcdocBlockStatesMudBrickSlab
  | JsonMcdocBlockStatesMudBrickStairs
  | JsonMcdocBlockStatesMudBrickWall
  | JsonMcdocBlockStatesMudBricks
  | JsonMcdocBlockStatesMuddyMangroveRoots
  | JsonMcdocBlockStatesMushroomStem
  | JsonMcdocBlockStatesMycelium
  | JsonMcdocBlockStatesNetherBrickFence
  | JsonMcdocBlockStatesNetherBrickSlab
  | JsonMcdocBlockStatesNetherBrickStairs
  | JsonMcdocBlockStatesNetherBrickWall
  | JsonMcdocBlockStatesNetherBricks
  | JsonMcdocBlockStatesNetherGoldOre
  | JsonMcdocBlockStatesNetherPortal
  | JsonMcdocBlockStatesNetherQuartzOre
  | JsonMcdocBlockStatesNetherSprouts
  | JsonMcdocBlockStatesNetherWart
  | JsonMcdocBlockStatesNetherWartBlock
  | JsonMcdocBlockStatesNetheriteBlock
  | JsonMcdocBlockStatesNetherrack
  | JsonMcdocBlockStatesNoteBlock
  | JsonMcdocBlockStatesOakButton
  | JsonMcdocBlockStatesOakDoor
  | JsonMcdocBlockStatesOakFence
  | JsonMcdocBlockStatesOakFenceGate
  | JsonMcdocBlockStatesOakHangingSign
  | JsonMcdocBlockStatesOakLeaves
  | JsonMcdocBlockStatesOakLog
  | JsonMcdocBlockStatesOakPlanks
  | JsonMcdocBlockStatesOakPressurePlate
  | JsonMcdocBlockStatesOakSapling
  | JsonMcdocBlockStatesOakShelf
  | JsonMcdocBlockStatesOakSign
  | JsonMcdocBlockStatesOakSlab
  | JsonMcdocBlockStatesOakStairs
  | JsonMcdocBlockStatesOakTrapdoor
  | JsonMcdocBlockStatesOakWallHangingSign
  | JsonMcdocBlockStatesOakWallSign
  | JsonMcdocBlockStatesOakWood
  | JsonMcdocBlockStatesObserver
  | JsonMcdocBlockStatesObsidian
  | JsonMcdocBlockStatesOchreFroglight
  | JsonMcdocBlockStatesOpenEyeblossom
  | JsonMcdocBlockStatesOrangeBanner
  | JsonMcdocBlockStatesOrangeBed
  | JsonMcdocBlockStatesOrangeCandle
  | JsonMcdocBlockStatesOrangeCandleCake
  | JsonMcdocBlockStatesOrangeCarpet
  | JsonMcdocBlockStatesOrangeConcrete
  | JsonMcdocBlockStatesOrangeConcretePowder
  | JsonMcdocBlockStatesOrangeConcreteSlab
  | JsonMcdocBlockStatesOrangeConcreteStairs
  | JsonMcdocBlockStatesOrangeGlazedTerracotta
  | JsonMcdocBlockStatesOrangePoplarLeaves
  | JsonMcdocBlockStatesOrangeShulkerBox
  | JsonMcdocBlockStatesOrangeStainedGlass
  | JsonMcdocBlockStatesOrangeStainedGlassPane
  | JsonMcdocBlockStatesOrangeTerracotta
  | JsonMcdocBlockStatesOrangeTulip
  | JsonMcdocBlockStatesOrangeWallBanner
  | JsonMcdocBlockStatesOrangeWool
  | JsonMcdocBlockStatesOrangeWoolSlab
  | JsonMcdocBlockStatesOrangeWoolStairs
  | JsonMcdocBlockStatesOxeyeDaisy
  | JsonMcdocBlockStatesOxidizedChiseledCopper
  | JsonMcdocBlockStatesOxidizedCopper
  | JsonMcdocBlockStatesOxidizedCopperBars
  | JsonMcdocBlockStatesOxidizedCopperBulb
  | JsonMcdocBlockStatesOxidizedCopperChain
  | JsonMcdocBlockStatesOxidizedCopperChest
  | JsonMcdocBlockStatesOxidizedCopperDoor
  | JsonMcdocBlockStatesOxidizedCopperGolemStatue
  | JsonMcdocBlockStatesOxidizedCopperGrate
  | JsonMcdocBlockStatesOxidizedCopperLantern
  | JsonMcdocBlockStatesOxidizedCopperTrapdoor
  | JsonMcdocBlockStatesOxidizedCutCopper
  | JsonMcdocBlockStatesOxidizedCutCopperSlab
  | JsonMcdocBlockStatesOxidizedCutCopperStairs
  | JsonMcdocBlockStatesOxidizedLightningRod
  | JsonMcdocBlockStatesPackedIce
  | JsonMcdocBlockStatesPackedMud
  | JsonMcdocBlockStatesPaleHangingMoss
  | JsonMcdocBlockStatesPaleMossBlock
  | JsonMcdocBlockStatesPaleMossCarpet
  | JsonMcdocBlockStatesPaleOakButton
  | JsonMcdocBlockStatesPaleOakDoor
  | JsonMcdocBlockStatesPaleOakFence
  | JsonMcdocBlockStatesPaleOakFenceGate
  | JsonMcdocBlockStatesPaleOakHangingSign
  | JsonMcdocBlockStatesPaleOakLeaves
  | JsonMcdocBlockStatesPaleOakLog
  | JsonMcdocBlockStatesPaleOakPlanks
  | JsonMcdocBlockStatesPaleOakPressurePlate
  | JsonMcdocBlockStatesPaleOakSapling
  | JsonMcdocBlockStatesPaleOakShelf
  | JsonMcdocBlockStatesPaleOakSign
  | JsonMcdocBlockStatesPaleOakSlab
  | JsonMcdocBlockStatesPaleOakStairs
  | JsonMcdocBlockStatesPaleOakTrapdoor
  | JsonMcdocBlockStatesPaleOakWallHangingSign
  | JsonMcdocBlockStatesPaleOakWallSign
  | JsonMcdocBlockStatesPaleOakWood
  | JsonMcdocBlockStatesPearlescentFroglight
  | JsonMcdocBlockStatesPeony
  | JsonMcdocBlockStatesPetrifiedOakSlab
  | JsonMcdocBlockStatesPiglinHead
  | JsonMcdocBlockStatesPiglinWallHead
  | JsonMcdocBlockStatesPinkBanner
  | JsonMcdocBlockStatesPinkBed
  | JsonMcdocBlockStatesPinkCandle
  | JsonMcdocBlockStatesPinkCandleCake
  | JsonMcdocBlockStatesPinkCarpet
  | JsonMcdocBlockStatesPinkConcrete
  | JsonMcdocBlockStatesPinkConcretePowder
  | JsonMcdocBlockStatesPinkConcreteSlab
  | JsonMcdocBlockStatesPinkConcreteStairs
  | JsonMcdocBlockStatesPinkGlazedTerracotta
  | JsonMcdocBlockStatesPinkPetals
  | JsonMcdocBlockStatesPinkShulkerBox
  | JsonMcdocBlockStatesPinkStainedGlass
  | JsonMcdocBlockStatesPinkStainedGlassPane
  | JsonMcdocBlockStatesPinkTerracotta
  | JsonMcdocBlockStatesPinkTulip
  | JsonMcdocBlockStatesPinkWallBanner
  | JsonMcdocBlockStatesPinkWool
  | JsonMcdocBlockStatesPinkWoolSlab
  | JsonMcdocBlockStatesPinkWoolStairs
  | JsonMcdocBlockStatesPiston
  | JsonMcdocBlockStatesPistonHead
  | JsonMcdocBlockStatesPitcherCrop
  | JsonMcdocBlockStatesPitcherPlant
  | JsonMcdocBlockStatesPlayerHead
  | JsonMcdocBlockStatesPlayerWallHead
  | JsonMcdocBlockStatesPodzol
  | JsonMcdocBlockStatesPointedDripstone
  | JsonMcdocBlockStatesPolishedAndesite
  | JsonMcdocBlockStatesPolishedAndesiteSlab
  | JsonMcdocBlockStatesPolishedAndesiteStairs
  | JsonMcdocBlockStatesPolishedBasalt
  | JsonMcdocBlockStatesPolishedBlackstone
  | JsonMcdocBlockStatesPolishedBlackstoneBrickSlab
  | JsonMcdocBlockStatesPolishedBlackstoneBrickStairs
  | JsonMcdocBlockStatesPolishedBlackstoneBrickWall
  | JsonMcdocBlockStatesPolishedBlackstoneBricks
  | JsonMcdocBlockStatesPolishedBlackstoneButton
  | JsonMcdocBlockStatesPolishedBlackstonePressurePlate
  | JsonMcdocBlockStatesPolishedBlackstoneSlab
  | JsonMcdocBlockStatesPolishedBlackstoneStairs
  | JsonMcdocBlockStatesPolishedBlackstoneWall
  | JsonMcdocBlockStatesPolishedCinnabar
  | JsonMcdocBlockStatesPolishedCinnabarSlab
  | JsonMcdocBlockStatesPolishedCinnabarStairs
  | JsonMcdocBlockStatesPolishedCinnabarWall
  | JsonMcdocBlockStatesPolishedDeepslate
  | JsonMcdocBlockStatesPolishedDeepslateSlab
  | JsonMcdocBlockStatesPolishedDeepslateStairs
  | JsonMcdocBlockStatesPolishedDeepslateWall
  | JsonMcdocBlockStatesPolishedDiorite
  | JsonMcdocBlockStatesPolishedDioriteSlab
  | JsonMcdocBlockStatesPolishedDioriteStairs
  | JsonMcdocBlockStatesPolishedGranite
  | JsonMcdocBlockStatesPolishedGraniteSlab
  | JsonMcdocBlockStatesPolishedGraniteStairs
  | JsonMcdocBlockStatesPolishedSulfur
  | JsonMcdocBlockStatesPolishedSulfurSlab
  | JsonMcdocBlockStatesPolishedSulfurStairs
  | JsonMcdocBlockStatesPolishedSulfurWall
  | JsonMcdocBlockStatesPolishedTuff
  | JsonMcdocBlockStatesPolishedTuffSlab
  | JsonMcdocBlockStatesPolishedTuffStairs
  | JsonMcdocBlockStatesPolishedTuffWall
  | JsonMcdocBlockStatesPoplarButton
  | JsonMcdocBlockStatesPoplarDoor
  | JsonMcdocBlockStatesPoplarFence
  | JsonMcdocBlockStatesPoplarFenceGate
  | JsonMcdocBlockStatesPoplarHangingSign
  | JsonMcdocBlockStatesPoplarLog
  | JsonMcdocBlockStatesPoplarPlanks
  | JsonMcdocBlockStatesPoplarPressurePlate
  | JsonMcdocBlockStatesPoplarSapling
  | JsonMcdocBlockStatesPoplarShelf
  | JsonMcdocBlockStatesPoplarSign
  | JsonMcdocBlockStatesPoplarSlab
  | JsonMcdocBlockStatesPoplarStairs
  | JsonMcdocBlockStatesPoplarTrapdoor
  | JsonMcdocBlockStatesPoplarWallHangingSign
  | JsonMcdocBlockStatesPoplarWallSign
  | JsonMcdocBlockStatesPoplarWood
  | JsonMcdocBlockStatesPoppy
  | JsonMcdocBlockStatesPotatoes
  | JsonMcdocBlockStatesPotentSulfur
  | JsonMcdocBlockStatesPottedAcaciaSapling
  | JsonMcdocBlockStatesPottedAllium
  | JsonMcdocBlockStatesPottedAzaleaBush
  | JsonMcdocBlockStatesPottedAzureBluet
  | JsonMcdocBlockStatesPottedBamboo
  | JsonMcdocBlockStatesPottedBirchSapling
  | JsonMcdocBlockStatesPottedBlueOrchid
  | JsonMcdocBlockStatesPottedBrownMushroom
  | JsonMcdocBlockStatesPottedCactus
  | JsonMcdocBlockStatesPottedCherrySapling
  | JsonMcdocBlockStatesPottedClosedEyeblossom
  | JsonMcdocBlockStatesPottedCornflower
  | JsonMcdocBlockStatesPottedCrimsonFungus
  | JsonMcdocBlockStatesPottedCrimsonRoots
  | JsonMcdocBlockStatesPottedDandelion
  | JsonMcdocBlockStatesPottedDarkOakSapling
  | JsonMcdocBlockStatesPottedDeadBush
  | JsonMcdocBlockStatesPottedFern
  | JsonMcdocBlockStatesPottedFloweringAzaleaBush
  | JsonMcdocBlockStatesPottedGoldenDandelion
  | JsonMcdocBlockStatesPottedJungleSapling
  | JsonMcdocBlockStatesPottedLilyOfTheValley
  | JsonMcdocBlockStatesPottedMangrovePropagule
  | JsonMcdocBlockStatesPottedOakSapling
  | JsonMcdocBlockStatesPottedOpenEyeblossom
  | JsonMcdocBlockStatesPottedOrangeTulip
  | JsonMcdocBlockStatesPottedOxeyeDaisy
  | JsonMcdocBlockStatesPottedPaleOakSapling
  | JsonMcdocBlockStatesPottedPinkTulip
  | JsonMcdocBlockStatesPottedPoplarSapling
  | JsonMcdocBlockStatesPottedPoppy
  | JsonMcdocBlockStatesPottedRedMushroom
  | JsonMcdocBlockStatesPottedRedTulip
  | JsonMcdocBlockStatesPottedSpruceSapling
  | JsonMcdocBlockStatesPottedTorchflower
  | JsonMcdocBlockStatesPottedWarpedFungus
  | JsonMcdocBlockStatesPottedWarpedRoots
  | JsonMcdocBlockStatesPottedWhiteTulip
  | JsonMcdocBlockStatesPottedWitherRose
  | JsonMcdocBlockStatesPowderSnow
  | JsonMcdocBlockStatesPowderSnowCauldron
  | JsonMcdocBlockStatesPoweredRail
  | JsonMcdocBlockStatesPrismarine
  | JsonMcdocBlockStatesPrismarineBrickSlab
  | JsonMcdocBlockStatesPrismarineBrickStairs
  | JsonMcdocBlockStatesPrismarineBricks
  | JsonMcdocBlockStatesPrismarineSlab
  | JsonMcdocBlockStatesPrismarineStairs
  | JsonMcdocBlockStatesPrismarineWall
  | JsonMcdocBlockStatesPumpkin
  | JsonMcdocBlockStatesPumpkinStem
  | JsonMcdocBlockStatesPurpleBanner
  | JsonMcdocBlockStatesPurpleBed
  | JsonMcdocBlockStatesPurpleCandle
  | JsonMcdocBlockStatesPurpleCandleCake
  | JsonMcdocBlockStatesPurpleCarpet
  | JsonMcdocBlockStatesPurpleConcrete
  | JsonMcdocBlockStatesPurpleConcretePowder
  | JsonMcdocBlockStatesPurpleConcreteSlab
  | JsonMcdocBlockStatesPurpleConcreteStairs
  | JsonMcdocBlockStatesPurpleGlazedTerracotta
  | JsonMcdocBlockStatesPurpleShulkerBox
  | JsonMcdocBlockStatesPurpleStainedGlass
  | JsonMcdocBlockStatesPurpleStainedGlassPane
  | JsonMcdocBlockStatesPurpleTerracotta
  | JsonMcdocBlockStatesPurpleWallBanner
  | JsonMcdocBlockStatesPurpleWool
  | JsonMcdocBlockStatesPurpleWoolSlab
  | JsonMcdocBlockStatesPurpleWoolStairs
  | JsonMcdocBlockStatesPurpurBlock
  | JsonMcdocBlockStatesPurpurPillar
  | JsonMcdocBlockStatesPurpurSlab
  | JsonMcdocBlockStatesPurpurStairs
  | JsonMcdocBlockStatesQuartzBlock
  | JsonMcdocBlockStatesQuartzBricks
  | JsonMcdocBlockStatesQuartzPillar
  | JsonMcdocBlockStatesQuartzSlab
  | JsonMcdocBlockStatesQuartzStairs
  | JsonMcdocBlockStatesRail
  | JsonMcdocBlockStatesRawCopperBlock
  | JsonMcdocBlockStatesRawGoldBlock
  | JsonMcdocBlockStatesRawIronBlock
  | JsonMcdocBlockStatesRedBanner
  | JsonMcdocBlockStatesRedBed
  | JsonMcdocBlockStatesRedCandle
  | JsonMcdocBlockStatesRedCandleCake
  | JsonMcdocBlockStatesRedCarpet
  | JsonMcdocBlockStatesRedConcrete
  | JsonMcdocBlockStatesRedConcretePowder
  | JsonMcdocBlockStatesRedConcreteSlab
  | JsonMcdocBlockStatesRedConcreteStairs
  | JsonMcdocBlockStatesRedGlazedTerracotta
  | JsonMcdocBlockStatesRedMushroom
  | JsonMcdocBlockStatesRedMushroomBlock
  | JsonMcdocBlockStatesRedNetherBrickSlab
  | JsonMcdocBlockStatesRedNetherBrickStairs
  | JsonMcdocBlockStatesRedNetherBrickWall
  | JsonMcdocBlockStatesRedNetherBricks
  | JsonMcdocBlockStatesRedPoplarLeaves
  | JsonMcdocBlockStatesRedSand
  | JsonMcdocBlockStatesRedSandstone
  | JsonMcdocBlockStatesRedSandstoneSlab
  | JsonMcdocBlockStatesRedSandstoneStairs
  | JsonMcdocBlockStatesRedSandstoneWall
  | JsonMcdocBlockStatesRedShrub
  | JsonMcdocBlockStatesRedShulkerBox
  | JsonMcdocBlockStatesRedStainedGlass
  | JsonMcdocBlockStatesRedStainedGlassPane
  | JsonMcdocBlockStatesRedTerracotta
  | JsonMcdocBlockStatesRedTulip
  | JsonMcdocBlockStatesRedWallBanner
  | JsonMcdocBlockStatesRedWool
  | JsonMcdocBlockStatesRedWoolSlab
  | JsonMcdocBlockStatesRedWoolStairs
  | JsonMcdocBlockStatesRedstoneBlock
  | JsonMcdocBlockStatesRedstoneLamp
  | JsonMcdocBlockStatesRedstoneOre
  | JsonMcdocBlockStatesRedstoneTorch
  | JsonMcdocBlockStatesRedstoneWallTorch
  | JsonMcdocBlockStatesRedstoneWire
  | JsonMcdocBlockStatesReinforcedDeepslate
  | JsonMcdocBlockStatesRepeater
  | JsonMcdocBlockStatesRepeatingCommandBlock
  | JsonMcdocBlockStatesResinBlock
  | JsonMcdocBlockStatesResinBrickSlab
  | JsonMcdocBlockStatesResinBrickStairs
  | JsonMcdocBlockStatesResinBrickWall
  | JsonMcdocBlockStatesResinBricks
  | JsonMcdocBlockStatesResinClump
  | JsonMcdocBlockStatesRespawnAnchor
  | JsonMcdocBlockStatesRootedDirt
  | JsonMcdocBlockStatesRoseBush
  | JsonMcdocBlockStatesSand
  | JsonMcdocBlockStatesSandstone
  | JsonMcdocBlockStatesSandstoneSlab
  | JsonMcdocBlockStatesSandstoneStairs
  | JsonMcdocBlockStatesSandstoneWall
  | JsonMcdocBlockStatesScaffolding
  | JsonMcdocBlockStatesSculk
  | JsonMcdocBlockStatesSculkCatalyst
  | JsonMcdocBlockStatesSculkSensor
  | JsonMcdocBlockStatesSculkShrieker
  | JsonMcdocBlockStatesSculkVein
  | JsonMcdocBlockStatesSeaLantern
  | JsonMcdocBlockStatesSeaPickle
  | JsonMcdocBlockStatesSeagrass
  | JsonMcdocBlockStatesShelfMushroom
  | JsonMcdocBlockStatesShortDryGrass
  | JsonMcdocBlockStatesShortGrass
  | JsonMcdocBlockStatesShroomlight
  | JsonMcdocBlockStatesShulkerBox
  | JsonMcdocBlockStatesSkeletonSkull
  | JsonMcdocBlockStatesSkeletonWallSkull
  | JsonMcdocBlockStatesSlimeBlock
  | JsonMcdocBlockStatesSmallAmethystBud
  | JsonMcdocBlockStatesSmallDripleaf
  | JsonMcdocBlockStatesSmithingTable
  | JsonMcdocBlockStatesSmoker
  | JsonMcdocBlockStatesSmoothBasalt
  | JsonMcdocBlockStatesSmoothQuartz
  | JsonMcdocBlockStatesSmoothQuartzSlab
  | JsonMcdocBlockStatesSmoothQuartzStairs
  | JsonMcdocBlockStatesSmoothRedSandstone
  | JsonMcdocBlockStatesSmoothRedSandstoneSlab
  | JsonMcdocBlockStatesSmoothRedSandstoneStairs
  | JsonMcdocBlockStatesSmoothSandstone
  | JsonMcdocBlockStatesSmoothSandstoneSlab
  | JsonMcdocBlockStatesSmoothSandstoneStairs
  | JsonMcdocBlockStatesSmoothStone
  | JsonMcdocBlockStatesSmoothStoneSlab
  | JsonMcdocBlockStatesSnifferEgg
  | JsonMcdocBlockStatesSnow
  | JsonMcdocBlockStatesSnowBlock
  | JsonMcdocBlockStatesSoulCampfire
  | JsonMcdocBlockStatesSoulFire
  | JsonMcdocBlockStatesSoulLantern
  | JsonMcdocBlockStatesSoulSand
  | JsonMcdocBlockStatesSoulSoil
  | JsonMcdocBlockStatesSoulTorch
  | JsonMcdocBlockStatesSoulWallTorch
  | JsonMcdocBlockStatesSpawner
  | JsonMcdocBlockStatesSponge
  | JsonMcdocBlockStatesSporeBlossom
  | JsonMcdocBlockStatesSpruceButton
  | JsonMcdocBlockStatesSpruceDoor
  | JsonMcdocBlockStatesSpruceFence
  | JsonMcdocBlockStatesSpruceFenceGate
  | JsonMcdocBlockStatesSpruceHangingSign
  | JsonMcdocBlockStatesSpruceLeaves
  | JsonMcdocBlockStatesSpruceLog
  | JsonMcdocBlockStatesSprucePlanks
  | JsonMcdocBlockStatesSprucePressurePlate
  | JsonMcdocBlockStatesSpruceSapling
  | JsonMcdocBlockStatesSpruceShelf
  | JsonMcdocBlockStatesSpruceSign
  | JsonMcdocBlockStatesSpruceSlab
  | JsonMcdocBlockStatesSpruceStairs
  | JsonMcdocBlockStatesSpruceTrapdoor
  | JsonMcdocBlockStatesSpruceWallHangingSign
  | JsonMcdocBlockStatesSpruceWallSign
  | JsonMcdocBlockStatesSpruceWood
  | JsonMcdocBlockStatesStickyPiston
  | JsonMcdocBlockStatesStone
  | JsonMcdocBlockStatesStoneBrickSlab
  | JsonMcdocBlockStatesStoneBrickStairs
  | JsonMcdocBlockStatesStoneBrickWall
  | JsonMcdocBlockStatesStoneBricks
  | JsonMcdocBlockStatesStoneButton
  | JsonMcdocBlockStatesStonePressurePlate
  | JsonMcdocBlockStatesStoneSlab
  | JsonMcdocBlockStatesStoneStairs
  | JsonMcdocBlockStatesStonecutter
  | JsonMcdocBlockStatesStrawBed
  | JsonMcdocBlockStatesStrippedAcaciaLog
  | JsonMcdocBlockStatesStrippedAcaciaWood
  | JsonMcdocBlockStatesStrippedBambooBlock
  | JsonMcdocBlockStatesStrippedBirchLog
  | JsonMcdocBlockStatesStrippedBirchWood
  | JsonMcdocBlockStatesStrippedCherryLog
  | JsonMcdocBlockStatesStrippedCherryWood
  | JsonMcdocBlockStatesStrippedCrimsonHyphae
  | JsonMcdocBlockStatesStrippedCrimsonStem
  | JsonMcdocBlockStatesStrippedDarkOakLog
  | JsonMcdocBlockStatesStrippedDarkOakWood
  | JsonMcdocBlockStatesStrippedJungleLog
  | JsonMcdocBlockStatesStrippedJungleWood
  | JsonMcdocBlockStatesStrippedMangroveLog
  | JsonMcdocBlockStatesStrippedMangroveWood
  | JsonMcdocBlockStatesStrippedOakLog
  | JsonMcdocBlockStatesStrippedOakWood
  | JsonMcdocBlockStatesStrippedPaleOakLog
  | JsonMcdocBlockStatesStrippedPaleOakWood
  | JsonMcdocBlockStatesStrippedPoplarLog
  | JsonMcdocBlockStatesStrippedPoplarWood
  | JsonMcdocBlockStatesStrippedSpruceLog
  | JsonMcdocBlockStatesStrippedSpruceWood
  | JsonMcdocBlockStatesStrippedWarpedHyphae
  | JsonMcdocBlockStatesStrippedWarpedStem
  | JsonMcdocBlockStatesStructureBlock
  | JsonMcdocBlockStatesStructureVoid
  | JsonMcdocBlockStatesSugarCane
  | JsonMcdocBlockStatesSulfur
  | JsonMcdocBlockStatesSulfurBrickSlab
  | JsonMcdocBlockStatesSulfurBrickStairs
  | JsonMcdocBlockStatesSulfurBrickWall
  | JsonMcdocBlockStatesSulfurBricks
  | JsonMcdocBlockStatesSulfurSlab
  | JsonMcdocBlockStatesSulfurSpike
  | JsonMcdocBlockStatesSulfurStairs
  | JsonMcdocBlockStatesSulfurWall
  | JsonMcdocBlockStatesSunflower
  | JsonMcdocBlockStatesSuspiciousGravel
  | JsonMcdocBlockStatesSuspiciousSand
  | JsonMcdocBlockStatesSweetBerryBush
  | JsonMcdocBlockStatesTallDryGrass
  | JsonMcdocBlockStatesTallGrass
  | JsonMcdocBlockStatesTallSeagrass
  | JsonMcdocBlockStatesTarget
  | JsonMcdocBlockStatesTerracotta
  | JsonMcdocBlockStatesTestBlock
  | JsonMcdocBlockStatesTestInstanceBlock
  | JsonMcdocBlockStatesTintedGlass
  | JsonMcdocBlockStatesTnt
  | JsonMcdocBlockStatesTorch
  | JsonMcdocBlockStatesTorchflower
  | JsonMcdocBlockStatesTorchflowerCrop
  | JsonMcdocBlockStatesTrappedChest
  | JsonMcdocBlockStatesTrialSpawner
  | JsonMcdocBlockStatesTripwire
  | JsonMcdocBlockStatesTripwireHook
  | JsonMcdocBlockStatesTubeCoral
  | JsonMcdocBlockStatesTubeCoralBlock
  | JsonMcdocBlockStatesTubeCoralFan
  | JsonMcdocBlockStatesTubeCoralWallFan
  | JsonMcdocBlockStatesTuff
  | JsonMcdocBlockStatesTuffBrickSlab
  | JsonMcdocBlockStatesTuffBrickStairs
  | JsonMcdocBlockStatesTuffBrickWall
  | JsonMcdocBlockStatesTuffBricks
  | JsonMcdocBlockStatesTuffSlab
  | JsonMcdocBlockStatesTuffStairs
  | JsonMcdocBlockStatesTuffWall
  | JsonMcdocBlockStatesTurtleEgg
  | JsonMcdocBlockStatesTwistingVines
  | JsonMcdocBlockStatesTwistingVinesPlant
  | JsonMcdocBlockStatesVault
  | JsonMcdocBlockStatesVerdantFroglight
  | JsonMcdocBlockStatesVine
  | JsonMcdocBlockStatesVoidAir
  | JsonMcdocBlockStatesWallTorch
  | JsonMcdocBlockStatesWarpedButton
  | JsonMcdocBlockStatesWarpedDoor
  | JsonMcdocBlockStatesWarpedFence
  | JsonMcdocBlockStatesWarpedFenceGate
  | JsonMcdocBlockStatesWarpedFungus
  | JsonMcdocBlockStatesWarpedHangingSign
  | JsonMcdocBlockStatesWarpedHyphae
  | JsonMcdocBlockStatesWarpedNylium
  | JsonMcdocBlockStatesWarpedPlanks
  | JsonMcdocBlockStatesWarpedPressurePlate
  | JsonMcdocBlockStatesWarpedRoots
  | JsonMcdocBlockStatesWarpedShelf
  | JsonMcdocBlockStatesWarpedSign
  | JsonMcdocBlockStatesWarpedSlab
  | JsonMcdocBlockStatesWarpedStairs
  | JsonMcdocBlockStatesWarpedStem
  | JsonMcdocBlockStatesWarpedTrapdoor
  | JsonMcdocBlockStatesWarpedWallHangingSign
  | JsonMcdocBlockStatesWarpedWallSign
  | JsonMcdocBlockStatesWarpedWartBlock
  | JsonMcdocBlockStatesWater
  | JsonMcdocBlockStatesWaterCauldron
  | JsonMcdocBlockStatesWaxedChiseledCopper
  | JsonMcdocBlockStatesWaxedCopperBars
  | JsonMcdocBlockStatesWaxedCopperBlock
  | JsonMcdocBlockStatesWaxedCopperBulb
  | JsonMcdocBlockStatesWaxedCopperChain
  | JsonMcdocBlockStatesWaxedCopperChest
  | JsonMcdocBlockStatesWaxedCopperDoor
  | JsonMcdocBlockStatesWaxedCopperGolemStatue
  | JsonMcdocBlockStatesWaxedCopperGrate
  | JsonMcdocBlockStatesWaxedCopperLantern
  | JsonMcdocBlockStatesWaxedCopperTrapdoor
  | JsonMcdocBlockStatesWaxedCutCopper
  | JsonMcdocBlockStatesWaxedCutCopperSlab
  | JsonMcdocBlockStatesWaxedCutCopperStairs
  | JsonMcdocBlockStatesWaxedExposedChiseledCopper
  | JsonMcdocBlockStatesWaxedExposedCopper
  | JsonMcdocBlockStatesWaxedExposedCopperBars
  | JsonMcdocBlockStatesWaxedExposedCopperBulb
  | JsonMcdocBlockStatesWaxedExposedCopperChain
  | JsonMcdocBlockStatesWaxedExposedCopperChest
  | JsonMcdocBlockStatesWaxedExposedCopperDoor
  | JsonMcdocBlockStatesWaxedExposedCopperGolemStatue
  | JsonMcdocBlockStatesWaxedExposedCopperGrate
  | JsonMcdocBlockStatesWaxedExposedCopperLantern
  | JsonMcdocBlockStatesWaxedExposedCopperTrapdoor
  | JsonMcdocBlockStatesWaxedExposedCutCopper
  | JsonMcdocBlockStatesWaxedExposedCutCopperSlab
  | JsonMcdocBlockStatesWaxedExposedCutCopperStairs
  | JsonMcdocBlockStatesWaxedExposedLightningRod
  | JsonMcdocBlockStatesWaxedLightningRod
  | JsonMcdocBlockStatesWaxedOxidizedChiseledCopper
  | JsonMcdocBlockStatesWaxedOxidizedCopper
  | JsonMcdocBlockStatesWaxedOxidizedCopperBars
  | JsonMcdocBlockStatesWaxedOxidizedCopperBulb
  | JsonMcdocBlockStatesWaxedOxidizedCopperChain
  | JsonMcdocBlockStatesWaxedOxidizedCopperChest
  | JsonMcdocBlockStatesWaxedOxidizedCopperDoor
  | JsonMcdocBlockStatesWaxedOxidizedCopperGolemStatue
  | JsonMcdocBlockStatesWaxedOxidizedCopperGrate
  | JsonMcdocBlockStatesWaxedOxidizedCopperLantern
  | JsonMcdocBlockStatesWaxedOxidizedCopperTrapdoor
  | JsonMcdocBlockStatesWaxedOxidizedCutCopper
  | JsonMcdocBlockStatesWaxedOxidizedCutCopperSlab
  | JsonMcdocBlockStatesWaxedOxidizedCutCopperStairs
  | JsonMcdocBlockStatesWaxedOxidizedLightningRod
  | JsonMcdocBlockStatesWaxedWeatheredChiseledCopper
  | JsonMcdocBlockStatesWaxedWeatheredCopper
  | JsonMcdocBlockStatesWaxedWeatheredCopperBars
  | JsonMcdocBlockStatesWaxedWeatheredCopperBulb
  | JsonMcdocBlockStatesWaxedWeatheredCopperChain
  | JsonMcdocBlockStatesWaxedWeatheredCopperChest
  | JsonMcdocBlockStatesWaxedWeatheredCopperDoor
  | JsonMcdocBlockStatesWaxedWeatheredCopperGolemStatue
  | JsonMcdocBlockStatesWaxedWeatheredCopperGrate
  | JsonMcdocBlockStatesWaxedWeatheredCopperLantern
  | JsonMcdocBlockStatesWaxedWeatheredCopperTrapdoor
  | JsonMcdocBlockStatesWaxedWeatheredCutCopper
  | JsonMcdocBlockStatesWaxedWeatheredCutCopperSlab
  | JsonMcdocBlockStatesWaxedWeatheredCutCopperStairs
  | JsonMcdocBlockStatesWaxedWeatheredLightningRod
  | JsonMcdocBlockStatesWeatheredChiseledCopper
  | JsonMcdocBlockStatesWeatheredCopper
  | JsonMcdocBlockStatesWeatheredCopperBars
  | JsonMcdocBlockStatesWeatheredCopperBulb
  | JsonMcdocBlockStatesWeatheredCopperChain
  | JsonMcdocBlockStatesWeatheredCopperChest
  | JsonMcdocBlockStatesWeatheredCopperDoor
  | JsonMcdocBlockStatesWeatheredCopperGolemStatue
  | JsonMcdocBlockStatesWeatheredCopperGrate
  | JsonMcdocBlockStatesWeatheredCopperLantern
  | JsonMcdocBlockStatesWeatheredCopperTrapdoor
  | JsonMcdocBlockStatesWeatheredCutCopper
  | JsonMcdocBlockStatesWeatheredCutCopperSlab
  | JsonMcdocBlockStatesWeatheredCutCopperStairs
  | JsonMcdocBlockStatesWeatheredLightningRod
  | JsonMcdocBlockStatesWeepingVines
  | JsonMcdocBlockStatesWeepingVinesPlant
  | JsonMcdocBlockStatesWetSponge
  | JsonMcdocBlockStatesWheat
  | JsonMcdocBlockStatesWhiteBanner
  | JsonMcdocBlockStatesWhiteBed
  | JsonMcdocBlockStatesWhiteCandle
  | JsonMcdocBlockStatesWhiteCandleCake
  | JsonMcdocBlockStatesWhiteCarpet
  | JsonMcdocBlockStatesWhiteConcrete
  | JsonMcdocBlockStatesWhiteConcretePowder
  | JsonMcdocBlockStatesWhiteConcreteSlab
  | JsonMcdocBlockStatesWhiteConcreteStairs
  | JsonMcdocBlockStatesWhiteGlazedTerracotta
  | JsonMcdocBlockStatesWhiteShulkerBox
  | JsonMcdocBlockStatesWhiteStainedGlass
  | JsonMcdocBlockStatesWhiteStainedGlassPane
  | JsonMcdocBlockStatesWhiteTerracotta
  | JsonMcdocBlockStatesWhiteTulip
  | JsonMcdocBlockStatesWhiteWallBanner
  | JsonMcdocBlockStatesWhiteWool
  | JsonMcdocBlockStatesWhiteWoolSlab
  | JsonMcdocBlockStatesWhiteWoolStairs
  | JsonMcdocBlockStatesWildflowers
  | JsonMcdocBlockStatesWitherRose
  | JsonMcdocBlockStatesWitherSkeletonSkull
  | JsonMcdocBlockStatesWitherSkeletonWallSkull
  | JsonMcdocBlockStatesYellowBanner
  | JsonMcdocBlockStatesYellowBed
  | JsonMcdocBlockStatesYellowCandle
  | JsonMcdocBlockStatesYellowCandleCake
  | JsonMcdocBlockStatesYellowCarpet
  | JsonMcdocBlockStatesYellowConcrete
  | JsonMcdocBlockStatesYellowConcretePowder
  | JsonMcdocBlockStatesYellowConcreteSlab
  | JsonMcdocBlockStatesYellowConcreteStairs
  | JsonMcdocBlockStatesYellowGlazedTerracotta
  | JsonMcdocBlockStatesYellowPoplarLeaves
  | JsonMcdocBlockStatesYellowShulkerBox
  | JsonMcdocBlockStatesYellowStainedGlass
  | JsonMcdocBlockStatesYellowStainedGlassPane
  | JsonMcdocBlockStatesYellowTerracotta
  | JsonMcdocBlockStatesYellowWallBanner
  | JsonMcdocBlockStatesYellowWool
  | JsonMcdocBlockStatesYellowWoolSlab
  | JsonMcdocBlockStatesYellowWoolStairs
  | JsonMcdocBlockStatesZombieHead
  | JsonMcdocBlockStatesZombieWallHead
  | JsonMcdocBlockStatesFallbackType)
export type JsonMcdocBlockStatesFallbackType = ({
  [Key in NonEmptyString]?: string
})
type JsonMcdocBlockStatesNoneType = ({
  [Key in NonEmptyString]?: string
})
type JsonMcdocBlockStatesAcaciaButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesAcaciaPlanks = Record<string, never>
type JsonMcdocBlockStatesAcaciaPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaSapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesAcaciaShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAcaciaWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesActivatorRail = {
  powered?: ('true' | 'false'),
  shape?: ('north_south' | 'east_west' | 'ascending_east' | 'ascending_west' | 'ascending_north' | 'ascending_south'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAir = Record<string, never>
type JsonMcdocBlockStatesAllium = Record<string, never>
type JsonMcdocBlockStatesAmethystBlock = Record<string, never>
type JsonMcdocBlockStatesAmethystCluster = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAncientDebris = Record<string, never>
type JsonMcdocBlockStatesAndesite = Record<string, never>
type JsonMcdocBlockStatesAndesiteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAndesiteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAndesiteWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesAnvil = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesAttachedMelonStem = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesAttachedPumpkinStem = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesAzalea = Record<string, never>
type JsonMcdocBlockStatesAzaleaLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesAzureBluet = Record<string, never>
type JsonMcdocBlockStatesBamboo = {
  age?: ('0' | '1'),
  leaves?: ('none' | 'small' | 'large'),
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesBambooBlock = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesBambooButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooMosaic = Record<string, never>
type JsonMcdocBlockStatesBambooMosaicSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooMosaicStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooPlanks = Record<string, never>
type JsonMcdocBlockStatesBambooPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooSapling = Record<string, never>
type JsonMcdocBlockStatesBambooShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBambooWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBarrel = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  open?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBarrier = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBasalt = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesBeacon = Record<string, never>
type JsonMcdocBlockStatesBedrock = Record<string, never>
type JsonMcdocBlockStatesBeeNest = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  honey_level?: ('0' | '1' | '2' | '3' | '4' | '5'),
}
type JsonMcdocBlockStatesBeehive = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  honey_level?: ('0' | '1' | '2' | '3' | '4' | '5'),
}
type JsonMcdocBlockStatesBeetroots = {
  age?: ('0' | '1' | '2' | '3'),
}
type JsonMcdocBlockStatesBell = {
  attachment?: ('floor' | 'ceiling' | 'single_wall' | 'double_wall'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBigDripleaf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  tilt?: ('none' | 'unstable' | 'partial' | 'full'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBigDripleafStem = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesBirchPlanks = Record<string, never>
type JsonMcdocBlockStatesBirchPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchSapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesBirchShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBirchWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesBlackBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesBlackBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesBlackCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackCarpet = Record<string, never>
type JsonMcdocBlockStatesBlackConcrete = Record<string, never>
type JsonMcdocBlockStatesBlackConcretePowder = Record<string, never>
type JsonMcdocBlockStatesBlackConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesBlackShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesBlackStainedGlass = Record<string, never>
type JsonMcdocBlockStatesBlackStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackTerracotta = Record<string, never>
type JsonMcdocBlockStatesBlackWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesBlackWool = Record<string, never>
type JsonMcdocBlockStatesBlackWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackstone = Record<string, never>
type JsonMcdocBlockStatesBlackstoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackstoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlackstoneWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesBlastFurnace = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlueBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesBlueBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesBlueCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlueCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlueCarpet = Record<string, never>
type JsonMcdocBlockStatesBlueConcrete = Record<string, never>
type JsonMcdocBlockStatesBlueConcretePowder = Record<string, never>
type JsonMcdocBlockStatesBlueConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlueConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlueGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesBlueIce = Record<string, never>
type JsonMcdocBlockStatesBlueOrchid = Record<string, never>
type JsonMcdocBlockStatesBlueShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesBlueStainedGlass = Record<string, never>
type JsonMcdocBlockStatesBlueStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlueTerracotta = Record<string, never>
type JsonMcdocBlockStatesBlueWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesBlueWool = Record<string, never>
type JsonMcdocBlockStatesBlueWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBlueWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBoneBlock = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesBookshelf = Record<string, never>
type JsonMcdocBlockStatesBrainCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrainCoralBlock = Record<string, never>
type JsonMcdocBlockStatesBrainCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrainCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrewingStand = {
  has_bottle_0?: ('true' | 'false'),
  has_bottle_1?: ('true' | 'false'),
  has_bottle_2?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesBricks = Record<string, never>
type JsonMcdocBlockStatesBrownBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesBrownBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesBrownCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrownCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrownCarpet = Record<string, never>
type JsonMcdocBlockStatesBrownConcrete = Record<string, never>
type JsonMcdocBlockStatesBrownConcretePowder = Record<string, never>
type JsonMcdocBlockStatesBrownConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrownConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrownGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesBrownMushroom = Record<string, never>
type JsonMcdocBlockStatesBrownMushroomBlock = {
  down?: ('true' | 'false'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrownShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesBrownStainedGlass = Record<string, never>
type JsonMcdocBlockStatesBrownStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrownTerracotta = Record<string, never>
type JsonMcdocBlockStatesBrownWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesBrownWool = Record<string, never>
type JsonMcdocBlockStatesBrownWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBrownWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBubbleColumn = {
  drag?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBubbleCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBubbleCoralBlock = Record<string, never>
type JsonMcdocBlockStatesBubbleCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBubbleCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesBuddingAmethyst = Record<string, never>
type JsonMcdocBlockStatesBush = Record<string, never>
type JsonMcdocBlockStatesCactus = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesCactusFlower = Record<string, never>
type JsonMcdocBlockStatesCake = {
  bites?: ('0' | '1' | '2' | '3' | '4' | '5' | '6'),
}
type JsonMcdocBlockStatesCalcite = Record<string, never>
type JsonMcdocBlockStatesCalibratedSculkSensor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  power?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  sculk_sensor_phase?: ('inactive' | 'active' | 'cooldown'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCampfire = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  lit?: ('true' | 'false'),
  signal_fire?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCarrots = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'),
}
type JsonMcdocBlockStatesCartographyTable = Record<string, never>
type JsonMcdocBlockStatesCarvedPumpkin = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesCauldron = Record<string, never>
type JsonMcdocBlockStatesCaveAir = Record<string, never>
type JsonMcdocBlockStatesCaveVines = {
  age?: (
      | '0'
      | '1'
      | '2'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '10'
      | '11'
      | '12'
      | '13'
      | '14'
      | '15'
      | '16'
      | '17'
      | '18'
      | '19'
      | '20'
      | '21'
      | '22'
      | '23'
      | '24'
      | '25'),
  berries?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCaveVinesPlant = {
  berries?: ('true' | 'false'),
}
type JsonMcdocBlockStatesChainCommandBlock = {
  conditional?: ('true' | 'false'),
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesCherryButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesCherryPlanks = Record<string, never>
type JsonMcdocBlockStatesCherryPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherrySapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesCherryShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherrySign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherrySlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCherryWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesChippedAnvil = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesChiseledBookshelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  slot_0_occupied?: ('true' | 'false'),
  slot_1_occupied?: ('true' | 'false'),
  slot_2_occupied?: ('true' | 'false'),
  slot_3_occupied?: ('true' | 'false'),
  slot_4_occupied?: ('true' | 'false'),
  slot_5_occupied?: ('true' | 'false'),
}
type JsonMcdocBlockStatesChiseledCinnabar = Record<string, never>
type JsonMcdocBlockStatesChiseledCopper = Record<string, never>
type JsonMcdocBlockStatesChiseledDeepslate = Record<string, never>
type JsonMcdocBlockStatesChiseledNetherBricks = Record<string, never>
type JsonMcdocBlockStatesChiseledPolishedBlackstone = Record<string, never>
type JsonMcdocBlockStatesChiseledQuartzBlock = Record<string, never>
type JsonMcdocBlockStatesChiseledRedSandstone = Record<string, never>
type JsonMcdocBlockStatesChiseledResinBricks = Record<string, never>
type JsonMcdocBlockStatesChiseledSandstone = Record<string, never>
type JsonMcdocBlockStatesChiseledStoneBricks = Record<string, never>
type JsonMcdocBlockStatesChiseledSulfur = Record<string, never>
type JsonMcdocBlockStatesChiseledTuff = Record<string, never>
type JsonMcdocBlockStatesChiseledTuffBricks = Record<string, never>
type JsonMcdocBlockStatesChorusFlower = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5'),
}
type JsonMcdocBlockStatesChorusPlant = {
  down?: ('true' | 'false'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCinnabar = Record<string, never>
type JsonMcdocBlockStatesCinnabarBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCinnabarBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCinnabarBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesCinnabarBricks = Record<string, never>
type JsonMcdocBlockStatesCinnabarSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCinnabarStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCinnabarWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesClay = Record<string, never>
type JsonMcdocBlockStatesClosedEyeblossom = Record<string, never>
type JsonMcdocBlockStatesCoalBlock = Record<string, never>
type JsonMcdocBlockStatesCoalOre = Record<string, never>
type JsonMcdocBlockStatesCoarseDirt = Record<string, never>
type JsonMcdocBlockStatesCobbledDeepslate = Record<string, never>
type JsonMcdocBlockStatesCobbledDeepslateSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCobbledDeepslateStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCobbledDeepslateWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesCobblestone = Record<string, never>
type JsonMcdocBlockStatesCobblestoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCobblestoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCobblestoneWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesCobweb = Record<string, never>
type JsonMcdocBlockStatesCocoa = {
  age?: ('0' | '1' | '2'),
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesCommandBlock = {
  conditional?: ('true' | 'false'),
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesComparator = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  mode?: ('compare' | 'subtract'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesComposter = {
  level?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'),
}
type JsonMcdocBlockStatesConduit = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperBlock = Record<string, never>
type JsonMcdocBlockStatesCopperBulb = {
  lit?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperGolemStatue = {
  copper_golem_pose?: ('standing' | 'sitting' | 'running' | 'star'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperGrate = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperOre = Record<string, never>
type JsonMcdocBlockStatesCopperTorch = Record<string, never>
type JsonMcdocBlockStatesCopperTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCopperWallTorch = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesCornflower = Record<string, never>
type JsonMcdocBlockStatesCrackedDeepslateBricks = Record<string, never>
type JsonMcdocBlockStatesCrackedDeepslateTiles = Record<string, never>
type JsonMcdocBlockStatesCrackedNetherBricks = Record<string, never>
type JsonMcdocBlockStatesCrackedPolishedBlackstoneBricks = Record<string, never>
type JsonMcdocBlockStatesCrackedStoneBricks = Record<string, never>
type JsonMcdocBlockStatesCrafter = {
  crafting?: ('true' | 'false'),
  orientation?: (
      | 'down_east'
      | 'down_north'
      | 'down_south'
      | 'down_west'
      | 'up_east'
      | 'up_north'
      | 'up_south'
      | 'up_west'
      | 'west_up'
      | 'east_up'
      | 'north_up'
      | 'south_up'),
  triggered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCraftingTable = Record<string, never>
type JsonMcdocBlockStatesCreakingHeart = {
  axis?: ('x' | 'y' | 'z'),
  creaking_heart_state?: ('uprooted' | 'dormant' | 'awake'),
  natural?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCreeperHead = {
  powered?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesCreeperWallHead = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonFungus = Record<string, never>
type JsonMcdocBlockStatesCrimsonHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonHyphae = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesCrimsonNylium = Record<string, never>
type JsonMcdocBlockStatesCrimsonPlanks = Record<string, never>
type JsonMcdocBlockStatesCrimsonPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonRoots = Record<string, never>
type JsonMcdocBlockStatesCrimsonShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonStem = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesCrimsonTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCrimsonWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCryingObsidian = Record<string, never>
type JsonMcdocBlockStatesCutCopper = Record<string, never>
type JsonMcdocBlockStatesCutCopperSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCutCopperStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCutRedSandstone = Record<string, never>
type JsonMcdocBlockStatesCutRedSandstoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCutSandstone = Record<string, never>
type JsonMcdocBlockStatesCutSandstoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCyanBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesCyanBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesCyanCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCyanCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCyanCarpet = Record<string, never>
type JsonMcdocBlockStatesCyanConcrete = Record<string, never>
type JsonMcdocBlockStatesCyanConcretePowder = Record<string, never>
type JsonMcdocBlockStatesCyanConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCyanConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCyanGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesCyanShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesCyanStainedGlass = Record<string, never>
type JsonMcdocBlockStatesCyanStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCyanTerracotta = Record<string, never>
type JsonMcdocBlockStatesCyanWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesCyanWool = Record<string, never>
type JsonMcdocBlockStatesCyanWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesCyanWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDamagedAnvil = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesDandelion = Record<string, never>
type JsonMcdocBlockStatesDarkOakButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesDarkOakPlanks = Record<string, never>
type JsonMcdocBlockStatesDarkOakPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakSapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesDarkOakShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkOakWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesDarkPrismarine = Record<string, never>
type JsonMcdocBlockStatesDarkPrismarineSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDarkPrismarineStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDaylightDetector = {
  inverted?: ('true' | 'false'),
  power?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesDeadBrainCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadBrainCoralBlock = Record<string, never>
type JsonMcdocBlockStatesDeadBrainCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadBrainCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadBubbleCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadBubbleCoralBlock = Record<string, never>
type JsonMcdocBlockStatesDeadBubbleCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadBubbleCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadBush = Record<string, never>
type JsonMcdocBlockStatesDeadFireCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadFireCoralBlock = Record<string, never>
type JsonMcdocBlockStatesDeadFireCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadFireCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadHornCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadHornCoralBlock = Record<string, never>
type JsonMcdocBlockStatesDeadHornCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadHornCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadTubeCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadTubeCoralBlock = Record<string, never>
type JsonMcdocBlockStatesDeadTubeCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeadTubeCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDecoratedPot = {
  cracked?: ('true' | 'false'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeepslate = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesDeepslateBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeepslateBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeepslateBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesDeepslateBricks = Record<string, never>
type JsonMcdocBlockStatesDeepslateCoalOre = Record<string, never>
type JsonMcdocBlockStatesDeepslateCopperOre = Record<string, never>
type JsonMcdocBlockStatesDeepslateDiamondOre = Record<string, never>
type JsonMcdocBlockStatesDeepslateEmeraldOre = Record<string, never>
type JsonMcdocBlockStatesDeepslateGoldOre = Record<string, never>
type JsonMcdocBlockStatesDeepslateIronOre = Record<string, never>
type JsonMcdocBlockStatesDeepslateLapisOre = Record<string, never>
type JsonMcdocBlockStatesDeepslateRedstoneOre = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeepslateTileSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeepslateTileStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDeepslateTileWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesDeepslateTiles = Record<string, never>
type JsonMcdocBlockStatesDetectorRail = {
  powered?: ('true' | 'false'),
  shape?: ('north_south' | 'east_west' | 'ascending_east' | 'ascending_west' | 'ascending_north' | 'ascending_south'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDiamondBlock = Record<string, never>
type JsonMcdocBlockStatesDiamondOre = Record<string, never>
type JsonMcdocBlockStatesDiorite = Record<string, never>
type JsonMcdocBlockStatesDioriteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDioriteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDioriteWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesDirt = Record<string, never>
type JsonMcdocBlockStatesDirtPath = Record<string, never>
type JsonMcdocBlockStatesDispenser = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  triggered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDragonEgg = Record<string, never>
type JsonMcdocBlockStatesDragonHead = {
  powered?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesDragonWallHead = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDriedGhast = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  hydration?: ('0' | '1' | '2' | '3'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesDriedKelpBlock = Record<string, never>
type JsonMcdocBlockStatesDripstoneBlock = Record<string, never>
type JsonMcdocBlockStatesDropper = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  triggered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesEmeraldBlock = Record<string, never>
type JsonMcdocBlockStatesEmeraldOre = Record<string, never>
type JsonMcdocBlockStatesEnchantingTable = Record<string, never>
type JsonMcdocBlockStatesEndGateway = Record<string, never>
type JsonMcdocBlockStatesEndPortal = Record<string, never>
type JsonMcdocBlockStatesEndPortalFrame = {
  eye?: ('true' | 'false'),
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesEndRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesEndStone = Record<string, never>
type JsonMcdocBlockStatesEndStoneBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesEndStoneBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesEndStoneBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesEndStoneBricks = Record<string, never>
type JsonMcdocBlockStatesEnderChest = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedChiseledCopper = Record<string, never>
type JsonMcdocBlockStatesExposedCopper = Record<string, never>
type JsonMcdocBlockStatesExposedCopperBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCopperBulb = {
  lit?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCopperChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCopperChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCopperDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCopperGolemStatue = {
  copper_golem_pose?: ('standing' | 'sitting' | 'running' | 'star'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCopperGrate = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCopperLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCopperTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCutCopper = Record<string, never>
type JsonMcdocBlockStatesExposedCutCopperSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedCutCopperStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesExposedLightningRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesFarmland = {
  moisture?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'),
}
type JsonMcdocBlockStatesFern = Record<string, never>
type JsonMcdocBlockStatesFire = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesFireCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesFireCoralBlock = Record<string, never>
type JsonMcdocBlockStatesFireCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesFireCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesFireflyBush = Record<string, never>
type JsonMcdocBlockStatesFletchingTable = Record<string, never>
type JsonMcdocBlockStatesFlowerPot = Record<string, never>
type JsonMcdocBlockStatesFloweringAzalea = Record<string, never>
type JsonMcdocBlockStatesFloweringAzaleaLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesFrogspawn = Record<string, never>
type JsonMcdocBlockStatesFrostedIce = {
  age?: ('0' | '1' | '2' | '3'),
}
type JsonMcdocBlockStatesFurnace = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGildedBlackstone = Record<string, never>
type JsonMcdocBlockStatesGlass = Record<string, never>
type JsonMcdocBlockStatesGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGlowLichen = {
  down?: ('true' | 'false'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGlowstone = Record<string, never>
type JsonMcdocBlockStatesGoldBlock = Record<string, never>
type JsonMcdocBlockStatesGoldOre = Record<string, never>
type JsonMcdocBlockStatesGoldenDandelion = Record<string, never>
type JsonMcdocBlockStatesGranite = Record<string, never>
type JsonMcdocBlockStatesGraniteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGraniteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGraniteWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesGrassBlock = {
  snowy?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGravel = Record<string, never>
type JsonMcdocBlockStatesGrayBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesGrayBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesGrayCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGrayCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGrayCarpet = Record<string, never>
type JsonMcdocBlockStatesGrayConcrete = Record<string, never>
type JsonMcdocBlockStatesGrayConcretePowder = Record<string, never>
type JsonMcdocBlockStatesGrayConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGrayConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGrayGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesGrayShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesGrayStainedGlass = Record<string, never>
type JsonMcdocBlockStatesGrayStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGrayTerracotta = Record<string, never>
type JsonMcdocBlockStatesGrayWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesGrayWool = Record<string, never>
type JsonMcdocBlockStatesGrayWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGrayWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGreenBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesGreenBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesGreenCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGreenCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGreenCarpet = Record<string, never>
type JsonMcdocBlockStatesGreenConcrete = Record<string, never>
type JsonMcdocBlockStatesGreenConcretePowder = Record<string, never>
type JsonMcdocBlockStatesGreenConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGreenConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGreenGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesGreenShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesGreenStainedGlass = Record<string, never>
type JsonMcdocBlockStatesGreenStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGreenTerracotta = Record<string, never>
type JsonMcdocBlockStatesGreenWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesGreenWool = Record<string, never>
type JsonMcdocBlockStatesGreenWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGreenWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesGrindstone = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesHangingRoots = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesHayBlock = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesHeavyCore = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesHeavyWeightedPressurePlate = {
  power?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesHoneyBlock = Record<string, never>
type JsonMcdocBlockStatesHoneycombBlock = Record<string, never>
type JsonMcdocBlockStatesHopper = {
  enabled?: ('true' | 'false'),
  facing?: ('down' | 'north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesHornCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesHornCoralBlock = Record<string, never>
type JsonMcdocBlockStatesHornCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesHornCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesIce = Record<string, never>
type JsonMcdocBlockStatesInfestedChiseledStoneBricks = Record<string, never>
type JsonMcdocBlockStatesInfestedCobblestone = Record<string, never>
type JsonMcdocBlockStatesInfestedCrackedStoneBricks = Record<string, never>
type JsonMcdocBlockStatesInfestedDeepslate = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesInfestedMossyStoneBricks = Record<string, never>
type JsonMcdocBlockStatesInfestedStone = Record<string, never>
type JsonMcdocBlockStatesInfestedStoneBricks = Record<string, never>
type JsonMcdocBlockStatesIronBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesIronBlock = Record<string, never>
type JsonMcdocBlockStatesIronChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesIronDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesIronOre = Record<string, never>
type JsonMcdocBlockStatesIronTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJackOLantern = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesJigsaw = {
  orientation?: (
      | 'down_east'
      | 'down_north'
      | 'down_south'
      | 'down_west'
      | 'up_east'
      | 'up_north'
      | 'up_south'
      | 'up_west'
      | 'west_up'
      | 'east_up'
      | 'north_up'
      | 'south_up'),
}
type JsonMcdocBlockStatesJukebox = {
  has_record?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesJunglePlanks = Record<string, never>
type JsonMcdocBlockStatesJunglePressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleSapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesJungleShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesJungleWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesKelp = {
  age?: (
      | '0'
      | '1'
      | '2'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '10'
      | '11'
      | '12'
      | '13'
      | '14'
      | '15'
      | '16'
      | '17'
      | '18'
      | '19'
      | '20'
      | '21'
      | '22'
      | '23'
      | '24'
      | '25'),
}
type JsonMcdocBlockStatesKelpPlant = Record<string, never>
type JsonMcdocBlockStatesLadder = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLapisBlock = Record<string, never>
type JsonMcdocBlockStatesLapisOre = Record<string, never>
type JsonMcdocBlockStatesLargeAmethystBud = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLargeFern = {
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesLava = {
  level?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesLavaCauldron = Record<string, never>
type JsonMcdocBlockStatesLeafLitter = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  segment_amount?: ('1' | '2' | '3' | '4'),
}
type JsonMcdocBlockStatesLectern = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  has_book?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLever = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLight = {
  level?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightBlueBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesLightBlueBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesLightBlueCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightBlueCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightBlueCarpet = Record<string, never>
type JsonMcdocBlockStatesLightBlueConcrete = Record<string, never>
type JsonMcdocBlockStatesLightBlueConcretePowder = Record<string, never>
type JsonMcdocBlockStatesLightBlueConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightBlueConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightBlueGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesLightBlueShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesLightBlueStainedGlass = Record<string, never>
type JsonMcdocBlockStatesLightBlueStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightBlueTerracotta = Record<string, never>
type JsonMcdocBlockStatesLightBlueWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesLightBlueWool = Record<string, never>
type JsonMcdocBlockStatesLightBlueWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightBlueWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightGrayBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesLightGrayBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesLightGrayCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightGrayCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightGrayCarpet = Record<string, never>
type JsonMcdocBlockStatesLightGrayConcrete = Record<string, never>
type JsonMcdocBlockStatesLightGrayConcretePowder = Record<string, never>
type JsonMcdocBlockStatesLightGrayConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightGrayConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightGrayGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesLightGrayShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesLightGrayStainedGlass = Record<string, never>
type JsonMcdocBlockStatesLightGrayStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightGrayTerracotta = Record<string, never>
type JsonMcdocBlockStatesLightGrayWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesLightGrayWool = Record<string, never>
type JsonMcdocBlockStatesLightGrayWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightGrayWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLightWeightedPressurePlate = {
  power?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesLightningRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLilac = {
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesLilyOfTheValley = Record<string, never>
type JsonMcdocBlockStatesLilyPad = Record<string, never>
type JsonMcdocBlockStatesLimeBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesLimeBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesLimeCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLimeCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLimeCarpet = Record<string, never>
type JsonMcdocBlockStatesLimeConcrete = Record<string, never>
type JsonMcdocBlockStatesLimeConcretePowder = Record<string, never>
type JsonMcdocBlockStatesLimeConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLimeConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLimeGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesLimeShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesLimeStainedGlass = Record<string, never>
type JsonMcdocBlockStatesLimeStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLimeTerracotta = Record<string, never>
type JsonMcdocBlockStatesLimeWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesLimeWool = Record<string, never>
type JsonMcdocBlockStatesLimeWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLimeWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesLodestone = Record<string, never>
type JsonMcdocBlockStatesLoom = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesMagentaBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesMagentaBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesMagentaCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMagentaCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMagentaCarpet = Record<string, never>
type JsonMcdocBlockStatesMagentaConcrete = Record<string, never>
type JsonMcdocBlockStatesMagentaConcretePowder = Record<string, never>
type JsonMcdocBlockStatesMagentaConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMagentaConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMagentaGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesMagentaShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesMagentaStainedGlass = Record<string, never>
type JsonMcdocBlockStatesMagentaStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMagentaTerracotta = Record<string, never>
type JsonMcdocBlockStatesMagentaWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesMagentaWool = Record<string, never>
type JsonMcdocBlockStatesMagentaWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMagentaWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMagmaBlock = Record<string, never>
type JsonMcdocBlockStatesMangroveButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesMangrovePlanks = Record<string, never>
type JsonMcdocBlockStatesMangrovePressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangrovePropagule = {
  age?: ('0' | '1' | '2' | '3' | '4'),
  hanging?: ('true' | 'false'),
  stage?: ('0' | '1'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveRoots = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMangroveWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesMediumAmethystBud = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMelon = Record<string, never>
type JsonMcdocBlockStatesMelonStem = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'),
}
type JsonMcdocBlockStatesMossBlock = Record<string, never>
type JsonMcdocBlockStatesMossCarpet = Record<string, never>
type JsonMcdocBlockStatesMossyCobblestone = Record<string, never>
type JsonMcdocBlockStatesMossyCobblestoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMossyCobblestoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMossyCobblestoneWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesMossyStoneBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMossyStoneBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMossyStoneBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesMossyStoneBricks = Record<string, never>
type JsonMcdocBlockStatesMovingPiston = {
  type?: ('normal' | 'sticky'),
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesMud = Record<string, never>
type JsonMcdocBlockStatesMudBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMudBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMudBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesMudBricks = Record<string, never>
type JsonMcdocBlockStatesMuddyMangroveRoots = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesMushroomStem = {
  down?: ('true' | 'false'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesMycelium = {
  snowy?: ('true' | 'false'),
}
type JsonMcdocBlockStatesNetherBrickFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesNetherBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesNetherBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesNetherBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesNetherBricks = Record<string, never>
type JsonMcdocBlockStatesNetherGoldOre = Record<string, never>
type JsonMcdocBlockStatesNetherPortal = {
  axis?: ('x' | 'z'),
}
type JsonMcdocBlockStatesNetherQuartzOre = Record<string, never>
type JsonMcdocBlockStatesNetherSprouts = Record<string, never>
type JsonMcdocBlockStatesNetherWart = {
  age?: ('0' | '1' | '2' | '3'),
}
type JsonMcdocBlockStatesNetherWartBlock = Record<string, never>
type JsonMcdocBlockStatesNetheriteBlock = Record<string, never>
type JsonMcdocBlockStatesNetherrack = Record<string, never>
type JsonMcdocBlockStatesNoteBlock = {
  instrument?: (
      | 'harp'
      | 'basedrum'
      | 'snare'
      | 'hat'
      | 'bass'
      | 'flute'
      | 'bell'
      | 'guitar'
      | 'chime'
      | 'xylophone'
      | 'iron_xylophone'
      | 'cow_bell'
      | 'didgeridoo'
      | 'bit'
      | 'banjo'
      | 'pling'
      | 'trumpet'
      | 'trumpet_exposed'
      | 'trumpet_oxidized'
      | 'trumpet_weathered'
      | 'zombie'
      | 'skeleton'
      | 'creeper'
      | 'dragon'
      | 'wither_skeleton'
      | 'piglin'
      | 'custom_head'),
  note?: (
      | '0'
      | '1'
      | '2'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '10'
      | '11'
      | '12'
      | '13'
      | '14'
      | '15'
      | '16'
      | '17'
      | '18'
      | '19'
      | '20'
      | '21'
      | '22'
      | '23'
      | '24'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesOakPlanks = Record<string, never>
type JsonMcdocBlockStatesOakPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakSapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesOakShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOakWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesObserver = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesObsidian = Record<string, never>
type JsonMcdocBlockStatesOchreFroglight = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesOpenEyeblossom = Record<string, never>
type JsonMcdocBlockStatesOrangeBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesOrangeBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesOrangeCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOrangeCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOrangeCarpet = Record<string, never>
type JsonMcdocBlockStatesOrangeConcrete = Record<string, never>
type JsonMcdocBlockStatesOrangeConcretePowder = Record<string, never>
type JsonMcdocBlockStatesOrangeConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOrangeConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOrangeGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesOrangePoplarLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOrangeShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesOrangeStainedGlass = Record<string, never>
type JsonMcdocBlockStatesOrangeStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOrangeTerracotta = Record<string, never>
type JsonMcdocBlockStatesOrangeTulip = Record<string, never>
type JsonMcdocBlockStatesOrangeWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesOrangeWool = Record<string, never>
type JsonMcdocBlockStatesOrangeWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOrangeWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxeyeDaisy = Record<string, never>
type JsonMcdocBlockStatesOxidizedChiseledCopper = Record<string, never>
type JsonMcdocBlockStatesOxidizedCopper = Record<string, never>
type JsonMcdocBlockStatesOxidizedCopperBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCopperBulb = {
  lit?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCopperChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCopperChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCopperDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCopperGolemStatue = {
  copper_golem_pose?: ('standing' | 'sitting' | 'running' | 'star'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCopperGrate = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCopperLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCopperTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCutCopper = Record<string, never>
type JsonMcdocBlockStatesOxidizedCutCopperSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedCutCopperStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesOxidizedLightningRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPackedIce = Record<string, never>
type JsonMcdocBlockStatesPackedMud = Record<string, never>
type JsonMcdocBlockStatesPaleHangingMoss = {
  tip?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleMossBlock = Record<string, never>
type JsonMcdocBlockStatesPaleMossCarpet = {
  bottom?: ('true' | 'false'),
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesPaleOakButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesPaleOakPlanks = Record<string, never>
type JsonMcdocBlockStatesPaleOakPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakSapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesPaleOakShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPaleOakWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesPearlescentFroglight = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesPeony = {
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesPetrifiedOakSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPiglinHead = {
  powered?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesPiglinWallHead = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPinkBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesPinkBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesPinkCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPinkCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPinkCarpet = Record<string, never>
type JsonMcdocBlockStatesPinkConcrete = Record<string, never>
type JsonMcdocBlockStatesPinkConcretePowder = Record<string, never>
type JsonMcdocBlockStatesPinkConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPinkConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPinkGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesPinkPetals = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  flower_amount?: ('1' | '2' | '3' | '4'),
}
type JsonMcdocBlockStatesPinkShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesPinkStainedGlass = Record<string, never>
type JsonMcdocBlockStatesPinkStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPinkTerracotta = Record<string, never>
type JsonMcdocBlockStatesPinkTulip = Record<string, never>
type JsonMcdocBlockStatesPinkWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesPinkWool = Record<string, never>
type JsonMcdocBlockStatesPinkWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPinkWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPiston = {
  extended?: ('true' | 'false'),
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesPistonHead = {
  type?: ('normal' | 'sticky'),
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  short?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPitcherCrop = {
  age?: ('0' | '1' | '2' | '3' | '4'),
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesPitcherPlant = {
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesPlayerHead = {
  powered?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesPlayerWallHead = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPodzol = {
  snowy?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPointedDripstone = {
  thickness?: ('tip_merge' | 'tip' | 'frustum' | 'middle' | 'base'),
  vertical_direction?: ('up' | 'down'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedAndesite = Record<string, never>
type JsonMcdocBlockStatesPolishedAndesiteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedAndesiteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedBasalt = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesPolishedBlackstone = Record<string, never>
type JsonMcdocBlockStatesPolishedBlackstoneBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedBlackstoneBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedBlackstoneBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesPolishedBlackstoneBricks = Record<string, never>
type JsonMcdocBlockStatesPolishedBlackstoneButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedBlackstonePressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedBlackstoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedBlackstoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedBlackstoneWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesPolishedCinnabar = Record<string, never>
type JsonMcdocBlockStatesPolishedCinnabarSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedCinnabarStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedCinnabarWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesPolishedDeepslate = Record<string, never>
type JsonMcdocBlockStatesPolishedDeepslateSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedDeepslateStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedDeepslateWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesPolishedDiorite = Record<string, never>
type JsonMcdocBlockStatesPolishedDioriteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedDioriteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedGranite = Record<string, never>
type JsonMcdocBlockStatesPolishedGraniteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedGraniteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedSulfur = Record<string, never>
type JsonMcdocBlockStatesPolishedSulfurSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedSulfurStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedSulfurWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesPolishedTuff = Record<string, never>
type JsonMcdocBlockStatesPolishedTuffSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedTuffStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPolishedTuffWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesPoplarButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesPoplarPlanks = Record<string, never>
type JsonMcdocBlockStatesPoplarPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarSapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesPoplarShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPoplarWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesPoppy = Record<string, never>
type JsonMcdocBlockStatesPotatoes = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'),
}
type JsonMcdocBlockStatesPotentSulfur = {
  potent_sulfur_state?: ('dry' | 'wet' | 'dormant' | 'erupting' | 'continuous'),
}
type JsonMcdocBlockStatesPottedAcaciaSapling = Record<string, never>
type JsonMcdocBlockStatesPottedAllium = Record<string, never>
type JsonMcdocBlockStatesPottedAzaleaBush = Record<string, never>
type JsonMcdocBlockStatesPottedAzureBluet = Record<string, never>
type JsonMcdocBlockStatesPottedBamboo = Record<string, never>
type JsonMcdocBlockStatesPottedBirchSapling = Record<string, never>
type JsonMcdocBlockStatesPottedBlueOrchid = Record<string, never>
type JsonMcdocBlockStatesPottedBrownMushroom = Record<string, never>
type JsonMcdocBlockStatesPottedCactus = Record<string, never>
type JsonMcdocBlockStatesPottedCherrySapling = Record<string, never>
type JsonMcdocBlockStatesPottedClosedEyeblossom = Record<string, never>
type JsonMcdocBlockStatesPottedCornflower = Record<string, never>
type JsonMcdocBlockStatesPottedCrimsonFungus = Record<string, never>
type JsonMcdocBlockStatesPottedCrimsonRoots = Record<string, never>
type JsonMcdocBlockStatesPottedDandelion = Record<string, never>
type JsonMcdocBlockStatesPottedDarkOakSapling = Record<string, never>
type JsonMcdocBlockStatesPottedDeadBush = Record<string, never>
type JsonMcdocBlockStatesPottedFern = Record<string, never>
type JsonMcdocBlockStatesPottedFloweringAzaleaBush = Record<string, never>
type JsonMcdocBlockStatesPottedGoldenDandelion = Record<string, never>
type JsonMcdocBlockStatesPottedJungleSapling = Record<string, never>
type JsonMcdocBlockStatesPottedLilyOfTheValley = Record<string, never>
type JsonMcdocBlockStatesPottedMangrovePropagule = Record<string, never>
type JsonMcdocBlockStatesPottedOakSapling = Record<string, never>
type JsonMcdocBlockStatesPottedOpenEyeblossom = Record<string, never>
type JsonMcdocBlockStatesPottedOrangeTulip = Record<string, never>
type JsonMcdocBlockStatesPottedOxeyeDaisy = Record<string, never>
type JsonMcdocBlockStatesPottedPaleOakSapling = Record<string, never>
type JsonMcdocBlockStatesPottedPinkTulip = Record<string, never>
type JsonMcdocBlockStatesPottedPoplarSapling = Record<string, never>
type JsonMcdocBlockStatesPottedPoppy = Record<string, never>
type JsonMcdocBlockStatesPottedRedMushroom = Record<string, never>
type JsonMcdocBlockStatesPottedRedTulip = Record<string, never>
type JsonMcdocBlockStatesPottedSpruceSapling = Record<string, never>
type JsonMcdocBlockStatesPottedTorchflower = Record<string, never>
type JsonMcdocBlockStatesPottedWarpedFungus = Record<string, never>
type JsonMcdocBlockStatesPottedWarpedRoots = Record<string, never>
type JsonMcdocBlockStatesPottedWhiteTulip = Record<string, never>
type JsonMcdocBlockStatesPottedWitherRose = Record<string, never>
type JsonMcdocBlockStatesPowderSnow = Record<string, never>
type JsonMcdocBlockStatesPowderSnowCauldron = {
  level?: ('1' | '2' | '3'),
}
type JsonMcdocBlockStatesPoweredRail = {
  powered?: ('true' | 'false'),
  shape?: ('north_south' | 'east_west' | 'ascending_east' | 'ascending_west' | 'ascending_north' | 'ascending_south'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPrismarine = Record<string, never>
type JsonMcdocBlockStatesPrismarineBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPrismarineBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPrismarineBricks = Record<string, never>
type JsonMcdocBlockStatesPrismarineSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPrismarineStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPrismarineWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesPumpkin = Record<string, never>
type JsonMcdocBlockStatesPumpkinStem = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'),
}
type JsonMcdocBlockStatesPurpleBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesPurpleBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesPurpleCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPurpleCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPurpleCarpet = Record<string, never>
type JsonMcdocBlockStatesPurpleConcrete = Record<string, never>
type JsonMcdocBlockStatesPurpleConcretePowder = Record<string, never>
type JsonMcdocBlockStatesPurpleConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPurpleConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPurpleGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesPurpleShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesPurpleStainedGlass = Record<string, never>
type JsonMcdocBlockStatesPurpleStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPurpleTerracotta = Record<string, never>
type JsonMcdocBlockStatesPurpleWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesPurpleWool = Record<string, never>
type JsonMcdocBlockStatesPurpleWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPurpleWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPurpurBlock = Record<string, never>
type JsonMcdocBlockStatesPurpurPillar = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesPurpurSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesPurpurStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesQuartzBlock = Record<string, never>
type JsonMcdocBlockStatesQuartzBricks = Record<string, never>
type JsonMcdocBlockStatesQuartzPillar = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesQuartzSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesQuartzStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRail = {
  shape?: (
      | 'north_south'
      | 'east_west'
      | 'ascending_east'
      | 'ascending_west'
      | 'ascending_north'
      | 'ascending_south'
      | 'south_east'
      | 'south_west'
      | 'north_west'
      | 'north_east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRawCopperBlock = Record<string, never>
type JsonMcdocBlockStatesRawGoldBlock = Record<string, never>
type JsonMcdocBlockStatesRawIronBlock = Record<string, never>
type JsonMcdocBlockStatesRedBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesRedBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesRedCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedCarpet = Record<string, never>
type JsonMcdocBlockStatesRedConcrete = Record<string, never>
type JsonMcdocBlockStatesRedConcretePowder = Record<string, never>
type JsonMcdocBlockStatesRedConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesRedMushroom = Record<string, never>
type JsonMcdocBlockStatesRedMushroomBlock = {
  down?: ('true' | 'false'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedNetherBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedNetherBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedNetherBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesRedNetherBricks = Record<string, never>
type JsonMcdocBlockStatesRedPoplarLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedSand = Record<string, never>
type JsonMcdocBlockStatesRedSandstone = Record<string, never>
type JsonMcdocBlockStatesRedSandstoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedSandstoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedSandstoneWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesRedShrub = Record<string, never>
type JsonMcdocBlockStatesRedShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesRedStainedGlass = Record<string, never>
type JsonMcdocBlockStatesRedStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedTerracotta = Record<string, never>
type JsonMcdocBlockStatesRedTulip = Record<string, never>
type JsonMcdocBlockStatesRedWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesRedWool = Record<string, never>
type JsonMcdocBlockStatesRedWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedstoneBlock = Record<string, never>
type JsonMcdocBlockStatesRedstoneLamp = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedstoneOre = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedstoneTorch = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedstoneWallTorch = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRedstoneWire = {
  east?: ('up' | 'side' | 'none'),
  north?: ('up' | 'side' | 'none'),
  power?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  south?: ('up' | 'side' | 'none'),
  west?: ('up' | 'side' | 'none'),
}
type JsonMcdocBlockStatesReinforcedDeepslate = Record<string, never>
type JsonMcdocBlockStatesRepeater = {
  delay?: ('1' | '2' | '3' | '4'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  locked?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRepeatingCommandBlock = {
  conditional?: ('true' | 'false'),
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesResinBlock = Record<string, never>
type JsonMcdocBlockStatesResinBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesResinBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesResinBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesResinBricks = Record<string, never>
type JsonMcdocBlockStatesResinClump = {
  down?: ('true' | 'false'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesRespawnAnchor = {
  charges?: ('0' | '1' | '2' | '3' | '4'),
}
type JsonMcdocBlockStatesRootedDirt = Record<string, never>
type JsonMcdocBlockStatesRoseBush = {
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesSand = Record<string, never>
type JsonMcdocBlockStatesSandstone = Record<string, never>
type JsonMcdocBlockStatesSandstoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSandstoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSandstoneWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesScaffolding = {
  bottom?: ('true' | 'false'),
  distance?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSculk = Record<string, never>
type JsonMcdocBlockStatesSculkCatalyst = {
  bloom?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSculkSensor = {
  power?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  sculk_sensor_phase?: ('inactive' | 'active' | 'cooldown'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSculkShrieker = {
  can_summon?: ('true' | 'false'),
  shrieking?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSculkVein = {
  down?: ('true' | 'false'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSeaLantern = Record<string, never>
type JsonMcdocBlockStatesSeaPickle = {
  pickles?: ('1' | '2' | '3' | '4'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSeagrass = Record<string, never>
type JsonMcdocBlockStatesShelfMushroom = {
  age?: ('0' | '1'),
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesShortDryGrass = Record<string, never>
type JsonMcdocBlockStatesShortGrass = Record<string, never>
type JsonMcdocBlockStatesShroomlight = Record<string, never>
type JsonMcdocBlockStatesShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesSkeletonSkull = {
  powered?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesSkeletonWallSkull = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSlimeBlock = Record<string, never>
type JsonMcdocBlockStatesSmallAmethystBud = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmallDripleaf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmithingTable = Record<string, never>
type JsonMcdocBlockStatesSmoker = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmoothBasalt = Record<string, never>
type JsonMcdocBlockStatesSmoothQuartz = Record<string, never>
type JsonMcdocBlockStatesSmoothQuartzSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmoothQuartzStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmoothRedSandstone = Record<string, never>
type JsonMcdocBlockStatesSmoothRedSandstoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmoothRedSandstoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmoothSandstone = Record<string, never>
type JsonMcdocBlockStatesSmoothSandstoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmoothSandstoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSmoothStone = Record<string, never>
type JsonMcdocBlockStatesSmoothStoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSnifferEgg = {
  hatch?: ('0' | '1' | '2'),
}
type JsonMcdocBlockStatesSnow = {
  layers?: ('1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'),
}
type JsonMcdocBlockStatesSnowBlock = Record<string, never>
type JsonMcdocBlockStatesSoulCampfire = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  lit?: ('true' | 'false'),
  signal_fire?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSoulFire = Record<string, never>
type JsonMcdocBlockStatesSoulLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSoulSand = Record<string, never>
type JsonMcdocBlockStatesSoulSoil = Record<string, never>
type JsonMcdocBlockStatesSoulTorch = Record<string, never>
type JsonMcdocBlockStatesSoulWallTorch = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesSpawner = Record<string, never>
type JsonMcdocBlockStatesSponge = Record<string, never>
type JsonMcdocBlockStatesSporeBlossom = Record<string, never>
type JsonMcdocBlockStatesSpruceButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesSprucePlanks = Record<string, never>
type JsonMcdocBlockStatesSprucePressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceSapling = {
  stage?: ('0' | '1'),
}
type JsonMcdocBlockStatesSpruceShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSpruceWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStickyPiston = {
  extended?: ('true' | 'false'),
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesStone = Record<string, never>
type JsonMcdocBlockStatesStoneBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesStoneBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesStoneBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesStoneBricks = Record<string, never>
type JsonMcdocBlockStatesStoneButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesStonePressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesStoneSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesStoneStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesStonecutter = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesStrawBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesStrippedAcaciaLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedAcaciaWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedBambooBlock = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedBirchLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedBirchWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedCherryLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedCherryWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedCrimsonHyphae = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedCrimsonStem = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedDarkOakLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedDarkOakWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedJungleLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedJungleWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedMangroveLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedMangroveWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedOakLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedOakWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedPaleOakLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedPaleOakWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedPoplarLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedPoplarWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedSpruceLog = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedSpruceWood = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedWarpedHyphae = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStrippedWarpedStem = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesStructureBlock = {
  mode?: ('save' | 'load' | 'corner' | 'data'),
}
type JsonMcdocBlockStatesStructureVoid = Record<string, never>
type JsonMcdocBlockStatesSugarCane = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesSulfur = Record<string, never>
type JsonMcdocBlockStatesSulfurBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSulfurBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSulfurBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesSulfurBricks = Record<string, never>
type JsonMcdocBlockStatesSulfurSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSulfurSpike = {
  thickness?: ('tip_merge' | 'tip' | 'frustum' | 'middle' | 'base'),
  vertical_direction?: ('up' | 'down'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSulfurStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesSulfurWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesSunflower = {
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesSuspiciousGravel = {
  dusted?: ('0' | '1' | '2' | '3'),
}
type JsonMcdocBlockStatesSuspiciousSand = {
  dusted?: ('0' | '1' | '2' | '3'),
}
type JsonMcdocBlockStatesSweetBerryBush = {
  age?: ('0' | '1' | '2' | '3'),
}
type JsonMcdocBlockStatesTallDryGrass = Record<string, never>
type JsonMcdocBlockStatesTallGrass = {
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesTallSeagrass = {
  half?: ('upper' | 'lower'),
}
type JsonMcdocBlockStatesTarget = {
  power?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesTerracotta = Record<string, never>
type JsonMcdocBlockStatesTestBlock = {
  mode?: ('start' | 'log' | 'fail' | 'accept'),
}
type JsonMcdocBlockStatesTestInstanceBlock = Record<string, never>
type JsonMcdocBlockStatesTintedGlass = Record<string, never>
type JsonMcdocBlockStatesTnt = {
  unstable?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTorch = Record<string, never>
type JsonMcdocBlockStatesTorchflower = Record<string, never>
type JsonMcdocBlockStatesTorchflowerCrop = {
  age?: ('0' | '1'),
}
type JsonMcdocBlockStatesTrappedChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTrialSpawner = {
  ominous?: ('true' | 'false'),
  trial_spawner_state?: (
      | 'inactive'
      | 'waiting_for_players'
      | 'active'
      | 'waiting_for_reward_ejection'
      | 'ejecting_reward'
      | 'cooldown'),
}
type JsonMcdocBlockStatesTripwire = {
  attached?: ('true' | 'false'),
  disarmed?: ('true' | 'false'),
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  south?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTripwireHook = {
  attached?: ('true' | 'false'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTubeCoral = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTubeCoralBlock = Record<string, never>
type JsonMcdocBlockStatesTubeCoralFan = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTubeCoralWallFan = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTuff = Record<string, never>
type JsonMcdocBlockStatesTuffBrickSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTuffBrickStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTuffBrickWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesTuffBricks = Record<string, never>
type JsonMcdocBlockStatesTuffSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTuffStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesTuffWall = {
  east?: ('none' | 'low' | 'tall'),
  north?: ('none' | 'low' | 'tall'),
  south?: ('none' | 'low' | 'tall'),
  up?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('none' | 'low' | 'tall'),
}
type JsonMcdocBlockStatesTurtleEgg = {
  eggs?: ('1' | '2' | '3' | '4'),
  hatch?: ('0' | '1' | '2'),
}
type JsonMcdocBlockStatesTwistingVines = {
  age?: (
      | '0'
      | '1'
      | '2'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '10'
      | '11'
      | '12'
      | '13'
      | '14'
      | '15'
      | '16'
      | '17'
      | '18'
      | '19'
      | '20'
      | '21'
      | '22'
      | '23'
      | '24'
      | '25'),
}
type JsonMcdocBlockStatesTwistingVinesPlant = Record<string, never>
type JsonMcdocBlockStatesVault = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  ominous?: ('true' | 'false'),
  vault_state?: ('inactive' | 'active' | 'unlocking' | 'ejecting'),
}
type JsonMcdocBlockStatesVerdantFroglight = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesVine = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  up?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesVoidAir = Record<string, never>
type JsonMcdocBlockStatesWallTorch = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesWarpedButton = {
  face?: ('floor' | 'wall' | 'ceiling'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedFence = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedFenceGate = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  in_wall?: ('true' | 'false'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedFungus = Record<string, never>
type JsonMcdocBlockStatesWarpedHangingSign = {
  attached?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedHyphae = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesWarpedNylium = Record<string, never>
type JsonMcdocBlockStatesWarpedPlanks = Record<string, never>
type JsonMcdocBlockStatesWarpedPressurePlate = {
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedRoots = Record<string, never>
type JsonMcdocBlockStatesWarpedShelf = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
  side_chain?: ('unconnected' | 'right' | 'center' | 'left'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedSign = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedStem = {
  axis?: ('x' | 'y' | 'z'),
}
type JsonMcdocBlockStatesWarpedTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedWallHangingSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedWallSign = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWarpedWartBlock = Record<string, never>
type JsonMcdocBlockStatesWater = {
  level?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesWaterCauldron = {
  level?: ('1' | '2' | '3'),
}
type JsonMcdocBlockStatesWaxedChiseledCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedCopperBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCopperBlock = Record<string, never>
type JsonMcdocBlockStatesWaxedCopperBulb = {
  lit?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCopperChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCopperChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCopperDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCopperGolemStatue = {
  copper_golem_pose?: ('standing' | 'sitting' | 'running' | 'star'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCopperGrate = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCopperLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCopperTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCutCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedCutCopperSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedCutCopperStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedChiseledCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedExposedCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedExposedCopperBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCopperBulb = {
  lit?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCopperChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCopperChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCopperDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCopperGolemStatue = {
  copper_golem_pose?: ('standing' | 'sitting' | 'running' | 'star'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCopperGrate = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCopperLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCopperTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCutCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedExposedCutCopperSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedCutCopperStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedExposedLightningRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedLightningRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedChiseledCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedOxidizedCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedOxidizedCopperBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCopperBulb = {
  lit?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCopperChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCopperChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCopperDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCopperGolemStatue = {
  copper_golem_pose?: ('standing' | 'sitting' | 'running' | 'star'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCopperGrate = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCopperLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCopperTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCutCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedOxidizedCutCopperSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedCutCopperStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedOxidizedLightningRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredChiseledCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedWeatheredCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedWeatheredCopperBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCopperBulb = {
  lit?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCopperChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCopperChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCopperDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCopperGolemStatue = {
  copper_golem_pose?: ('standing' | 'sitting' | 'running' | 'star'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCopperGrate = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCopperLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCopperTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCutCopper = Record<string, never>
type JsonMcdocBlockStatesWaxedWeatheredCutCopperSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredCutCopperStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWaxedWeatheredLightningRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredChiseledCopper = Record<string, never>
type JsonMcdocBlockStatesWeatheredCopper = Record<string, never>
type JsonMcdocBlockStatesWeatheredCopperBars = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCopperBulb = {
  lit?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCopperChain = {
  axis?: ('x' | 'y' | 'z'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCopperChest = {
  type?: ('single' | 'left' | 'right'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCopperDoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('upper' | 'lower'),
  hinge?: ('left' | 'right'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCopperGolemStatue = {
  copper_golem_pose?: ('standing' | 'sitting' | 'running' | 'star'),
  facing?: ('north' | 'south' | 'west' | 'east'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCopperGrate = {
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCopperLantern = {
  hanging?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCopperTrapdoor = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  open?: ('true' | 'false'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCutCopper = Record<string, never>
type JsonMcdocBlockStatesWeatheredCutCopperSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredCutCopperStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeatheredLightningRod = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
  powered?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWeepingVines = {
  age?: (
      | '0'
      | '1'
      | '2'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '10'
      | '11'
      | '12'
      | '13'
      | '14'
      | '15'
      | '16'
      | '17'
      | '18'
      | '19'
      | '20'
      | '21'
      | '22'
      | '23'
      | '24'
      | '25'),
}
type JsonMcdocBlockStatesWeepingVinesPlant = Record<string, never>
type JsonMcdocBlockStatesWetSponge = Record<string, never>
type JsonMcdocBlockStatesWheat = {
  age?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'),
}
type JsonMcdocBlockStatesWhiteBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesWhiteBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesWhiteCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWhiteCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWhiteCarpet = Record<string, never>
type JsonMcdocBlockStatesWhiteConcrete = Record<string, never>
type JsonMcdocBlockStatesWhiteConcretePowder = Record<string, never>
type JsonMcdocBlockStatesWhiteConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWhiteConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWhiteGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesWhiteShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesWhiteStainedGlass = Record<string, never>
type JsonMcdocBlockStatesWhiteStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWhiteTerracotta = Record<string, never>
type JsonMcdocBlockStatesWhiteTulip = Record<string, never>
type JsonMcdocBlockStatesWhiteWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesWhiteWool = Record<string, never>
type JsonMcdocBlockStatesWhiteWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWhiteWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesWildflowers = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  flower_amount?: ('1' | '2' | '3' | '4'),
}
type JsonMcdocBlockStatesWitherRose = Record<string, never>
type JsonMcdocBlockStatesWitherSkeletonSkull = {
  powered?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesWitherSkeletonWallSkull = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
type JsonMcdocBlockStatesYellowBanner = {
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesYellowBed = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  occupied?: ('true' | 'false'),
  part?: ('head' | 'foot'),
}
type JsonMcdocBlockStatesYellowCandle = {
  candles?: ('1' | '2' | '3' | '4'),
  lit?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesYellowCandleCake = {
  lit?: ('true' | 'false'),
}
type JsonMcdocBlockStatesYellowCarpet = Record<string, never>
type JsonMcdocBlockStatesYellowConcrete = Record<string, never>
type JsonMcdocBlockStatesYellowConcretePowder = Record<string, never>
type JsonMcdocBlockStatesYellowConcreteSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesYellowConcreteStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesYellowGlazedTerracotta = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesYellowPoplarLeaves = {
  distance?: ('1' | '2' | '3' | '4' | '5' | '6' | '7'),
  persistent?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesYellowShulkerBox = {
  facing?: ('north' | 'east' | 'south' | 'west' | 'up' | 'down'),
}
type JsonMcdocBlockStatesYellowStainedGlass = Record<string, never>
type JsonMcdocBlockStatesYellowStainedGlassPane = {
  east?: ('true' | 'false'),
  north?: ('true' | 'false'),
  south?: ('true' | 'false'),
  waterlogged?: ('true' | 'false'),
  west?: ('true' | 'false'),
}
type JsonMcdocBlockStatesYellowTerracotta = Record<string, never>
type JsonMcdocBlockStatesYellowWallBanner = {
  facing?: ('north' | 'south' | 'west' | 'east'),
}
type JsonMcdocBlockStatesYellowWool = Record<string, never>
type JsonMcdocBlockStatesYellowWoolSlab = {
  type?: ('top' | 'bottom' | 'double'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesYellowWoolStairs = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  half?: ('top' | 'bottom'),
  shape?: ('straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'),
  waterlogged?: ('true' | 'false'),
}
type JsonMcdocBlockStatesZombieHead = {
  powered?: ('true' | 'false'),
  rotation?: ('0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15'),
}
type JsonMcdocBlockStatesZombieWallHead = {
  facing?: ('north' | 'south' | 'west' | 'east'),
  powered?: ('true' | 'false'),
}
export type JsonSymbolMcdocBlockStates<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocBlockStatesDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocBlockStatesKeys
    : CASE extends '%fallback'
      ? JsonMcdocBlockStatesFallback
      : CASE extends '%none'
        ? JsonMcdocBlockStatesNoneType
        : CASE extends '%unknown' ? JsonMcdocBlockStatesFallbackType : never
