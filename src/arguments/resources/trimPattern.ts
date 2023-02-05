import type { LiteralUnion } from 'sandstone/utils'
import type { JSONTextComponent } from '../jsonTextComponent'
import type { ITEMS } from '#arguments/generated'

export type TrimPatternJSON = {
  /** A resource location (In the resource pack) of the pattern that will be used as an overlay on the armor. */
  asset_id: string

  /** A JSON text component name, allowing color, translations, etc. Displayed in the result item tooltip. */
  description: JSONTextComponent

  /** The item used in the smithing table for this pattern. */
  template_item: LiteralUnion<ITEMS>
}
