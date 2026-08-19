import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonGlobalPos } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonSlottedItem } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonAnyEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonLivingEntity } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type {
  JsonNBTList,
  NBTByte,
  NBTDouble,
  NBTFloat,
  NBTInt,
  NBTIntArray,
  NBTShort,
  PostEffectClass,
  RecipeClass,
} from 'sandstone'

export type JsonAbilities = {
  /**
   * Speed that the player walks at.
   *
   * Value:
   * Range: 0.1
   */
  walkSpeed?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Speed that the player flies at.
   *
   * Value:
   * Range: 0.05
   */
  flySpeed?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Whether the player can fly.
   */
  mayfly?: boolean,
  /**
   * Whether the player is flying.
   */
  flying?: boolean,
  /**
   * Whether the player can only take damage from the void.
   */
  invulnerable?: boolean,
  /**
   * Whether the player may build.
   */
  mayBuild?: boolean,
  /**
   * Whether the player destroys blocks instantly.
   */
  instabuild?: boolean,
}

export type JsonDimension = (-1 | 0 | 1)

export type JsonEnderPearl = ({
  ender_pearl_dimension: JsonRegistry['minecraft:dimension'],
} & JsonAnyEntity)

export type JsonEnteredNetherPosition = {
  x?: (NBTDouble | number),
  y?: (NBTDouble | number),
  z?: (NBTDouble | number),
}

export type JsonGamemode = (0 | 1 | 2 | 3)

export type JsonPlayer = (JsonLivingEntity & {
  /**
   * Version of the player NBT structure
   */
  DataVersion?: (NBTInt | number),
  Dimension?: JsonRegistry['minecraft:dimension'],
  /**
   * Location of the player's last death.
   */
  LastDeathLocation?: JsonGlobalPos,
  /**
   * Game mode that the player is in.
   *
   * Value:
   *
   *  - Survival(`0`)
   *  - Creative(`1`)
   *  - Adventure(`2`)
   *  - Spectator(`3`)
   */
  playerGameType?: JsonGamemode,
  /**
   * Previous game mode that the player was in.
   *
   * Value:
   *
   *  - Survival(`0`)
   *  - Creative(`1`)
   *  - Adventure(`2`)
   *  - Spectator(`3`)
   */
  previousPlayerGameType?: JsonGamemode,
  /**
   * Score to display upon death.
   */
  Score?: (NBTInt | number),
  /**
   * Hotbar slot the player has selected.
   *
   * Value:
   * Range: 0..8
   */
  SelectedItemSlot?: (NBTInt<{
    min: 0,
    max: 8,
  }> | number),
  /**
   * Item in the hotbar slot the player has selected.
   */
  SelectedItem?: JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 8,
  }> | number)>,
  equipment?: JsonPlayerEquipment,
  respawn?: JsonRespawn,
  /**
   * Ticks the player has been in bed.
   */
  SleepTimer?: (NBTShort | number),
  /**
   * Level of the hunger bar.
   */
  foodLevel?: (NBTInt | number),
  /**
   * Rate at which the `foodSaturationLevel` depletes.
   */
  foodExhaustionLevel?: (NBTFloat | number),
  /**
   * Rate at which the hunger bar depletes.
   */
  foodSaturationLevel?: (NBTFloat | number),
  /**
   * Ticks until the player heals or takes starvation damage.
   */
  foodTickTimer?: (NBTInt | number),
  /**
   * Number of experience levels the player has.
   */
  XpLevel?: (NBTInt | number),
  /**
   * Percentage the experience bar is filled up.
   */
  XpP?: (NBTFloat | number),
  /**
   * Total experience the player has.
   */
  XpTotal?: (NBTInt | number),
  /**
   * Seed for enchantments.
   */
  XpSeed?: (NBTInt | number),
  /**
   * Value:
   * List length range: 0..41
   */
  Inventory?: JsonNBTList<JsonSlottedItem<JsonPlayerSlot>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 41,
  }>,
  /**
   * The player's enderchest inventory.
   *
   * Value:
   * List length range: 0..27
   */
  EnderItems?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 26,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 27,
  }>,
  /**
   * Abilities of the player.
   */
  abilities?: JsonAbilities,
  /**
   * Position that the player entered the nether at.
   *
   * Value:
   * List length range: 3
   */
  entered_nether_pos?: JsonNBTList<(NBTDouble | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * Array length range: 3
   */
  raid_omen_position?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Entity that the player is riding.
   */
  RootVehicle?: JsonRootVehicle,
  /**
   * Entity that is on the player's left shoulder.
   */
  ShoulderEntityLeft?: JsonAnyEntity,
  /**
   * Entity that is on the player's right shoulder.
   */
  ShoulderEntityRight?: JsonAnyEntity,
  /**
   * Whether the player has gone to the overworld after defeating the Ender Dragon.
   */
  seenCredits?: boolean,
  /**
   * Recipes that the player has.
   */
  recipeBook?: JsonRecipeBook,
  /**
   * Tracking the warden spawning process for this player.
   */
  warden_spawn_tracker?: JsonWardenSpawnTracker,
  /**
   * Ender pearls thrown by this player.
   */
  ender_pearls?: Array<JsonEnderPearl>,
  post_effects?: Array<(JsonRegistry['minecraft:post_effect'] | PostEffectClass)>,
  /**
   * Value:
   * List length range: 3
   */
  last_explosion_impact_pos?: JsonNBTList<(NBTDouble | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  spawn_extra_particles_on_fall?: boolean,
  CustomName?: never,
  CustomNameVisible?: never,
})

export type JsonPlayerEquipment = ({
  [Key in Extract<JsonPlayerEquipmentSlot, string>]?: JsonItemStack
})

export type JsonPlayerEquipmentSlot = ('offhand' | 'head' | 'chest' | 'legs' | 'feet' | 'body' | 'saddle')

/**
 * Range: 0..35
 */
export type JsonPlayerSlot = (NBTByte<{
  min: 0,
  max: 35,
}> | number)

export type JsonRecipeBook = {
  /**
   * Recipes the player has acquired.
   */
  recipes?: Array<(JsonRegistry['minecraft:recipe'] | RecipeClass)>,
  /**
   * Recipes that should pulse in the crafting book.
   */
  toBeDisplayed?: Array<(JsonRegistry['minecraft:recipe'] | RecipeClass)>,
  /**
   * Whether the player has filtered crafting on in the crafting table.
   */
  isFilteringCraftable?: boolean,
  /**
   * Whether the player has the crafting book open in the crafting table.
   */
  isGuiOpen?: boolean,
  /**
   * Whether the player has filtered crafting on in the furnace.
   */
  isFurnaceFilteringCraftable?: boolean,
  /**
   * Whether the player has the crafting book open in the furnace.
   */
  isFurnaceGuiOpen?: boolean,
}

export type JsonRespawn = ({
  /**
   * The block coordinates of the player's respawn point
   *
   * Value:
   * Array length range: 3
   */
  pos: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * The Y-rotation of the player's respawn point
   */
  yaw: (NBTFloat | number),
  /**
   * The X-rotation of the player's respawn point
   */
  pitch: (NBTFloat | number),
  /**
   * Whether the player must spawn at the respawn point.
   */
  forced?: boolean,
} & {
  /**
   * Dimension of the player's respawn point.
   */
  dimension: JsonRegistry['minecraft:dimension'],
})

export type JsonRootVehicle = {
  /**
   * Ridden entity's UUID.
   *
   * Value:
   * Array length range: 4
   */
  Attach?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * The ridden entity.
   */
  Entity?: JsonAnyEntity,
}

export type JsonWardenSpawnTracker = {
  /**
   * Ticks before the `warning_level` can be increased again.
   * Decreases by 1 every tick. It is set to 200 game ticks (10 seconds) every time the warning level is increased.
   *
   * Value:
   * Range: 0..
   */
  cooldown_ticks?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Ticks since the player was warned for warden spawning.
   * Increases by 1 every tick. After 12000 game ticks (10 minutes) it will be set back to 0,
   * and the `warning_level` will be decreased by 1.
   *
   * Value:
   * Range: 0..
   */
  ticks_since_last_warning?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * The current warning level. The warden will spawn at level `4`.
   *
   * Value:
   * Range: 0..4
   */
  warning_level?: (NBTInt<{
    min: 0,
    max: 4,
  }> | number),
}
