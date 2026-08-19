import type { JsonBanner } from 'sandstone/arguments/generated/_json/world/block/banner.ts'
import type { JsonBeacon } from 'sandstone/arguments/generated/_json/world/block/beacon.ts'
import type { JsonBeehive } from 'sandstone/arguments/generated/_json/world/block/beehive.ts'
import type { JsonBrewingStand } from 'sandstone/arguments/generated/_json/world/block/brewing_stand.ts'
import type { JsonBrushableBlock } from 'sandstone/arguments/generated/_json/world/block/brushable_block.ts'
import type { JsonCampfire } from 'sandstone/arguments/generated/_json/world/block/campfire.ts'
import type { JsonChiseledBookshelf } from 'sandstone/arguments/generated/_json/world/block/chiseled_bookshelf.ts'
import type { JsonCommandBlock } from 'sandstone/arguments/generated/_json/world/block/command_block.ts'
import type { JsonComparator } from 'sandstone/arguments/generated/_json/world/block/comparator.ts'
import type { JsonConduit } from 'sandstone/arguments/generated/_json/world/block/conduit.ts'
import type {
  JsonContainer27,
  JsonContainer9,
  JsonHopper,
  JsonShelf,
} from 'sandstone/arguments/generated/_json/world/block/container.ts'
import type { JsonCrafter } from 'sandstone/arguments/generated/_json/world/block/crafter.ts'
import type { JsonCreakingHeart } from 'sandstone/arguments/generated/_json/world/block/creaking_heart.ts'
import type { JsonDecoratedPot } from 'sandstone/arguments/generated/_json/world/block/decorated_pot.ts'
import type { JsonEnchantingTable } from 'sandstone/arguments/generated/_json/world/block/enchanting_table.ts'
import type { JsonEndGateway } from 'sandstone/arguments/generated/_json/world/block/end_gateway.ts'
import type { JsonFurnace } from 'sandstone/arguments/generated/_json/world/block/furnace.ts'
import type { JsonSkull } from 'sandstone/arguments/generated/_json/world/block/head.ts'
import type { JsonJigsaw } from 'sandstone/arguments/generated/_json/world/block/jigsaw.ts'
import type { JsonJukebox } from 'sandstone/arguments/generated/_json/world/block/jukebox.ts'
import type { JsonLectern } from 'sandstone/arguments/generated/_json/world/block/lectern.ts'
import type { JsonMovingPiston } from 'sandstone/arguments/generated/_json/world/block/moving_piston.ts'
import type { JsonPotentSulfur } from 'sandstone/arguments/generated/_json/world/block/potent_sulfur.ts'
import type { JsonSculkCatalyst } from 'sandstone/arguments/generated/_json/world/block/sculk_catalyst.ts'
import type { JsonSculkSensor } from 'sandstone/arguments/generated/_json/world/block/sculk_sensor.ts'
import type { JsonSculkShrieker } from 'sandstone/arguments/generated/_json/world/block/sculk_shrieker.ts'
import type { JsonSign } from 'sandstone/arguments/generated/_json/world/block/sign.ts'
import type { JsonSpawner, JsonTrialSpawner } from 'sandstone/arguments/generated/_json/world/block/spawner.ts'
import type { JsonStructureBlock } from 'sandstone/arguments/generated/_json/world/block/structure_block.ts'
import type { JsonTestBlock } from 'sandstone/arguments/generated/_json/world/block/test_block.ts'
import type { JsonTestInstanceBlock } from 'sandstone/arguments/generated/_json/world/block/test_instance_block.ts'
import type { JsonVault } from 'sandstone/arguments/generated/_json/world/block/vault.ts'

type JsonBlockEntityDispatcherMap = {
  'banner': JsonBlockEntityBanner,
  'minecraft:banner': JsonBlockEntityBanner,
  'barrel': JsonBlockEntityBarrel,
  'minecraft:barrel': JsonBlockEntityBarrel,
  'beacon': JsonBlockEntityBeacon,
  'minecraft:beacon': JsonBlockEntityBeacon,
  'beehive': JsonBlockEntityBeehive,
  'minecraft:beehive': JsonBlockEntityBeehive,
  'blast_furnace': JsonBlockEntityBlastFurnace,
  'minecraft:blast_furnace': JsonBlockEntityBlastFurnace,
  'brewing_stand': JsonBlockEntityBrewingStand,
  'minecraft:brewing_stand': JsonBlockEntityBrewingStand,
  'brushable_block': JsonBlockEntityBrushableBlock,
  'minecraft:brushable_block': JsonBlockEntityBrushableBlock,
  'calibrated_sculk_sensor': JsonBlockEntityCalibratedSculkSensor,
  'minecraft:calibrated_sculk_sensor': JsonBlockEntityCalibratedSculkSensor,
  'campfire': JsonBlockEntityCampfire,
  'minecraft:campfire': JsonBlockEntityCampfire,
  'chest': JsonBlockEntityChest,
  'minecraft:chest': JsonBlockEntityChest,
  'chiseled_bookshelf': JsonBlockEntityChiseledBookshelf,
  'minecraft:chiseled_bookshelf': JsonBlockEntityChiseledBookshelf,
  'command_block': JsonBlockEntityCommandBlock,
  'minecraft:command_block': JsonBlockEntityCommandBlock,
  'comparator': JsonBlockEntityComparator,
  'minecraft:comparator': JsonBlockEntityComparator,
  'conduit': JsonBlockEntityConduit,
  'minecraft:conduit': JsonBlockEntityConduit,
  'crafter': JsonBlockEntityCrafter,
  'minecraft:crafter': JsonBlockEntityCrafter,
  'creaking_heart': JsonBlockEntityCreakingHeart,
  'minecraft:creaking_heart': JsonBlockEntityCreakingHeart,
  'decorated_pot': JsonBlockEntityDecoratedPot,
  'minecraft:decorated_pot': JsonBlockEntityDecoratedPot,
  'dispenser': JsonBlockEntityDispenser,
  'minecraft:dispenser': JsonBlockEntityDispenser,
  'dropper': JsonBlockEntityDropper,
  'minecraft:dropper': JsonBlockEntityDropper,
  'enchanting_table': JsonBlockEntityEnchantingTable,
  'minecraft:enchanting_table': JsonBlockEntityEnchantingTable,
  'end_gateway': JsonBlockEntityEndGateway,
  'minecraft:end_gateway': JsonBlockEntityEndGateway,
  'furnace': JsonBlockEntityFurnace,
  'minecraft:furnace': JsonBlockEntityFurnace,
  'hanging_sign': JsonBlockEntityHangingSign,
  'minecraft:hanging_sign': JsonBlockEntityHangingSign,
  'hopper': JsonBlockEntityHopper,
  'minecraft:hopper': JsonBlockEntityHopper,
  'jigsaw': JsonBlockEntityJigsaw,
  'minecraft:jigsaw': JsonBlockEntityJigsaw,
  'jukebox': JsonBlockEntityJukebox,
  'minecraft:jukebox': JsonBlockEntityJukebox,
  'lectern': JsonBlockEntityLectern,
  'minecraft:lectern': JsonBlockEntityLectern,
  'mob_spawner': JsonBlockEntityMobSpawner,
  'minecraft:mob_spawner': JsonBlockEntityMobSpawner,
  'moving_piston': JsonBlockEntityMovingPiston,
  'minecraft:moving_piston': JsonBlockEntityMovingPiston,
  'potent_sulfur': JsonBlockEntityPotentSulfur,
  'minecraft:potent_sulfur': JsonBlockEntityPotentSulfur,
  'sculk_catalyst': JsonBlockEntitySculkCatalyst,
  'minecraft:sculk_catalyst': JsonBlockEntitySculkCatalyst,
  'sculk_sensor': JsonBlockEntitySculkSensor,
  'minecraft:sculk_sensor': JsonBlockEntitySculkSensor,
  'sculk_shrieker': JsonBlockEntitySculkShrieker,
  'minecraft:sculk_shrieker': JsonBlockEntitySculkShrieker,
  'shelf': JsonBlockEntityShelf,
  'minecraft:shelf': JsonBlockEntityShelf,
  'shulker_box': JsonBlockEntityShulkerBox,
  'minecraft:shulker_box': JsonBlockEntityShulkerBox,
  'sign': JsonBlockEntitySign,
  'minecraft:sign': JsonBlockEntitySign,
  'skull': JsonBlockEntitySkull,
  'minecraft:skull': JsonBlockEntitySkull,
  'smoker': JsonBlockEntitySmoker,
  'minecraft:smoker': JsonBlockEntitySmoker,
  'structure_block': JsonBlockEntityStructureBlock,
  'minecraft:structure_block': JsonBlockEntityStructureBlock,
  'test_block': JsonBlockEntityTestBlock,
  'minecraft:test_block': JsonBlockEntityTestBlock,
  'test_instance_block': JsonBlockEntityTestInstanceBlock,
  'minecraft:test_instance_block': JsonBlockEntityTestInstanceBlock,
  'trapped_chest': JsonBlockEntityTrappedChest,
  'minecraft:trapped_chest': JsonBlockEntityTrappedChest,
  'trial_spawner': JsonBlockEntityTrialSpawner,
  'minecraft:trial_spawner': JsonBlockEntityTrialSpawner,
  'vault': JsonBlockEntityVault,
  'minecraft:vault': JsonBlockEntityVault,
}
type JsonBlockEntityKeys = keyof JsonBlockEntityDispatcherMap
type JsonBlockEntityFallback = (
  | JsonBlockEntityBanner
  | JsonBlockEntityBarrel
  | JsonBlockEntityBeacon
  | JsonBlockEntityBeehive
  | JsonBlockEntityBlastFurnace
  | JsonBlockEntityBrewingStand
  | JsonBlockEntityBrushableBlock
  | JsonBlockEntityCalibratedSculkSensor
  | JsonBlockEntityCampfire
  | JsonBlockEntityChest
  | JsonBlockEntityChiseledBookshelf
  | JsonBlockEntityCommandBlock
  | JsonBlockEntityComparator
  | JsonBlockEntityConduit
  | JsonBlockEntityCrafter
  | JsonBlockEntityCreakingHeart
  | JsonBlockEntityDecoratedPot
  | JsonBlockEntityDispenser
  | JsonBlockEntityDropper
  | JsonBlockEntityEnchantingTable
  | JsonBlockEntityEndGateway
  | JsonBlockEntityFurnace
  | JsonBlockEntityHangingSign
  | JsonBlockEntityHopper
  | JsonBlockEntityJigsaw
  | JsonBlockEntityJukebox
  | JsonBlockEntityLectern
  | JsonBlockEntityMobSpawner
  | JsonBlockEntityMovingPiston
  | JsonBlockEntityPotentSulfur
  | JsonBlockEntitySculkCatalyst
  | JsonBlockEntitySculkSensor
  | JsonBlockEntitySculkShrieker
  | JsonBlockEntityShelf
  | JsonBlockEntityShulkerBox
  | JsonBlockEntitySign
  | JsonBlockEntitySkull
  | JsonBlockEntitySmoker
  | JsonBlockEntityStructureBlock
  | JsonBlockEntityTestBlock
  | JsonBlockEntityTestInstanceBlock
  | JsonBlockEntityTrappedChest
  | JsonBlockEntityTrialSpawner
  | JsonBlockEntityVault)
type JsonBlockEntityBanner = JsonBanner
type JsonBlockEntityBarrel = JsonContainer27
type JsonBlockEntityBeacon = JsonBeacon
type JsonBlockEntityBeehive = JsonBeehive
type JsonBlockEntityBlastFurnace = JsonFurnace
type JsonBlockEntityBrewingStand = JsonBrewingStand
type JsonBlockEntityBrushableBlock = JsonBrushableBlock
type JsonBlockEntityCalibratedSculkSensor = JsonSculkSensor
type JsonBlockEntityCampfire = JsonCampfire
type JsonBlockEntityChest = JsonContainer27
type JsonBlockEntityChiseledBookshelf = JsonChiseledBookshelf
type JsonBlockEntityCommandBlock = JsonCommandBlock
type JsonBlockEntityComparator = JsonComparator
type JsonBlockEntityConduit = JsonConduit
type JsonBlockEntityCrafter = JsonCrafter
type JsonBlockEntityCreakingHeart = JsonCreakingHeart
type JsonBlockEntityDecoratedPot = JsonDecoratedPot
type JsonBlockEntityDispenser = JsonContainer9
type JsonBlockEntityDropper = JsonContainer9
type JsonBlockEntityEnchantingTable = JsonEnchantingTable
type JsonBlockEntityEndGateway = JsonEndGateway
type JsonBlockEntityFurnace = JsonFurnace
type JsonBlockEntityHangingSign = JsonSign
type JsonBlockEntityHopper = JsonHopper
type JsonBlockEntityJigsaw = JsonJigsaw
type JsonBlockEntityJukebox = JsonJukebox
type JsonBlockEntityLectern = JsonLectern
type JsonBlockEntityMobSpawner = JsonSpawner
type JsonBlockEntityMovingPiston = JsonMovingPiston
type JsonBlockEntityPotentSulfur = JsonPotentSulfur
type JsonBlockEntitySculkCatalyst = JsonSculkCatalyst
type JsonBlockEntitySculkSensor = JsonSculkSensor
type JsonBlockEntitySculkShrieker = JsonSculkShrieker
type JsonBlockEntityShelf = JsonShelf
type JsonBlockEntityShulkerBox = JsonContainer27
type JsonBlockEntitySign = JsonSign
type JsonBlockEntitySkull = JsonSkull
type JsonBlockEntitySmoker = JsonFurnace
type JsonBlockEntityStructureBlock = JsonStructureBlock
type JsonBlockEntityTestBlock = JsonTestBlock
type JsonBlockEntityTestInstanceBlock = JsonTestInstanceBlock
type JsonBlockEntityTrappedChest = JsonContainer27
type JsonBlockEntityTrialSpawner = JsonTrialSpawner
type JsonBlockEntityVault = JsonVault
export type JsonSymbolBlockEntity<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonBlockEntityDispatcherMap
  : CASE extends 'keys' ? JsonBlockEntityKeys : CASE extends '%fallback' ? JsonBlockEntityFallback : never
