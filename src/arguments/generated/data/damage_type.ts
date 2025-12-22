import type { NBTFloat } from 'sandstone'

export type DamageEffects = ('hurt' | 'thorns' | 'drowning' | 'burning' | 'poking' | 'freezing')

export type DamageScaling = ('never' | 'always' | 'when_caused_by_living_non_player')

export type DamageType = {
  /**
     * The message id used for deaths caused by this damage type.
     * Is combined with the result of `death_message_type` to form a translation key.
     */
  message_id: string
  /**
     * Amount of hunger exhaustion to cause.
     *
     * Value:
     * Range: 0..
     */
  exhaustion: NBTFloat<{
    leftExclusive: false
    min: 0
  }>
  /**
     * Whether to scale damage with difficulty levels.
     *
     * Value:
     *
     *  - Never(`never`): Always the same.
     *  - Always(`always`): Always scale with difficulty.
     *  - LivingNonPlayer(`when_caused_by_living_non_player`): Scale with difficulty if it was caused by a living entity who is not a player.
     */
  scaling: DamageScaling
  /**
     * Controls how damage manifests when inflicted on players. Defaults to `hurt`.
     *
     * Value:
     *
     *  - Hurt(`hurt`): Default hurt sound.
     *  - Thorns(`thorns`): Thorns hurt sound.
     *  - Drowning(`drowning`): Drowing sound.
     *  - Burning(`burning`): A single tick of burning hurt sound.
     *  - Poking(`poking`): Berry bush poke sound.
     *  - Freezing(`freezing`): A single tick of freezing hurt sound.
     */
  effects?: DamageEffects
  /**
     * Controls if special death message variants are used. Defaults to `default`.
     *
     * For more info see: https://minecraft.wiki/w/Damage_type#Death_messages
     *
     * Value:
     *
     *  - Default(`default`): Resulting translation key of `death.attack.` + message_id.
     *  - FallVariants(`fall_variants`): Resulting translation key of `death.attack.` + message_id.
     *  - IntentionalGameDesign(`intentional_game_design`): Resulting translation key of `death.attack.` + message_id + `.link`.
     */
  death_message_type?: DeathMessageType
}

export type DeathMessageType = ('default' | 'fall_variants' | 'intentional_game_design')
