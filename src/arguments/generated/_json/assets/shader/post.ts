import type { JsonSymbolUniformValue } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JSONRGBA } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NamespacedString, NBTInt, NonEmptyString } from 'sandstone'

export type JsonAuxTarget = {
  name: string,
  id: string,
  width?: (NBTInt | number),
  height?: (NBTInt | number),
  bilinear?: boolean,
}

export type JsonFixedSizedTarget = {
  width: (NBTInt | number),
  height: (NBTInt | number),
}

export type JsonFullScreenTarget = Record<string, never>

export type JsonInternalTarget = {
  width?: (NBTInt | number),
  height?: (NBTInt | number),
  /**
   * If `true`, target will be persistent across frames. Defaults to `false`.
   * The contents of the target will be cleared when the screen is resized.
   */
  persistent?: boolean,
  /**
   * Target will be filled with this color when created or cleared. Defaults to `0`.
   */
  clear_color?: JSONRGBA,
}

export type JsonOldTarget = {
  name: string,
  width?: (NBTInt | number),
  height?: (NBTInt | number),
}

export type JsonPass = ({
  vertex_shader: NamespacedString,
  fragment_shader: NamespacedString,
} & {
  inputs?: Array<(JsonTargetInput | JsonTextureInput)>,
  output: NamespacedString,
  uniforms?: JsonUniformBlocks,
})

export type JsonPostEffect = {
  targets?: JsonTargets,
  passes?: Array<JsonPass>,
}

export type JsonTargetInput = {
  target: NamespacedString,
  sampler_name: string,
  use_depth_buffer?: boolean,
  bilinear?: boolean,
}

export type JsonTargets = ({
  [Key in Extract<NamespacedString, string>]?: JsonInternalTarget
})

export type JsonTextureInput = {
  /**
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/effect/`
   */
  location: NamespacedString,
  sampler_name: string,
  /**
   * Value:
   * Range: 1..
   */
  width: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..
   */
  height: (NBTInt<{
    min: 1,
  }> | number),
  bilinear?: boolean,
}

export type JsonUniformBlocks = ({
  [Key in NonEmptyString]?: Array<JsonUniformValue>
})

export type JsonUniformValue = NonNullable<({
  [S in Extract<Extract<JsonUniformValueType, string>, string>]?: ({
    /**
     * Unused by the game, but good to set in practice.
     */
    name?: string,
  } & {
    /**
     * Value:
     *
     *  - Int(`int`)
     *  - Ivec3(`ivec3`)
     *  - Float(`float`)
     *  - Vec2(`vec2`)
     *  - Vec3(`vec3`)
     *  - Vec4(`vec4`)
     *  - Matrix4x4(`matrix4x4`)
     */
    type: S,
    value: (S extends keyof JsonSymbolUniformValue ? JsonSymbolUniformValue[S] : JsonRootNBT),
  })
}[Extract<JsonUniformValueType, string>])>

export type JsonUniformValueType = ('int' | 'ivec3' | 'float' | 'vec2' | 'vec3' | 'vec4' | 'matrix4x4')
