import type { Registry } from 'sandstone/arguments/generated/registry'
import type { GlobalPos } from 'sandstone/arguments/generated/util'
import type { SlottedItem } from 'sandstone/arguments/generated/util/slot'
import type { AnyEntity } from 'sandstone/arguments/generated/world/entity'
import type { LivingEntity } from 'sandstone/arguments/generated/world/entity/mob'
import type { ItemStack } from 'sandstone/arguments/generated/world/item'
import type { NBTByte, NBTDouble, NBTFloat, NBTInt, NBTIntArray, NBTList, NBTObject, NBTShort } from 'sandstone'

export type Abilities = {
  /**
     * Speed that the player walks at.
     *
     * Value:
     * Range: 0.1
     */
  walkSpeed?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
  }>
  /**
     * Speed that the player flies at.
     *
     * Value:
     * Range: 0.05
     */
  flySpeed?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
  }>
  /**
     * Whether the player can fly.
     */
  mayfly?: boolean
  /**
     * Whether the player is flying.
     */
  flying?: boolean
  /**
     * Whether the player can only take damage from the void.
     */
  invulnerable?: boolean
  /**
     * Whether the player may build.
     */
  mayBuild?: boolean
  /**
     * Whether the player destroys blocks instantly.
     */
  instabuild?: boolean
}

export type Dimension = (-1 | 0 | 1)

export type EnderPearl = ({
  ender_pearl_dimension: Registry['minecraft:dimension']
} & AnyEntity)

export type EnteredNetherPosition = {
  x?: (NBTDouble | number)
  y?: (NBTDouble | number)
  z?: (NBTDouble | number)
}

export type Gamemode = (0 | 1 | 2 | 3)

export type Player = (LivingEntity & {
  /**
     * Version of the player NBT structure
     */
  DataVersion?: NBTInt
  Dimension?: Registry['minecraft:dimension']
  /**
     * Location of the player's last death.
     */
  LastDeathLocation?: GlobalPos
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
  playerGameType?: Gamemode
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
  previousPlayerGameType?: Gamemode
  /**
     * Score to display upon death.
     */
  Score?: NBTInt
  /**
     * Hotbar slot the player has selected.
     *
     * Value:
     * Range: 0..8
     */
  SelectedItemSlot?: NBTInt<{
    min: 0
    max: 8
  }>
  /**
     * Item in the hotbar slot the player has selected.
     */
  SelectedItem?: SlottedItem<NBTByte<{
    min: 0
    max: 8
  }>>
  equipment?: PlayerEquipment
  respawn?: Respawn
  /**
     * Ticks the player has been in bed.
     */
  SleepTimer?: NBTShort
  /**
     * Level of the hunger bar.
     */
  foodLevel?: NBTInt
  /**
     * Rate at which the `foodSaturationLevel` depletes.
     */
  foodExhaustionLevel?: NBTFloat
  /**
     * Rate at which the hunger bar depletes.
     */
  foodSaturationLevel?: NBTFloat
  /**
     * Ticks until the player heals or takes starvation damage.
     */
  foodTickTimer?: NBTInt
  /**
     * Number of experience levels the player has.
     */
  XpLevel?: NBTInt
  /**
     * Percentage the experience bar is filled up.
     */
  XpP?: NBTFloat
  /**
     * Total experience the player has.
     */
  XpTotal?: NBTInt
  /**
     * Seed for enchantments.
     */
  XpSeed?: NBTInt
  /**
     * Value:
     * List length range: 0..41
     */
  Inventory?: NBTList<SlottedItem<PlayerSlot>, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 41
  }>
  /**
     * The player's enderchest inventory.
     *
     * Value:
     * List length range: 0..27
     */
  EnderItems?: NBTList<SlottedItem<NBTByte<{
    min: 0
    max: 26
  }>>, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 27
  }>
  /**
     * Abilities of the player.
     */
  abilities?: Abilities
  /**
     * Position that the player entered the nether at.
     *
     * Value:
     * List length range: 3
     */
  entered_nether_pos?: NBTList<(NBTDouble | number), {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Entity that the player is riding.
     */
  RootVehicle?: RootVehicle
  /**
     * Entity that is on the player's left shoulder.
     */
  ShoulderEntityLeft?: AnyEntity
  /**
     * Entity that is on the player's right shoulder.
     */
  ShoulderEntityRight?: AnyEntity
  /**
     * Whether the player has gone to the overworld after defeating the Ender Dragon.
     */
  seenCredits?: boolean
  /**
     * Recipes that the player has.
     */
  recipeBook?: RecipeBook
  /**
     * Tracking the warden spawning process for this player.
     */
  warden_spawn_tracker?: WardenSpawnTracker
  /**
     * Ender pearls thrown by this player.
     */
  ender_pearls?: Array<EnderPearl>
  /**
     * Used by the game for wind charges.
     */
  ignore_fall_damage_from_current_explosion?: boolean
  /**
     * Added mid-air after being hit by an explosion.
     *
     * Value:
     * List length range: 3
     */
  current_explosion_impact_pos?: NBTList<(NBTDouble | number), {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Used by fall damage logic. Decreases by 1 every tick.
     *
     * Value:
     * Range: 0..
     */
  current_impulse_context_reset_grace_time: NBTInt<{
    min: 0
  }>
  CustomName?: never
  CustomNameVisible?: never
})

export type PlayerEquipment = ({
  [Key in Extract<PlayerEquipmentSlot, string>]?: ItemStack;
})

export type PlayerEquipmentSlot = ('offhand' | 'head' | 'chest' | 'legs' | 'feet' | 'body' | 'saddle')

/**
 * Range: 0..35
 */
export type PlayerSlot = NBTByte<{
  min: 0
  max: 35
}>

export type RecipeBook = {
  /**
     * Recipes the player has acquired.
     */
  recipes?: Array<Registry['minecraft:recipe']>
  /**
     * Recipes that should pulse in the crafting book.
     */
  toBeDisplayed?: Array<Registry['minecraft:recipe']>
  /**
     * Whether the player has filtered crafting on in the crafting table.
     */
  isFilteringCraftable?: boolean
  /**
     * Whether the player has the crafting book open in the crafting table.
     */
  isGuiOpen?: boolean
  /**
     * Whether the player has filtered crafting on in the furnace.
     */
  isFurnaceFilteringCraftable?: boolean
  /**
     * Whether the player has the crafting book open in the furnace.
     */
  isFurnaceGuiOpen?: boolean
}

export type Respawn = ({
  /**
     * The block coordinates of the player's respawn point
     *
     * Value:
     * Array length range: 3
     */
  pos: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * The Y-rotation of the player's respawn point
     */
  yaw: NBTFloat
  /**
     * The X-rotation of the player's respawn point
     */
  pitch: NBTFloat
  /**
     * Whether the player must spawn at the respawn point.
     */
  forced?: boolean
} & {
  /**
     * Dimension of the player's respawn point. Defaults to overworl.
     */
  dimension: Registry['minecraft:dimension']
})

export type RootVehicle = {
  /**
     * Ridden entity's UUID.
     *
     * Value:
     * Array length range: 4
     */
  Attach?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  /**
     * The ridden entity.
     */
  Entity?: AnyEntity
}

export type WardenSpawnTracker = {
  /**
     * Ticks before the `warning_level` can be increased again.
     * Decreases by 1 every tick. It is set to 200 game ticks (10 seconds) every time the warning level is increased.
     *
     * Value:
     * Range: 0..
     */
  cooldown_ticks?: NBTInt<{
    min: 0
  }>
  /**
     * Ticks since the player was warned for warden spawning.
     * Increases by 1 every tick. After 12000 game ticks (10 minutes) it will be set back to 0,
     * and the `warning_level` will be decreased by 1.
     *
     * Value:
     * Range: 0..
     */
  ticks_since_last_warning?: NBTInt<{
    min: 0
  }>
  /**
     * The warden will spawn at level 3.
     *
     * Value:
     * Range: 0..3
     */
  warning_level?: NBTInt<{
    min: 0
    max: 3
  }>
}
