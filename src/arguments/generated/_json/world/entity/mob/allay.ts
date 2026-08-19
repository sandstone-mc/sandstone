import type { JsonVibrationListener } from 'sandstone/arguments/generated/_json/util/game_event.ts'
import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonNBTList, NBTInt } from 'sandstone'

export type JsonAllay = (JsonMobBase & {
  /**
   * Ticks until the allay can duplicate. This is set to 6000 game ticks (5 minutes) when the allay duplicates.
   */
  DuplicationCooldown?: (NBTInt | number),
  /**
   * Items it has picked up. Note that the item given by the player is in
   * the allay's `HandItems[0]` tag, not here.
   *
   * Value:
   * List length range: 1
   */
  Inventory?: JsonNBTList<JsonItemStack, {
    leftExclusive: false,
    rightExclusive: false,
    min: 1,
    max: 1,
  }>,
  /**
   * Vibration game event listener.
   */
  listener?: JsonVibrationListener,
})
