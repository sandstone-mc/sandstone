import type { JSONTextComponent } from '../../jsonTextComponent.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

export type TrimPatternJSON = {
  /** A resource location (In the resource pack) of the pattern that will be used as an overlay on the armor. */
  asset_id: string

  /** A JSON text component name, allowing color, translations, etc. Displayed in the result item tooltip. */
  description: JSONTextComponent

  /** The item used in the smithing table for this pattern. */
  template_item: Registry['minecraft:item']
}
