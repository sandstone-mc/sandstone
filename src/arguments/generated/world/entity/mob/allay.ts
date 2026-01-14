import type { VibrationListener } from 'sandstone/arguments/generated/util/game_event.ts'
import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTInt, NBTList } from 'sandstone'

export type Allay = (MobBase & {
  /**
   * Ticks until the allay can duplicate. This is set to 6000 game ticks (5 minutes) when the allay duplicates.
   */
  DuplicationCooldown?: NBTInt
  /**
   * Items it has picked up. Note that the item given by the player is in
   * the allay's `HandItems[0]` tag, not here.
   *
   * Value:
   * List length range: 1
   */
  Inventory?: NBTList<ItemStack, {
    leftExclusive: false
    rightExclusive: false
    min: 1
    max: 1
  }>
  /**
   * Vibration game event listener.
   */
  listener?: VibrationListener
})
