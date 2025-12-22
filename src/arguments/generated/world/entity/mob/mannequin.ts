import type { HumanoidArm, PlayerModelPart, Profile } from 'sandstone/arguments/generated/util/avatar.js'
import type { Text } from 'sandstone/arguments/generated/util/text.js'
import type { LivingEntity } from 'sandstone/arguments/generated/world/entity/mob.js'

export type Mannequin = (LivingEntity & {
  profile?: Profile
  hidden_layers?: Array<PlayerModelPart>
  /**
     * Defaults to `right`.
     *
     * Value:
     *
     *  - Left(`left`)
     *  - Right(`right`)
     */
  main_hand?: HumanoidArm
  /**
     * Defaults to `standing`.
     *
     * Value:
     *
     *  - Standing(`standing`)
     *  - Crouching(`crouching`)
     *  - Swimming(`swimming`)
     *  - FallFlying(`fall_flying`)
     *  - Sleeping(`sleeping`)
     */
  pose?: MannequinPose
  /**
     * Defaults to `false`.
     */
  immovable?: boolean
  /**
     * Text shown below the name tag.
     * Defaults to the translated `entity.minecraft.mannequin.label`.
     */
  description?: Text
  /**
     * Whether the below name text is displayed.
     * Defaults to `false`.
     */
  hide_description?: boolean
})

export type MannequinPose = ('standing' | 'crouching' | 'swimming' | 'fall_flying' | 'sleeping')
