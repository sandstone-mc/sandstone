import type { JsonModelRef } from 'sandstone/arguments/generated/_json/assets/model.ts'
import type { NBTInt, NonEmptyString } from 'sandstone'

export type JsonBlockStateDefinition = ({
  variants: ({
    [Key in NonEmptyString]?: JsonModelVariant
  }),
} | {
  multipart: Array<{
    /**
     * One condition or an array where at least one condition must apply.
     */
    when?: JsonMultiPartCondition,
    apply: JsonModelVariant,
  }>,
})

export type JsonBlockStateDefinitionMultipart = {
  multipart: Array<{
    /**
     * One condition or an array where at least one condition must apply.
     */
    when?: JsonMultiPartCondition,
    apply: JsonModelVariant,
  }>,
}

export type JsonBlockStateDefinitionMultipartEntry = {
  /**
   * One condition or an array where at least one condition must apply.
   */
  when?: JsonMultiPartCondition,
  apply: JsonModelVariant,
}

export type JsonBlockStateDefinitionVariant = {
  variants: ({
    [Key in NonEmptyString]?: JsonModelVariant
  }),
}

export type JsonBlockStateDefinitionVariantMap = ({
  [Key in NonEmptyString]?: JsonModelVariant
})

export type JsonModelVariant = (JsonModelVariantBase | Array<(JsonModelVariantBase & {
  /**
   * Value:
   * Range: 1..
   */
  weight?: (NBTInt<{
    min: 1,
  }> | number),
})>)

export type JsonModelVariantBase = {
  model: JsonModelRef,
  x?: (0 | 90 | 180 | 270),
  y?: (0 | 90 | 180 | 270),
  z?: (0 | 90 | 180 | 270),
  /**
   * If set to `true`, the textures are not rotated with the block.
   */
  uvlock?: boolean,
}

export type JsonMultiPartAlternatives = {
  OR: Array<JsonMultiPartCondition>,
}

export type JsonMultiPartAnd = {
  AND: Array<JsonMultiPartCondition>,
}

export type JsonMultiPartBlockStates = ({
  [Key in NonEmptyString]?: string
})

export type JsonMultiPartCondition = ({
  OR: Array<JsonMultiPartCondition>,
} | {
  AND: Array<JsonMultiPartCondition>,
} | ({
  [Key in NonEmptyString]?: string
}))

export type JsonWeightedModelVariant = (JsonModelVariantBase & {
  /**
   * Value:
   * Range: 1..
   */
  weight?: (NBTInt<{
    min: 1,
  }> | number),
})
