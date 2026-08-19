import type {
  JsonHumanoidArm,
  JsonPlayerModelPart,
  JsonProfile,
} from 'sandstone/arguments/generated/_json/util/avatar.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonEntityEquipment, JsonLivingEntity } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'

export type JsonMannequin = (JsonLivingEntity & {
  profile?: JsonProfile,
  hidden_layers?: Array<JsonPlayerModelPart>,
  /**
   * Defaults to `right`.
   *
   * Value:
   *
   *  - Left(`left`)
   *  - Right(`right`)
   */
  main_hand?: JsonHumanoidArm,
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
  pose?: JsonMannequinPose,
  /**
   * Defaults to `false`.
   */
  immovable?: boolean,
  /**
   * Text shown below the name tag.
   * Defaults to the translated `entity.minecraft.mannequin.label`.
   */
  description?: JsonText,
  /**
   * Whether the below name text is displayed.
   * Defaults to `false`.
   */
  hide_description?: boolean,
  /**
   * The equipment items of the mannequin.
   */
  equipment?: JsonEntityEquipment,
})

export type JsonMannequinPose = ('standing' | 'crouching' | 'swimming' | 'fall_flying' | 'sleeping')
