import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { GlobalPos } from 'sandstone/arguments/generated/util.ts'
import type { NBTInt, NBTIntArray, NBTList, NBTLong } from 'sandstone'

export type AdmiringDisable = (ExpirableValue & {
  /**
   * Whether the piglin cannot admire an item.
   * Set when converting, when attacked, or when admiring an item.
   */
  value: boolean
})

export type AdmiringItem = (ExpirableValue & {
  /**
   * Whether the piglin is currently admiring an item.
   */
  value: boolean
})

export type AngryAt = (ExpirableValue & {
  /**
   * The target of the piglin or piglin brute.
   *
   * Value:
   * Array length range: 4
   */
  value: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})

export type AttackTargetCooldown = (ExpirableValue & {
  value: NBTInt
})

export type BreezeJumpCooldown = (ExpirableValue & {
  /**
   * If present, the breeze will not long jump or slide. Set after performing a long jump.
   */
  value: Record<string, never>
})

export type BreezeJumpInhaling = (ExpirableValue & {
  /**
   * If present, the breeze will not long jump or shoot a wind charge when stuck.
   */
  value: Record<string, never>
})

export type BreezeJumpTarget = (ExpirableValue & {
  /**
   * The block position that the breeze is jumping towards.
   *
   * Value:
   * Array length range: 3
   */
  value: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
})

export type BreezeLeavingWater = (ExpirableValue & {
  /**
   * If present, the breeze is in water.
   */
  value: Record<string, never>
})

export type BreezeShoot = (ExpirableValue & {
  /**
   * If present, the breeze is able to shoot a wind charge, and will not long jump or slide.
   */
  value: Record<string, never>
})

export type BreezeShootCharging = (ExpirableValue & {
  /**
   * If present, the breeze will not shoot a wind charge. Set when starting to shoot.
   */
  value: Record<string, never>
})

export type BreezeShootCooldown = (ExpirableValue & {
  /**
   * If present, the breeze will not shoot a wind charge. Set after shooting
   */
  value: Record<string, never>
})

export type BreezeShootRecover = (ExpirableValue & {
  /**
   * If present, the breeze will not shoot a wind charge.
   */
  value: Record<string, never>
})

export type ChargeCooldownTicks = (ExpirableValue & {
  value: NBTInt
})

export type DangerDetectedRecently = (ExpirableValue & {
  /**
   * Whether the armadillo has detected danger recently.
   */
  value: boolean
})

export type DigCooldown = (ExpirableValue & {
  /**
   * If present, the warden will not dig down.
   */
  value: Record<string, never>
})

export type ExpirableValue = {
  /**
   * If present, ticks before this memory is automatically removed.
   */
  ttl?: NBTLong
}

export type GazeCooldownTicks = (ExpirableValue & {
  /**
   * Ticks before the armadillo or camel can randomly look around again.
   */
  value: NBTInt
})

export type GolemDetectedRecently = (ExpirableValue & {
  /**
   * Whether the villager has detected an iron golem recently.
   */
  value: boolean
})

export type HasHuntingCooldown = (ExpirableValue & {
  /**
   * Whether the axolotl is in a hunting cooldown.
   */
  value: boolean
})

export type Home = (ExpirableValue & {
  /**
   * Position of the villager's home.
   */
  value: GlobalPos
})

export type HuntedRecently = (ExpirableValue & {
  /**
   * Whether the piglin just hunted recently.
   * Set after hunting or spawning in a bastion remnant.
   */
  value: boolean
})

export type IsEmerging = (ExpirableValue & {
  /**
   * Whether the warden is currently emerging from the ground.
   */
  value: Record<string, never>
})

export type IsInWater = (ExpirableValue & {
  /**
   * Whether the frog is currently in water.
   */
  value: Record<string, never>
})

export type IsPanicking = (ExpirableValue & {
  /**
   * Whether the mob is currently panicking.
   */
  value: boolean
})

export type IsPregnant = (ExpirableValue & {
  /**
   * Whether the frog is pregnant.
   */
  value: Record<string, never>
})

export type IsSniffing = (ExpirableValue & {
  /**
   * Whether the warden or sniffer is currently sniffing.
   */
  value: Record<string, never>
})

export type IsTempted = (ExpirableValue & {
  /**
   * Whether the mob is currently tempted by a player.
   */
  value: boolean
})

export type ItemPickupCooldownTicks = (ExpirableValue & {
  /**
   * Ticks before the allay goes to pick up an item again.
   */
  value: NBTInt
})

export type JobSite = (ExpirableValue & {
  /**
   * Position of the villager's job site.
   */
  value: GlobalPos
})

export type LastSlept = (ExpirableValue & {
  /**
   * The gametime tick that the villager last slept in a bed.
   */
  value: NBTLong
})

export type LastWoken = (ExpirableValue & {
  /**
   * The gametime tick that the villager last woke up from a bed.
   */
  value: NBTLong
})

export type LastWorkedAtPoi = (ExpirableValue & {
  /**
   * The gametime tick that the villager last worked at their job site.
   */
  value: NBTLong
})

export type LikedNoteblock = (ExpirableValue & {
  /**
   * The position and dimension of the note block that the allay likes.
   */
  value: GlobalPos
})

export type LikedNoteblockCooldownTicks = (ExpirableValue & {
  /**
   * Ticks before the allay stops putting items at the liked note block.
   */
  value: NBTInt
})

export type LikedPlayer = (ExpirableValue & {
  /**
   * The UUID of the player entity that the allay likes.
   *
   * Value:
   * Array length range: 4
   */
  value: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})

export type LongJumpCoolingDown = (ExpirableValue & {
  /**
   * Ticks before the goat can long jump again.
   */
  value: NBTInt
})

export type MeetingPoint = (ExpirableValue & {
  /**
   * Position of the villager's meeting point.
   */
  value: GlobalPos
})

export type Memories = ({
  [Key in Extract<Registry['minecraft:memory_module_type'], string>]?: (Key extends keyof SymbolMemoryModule
    ? SymbolMemoryModule[Key]
    : SymbolMemoryModule<'%unknown'>);
})

export type PlayDeadTicks = (ExpirableValue & {
  /**
   * Ticks until the axolotl stops playing dead.
   */
  value: NBTInt
})

export type PotentialJobSite = (ExpirableValue & {
  /**
   * Position of a potential job site of the villager.
   */
  value: GlobalPos
})

export type RamCooldownTicks = (ExpirableValue & {
  /**
   * Ticks before the goat can ram again.
   */
  value: NBTInt
})

export type RecentProjectile = (ExpirableValue & {
  /**
   * Whether the warden has recently noticed a projectile vibration.
   */
  value: Record<string, never>
})

export type RoarSoundCooldown = (ExpirableValue & {
  /**
   * If present, the warden doesn't roar.
   */
  value: Record<string, never>
})

export type RoarSoundDelay = (ExpirableValue & {
  /**
   * If present, the warden doesn't roar.
   */
  value: Record<string, never>
})

export type SniffCooldown = (ExpirableValue & {
  /**
   * If present, the warden or sniffer will not sniff.
   */
  value: Record<string, never>
})

export type SnifferExploredPositions = (ExpirableValue & {
  /**
   * Last 20 block positions that the sniffer has dug up. The sniffer will not dig in these positions.
   *
   * Value:
   * List length range: ..20
   */
  value: NBTList<NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>, {
    rightExclusive: false
  }>
})

export type SonicBoomCooldown = (ExpirableValue & {
  /**
   * If present, the warden will not use the sonic boom attack.
   */
  value: Record<string, never>
})

export type SonicBoomSoundCooldown = (ExpirableValue & {
  /**
   * If present, the warden's sonic boom animation will not spawn particles and play sounds.
   */
  value: Record<string, never>
})

export type SonicBoomSoundDelay = (ExpirableValue & {
  /**
   * If present, will delay the warden's sonic boom animation.
   */
  value: Record<string, never>
})

export type TemptationCooldownTicks = (ExpirableValue & {
  /**
   * Ticks before the mob can be tempted again.
   */
  value: NBTInt
})

export type TouchCooldown = (ExpirableValue & {
  /**
   * If present, the warden will not react to being pushed by another mob. Set to 20 when touched.
   */
  value: Record<string, never>
})

export type UniversalAnger = (ExpirableValue & {
  /**
   * Whether the piglin is being universally angered. Only used when the `universalAnger` gamerule is enabled.
   */
  value: boolean
})

export type UnreachableTransportBlockPositions = (ExpirableValue & {
  /**
   * A list of container positions that the copper golem has visited and failed to interact with.
   */
  value: Array<GlobalPos>
})

export type VibrationCooldown = (ExpirableValue & {
  /**
   * If present, the warden will not react to vibrations. Set to 40 when receiving a vibration.
   */
  value: Record<string, never>
})

export type VisitedBlockPositions = (ExpirableValue & {
  /**
   * A list of container positions that the copper golem has visited, whether successful or not.
   */
  value: Array<GlobalPos>
})
type MemoryModuleDispatcherMap = {
  'admiring_disabled': MemoryModuleAdmiringDisabled
  'minecraft:admiring_disabled': MemoryModuleAdmiringDisabled
  'admiring_item': MemoryModuleAdmiringItem
  'minecraft:admiring_item': MemoryModuleAdmiringItem
  'angry_at': MemoryModuleAngryAt
  'minecraft:angry_at': MemoryModuleAngryAt
  'attack_target_cooldown': MemoryModuleAttackTargetCooldown
  'minecraft:attack_target_cooldown': MemoryModuleAttackTargetCooldown
  'breeze_jump_cooldown': MemoryModuleBreezeJumpCooldown
  'minecraft:breeze_jump_cooldown': MemoryModuleBreezeJumpCooldown
  'breeze_jump_inhaling': MemoryModuleBreezeJumpInhaling
  'minecraft:breeze_jump_inhaling': MemoryModuleBreezeJumpInhaling
  'breeze_jump_target': MemoryModuleBreezeJumpTarget
  'minecraft:breeze_jump_target': MemoryModuleBreezeJumpTarget
  'breeze_leaving_water': MemoryModuleBreezeLeavingWater
  'minecraft:breeze_leaving_water': MemoryModuleBreezeLeavingWater
  'breeze_shoot': MemoryModuleBreezeShoot
  'minecraft:breeze_shoot': MemoryModuleBreezeShoot
  'breeze_shoot_charging': MemoryModuleBreezeShootCharging
  'minecraft:breeze_shoot_charging': MemoryModuleBreezeShootCharging
  'breeze_shoot_cooldown': MemoryModuleBreezeShootCooldown
  'minecraft:breeze_shoot_cooldown': MemoryModuleBreezeShootCooldown
  'breeze_shoot_recover': MemoryModuleBreezeShootRecover
  'minecraft:breeze_shoot_recover': MemoryModuleBreezeShootRecover
  'charge_cooldown_ticks': MemoryModuleChargeCooldownTicks
  'minecraft:charge_cooldown_ticks': MemoryModuleChargeCooldownTicks
  'danger_detected_recently': MemoryModuleDangerDetectedRecently
  'minecraft:danger_detected_recently': MemoryModuleDangerDetectedRecently
  'dig_cooldown': MemoryModuleDigCooldown
  'minecraft:dig_cooldown': MemoryModuleDigCooldown
  'gaze_cooldown_ticks': MemoryModuleGazeCooldownTicks
  'minecraft:gaze_cooldown_ticks': MemoryModuleGazeCooldownTicks
  'golem_detected_recently': MemoryModuleGolemDetectedRecently
  'minecraft:golem_detected_recently': MemoryModuleGolemDetectedRecently
  'has_hunting_cooldown': MemoryModuleHasHuntingCooldown
  'minecraft:has_hunting_cooldown': MemoryModuleHasHuntingCooldown
  'home': MemoryModuleHome
  'minecraft:home': MemoryModuleHome
  'hunted_recently': MemoryModuleHuntedRecently
  'minecraft:hunted_recently': MemoryModuleHuntedRecently
  'is_emerging': MemoryModuleIsEmerging
  'minecraft:is_emerging': MemoryModuleIsEmerging
  'is_in_water': MemoryModuleIsInWater
  'minecraft:is_in_water': MemoryModuleIsInWater
  'is_panicking': MemoryModuleIsPanicking
  'minecraft:is_panicking': MemoryModuleIsPanicking
  'is_pregnant': MemoryModuleIsPregnant
  'minecraft:is_pregnant': MemoryModuleIsPregnant
  'is_sniffing': MemoryModuleIsSniffing
  'minecraft:is_sniffing': MemoryModuleIsSniffing
  'is_tempted': MemoryModuleIsTempted
  'minecraft:is_tempted': MemoryModuleIsTempted
  'item_pickup_cooldown_ticks': MemoryModuleItemPickupCooldownTicks
  'minecraft:item_pickup_cooldown_ticks': MemoryModuleItemPickupCooldownTicks
  'job_site': MemoryModuleJobSite
  'minecraft:job_site': MemoryModuleJobSite
  'last_slept': MemoryModuleLastSlept
  'minecraft:last_slept': MemoryModuleLastSlept
  'last_woken': MemoryModuleLastWoken
  'minecraft:last_woken': MemoryModuleLastWoken
  'last_worked_at_poi': MemoryModuleLastWorkedAtPoi
  'minecraft:last_worked_at_poi': MemoryModuleLastWorkedAtPoi
  'liked_noteblock': MemoryModuleLikedNoteblock
  'minecraft:liked_noteblock': MemoryModuleLikedNoteblock
  'liked_noteblock_cooldown_ticks': MemoryModuleLikedNoteblockCooldownTicks
  'minecraft:liked_noteblock_cooldown_ticks': MemoryModuleLikedNoteblockCooldownTicks
  'liked_player': MemoryModuleLikedPlayer
  'minecraft:liked_player': MemoryModuleLikedPlayer
  'long_jump_cooling_down': MemoryModuleLongJumpCoolingDown
  'minecraft:long_jump_cooling_down': MemoryModuleLongJumpCoolingDown
  'meeting_point': MemoryModuleMeetingPoint
  'minecraft:meeting_point': MemoryModuleMeetingPoint
  'play_dead_ticks': MemoryModulePlayDeadTicks
  'minecraft:play_dead_ticks': MemoryModulePlayDeadTicks
  'potential_job_site': MemoryModulePotentialJobSite
  'minecraft:potential_job_site': MemoryModulePotentialJobSite
  'ram_cooldown_ticks': MemoryModuleRamCooldownTicks
  'minecraft:ram_cooldown_ticks': MemoryModuleRamCooldownTicks
  'recent_projectile': MemoryModuleRecentProjectile
  'minecraft:recent_projectile': MemoryModuleRecentProjectile
  'roar_sound_cooldown': MemoryModuleRoarSoundCooldown
  'minecraft:roar_sound_cooldown': MemoryModuleRoarSoundCooldown
  'roar_sound_delay': MemoryModuleRoarSoundDelay
  'minecraft:roar_sound_delay': MemoryModuleRoarSoundDelay
  'sniff_cooldown': MemoryModuleSniffCooldown
  'minecraft:sniff_cooldown': MemoryModuleSniffCooldown
  'sniffer_explored_positions': MemoryModuleSnifferExploredPositions
  'minecraft:sniffer_explored_positions': MemoryModuleSnifferExploredPositions
  'sonic_boom_cooldown': MemoryModuleSonicBoomCooldown
  'minecraft:sonic_boom_cooldown': MemoryModuleSonicBoomCooldown
  'sonic_boom_sound_cooldown': MemoryModuleSonicBoomSoundCooldown
  'minecraft:sonic_boom_sound_cooldown': MemoryModuleSonicBoomSoundCooldown
  'sonic_boom_sound_delay': MemoryModuleSonicBoomSoundDelay
  'minecraft:sonic_boom_sound_delay': MemoryModuleSonicBoomSoundDelay
  'temptation_cooldown_ticks': MemoryModuleTemptationCooldownTicks
  'minecraft:temptation_cooldown_ticks': MemoryModuleTemptationCooldownTicks
  'touch_cooldown': MemoryModuleTouchCooldown
  'minecraft:touch_cooldown': MemoryModuleTouchCooldown
  'universal_anger': MemoryModuleUniversalAnger
  'minecraft:universal_anger': MemoryModuleUniversalAnger
  'unreachable_transport_block_positions': MemoryModuleUnreachableTransportBlockPositions
  'minecraft:unreachable_transport_block_positions': MemoryModuleUnreachableTransportBlockPositions
  'vibration_cooldown': MemoryModuleVibrationCooldown
  'minecraft:vibration_cooldown': MemoryModuleVibrationCooldown
  'visited_block_positions': MemoryModuleVisitedBlockPositions
  'minecraft:visited_block_positions': MemoryModuleVisitedBlockPositions
}
type MemoryModuleKeys = keyof MemoryModuleDispatcherMap
type MemoryModuleFallback = (
  | MemoryModuleAdmiringDisabled
  | MemoryModuleAdmiringItem
  | MemoryModuleAngryAt
  | MemoryModuleAttackTargetCooldown
  | MemoryModuleBreezeJumpCooldown
  | MemoryModuleBreezeJumpInhaling
  | MemoryModuleBreezeJumpTarget
  | MemoryModuleBreezeLeavingWater
  | MemoryModuleBreezeShoot
  | MemoryModuleBreezeShootCharging
  | MemoryModuleBreezeShootCooldown
  | MemoryModuleBreezeShootRecover
  | MemoryModuleChargeCooldownTicks
  | MemoryModuleDangerDetectedRecently
  | MemoryModuleDigCooldown
  | MemoryModuleGazeCooldownTicks
  | MemoryModuleGolemDetectedRecently
  | MemoryModuleHasHuntingCooldown
  | MemoryModuleHome
  | MemoryModuleHuntedRecently
  | MemoryModuleIsEmerging
  | MemoryModuleIsInWater
  | MemoryModuleIsPanicking
  | MemoryModuleIsPregnant
  | MemoryModuleIsSniffing
  | MemoryModuleIsTempted
  | MemoryModuleItemPickupCooldownTicks
  | MemoryModuleJobSite
  | MemoryModuleLastSlept
  | MemoryModuleLastWoken
  | MemoryModuleLastWorkedAtPoi
  | MemoryModuleLikedNoteblock
  | MemoryModuleLikedNoteblockCooldownTicks
  | MemoryModuleLikedPlayer
  | MemoryModuleLongJumpCoolingDown
  | MemoryModuleMeetingPoint
  | MemoryModulePlayDeadTicks
  | MemoryModulePotentialJobSite
  | MemoryModuleRamCooldownTicks
  | MemoryModuleRecentProjectile
  | MemoryModuleRoarSoundCooldown
  | MemoryModuleRoarSoundDelay
  | MemoryModuleSniffCooldown
  | MemoryModuleSnifferExploredPositions
  | MemoryModuleSonicBoomCooldown
  | MemoryModuleSonicBoomSoundCooldown
  | MemoryModuleSonicBoomSoundDelay
  | MemoryModuleTemptationCooldownTicks
  | MemoryModuleTouchCooldown
  | MemoryModuleUniversalAnger
  | MemoryModuleUnreachableTransportBlockPositions
  | MemoryModuleVibrationCooldown
  | MemoryModuleVisitedBlockPositions
  | MemoryModuleFallbackType)
export type MemoryModuleFallbackType = never
type MemoryModuleAdmiringDisabled = AdmiringDisable
type MemoryModuleAdmiringItem = AdmiringItem
type MemoryModuleAngryAt = AngryAt
type MemoryModuleAttackTargetCooldown = AttackTargetCooldown
type MemoryModuleBreezeJumpCooldown = BreezeJumpCooldown
type MemoryModuleBreezeJumpInhaling = BreezeJumpInhaling
type MemoryModuleBreezeJumpTarget = BreezeJumpTarget
type MemoryModuleBreezeLeavingWater = BreezeLeavingWater
type MemoryModuleBreezeShoot = BreezeShoot
type MemoryModuleBreezeShootCharging = BreezeShootCharging
type MemoryModuleBreezeShootCooldown = BreezeShootCooldown
type MemoryModuleBreezeShootRecover = BreezeShootRecover
type MemoryModuleChargeCooldownTicks = ChargeCooldownTicks
type MemoryModuleDangerDetectedRecently = DangerDetectedRecently
type MemoryModuleDigCooldown = DigCooldown
type MemoryModuleGazeCooldownTicks = GazeCooldownTicks
type MemoryModuleGolemDetectedRecently = GolemDetectedRecently
type MemoryModuleHasHuntingCooldown = HasHuntingCooldown
type MemoryModuleHome = Home
type MemoryModuleHuntedRecently = HuntedRecently
type MemoryModuleIsEmerging = IsEmerging
type MemoryModuleIsInWater = IsInWater
type MemoryModuleIsPanicking = IsPanicking
type MemoryModuleIsPregnant = IsPregnant
type MemoryModuleIsSniffing = IsSniffing
type MemoryModuleIsTempted = IsTempted
type MemoryModuleItemPickupCooldownTicks = ItemPickupCooldownTicks
type MemoryModuleJobSite = JobSite
type MemoryModuleLastSlept = LastSlept
type MemoryModuleLastWoken = LastWoken
type MemoryModuleLastWorkedAtPoi = LastWorkedAtPoi
type MemoryModuleLikedNoteblock = LikedNoteblock
type MemoryModuleLikedNoteblockCooldownTicks = LikedNoteblockCooldownTicks
type MemoryModuleLikedPlayer = LikedPlayer
type MemoryModuleLongJumpCoolingDown = LongJumpCoolingDown
type MemoryModuleMeetingPoint = MeetingPoint
type MemoryModulePlayDeadTicks = PlayDeadTicks
type MemoryModulePotentialJobSite = PotentialJobSite
type MemoryModuleRamCooldownTicks = RamCooldownTicks
type MemoryModuleRecentProjectile = RecentProjectile
type MemoryModuleRoarSoundCooldown = RoarSoundCooldown
type MemoryModuleRoarSoundDelay = RoarSoundDelay
type MemoryModuleSniffCooldown = SniffCooldown
type MemoryModuleSnifferExploredPositions = SnifferExploredPositions
type MemoryModuleSonicBoomCooldown = SonicBoomCooldown
type MemoryModuleSonicBoomSoundCooldown = SonicBoomSoundCooldown
type MemoryModuleSonicBoomSoundDelay = SonicBoomSoundDelay
type MemoryModuleTemptationCooldownTicks = TemptationCooldownTicks
type MemoryModuleTouchCooldown = TouchCooldown
type MemoryModuleUniversalAnger = UniversalAnger
type MemoryModuleUnreachableTransportBlockPositions = UnreachableTransportBlockPositions
type MemoryModuleVibrationCooldown = VibrationCooldown
type MemoryModuleVisitedBlockPositions = VisitedBlockPositions
export type SymbolMemoryModule<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? MemoryModuleDispatcherMap
  : CASE extends 'keys'
    ? MemoryModuleKeys
    : CASE extends '%fallback' ? MemoryModuleFallback : CASE extends '%unknown' ? MemoryModuleFallbackType : never
