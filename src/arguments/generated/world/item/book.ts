import type { Filterable } from 'sandstone/arguments/generated/util.js'
import type { BookGeneration } from 'sandstone/arguments/generated/world/component/item.js'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'

export type WritableBook = (ItemBase & {
    pages?: Array<string>
})

export type WrittenBook = (ItemBase & {
    /**
     * Whether the dynamic content on the pages has been resolved.
     */
    resolved?: boolean
    /**
     * Pages of the book as JSON text components.
     */
    pages?: Array<Filterable<`${any}${string}`>>
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
    generation?: BookGeneration
    author?: string
    title?: Filterable<string>
})
