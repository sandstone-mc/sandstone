import type { Banner } from 'sandstone/arguments/generated/world/block/banner'
import type { Beacon } from 'sandstone/arguments/generated/world/block/beacon'
import type { Beehive } from 'sandstone/arguments/generated/world/block/beehive'
import type { BrewingStand } from 'sandstone/arguments/generated/world/block/brewing_stand'
import type { BrushableBlock } from 'sandstone/arguments/generated/world/block/brushable_block'
import type { Campfire } from 'sandstone/arguments/generated/world/block/campfire'
import type { ChiseledBookshelf } from 'sandstone/arguments/generated/world/block/chiseled_bookshelf'
import type { CommandBlock } from 'sandstone/arguments/generated/world/block/command_block'
import type { Comparator } from 'sandstone/arguments/generated/world/block/comparator'
import type { Conduit } from 'sandstone/arguments/generated/world/block/conduit'
import type { Container27, Container9, Hopper, Shelf } from 'sandstone/arguments/generated/world/block/container'
import type { Crafter } from 'sandstone/arguments/generated/world/block/crafter'
import type { CreakingHeart } from 'sandstone/arguments/generated/world/block/creaking_heart'
import type { DecoratedPot } from 'sandstone/arguments/generated/world/block/decorated_pot'
import type { EnchantingTable } from 'sandstone/arguments/generated/world/block/enchanting_table'
import type { EndGateway } from 'sandstone/arguments/generated/world/block/end_gateway'
import type { Furnace } from 'sandstone/arguments/generated/world/block/furnace'
import type { Skull } from 'sandstone/arguments/generated/world/block/head'
import type { Jigsaw } from 'sandstone/arguments/generated/world/block/jigsaw'
import type { Jukebox } from 'sandstone/arguments/generated/world/block/jukebox'
import type { Lectern } from 'sandstone/arguments/generated/world/block/lectern'
import type { MovingPiston } from 'sandstone/arguments/generated/world/block/moving_piston'
import type { SculkCatalyst } from 'sandstone/arguments/generated/world/block/sculk_catalyst'
import type { SculkSensor } from 'sandstone/arguments/generated/world/block/sculk_sensor'
import type { SculkShrieker } from 'sandstone/arguments/generated/world/block/sculk_shrieker'
import type { Sign } from 'sandstone/arguments/generated/world/block/sign'
import type { Spawner, TrialSpawner } from 'sandstone/arguments/generated/world/block/spawner'
import type { StructureBlock } from 'sandstone/arguments/generated/world/block/structure_block'
import type { TestBlock } from 'sandstone/arguments/generated/world/block/test_block'
import type { TestInstanceBlock } from 'sandstone/arguments/generated/world/block/test_instance_block'
import type { Vault } from 'sandstone/arguments/generated/world/block/vault'

type BlockEntityDispatcherMap = {
  'banner': BlockEntityBanner
  'minecraft:banner': BlockEntityBanner
  'barrel': BlockEntityBarrel
  'minecraft:barrel': BlockEntityBarrel
  'beacon': BlockEntityBeacon
  'minecraft:beacon': BlockEntityBeacon
  'beehive': BlockEntityBeehive
  'minecraft:beehive': BlockEntityBeehive
  'blast_furnace': BlockEntityBlastFurnace
  'minecraft:blast_furnace': BlockEntityBlastFurnace
  'brewing_stand': BlockEntityBrewingStand
  'minecraft:brewing_stand': BlockEntityBrewingStand
  'brushable_block': BlockEntityBrushableBlock
  'minecraft:brushable_block': BlockEntityBrushableBlock
  'calibrated_sculk_sensor': BlockEntityCalibratedSculkSensor
  'minecraft:calibrated_sculk_sensor': BlockEntityCalibratedSculkSensor
  'campfire': BlockEntityCampfire
  'minecraft:campfire': BlockEntityCampfire
  'chest': BlockEntityChest
  'minecraft:chest': BlockEntityChest
  'chiseled_bookshelf': BlockEntityChiseledBookshelf
  'minecraft:chiseled_bookshelf': BlockEntityChiseledBookshelf
  'command_block': BlockEntityCommandBlock
  'minecraft:command_block': BlockEntityCommandBlock
  'comparator': BlockEntityComparator
  'minecraft:comparator': BlockEntityComparator
  'conduit': BlockEntityConduit
  'minecraft:conduit': BlockEntityConduit
  'crafter': BlockEntityCrafter
  'minecraft:crafter': BlockEntityCrafter
  'creaking_heart': BlockEntityCreakingHeart
  'minecraft:creaking_heart': BlockEntityCreakingHeart
  'decorated_pot': BlockEntityDecoratedPot
  'minecraft:decorated_pot': BlockEntityDecoratedPot
  'dispenser': BlockEntityDispenser
  'minecraft:dispenser': BlockEntityDispenser
  'dropper': BlockEntityDropper
  'minecraft:dropper': BlockEntityDropper
  'enchanting_table': BlockEntityEnchantingTable
  'minecraft:enchanting_table': BlockEntityEnchantingTable
  'end_gateway': BlockEntityEndGateway
  'minecraft:end_gateway': BlockEntityEndGateway
  'furnace': BlockEntityFurnace
  'minecraft:furnace': BlockEntityFurnace
  'hanging_sign': BlockEntityHangingSign
  'minecraft:hanging_sign': BlockEntityHangingSign
  'hopper': BlockEntityHopper
  'minecraft:hopper': BlockEntityHopper
  'jigsaw': BlockEntityJigsaw
  'minecraft:jigsaw': BlockEntityJigsaw
  'jukebox': BlockEntityJukebox
  'minecraft:jukebox': BlockEntityJukebox
  'lectern': BlockEntityLectern
  'minecraft:lectern': BlockEntityLectern
  'mob_spawner': BlockEntityMobSpawner
  'minecraft:mob_spawner': BlockEntityMobSpawner
  'moving_piston': BlockEntityMovingPiston
  'minecraft:moving_piston': BlockEntityMovingPiston
  'sculk_catalyst': BlockEntitySculkCatalyst
  'minecraft:sculk_catalyst': BlockEntitySculkCatalyst
  'sculk_sensor': BlockEntitySculkSensor
  'minecraft:sculk_sensor': BlockEntitySculkSensor
  'sculk_shrieker': BlockEntitySculkShrieker
  'minecraft:sculk_shrieker': BlockEntitySculkShrieker
  'shelf': BlockEntityShelf
  'minecraft:shelf': BlockEntityShelf
  'shulker_box': BlockEntityShulkerBox
  'minecraft:shulker_box': BlockEntityShulkerBox
  'sign': BlockEntitySign
  'minecraft:sign': BlockEntitySign
  'skull': BlockEntitySkull
  'minecraft:skull': BlockEntitySkull
  'smoker': BlockEntitySmoker
  'minecraft:smoker': BlockEntitySmoker
  'structure_block': BlockEntityStructureBlock
  'minecraft:structure_block': BlockEntityStructureBlock
  'test_block': BlockEntityTestBlock
  'minecraft:test_block': BlockEntityTestBlock
  'test_instance_block': BlockEntityTestInstanceBlock
  'minecraft:test_instance_block': BlockEntityTestInstanceBlock
  'trapped_chest': BlockEntityTrappedChest
  'minecraft:trapped_chest': BlockEntityTrappedChest
  'trial_spawner': BlockEntityTrialSpawner
  'minecraft:trial_spawner': BlockEntityTrialSpawner
  'vault': BlockEntityVault
  'minecraft:vault': BlockEntityVault
}
type BlockEntityKeys = keyof BlockEntityDispatcherMap
type BlockEntityFallback = (
  | BlockEntityBanner
  | BlockEntityBarrel
  | BlockEntityBeacon
  | BlockEntityBeehive
  | BlockEntityBlastFurnace
  | BlockEntityBrewingStand
  | BlockEntityBrushableBlock
  | BlockEntityCalibratedSculkSensor
  | BlockEntityCampfire
  | BlockEntityChest
  | BlockEntityChiseledBookshelf
  | BlockEntityCommandBlock
  | BlockEntityComparator
  | BlockEntityConduit
  | BlockEntityCrafter
  | BlockEntityCreakingHeart
  | BlockEntityDecoratedPot
  | BlockEntityDispenser
  | BlockEntityDropper
  | BlockEntityEnchantingTable
  | BlockEntityEndGateway
  | BlockEntityFurnace
  | BlockEntityHangingSign
  | BlockEntityHopper
  | BlockEntityJigsaw
  | BlockEntityJukebox
  | BlockEntityLectern
  | BlockEntityMobSpawner
  | BlockEntityMovingPiston
  | BlockEntitySculkCatalyst
  | BlockEntitySculkSensor
  | BlockEntitySculkShrieker
  | BlockEntityShelf
  | BlockEntityShulkerBox
  | BlockEntitySign
  | BlockEntitySkull
  | BlockEntitySmoker
  | BlockEntityStructureBlock
  | BlockEntityTestBlock
  | BlockEntityTestInstanceBlock
  | BlockEntityTrappedChest
  | BlockEntityTrialSpawner
  | BlockEntityVault)
type BlockEntityBanner = Banner
type BlockEntityBarrel = Container27
type BlockEntityBeacon = Beacon
type BlockEntityBeehive = Beehive
type BlockEntityBlastFurnace = Furnace
type BlockEntityBrewingStand = BrewingStand
type BlockEntityBrushableBlock = BrushableBlock
type BlockEntityCalibratedSculkSensor = SculkSensor
type BlockEntityCampfire = Campfire
type BlockEntityChest = Container27
type BlockEntityChiseledBookshelf = ChiseledBookshelf
type BlockEntityCommandBlock = CommandBlock
type BlockEntityComparator = Comparator
type BlockEntityConduit = Conduit
type BlockEntityCrafter = Crafter
type BlockEntityCreakingHeart = CreakingHeart
type BlockEntityDecoratedPot = DecoratedPot
type BlockEntityDispenser = Container9
type BlockEntityDropper = Container9
type BlockEntityEnchantingTable = EnchantingTable
type BlockEntityEndGateway = EndGateway
type BlockEntityFurnace = Furnace
type BlockEntityHangingSign = Sign
type BlockEntityHopper = Hopper
type BlockEntityJigsaw = Jigsaw
type BlockEntityJukebox = Jukebox
type BlockEntityLectern = Lectern
type BlockEntityMobSpawner = Spawner
type BlockEntityMovingPiston = MovingPiston
type BlockEntitySculkCatalyst = SculkCatalyst
type BlockEntitySculkSensor = SculkSensor
type BlockEntitySculkShrieker = SculkShrieker
type BlockEntityShelf = Shelf
type BlockEntityShulkerBox = Container27
type BlockEntitySign = Sign
type BlockEntitySkull = Skull
type BlockEntitySmoker = Furnace
type BlockEntityStructureBlock = StructureBlock
type BlockEntityTestBlock = TestBlock
type BlockEntityTestInstanceBlock = TestInstanceBlock
type BlockEntityTrappedChest = Container27
type BlockEntityTrialSpawner = TrialSpawner
type BlockEntityVault = Vault
export type SymbolBlockEntity<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? BlockEntityDispatcherMap
  : CASE extends 'keys' ? BlockEntityKeys : CASE extends '%fallback' ? BlockEntityFallback : never
