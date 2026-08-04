import type { Filterable } from 'sandstone/arguments/generated/util.ts'
import type { BookGeneration } from 'sandstone/arguments/generated/world/component/item.ts'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTList, NonEmptyString } from 'sandstone'

export type WritableBook = (ItemBase & {
  pages?: Array<string>,
})

export type WrittenBook = (ItemBase & {
  /**
   * Whether the dynamic content on the pages has been resolved.
   */
  resolved?: boolean,
  /**
   * Pages of the book as JSON text components.
   */
  pages?: Array<Filterable<NonEmptyString>>,
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
  generation?: BookGeneration,
  author?: string,
  title?: Filterable<string>,
})
