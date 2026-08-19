import type { JsonItemBase, JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonNBTList } from 'sandstone'

export type JsonCrossbow = (JsonItemBase & {
  /**
   * Projectiles that are loaded.
   *
   * Value:
   * List length range: 0..3
   */
  ChargedProjectiles?: JsonNBTList<JsonItemStack, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 3,
  }>,
  /**
   * Whether the crossbow is charged.
   */
  Charged?: boolean,
})
