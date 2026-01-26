import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type Lang = ({
  [Key in `${any}${string}`]?: string
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
    [Key in `${any}${string}`]?: Registry['minecraft:translation_key']
  }),
}
