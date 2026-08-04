import type { ModelRef } from 'sandstone/arguments/generated/assets/model.ts'
import type { NBTInt, NonEmptyString } from 'sandstone'

export type BlockStateDefinition = ({
  variants: ({
    [Key in NonEmptyString]?: ModelVariant
  }),
} | {
  multipart: Array<{
    /**
     * One condition or an array where at least one condition must apply.
     */
    when?: MultiPartCondition,
    apply: ModelVariant,
  }>,
})

export type BlockStateDefinitionMultipart = {
  multipart: Array<{
    /**
     * One condition or an array where at least one condition must apply.
     */
    when?: MultiPartCondition,
    apply: ModelVariant,
  }>,
}

export type BlockStateDefinitionMultipartEntry = {
  /**
   * One condition or an array where at least one condition must apply.
   */
  when?: MultiPartCondition,
  apply: ModelVariant,
}

export type BlockStateDefinitionVariant = {
  variants: ({
    [Key in NonEmptyString]?: ModelVariant
  }),
}

export type BlockStateDefinitionVariantMap = ({
  [Key in NonEmptyString]?: ModelVariant
})

export type ModelVariant = (ModelVariantBase | Array<(ModelVariantBase & {
  /**
   * Value:
   * Range: 1..
   */
  weight?: NBTInt<{
    min: 1,
  }>,
})>)

export type ModelVariantBase = {
  model: ModelRef,
  x?: (0 | 90 | 180 | 270),
  y?: (0 | 90 | 180 | 270),
  z?: (0 | 90 | 180 | 270),
  /**
   * If set to `true`, the textures are not rotated with the block.
   */
  uvlock?: boolean,
}

export type MultiPartAlternatives = {
  OR: Array<MultiPartCondition>,
}

export type MultiPartAnd = ({
  [Key in NonEmptyString]?: string
})

export type MultiPartCondition = ({
  OR: Array<MultiPartCondition>,
} | ({
  [Key in NonEmptyString]?: string
}))

export type WeightedModelVariant = (ModelVariantBase & {
  /**
   * Value:
   * Range: 1..
   */
  weight?: NBTInt<{
    min: 1,
  }>,
})
