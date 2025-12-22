import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { NBTFloat, NBTInt } from 'sandstone'

export type BlendFactor = (
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

export type BlendFunc = ('add' | 'subtract' | 'reversesubtract' | 'reverse_subtract' | 'min' | 'max')

export type BlendMode = {
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
  func?: BlendFunc
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
  srcrgb?: BlendFactor
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
  dstrgb?: BlendFactor
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
  srcalpha?: BlendFactor
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
  dstalpha?: BlendFactor
}

export type Defines = {
  /**
     * Values that will be injected as `#define <key> <value>` at the top of the file.
     */
  values?: ({
    [Key in `${any}${string}`]?: string;
  })
  /**
     * Flags that will be injected as `#define <key>` at the top of the file.
     */
  flags?: Array<string>
}

export type Sampler = {
  name: string
}

export type ShaderProgram = {
  vertex: `${string}:${string}`
  fragment: `${string}:${string}`
  samplers?: Array<Sampler>
  uniforms: Array<Uniform>
  /**
     * Defines GLSL directives to be injected into the shader source.
     */
  defines?: Defines
}

export type Uniform = {
  name: string
  /**
     * Value:
     *
     *  - Int(`int`)
     *  - Float(`float`)
     *  - Matrix2x2(`matrix2x2`)
     *  - Matrix3x3(`matrix3x3`)
     *  - Matrix4x4(`matrix4x4`)
     */
  type: UniformType
  count: NBTInt
  values: Array<NBTFloat>
}

export type UniformType = ('int' | 'float' | 'matrix2x2' | 'matrix3x3' | 'matrix4x4')
