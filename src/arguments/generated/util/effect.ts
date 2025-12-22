import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { NBTByte, NBTInt } from 'sandstone'

export type EffectByteId = (
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32)

/**
 *
 *  - Speed(`1`)
 *  - Slowness(`2`)
 *  - Haste(`3`)
 *  - MiningFatigue(`4`)
 *  - Strength(`5`)
 *  - InstantHealth(`6`)
 *  - InstantDamage(`7`)
 *  - JumpBoost(`8`)
 *  - Nausea(`9`)
 *  - Regeneration(`10`)
 *  - Resistance(`11`)
 *  - FireResistance(`12`)
 *  - WaterBreathing(`13`)
 *  - Invisibility(`14`)
 *  - Blindness(`15`)
 *  - NightVision(`16`)
 *  - Hunger(`17`)
 *  - Weakness(`18`)
 *  - Poison(`19`)
 *  - Wither(`20`)
 *  - HealthBoost(`21`)
 *  - Absorption(`22`)
 *  - Saturation(`23`)
 *  - Glowing(`24`)
 *  - Levitation(`25`)
 *  - Luck(`26`)
 *  - UnLuck(`27`)
 *  - SlowFalling(`28`)
 *  - ConduitPower(`29`)
 *  - DolphinsGrace(`30`)
 *  - BadOmen(`31`)
 *  - HeroOfTheVillage(`32`)
 *  - Darkness(`33`)
 */
export type EffectId = EffectIntId

export type EffectIntId = (
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33)

export type MobEffectInstance = {
  id: Registry['minecraft:mob_effect']
  /**
     * Level I having value 0. Defaults to 0.
     *
     * Value:
     * Range: 0..
     */
  amplifier?: NBTByte<{
    min: 0
  }>
  /**
     * Duration of the effect in ticks. Infinite is represented by `-1`.
     *
     * Value:
     * *either*
     *
     * *item 0*
     *
     * *or*
     *
     * Range: 1..
     */
  duration?: (-1 | NBTInt<{
    min: 1
  }>)
  /**
     * Whether the effect appears as a HUD icon in addition to in the inventory GUI (same behavior as beacons when `true`). Defaults to `false`.
     */
  ambient?: boolean
  /**
     * Defaults to `true`.
     */
  show_particles?: boolean
  /**
     * Whether the effect appears in the inventory GUI. Defaults to `true`
     */
  show_icon?: boolean
  /**
     * A lower amplifier effect of the same type.
     */
  hidden_effect?: MobEffectInstance
}
