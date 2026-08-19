import type { JsonFilterable } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonBookGeneration } from 'sandstone/arguments/generated/_json/world/component/item.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NonEmptyString } from 'sandstone'

export type JsonWritableBook = (JsonItemBase & {
  pages?: Array<string>,
})

export type JsonWrittenBook = (JsonItemBase & {
  /**
   * Whether the dynamic content on the pages has been resolved.
   */
  resolved?: boolean,
  /**
   * Pages of the book as JSON text components.
   */
  pages?: Array<JsonFilterable<NonEmptyString>>,
  /**
   * Generation of the book. 0 = original, 1 = copy of original, 2 = copy of copy, 3 = tattered.
   *
   * Value:
   *
   *  - Original(`0`)
   *  - Copy(`1`)
   *  - CopyOfCopy(`2`)
   *  - Tattered(`3`)
   */
  generation?: JsonBookGeneration,
  author?: string,
  title?: JsonFilterable<string>,
})
