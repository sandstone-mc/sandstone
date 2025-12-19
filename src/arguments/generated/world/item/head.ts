import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'
import type { NBTIntArray } from 'sandstone'

export type PlayerHead = (ItemBase & {
    SkullOwner?: (SkullOwner | string)
})

export type Properties = {
    textures?: Array<Texture>
}

export type SkullOwner = {
    /**
     * Optional.
     *
     * Value:
     * Array length range: 4
     */
    Id?: NBTIntArray<{
        leftExclusive: false
        rightExclusive: false
        min: 4
        max: 4
    }>
    /**
     * Name of the owner, if missing appears as a steve head.
     */
    Name?: string
    Properties?: Properties
}

export type Texture = {
    Signature?: string
    /**
     * Base64 encoded JSON value of the texture index.
     */
    Value?: string
}
