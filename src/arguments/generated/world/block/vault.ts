import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { NBTDouble, NBTInt, NBTIntArray, NBTLong } from 'sandstone'

export type Vault = {
  server_data?: {
    /**
         * Ticks until the loot table is ran again to update the display item.
         */
    state_updating_resumes_at?: NBTLong
    /**
         * When a player is in this list they can no longer open the vault, but other players can.
         */
    rewarded_players?: Array<NBTIntArray<{
      leftExclusive: false
      rightExclusive: false
      min: 4
      max: 4
    }>>
    /**
         * Items that are being ejected from the vault when it is opened. As each item is ejected, it is removed from this list, before ejection, it is previewed as the `display_item`.
         */
    items_to_eject?: Array<ItemStack>
    /**
         * Number of items that the loot table started off the opening with, does not change while items are ejected.
         */
    total_ejections_needed?: NBTInt
  }
  config?: {
    /**
         * Item required to open the vault.
         */
    key_item?: ItemStack
    /**
         * Defaults to "minecraft:chests/trial_chambers/reward".
         */
    loot_table?: Registry['minecraft:loot_table']
    /**
         * The loot table to display items in the vault.
         * Defaults to use the value in `loot_table` field.
         */
    override_loot_table_to_display: Registry['minecraft:loot_table']
    /**
         * The range when the vault should activate.
         */
    activation_range?: (NBTDouble | number)
    /**
         * The range when the vault should deactivate.
         */
    deactivation_range?: (NBTDouble | number)
  }
  /**
     * When a player is in range of the vault, the same display item will be shown to all players.
     * This is also used for the items that are being ejected from the vault.
     */
  shared_data?: {
    /**
         * Item that is displayed to players when they are in range of the vault.
         */
    display_item?: ItemStack
    connected_players?: Array<NBTIntArray<{
      leftExclusive: false
      rightExclusive: false
      min: 4
      max: 4
    }>>
    connected_particles_range?: (NBTDouble | number)
  }
}
