import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { ProjectileBase } from 'sandstone/arguments/generated/world/entity/projectile.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTByte, NBTDouble, NBTInt, NBTShort } from 'sandstone'

export type Arrow = ArrowBase

export type ArrowBase = (ProjectileBase & {
  /**
   * Shake it creates.
   */
  shake?: NBTByte,
  /**
   * How players can pick up it.
   *
   * Value:
   *
   *  - None(`0`)
   *  - Any(`1`)
   *  - Creative(`2`)
   */
  pickup?: Pickup,
  /**
   * Ticks since it last moved.
   */
  life?: NBTShort,
  /**
   * Damage it should deal.
   */
  damage?: (NBTDouble | number),
  /**
   * Whether it is in the ground.
   */
  inGround?: boolean,
  /**
   * Block it is in.
   */
  inBlockState?: BlockState,
  /**
   * Whether it should do critical damage.
   */
  crit?: boolean,
  /**
   * The item which has shot this arrow.
   */
  weapon?: ItemStack,
  /**
   * Number of entities it can pass through.
   */
  PierceLevel?: NBTByte,
  /**
   * Sound event to play when it hits something.
   *
   * Can only be vanilla sound events
   */
  SoundEvent?: Registry['minecraft:sound_event'],
  item?: ItemStack,
})

export type Pickup = (0 | 1 | 2)

export type SpectralArrow = (ArrowBase & {
  /**
   * Ticks the glowing effect lasts.
   */
  Duration?: NBTInt,
})

export type Trident = (ArrowBase & {
  /**
   * Whether it has already damaged an entity.
   */
  DealtDamage?: boolean,
})
