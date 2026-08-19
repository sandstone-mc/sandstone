import type { JsonSymbolDataComponent } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonMooshroomType } from 'sandstone/arguments/generated/_json/world/component/entity.ts'
import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'

export type JsonMooshroom = (JsonBreedable & {
  /**
   * Value:
   *
   *  - Red(`red`)
   *  - Brown(`brown`)
   */
  Type?: JsonMooshroomType,
  stew_effects?: JsonSymbolDataComponent['suspicious_stew_effects'],
})
