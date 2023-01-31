import type { LiteralUnion } from 'sandstone/utils'
import type { JSONTextComponent } from '../jsonTextComponent'
import type { ITEMS } from '#arguments/generated'

export type TrimMaterialJSON = {
  /** A string which will be used in the resource pack. */
  asset_name: string

  /** A JSON text component name, allowing color, translations, etc. */
  description: JSONTextComponent

  /** The item used in the smithing table for this material. */
  ingredient: LiteralUnion<ITEMS>

  /** Model override predicate float between 1 & 0. */
  item_model_index: number

  /** Optional.  If this material is incompatible with an armor material. */
  incompatible_armor_material?: LiteralUnion<'leather' | 'chainmail' | 'iron' | 'gold' | 'diamond' | 'turtle' | 'netherite'>
}
