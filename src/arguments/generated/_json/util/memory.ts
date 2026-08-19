import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonGlobalPos } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonNBTList, NBTInt, NBTIntArray, NBTLong } from 'sandstone'

export type JsonAdmiringDisable = (JsonExpirableValue & {
  /**
   * Whether the piglin cannot admire an item.
   * Set when converting, when attacked, or when admiring an item.
   */
  value: boolean,
})

export type JsonAdmiringItem = (JsonExpirableValue & {
  /**
   * Whether the piglin is currently admiring an item.
   */
  value: boolean,
})

export type JsonAngryAt = (JsonExpirableValue & {
  /**
   * The target of the piglin or piglin brute.
   *
   * Value:
   * Array length range: 4
   */
  value: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})

export type JsonAttackTargetCooldown = (JsonExpirableValue & {
  value: (NBTInt | number),
})

export type JsonBreezeJumpCooldown = (JsonExpirableValue & {
  /**
   * If present, the breeze will not long jump or slide. Set after performing a long jump.
   */
  value: Record<string, never>,
})

export type JsonBreezeJumpInhaling = (JsonExpirableValue & {
  /**
   * If present, the breeze will not long jump or shoot a wind charge when stuck.
   */
  value: Record<string, never>,
})

export type JsonBreezeJumpTarget = (JsonExpirableValue & {
  /**
   * The block position that the breeze is jumping towards.
   *
   * Value:
   * Array length range: 3
   */
  value: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
})

export type JsonBreezeLeavingWater = (JsonExpirableValue & {
  /**
   * If present, the breeze is in water.
   */
  value: Record<string, never>,
})

export type JsonBreezeShoot = (JsonExpirableValue & {
  /**
   * If present, the breeze is able to shoot a wind charge, and will not long jump or slide.
   */
  value: Record<string, never>,
})

export type JsonBreezeShootCharging = (JsonExpirableValue & {
  /**
   * If present, the breeze will not shoot a wind charge. Set when starting to shoot.
   */
  value: Record<string, never>,
})

export type JsonBreezeShootCooldown = (JsonExpirableValue & {
  /**
   * If present, the breeze will not shoot a wind charge. Set after shooting
   */
  value: Record<string, never>,
})

export type JsonBreezeShootRecover = (JsonExpirableValue & {
  /**
   * If present, the breeze will not shoot a wind charge.
   */
  value: Record<string, never>,
})

export type JsonChargeCooldownTicks = (JsonExpirableValue & {
  value: (NBTInt | number),
})

export type JsonDangerDetectedRecently = (JsonExpirableValue & {
  /**
   * Whether the armadillo has detected danger recently.
   */
  value: boolean,
})

export type JsonDigCooldown = (JsonExpirableValue & {
  /**
   * If present, the warden will not dig down.
   */
  value: Record<string, never>,
})

export type JsonExpirableValue = {
  /**
   * If present, ticks before this memory is automatically removed.
   */
  ttl?: (NBTLong | number),
}

export type JsonGazeCooldownTicks = (JsonExpirableValue & {
  /**
   * Ticks before the armadillo or camel can randomly look around again.
   */
  value: (NBTInt | number),
})

export type JsonGolemDetectedRecently = (JsonExpirableValue & {
  /**
   * Whether the villager has detected an iron golem recently.
   */
  value: boolean,
})

export type JsonHasHuntingCooldown = (JsonExpirableValue & {
  /**
   * Whether the axolotl is in a hunting cooldown.
   */
  value: boolean,
})

export type JsonHome = (JsonExpirableValue & {
  /**
   * Position of the villager's home.
   */
  value: JsonGlobalPos,
})

export type JsonHuntedRecently = (JsonExpirableValue & {
  /**
   * Whether the piglin just hunted recently.
   * Set after hunting or spawning in a bastion remnant.
   */
  value: boolean,
})

export type JsonIsEmerging = (JsonExpirableValue & {
  /**
   * Whether the warden is currently emerging from the ground.
   */
  value: Record<string, never>,
})

export type JsonIsInWater = (JsonExpirableValue & {
  /**
   * Whether the frog is currently in water.
   */
  value: Record<string, never>,
})

export type JsonIsPanicking = (JsonExpirableValue & {
  /**
   * Whether the mob is currently panicking.
   */
  value: boolean,
})

export type JsonIsPregnant = (JsonExpirableValue & {
  /**
   * Whether the frog is pregnant.
   */
  value: Record<string, never>,
})

export type JsonIsSniffing = (JsonExpirableValue & {
  /**
   * Whether the warden or sniffer is currently sniffing.
   */
  value: Record<string, never>,
})

export type JsonIsTempted = (JsonExpirableValue & {
  /**
   * Whether the mob is currently tempted by a player.
   */
  value: boolean,
})

export type JsonItemPickupCooldownTicks = (JsonExpirableValue & {
  /**
   * Ticks before the allay goes to pick up an item again.
   */
  value: (NBTInt | number),
})

export type JsonJobSite = (JsonExpirableValue & {
  /**
   * Position of the villager's job site.
   */
  value: JsonGlobalPos,
})

export type JsonLastSlept = (JsonExpirableValue & {
  /**
   * The gametime tick that the villager last slept in a bed.
   */
  value: (NBTLong | number),
})

export type JsonLastWoken = (JsonExpirableValue & {
  /**
   * The gametime tick that the villager last woke up from a bed.
   */
  value: (NBTLong | number),
})

export type JsonLastWorkedAtPoi = (JsonExpirableValue & {
  /**
   * The gametime tick that the villager last worked at their job site.
   */
  value: (NBTLong | number),
})

export type JsonLikedNoteblock = (JsonExpirableValue & {
  /**
   * The position and dimension of the note block that the allay likes.
   */
  value: JsonGlobalPos,
})

export type JsonLikedNoteblockCooldownTicks = (JsonExpirableValue & {
  /**
   * Ticks before the allay stops putting items at the liked note block.
   */
  value: (NBTInt | number),
})

export type JsonLikedPlayer = (JsonExpirableValue & {
  /**
   * The UUID of the player entity that the allay likes.
   *
   * Value:
   * Array length range: 4
   */
  value: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})

export type JsonLongJumpCoolingDown = (JsonExpirableValue & {
  /**
   * Ticks before the goat can long jump again.
   */
  value: (NBTInt | number),
})

export type JsonMeetingPoint = (JsonExpirableValue & {
  /**
   * Position of the villager's meeting point.
   */
  value: JsonGlobalPos,
})

export type JsonMemories = ({
  [Key in Extract<JsonRegistry['minecraft:memory_module_type'], string>]?: (Key extends keyof JsonSymbolMemoryModule
    ? JsonSymbolMemoryModule[Key]
    : JsonSymbolMemoryModule<'%unknown'>)
})

export type JsonPlayDeadTicks = (JsonExpirableValue & {
  /**
   * Ticks until the axolotl stops playing dead.
   */
  value: (NBTInt | number),
})

export type JsonPotentialJobSite = (JsonExpirableValue & {
  /**
   * Position of a potential job site of the villager.
   */
  value: JsonGlobalPos,
})

export type JsonRamCooldownTicks = (JsonExpirableValue & {
  /**
   * Ticks before the goat can ram again.
   */
  value: (NBTInt | number),
})

export type JsonRecentProjectile = (JsonExpirableValue & {
  /**
   * Whether the warden has recently noticed a projectile vibration.
   */
  value: Record<string, never>,
})

export type JsonRoarSoundCooldown = (JsonExpirableValue & {
  /**
   * If present, the warden doesn't roar.
   */
  value: Record<string, never>,
})

export type JsonRoarSoundDelay = (JsonExpirableValue & {
  /**
   * If present, the warden doesn't roar.
   */
  value: Record<string, never>,
})

export type JsonSniffCooldown = (JsonExpirableValue & {
  /**
   * If present, the warden or sniffer will not sniff.
   */
  value: Record<string, never>,
})

export type JsonSnifferExploredPositions = (JsonExpirableValue & {
  /**
   * Last 20 block positions that the sniffer has dug up. The sniffer will not dig in these positions.
   *
   * Value:
   * List length range: ..20
   */
  value: JsonNBTList<NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>, {
    rightExclusive: false,
  }>,
})

export type JsonSonicBoomCooldown = (JsonExpirableValue & {
  /**
   * If present, the warden will not use the sonic boom attack.
   */
  value: Record<string, never>,
})

export type JsonSonicBoomSoundCooldown = (JsonExpirableValue & {
  /**
   * If present, the warden's sonic boom animation will not spawn particles and play sounds.
   */
  value: Record<string, never>,
})

export type JsonSonicBoomSoundDelay = (JsonExpirableValue & {
  /**
   * If present, will delay the warden's sonic boom animation.
   */
  value: Record<string, never>,
})

export type JsonTemptationCooldownTicks = (JsonExpirableValue & {
  /**
   * Ticks before the mob can be tempted again.
   */
  value: (NBTInt | number),
})

export type JsonTouchCooldown = (JsonExpirableValue & {
  /**
   * If present, the warden will not react to being pushed by another mob. Set to 20 when touched.
   */
  value: Record<string, never>,
})

export type JsonUniversalAnger = (JsonExpirableValue & {
  /**
   * Whether the piglin is being universally angered. Only used when the `universalAnger` gamerule is enabled.
   */
  value: boolean,
})

export type JsonUnreachableTransportBlockPositions = (JsonExpirableValue & {
  /**
   * A list of container positions that the copper golem has visited and failed to interact with.
   */
  value: Array<JsonGlobalPos>,
})

export type JsonVibrationCooldown = (JsonExpirableValue & {
  /**
   * If present, the warden will not react to vibrations. Set to 40 when receiving a vibration.
   */
  value: Record<string, never>,
})

export type JsonVisitedBlockPositions = (JsonExpirableValue & {
  /**
   * A list of container positions that the copper golem has visited, whether successful or not.
   */
  value: Array<JsonGlobalPos>,
})
type JsonMemoryModuleDispatcherMap = {
  'admiring_disabled': JsonMemoryModuleAdmiringDisabled,
  'minecraft:admiring_disabled': JsonMemoryModuleAdmiringDisabled,
  'admiring_item': JsonMemoryModuleAdmiringItem,
  'minecraft:admiring_item': JsonMemoryModuleAdmiringItem,
  'angry_at': JsonMemoryModuleAngryAt,
  'minecraft:angry_at': JsonMemoryModuleAngryAt,
  'attack_target_cooldown': JsonMemoryModuleAttackTargetCooldown,
  'minecraft:attack_target_cooldown': JsonMemoryModuleAttackTargetCooldown,
  'breeze_jump_cooldown': JsonMemoryModuleBreezeJumpCooldown,
  'minecraft:breeze_jump_cooldown': JsonMemoryModuleBreezeJumpCooldown,
  'breeze_jump_inhaling': JsonMemoryModuleBreezeJumpInhaling,
  'minecraft:breeze_jump_inhaling': JsonMemoryModuleBreezeJumpInhaling,
  'breeze_jump_target': JsonMemoryModuleBreezeJumpTarget,
  'minecraft:breeze_jump_target': JsonMemoryModuleBreezeJumpTarget,
  'breeze_leaving_water': JsonMemoryModuleBreezeLeavingWater,
  'minecraft:breeze_leaving_water': JsonMemoryModuleBreezeLeavingWater,
  'breeze_shoot': JsonMemoryModuleBreezeShoot,
  'minecraft:breeze_shoot': JsonMemoryModuleBreezeShoot,
  'breeze_shoot_charging': JsonMemoryModuleBreezeShootCharging,
  'minecraft:breeze_shoot_charging': JsonMemoryModuleBreezeShootCharging,
  'breeze_shoot_cooldown': JsonMemoryModuleBreezeShootCooldown,
  'minecraft:breeze_shoot_cooldown': JsonMemoryModuleBreezeShootCooldown,
  'breeze_shoot_recover': JsonMemoryModuleBreezeShootRecover,
  'minecraft:breeze_shoot_recover': JsonMemoryModuleBreezeShootRecover,
  'charge_cooldown_ticks': JsonMemoryModuleChargeCooldownTicks,
  'minecraft:charge_cooldown_ticks': JsonMemoryModuleChargeCooldownTicks,
  'danger_detected_recently': JsonMemoryModuleDangerDetectedRecently,
  'minecraft:danger_detected_recently': JsonMemoryModuleDangerDetectedRecently,
  'dig_cooldown': JsonMemoryModuleDigCooldown,
  'minecraft:dig_cooldown': JsonMemoryModuleDigCooldown,
  'gaze_cooldown_ticks': JsonMemoryModuleGazeCooldownTicks,
  'minecraft:gaze_cooldown_ticks': JsonMemoryModuleGazeCooldownTicks,
  'golem_detected_recently': JsonMemoryModuleGolemDetectedRecently,
  'minecraft:golem_detected_recently': JsonMemoryModuleGolemDetectedRecently,
  'has_hunting_cooldown': JsonMemoryModuleHasHuntingCooldown,
  'minecraft:has_hunting_cooldown': JsonMemoryModuleHasHuntingCooldown,
  'home': JsonMemoryModuleHome,
  'minecraft:home': JsonMemoryModuleHome,
  'hunted_recently': JsonMemoryModuleHuntedRecently,
  'minecraft:hunted_recently': JsonMemoryModuleHuntedRecently,
  'is_emerging': JsonMemoryModuleIsEmerging,
  'minecraft:is_emerging': JsonMemoryModuleIsEmerging,
  'is_in_water': JsonMemoryModuleIsInWater,
  'minecraft:is_in_water': JsonMemoryModuleIsInWater,
  'is_panicking': JsonMemoryModuleIsPanicking,
  'minecraft:is_panicking': JsonMemoryModuleIsPanicking,
  'is_pregnant': JsonMemoryModuleIsPregnant,
  'minecraft:is_pregnant': JsonMemoryModuleIsPregnant,
  'is_sniffing': JsonMemoryModuleIsSniffing,
  'minecraft:is_sniffing': JsonMemoryModuleIsSniffing,
  'item_pickup_cooldown_ticks': JsonMemoryModuleItemPickupCooldownTicks,
  'minecraft:item_pickup_cooldown_ticks': JsonMemoryModuleItemPickupCooldownTicks,
  'job_site': JsonMemoryModuleJobSite,
  'minecraft:job_site': JsonMemoryModuleJobSite,
  'last_slept': JsonMemoryModuleLastSlept,
  'minecraft:last_slept': JsonMemoryModuleLastSlept,
  'last_woken': JsonMemoryModuleLastWoken,
  'minecraft:last_woken': JsonMemoryModuleLastWoken,
  'last_worked_at_poi': JsonMemoryModuleLastWorkedAtPoi,
  'minecraft:last_worked_at_poi': JsonMemoryModuleLastWorkedAtPoi,
  'liked_noteblock': JsonMemoryModuleLikedNoteblock,
  'minecraft:liked_noteblock': JsonMemoryModuleLikedNoteblock,
  'liked_noteblock_cooldown_ticks': JsonMemoryModuleLikedNoteblockCooldownTicks,
  'minecraft:liked_noteblock_cooldown_ticks': JsonMemoryModuleLikedNoteblockCooldownTicks,
  'liked_player': JsonMemoryModuleLikedPlayer,
  'minecraft:liked_player': JsonMemoryModuleLikedPlayer,
  'long_jump_cooling_down': JsonMemoryModuleLongJumpCoolingDown,
  'minecraft:long_jump_cooling_down': JsonMemoryModuleLongJumpCoolingDown,
  'meeting_point': JsonMemoryModuleMeetingPoint,
  'minecraft:meeting_point': JsonMemoryModuleMeetingPoint,
  'play_dead_ticks': JsonMemoryModulePlayDeadTicks,
  'minecraft:play_dead_ticks': JsonMemoryModulePlayDeadTicks,
  'potential_job_site': JsonMemoryModulePotentialJobSite,
  'minecraft:potential_job_site': JsonMemoryModulePotentialJobSite,
  'ram_cooldown_ticks': JsonMemoryModuleRamCooldownTicks,
  'minecraft:ram_cooldown_ticks': JsonMemoryModuleRamCooldownTicks,
  'recent_projectile': JsonMemoryModuleRecentProjectile,
  'minecraft:recent_projectile': JsonMemoryModuleRecentProjectile,
  'roar_sound_cooldown': JsonMemoryModuleRoarSoundCooldown,
  'minecraft:roar_sound_cooldown': JsonMemoryModuleRoarSoundCooldown,
  'roar_sound_delay': JsonMemoryModuleRoarSoundDelay,
  'minecraft:roar_sound_delay': JsonMemoryModuleRoarSoundDelay,
  'sniff_cooldown': JsonMemoryModuleSniffCooldown,
  'minecraft:sniff_cooldown': JsonMemoryModuleSniffCooldown,
  'sniffer_explored_positions': JsonMemoryModuleSnifferExploredPositions,
  'minecraft:sniffer_explored_positions': JsonMemoryModuleSnifferExploredPositions,
  'sonic_boom_cooldown': JsonMemoryModuleSonicBoomCooldown,
  'minecraft:sonic_boom_cooldown': JsonMemoryModuleSonicBoomCooldown,
  'sonic_boom_sound_cooldown': JsonMemoryModuleSonicBoomSoundCooldown,
  'minecraft:sonic_boom_sound_cooldown': JsonMemoryModuleSonicBoomSoundCooldown,
  'sonic_boom_sound_delay': JsonMemoryModuleSonicBoomSoundDelay,
  'minecraft:sonic_boom_sound_delay': JsonMemoryModuleSonicBoomSoundDelay,
  'temptation_cooldown_ticks': JsonMemoryModuleTemptationCooldownTicks,
  'minecraft:temptation_cooldown_ticks': JsonMemoryModuleTemptationCooldownTicks,
  'touch_cooldown': JsonMemoryModuleTouchCooldown,
  'minecraft:touch_cooldown': JsonMemoryModuleTouchCooldown,
  'universal_anger': JsonMemoryModuleUniversalAnger,
  'minecraft:universal_anger': JsonMemoryModuleUniversalAnger,
  'unreachable_transport_block_positions': JsonMemoryModuleUnreachableTransportBlockPositions,
  'minecraft:unreachable_transport_block_positions': JsonMemoryModuleUnreachableTransportBlockPositions,
  'vibration_cooldown': JsonMemoryModuleVibrationCooldown,
  'minecraft:vibration_cooldown': JsonMemoryModuleVibrationCooldown,
  'visited_block_positions': JsonMemoryModuleVisitedBlockPositions,
  'minecraft:visited_block_positions': JsonMemoryModuleVisitedBlockPositions,
}
type JsonMemoryModuleKeys = keyof JsonMemoryModuleDispatcherMap
type JsonMemoryModuleFallback = (
  | JsonMemoryModuleAdmiringDisabled
  | JsonMemoryModuleAdmiringItem
  | JsonMemoryModuleAngryAt
  | JsonMemoryModuleAttackTargetCooldown
  | JsonMemoryModuleBreezeJumpCooldown
  | JsonMemoryModuleBreezeJumpInhaling
  | JsonMemoryModuleBreezeJumpTarget
  | JsonMemoryModuleBreezeLeavingWater
  | JsonMemoryModuleBreezeShoot
  | JsonMemoryModuleBreezeShootCharging
  | JsonMemoryModuleBreezeShootCooldown
  | JsonMemoryModuleBreezeShootRecover
  | JsonMemoryModuleChargeCooldownTicks
  | JsonMemoryModuleDangerDetectedRecently
  | JsonMemoryModuleDigCooldown
  | JsonMemoryModuleGazeCooldownTicks
  | JsonMemoryModuleGolemDetectedRecently
  | JsonMemoryModuleHasHuntingCooldown
  | JsonMemoryModuleHome
  | JsonMemoryModuleHuntedRecently
  | JsonMemoryModuleIsEmerging
  | JsonMemoryModuleIsInWater
  | JsonMemoryModuleIsPanicking
  | JsonMemoryModuleIsPregnant
  | JsonMemoryModuleIsSniffing
  | JsonMemoryModuleItemPickupCooldownTicks
  | JsonMemoryModuleJobSite
  | JsonMemoryModuleLastSlept
  | JsonMemoryModuleLastWoken
  | JsonMemoryModuleLastWorkedAtPoi
  | JsonMemoryModuleLikedNoteblock
  | JsonMemoryModuleLikedNoteblockCooldownTicks
  | JsonMemoryModuleLikedPlayer
  | JsonMemoryModuleLongJumpCoolingDown
  | JsonMemoryModuleMeetingPoint
  | JsonMemoryModulePlayDeadTicks
  | JsonMemoryModulePotentialJobSite
  | JsonMemoryModuleRamCooldownTicks
  | JsonMemoryModuleRecentProjectile
  | JsonMemoryModuleRoarSoundCooldown
  | JsonMemoryModuleRoarSoundDelay
  | JsonMemoryModuleSniffCooldown
  | JsonMemoryModuleSnifferExploredPositions
  | JsonMemoryModuleSonicBoomCooldown
  | JsonMemoryModuleSonicBoomSoundCooldown
  | JsonMemoryModuleSonicBoomSoundDelay
  | JsonMemoryModuleTemptationCooldownTicks
  | JsonMemoryModuleTouchCooldown
  | JsonMemoryModuleUniversalAnger
  | JsonMemoryModuleUnreachableTransportBlockPositions
  | JsonMemoryModuleVibrationCooldown
  | JsonMemoryModuleVisitedBlockPositions
  | JsonMemoryModuleFallbackType)
export type JsonMemoryModuleFallbackType = never
type JsonMemoryModuleAdmiringDisabled = JsonAdmiringDisable
type JsonMemoryModuleAdmiringItem = JsonAdmiringItem
type JsonMemoryModuleAngryAt = JsonAngryAt
type JsonMemoryModuleAttackTargetCooldown = JsonAttackTargetCooldown
type JsonMemoryModuleBreezeJumpCooldown = JsonBreezeJumpCooldown
type JsonMemoryModuleBreezeJumpInhaling = JsonBreezeJumpInhaling
type JsonMemoryModuleBreezeJumpTarget = JsonBreezeJumpTarget
type JsonMemoryModuleBreezeLeavingWater = JsonBreezeLeavingWater
type JsonMemoryModuleBreezeShoot = JsonBreezeShoot
type JsonMemoryModuleBreezeShootCharging = JsonBreezeShootCharging
type JsonMemoryModuleBreezeShootCooldown = JsonBreezeShootCooldown
type JsonMemoryModuleBreezeShootRecover = JsonBreezeShootRecover
type JsonMemoryModuleChargeCooldownTicks = JsonChargeCooldownTicks
type JsonMemoryModuleDangerDetectedRecently = JsonDangerDetectedRecently
type JsonMemoryModuleDigCooldown = JsonDigCooldown
type JsonMemoryModuleGazeCooldownTicks = JsonGazeCooldownTicks
type JsonMemoryModuleGolemDetectedRecently = JsonGolemDetectedRecently
type JsonMemoryModuleHasHuntingCooldown = JsonHasHuntingCooldown
type JsonMemoryModuleHome = JsonHome
type JsonMemoryModuleHuntedRecently = JsonHuntedRecently
type JsonMemoryModuleIsEmerging = JsonIsEmerging
type JsonMemoryModuleIsInWater = JsonIsInWater
type JsonMemoryModuleIsPanicking = JsonIsPanicking
type JsonMemoryModuleIsPregnant = JsonIsPregnant
type JsonMemoryModuleIsSniffing = JsonIsSniffing
type JsonMemoryModuleItemPickupCooldownTicks = JsonItemPickupCooldownTicks
type JsonMemoryModuleJobSite = JsonJobSite
type JsonMemoryModuleLastSlept = JsonLastSlept
type JsonMemoryModuleLastWoken = JsonLastWoken
type JsonMemoryModuleLastWorkedAtPoi = JsonLastWorkedAtPoi
type JsonMemoryModuleLikedNoteblock = JsonLikedNoteblock
type JsonMemoryModuleLikedNoteblockCooldownTicks = JsonLikedNoteblockCooldownTicks
type JsonMemoryModuleLikedPlayer = JsonLikedPlayer
type JsonMemoryModuleLongJumpCoolingDown = JsonLongJumpCoolingDown
type JsonMemoryModuleMeetingPoint = JsonMeetingPoint
type JsonMemoryModulePlayDeadTicks = JsonPlayDeadTicks
type JsonMemoryModulePotentialJobSite = JsonPotentialJobSite
type JsonMemoryModuleRamCooldownTicks = JsonRamCooldownTicks
type JsonMemoryModuleRecentProjectile = JsonRecentProjectile
type JsonMemoryModuleRoarSoundCooldown = JsonRoarSoundCooldown
type JsonMemoryModuleRoarSoundDelay = JsonRoarSoundDelay
type JsonMemoryModuleSniffCooldown = JsonSniffCooldown
type JsonMemoryModuleSnifferExploredPositions = JsonSnifferExploredPositions
type JsonMemoryModuleSonicBoomCooldown = JsonSonicBoomCooldown
type JsonMemoryModuleSonicBoomSoundCooldown = JsonSonicBoomSoundCooldown
type JsonMemoryModuleSonicBoomSoundDelay = JsonSonicBoomSoundDelay
type JsonMemoryModuleTemptationCooldownTicks = JsonTemptationCooldownTicks
type JsonMemoryModuleTouchCooldown = JsonTouchCooldown
type JsonMemoryModuleUniversalAnger = JsonUniversalAnger
type JsonMemoryModuleUnreachableTransportBlockPositions = JsonUnreachableTransportBlockPositions
type JsonMemoryModuleVibrationCooldown = JsonVibrationCooldown
type JsonMemoryModuleVisitedBlockPositions = JsonVisitedBlockPositions
export type JsonSymbolMemoryModule<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMemoryModuleDispatcherMap
  : CASE extends 'keys'
    ? JsonMemoryModuleKeys
    : CASE extends '%fallback'
      ? JsonMemoryModuleFallback
      : CASE extends '%unknown' ? JsonMemoryModuleFallbackType : never
