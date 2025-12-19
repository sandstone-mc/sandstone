import type { TRANSLATION_KEYS } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone'

export type Lang = ({
    [Key in `${any}${string}`]?: string;
})

export type LangDeprecated = {
    /**
     * List of removed translation keys.
     */
    removed: Array<LiteralUnion<TRANSLATION_KEYS>>
    /**
     * Mapping renamed translation keys from old to new keys.
     */
    renamed: ({
        [Key in `${any}${string}`]?: LiteralUnion<TRANSLATION_KEYS>;
    })
}
