export type BlockStateType = 'variant' | 'multipart'

export type Variant = {
  model: string
  x?: 0 | 90 | 180 | 270
  y?: 0 | 90 | 180 | 270
  /** If set to `true`, the textures are not rotated with the block. */
  uvlock?: boolean
}

export type WeightedVariant = Variant & {
  weight?: number
}

export type StringRecord = { [state: string]: string }

export type MultipartCase = {
  /** One condition or an array where at least one condition must apply. */
  when: StringRecord | StringRecord[]
  apply: Variant | WeightedVariant[]
}

export type BlockStateDefinition<Type extends BlockStateType> = Type extends 'variant'
  ? { variants: { [name: string]: Variant | WeightedVariant[] } }
  : { multipart: MultipartCase[] }
