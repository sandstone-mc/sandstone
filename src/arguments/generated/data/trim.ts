import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'

export type ArmorMaterial = ('leather' | 'chainmail' | 'iron' | 'gold' | 'diamond' | 'netherite' | 'turtle')

export type TrimMaterial = {
  /**
     * ID which will be used in the resource pack.
     */
  asset_name: string
  /**
     * Text displayed in the item tooltip.
     */
  description: Text
  /**
     * Armor materials that should have a different color palette.
     */
  override_armor_assets?: ({
    [Key in Extract<Registry['minecraft:equipment'], string>]?: string;
  })
}

export type TrimPattern = {
  /**
     * ID of the pattern that will be used in the resource pack as an overlay on the armor.
     *
     * Value:
     *
     * Value: A minecraft:texture ID within a path root of `(namespace)/textures/trims/models/armor/`
     */
  asset_id: `${string}:${string}`
  /**
     * Text displayed in the item tooltip.
     */
  description: Text
  /**
     * Whether the pattern texture will be masked based on the underlying armor. Defaults to `false`.
     */
  decal?: boolean
}
