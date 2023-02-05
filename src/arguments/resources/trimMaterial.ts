import type { LiteralUnion } from 'sandstone/utils'
import type { JSONTextComponent } from '../jsonTextComponent'
import type { ITEMS } from '#arguments/generated'

/** Key is armor material, value is a string which will be used in the resource pack. */
export type OverrideArmorMaterials = Record<LiteralUnion<'leather' | 'chainmail' | 'iron' | 'gold' | 'diamond' | 'turtle' | 'netherite'>, string>

export type TrimMaterialJSON = {
  /** A string which will be used in the resource pack for the color palette. */
  asset_name: string

  /** A JSON text component name, allowing color, translations, etc. */
  description: JSONTextComponent

  /** The item used in the smithing table for this material. */
  ingredient: LiteralUnion<ITEMS>

  /** Model override predicate float between 1 & 0. */
  item_model_index: number

  /** Optional.  Armor materials that should have a different color palette. */
  override_armor_materials?: OverrideArmorMaterials
}
