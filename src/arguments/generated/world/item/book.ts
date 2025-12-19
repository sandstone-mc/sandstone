import type { Filterable } from 'sandstone/generated/util'
import type { BookGeneration } from 'sandstone/generated/world/component/item'
import type { ItemBase } from 'sandstone/generated/world/item'

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
