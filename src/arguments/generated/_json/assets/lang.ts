import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { NonEmptyString } from 'sandstone'

export type JsonLang = ({
  [Key in NonEmptyString]?: string
})

export type JsonLangDeprecated = {
  /**
   * List of removed translation keys.
   */
  removed: Array<JsonRegistry['minecraft:translation_key']>,
  /**
   * Mapping renamed translation keys from old to new keys.
   */
  renamed: ({
    [Key in NonEmptyString]?: JsonRegistry['minecraft:translation_key']
  }),
}
