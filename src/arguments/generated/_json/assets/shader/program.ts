import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { NamespacedString, NBTFloat, NBTInt, NonEmptyString } from 'sandstone'

export type JsonBlendFactor = (
  | '0'
  | 'zero'
  | '1'
  | 'one'
  | 'srccolor'
  | '1-srccolor'
  | 'dstcolor'
  | '1-dstcolor'
  | 'srcalpha'
  | '1-srcalpha'
  | 'dstalpha'
  | '1-dstalpha')

export type JsonBlendFunc = ('add' | 'subtract' | 'reversesubtract' | 'reverse_subtract' | 'min' | 'max')

export type JsonBlendMode = {
  /**
   * Value:
   *
   *  - Add(`add`)
   *  - Subtract(`subtract`)
   *  - ReverseSubtract(`reversesubtract`)
   *  - ReverseSubtract2(`reverse_subtract`)
   *  - Min(`min`)
   *  - Max(`max`)
   */
  func?: JsonBlendFunc,
  /**
   * Value:
   *
   *  - Zero(`0`)
   *  - Zero2(`zero`)
   *  - One(`1`)
   *  - One2(`one`)
   *  - SrcColor(`srccolor`)
   *  - OneSrcColor(`1-srccolor`)
   *  - DstColor(`dstcolor`)
   *  - OneDstColor(`1-dstcolor`)
   *  - SrcAlpha(`srcalpha`)
   *  - OneSrcAlpha(`1-srcalpha`)
   *  - DstAlpha(`dstalpha`)
   *  - OneDstAlpha(`1-dstalpha`)
   */
  srcrgb?: JsonBlendFactor,
  /**
   * Value:
   *
   *  - Zero(`0`)
   *  - Zero2(`zero`)
   *  - One(`1`)
   *  - One2(`one`)
   *  - SrcColor(`srccolor`)
   *  - OneSrcColor(`1-srccolor`)
   *  - DstColor(`dstcolor`)
   *  - OneDstColor(`1-dstcolor`)
   *  - SrcAlpha(`srcalpha`)
   *  - OneSrcAlpha(`1-srcalpha`)
   *  - DstAlpha(`dstalpha`)
   *  - OneDstAlpha(`1-dstalpha`)
   */
  dstrgb?: JsonBlendFactor,
  /**
   * Value:
   *
   *  - Zero(`0`)
   *  - Zero2(`zero`)
   *  - One(`1`)
   *  - One2(`one`)
   *  - SrcColor(`srccolor`)
   *  - OneSrcColor(`1-srccolor`)
   *  - DstColor(`dstcolor`)
   *  - OneDstColor(`1-dstcolor`)
   *  - SrcAlpha(`srcalpha`)
   *  - OneSrcAlpha(`1-srcalpha`)
   *  - DstAlpha(`dstalpha`)
   *  - OneDstAlpha(`1-dstalpha`)
   */
  srcalpha?: JsonBlendFactor,
  /**
   * Value:
   *
   *  - Zero(`0`)
   *  - Zero2(`zero`)
   *  - One(`1`)
   *  - One2(`one`)
   *  - SrcColor(`srccolor`)
   *  - OneSrcColor(`1-srccolor`)
   *  - DstColor(`dstcolor`)
   *  - OneDstColor(`1-dstcolor`)
   *  - SrcAlpha(`srcalpha`)
   *  - OneSrcAlpha(`1-srcalpha`)
   *  - DstAlpha(`dstalpha`)
   *  - OneDstAlpha(`1-dstalpha`)
   */
  dstalpha?: JsonBlendFactor,
}

export type JsonDefines = {
  /**
   * Values that will be injected as `#define <key> <value>` at the top of the file.
   */
  values?: ({
    [Key in NonEmptyString]?: string
  }),
  /**
   * Flags that will be injected as `#define <key>` at the top of the file.
   */
  flags?: Array<string>,
}

export type JsonDefinesValues = ({
  [Key in NonEmptyString]?: string
})

export type JsonSampler = {
  name: string,
}

export type JsonShaderProgram = {
  vertex: NamespacedString,
  fragment: NamespacedString,
  samplers?: Array<JsonSampler>,
  uniforms: Array<JsonUniform>,
  /**
   * Defines GLSL directives to be injected into the shader source.
   */
  defines?: JsonDefines,
}

export type JsonUniform = {
  name: string,
  /**
   * Value:
   *
   *  - Int(`int`)
   *  - Float(`float`)
   *  - Matrix2x2(`matrix2x2`)
   *  - Matrix3x3(`matrix3x3`)
   *  - Matrix4x4(`matrix4x4`)
   */
  type: JsonUniformType,
  count: (NBTInt | number),
  values: Array<(NBTFloat | number)>,
}

export type JsonUniformType = ('int' | 'float' | 'matrix2x2' | 'matrix3x3' | 'matrix4x4')
