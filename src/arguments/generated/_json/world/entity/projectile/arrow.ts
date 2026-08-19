import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonProjectileBase } from 'sandstone/arguments/generated/_json/world/entity/projectile.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTByte, NBTDouble, NBTInt, NBTShort } from 'sandstone'

export type JsonArrow = JsonArrowBase

export type JsonArrowBase = (JsonProjectileBase & {
  /**
   * Shake it creates.
   */
  shake?: (NBTByte | number),
  /**
   * How players can pick up it.
   *
   * Value:
   *
   *  - None(`0`)
   *  - Any(`1`)
   *  - Creative(`2`)
   */
  pickup?: JsonPickup,
  /**
   * Ticks since it last moved.
   */
  life?: (NBTShort | number),
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
  inBlockState?: JsonBlockState,
  /**
   * Whether it should do critical damage.
   */
  crit?: boolean,
  /**
   * The item which has shot this arrow.
   */
  weapon?: JsonItemStack,
  /**
   * Number of entities it can pass through.
   */
  PierceLevel?: (NBTByte | number),
  /**
   * Sound event to play when it hits something.
   *
   * Can only be vanilla sound events
   */
  SoundEvent?: JsonRegistry['minecraft:sound_event'],
  item?: JsonItemStack,
})

export type JsonPickup = (0 | 1 | 2)

export type JsonSpectralArrow = (JsonArrowBase & {
  /**
   * Ticks the glowing effect lasts.
   */
  Duration?: (NBTInt | number),
})

export type JsonTrident = (JsonArrowBase & {
  /**
   * Whether it has already damaged an entity.
   */
  DealtDamage?: boolean,
})
