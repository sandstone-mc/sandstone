export type DamageTypeJSON = {
  /**
   * The message id used for deaths caused by this damage type.
   * Is combined with the result of `death_message_type` to form a translation key.
   */
  message_id: string

  /** The amount of hunger exhaustion caused by this damage type. */
  exhaustion: number

  /** Whether this damage type scales with difficulty levels. */
  scaling: 'never' | 'always' | 'when_caused_by_living_non_player'

  /** Optional. Controls how damage manifests when inflicted on players. Defaults to `hurt`. */
  effects?: 'hurt' | 'thorns' | 'drowning' | 'burning' | 'poking' | 'freezing'

  /**
   * Optional. Controls if special death message variants are used. Defaults to `default`.
   *
   * - `default` Resulting translation key of `death.attack.` + message_id.
   * - `fall_variants` Resulting translation key of `death.attack.` + message_id. (yes)
   * - `intentional_game_design` Resulting translation key of `death.attack.` + message_id + `.link`.
   */
  death_message_type?: 'default' | 'fall_variants' | 'intentional_game_design'

  /** Optional. Controls whether the pattern texture will be masked by the underlying armor. Defaults to `false`. */
  decal?: boolean
}
