import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { RGBA } from 'sandstone/arguments/generated/util/color.js'
import type { NBTInt } from 'sandstone'

export type AuxTarget = {
    name: string
    id: string
    width?: NBTInt
    height?: NBTInt
    bilinear?: boolean
}

export type FixedSizedTarget = {
    width: NBTInt
    height: NBTInt
}

export type FullScreenTarget = Record<string, never>

export type InternalTarget = {
    width?: NBTInt
    height?: NBTInt
    /**
     * If `true`, target will be persistent across frames. Defaults to `false`.
     * The contents of the target will be cleared when the screen is resized.
     */
    persistent?: boolean
    /**
     * Target will be filled with this color when created or cleared. Defaults to `0`.
     */
    clear_color?: RGBA
}

export type OldTarget = {
    name: string
    width?: NBTInt
    height?: NBTInt
}

export type Pass = ({
    vertex_shader: `${string}:${string}`
    fragment_shader: `${string}:${string}`
} & {
    inputs?: Array<(TargetInput | TextureInput)>
    output: `${string}:${string}`
    uniforms?: UniformBlocks
})

export type PostEffect = {
    targets?: Targets
    passes?: Array<Pass>
}

export type TargetInput = {
    target: `${string}:${string}`
    sampler_name: string
    use_depth_buffer?: boolean
    bilinear?: boolean
}

export type Targets = ({
    [Key in Extract<`${string}:${string}`, string>]?: InternalTarget;
})

export type TextureInput = {
    location: string
    sampler_name: string
    /**
     * Value:
     * Range: 1..
     */
    width: NBTInt<{
        min: 1
    }>
    /**
     * Value:
     * Range: 1..
     */
    height: NBTInt<{
        min: 1
    }>
    bilinear?: boolean
}

export type UniformBlocks = ({
    [Key in `${any}${string}`]?: Array<UniformValue>;
})

export type UniformValue = ({
    [S in Extract<UniformValueType, string>]?: ({
        /**
         * Unused by the game, but good to set in practice.
         */
        name?: string
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
        type: S
        value: (S extends keyof Dispatcher<'minecraft:uniform_value'>
            ? Dispatcher<'minecraft:uniform_value'>[S]
            : Record<string, unknown>)
    });
}[UniformValueType])

export type UniformValueType = ('int' | 'ivec3' | 'float' | 'vec2' | 'vec3' | 'vec4' | 'matrix4x4')
