import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NonEmptyString } from 'sandstone'

export type Lang = ({
  [Key in NonEmptyString]?: string
})

export type LangDeprecated = {
  /**
   * List of removed translation keys.
   */
  removed: Array<Registry['minecraft:translation_key']>,
  /**
   * Mapping renamed translation keys from old to new keys.
   */
  renamed: ({
    [Key in NonEmptyString]?: Registry['minecraft:translation_key']
  }),
}
