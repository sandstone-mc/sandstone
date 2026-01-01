import type { SymbolDataComponent } from 'sandstone/arguments/generated/dispatcher'
import type { Profile } from 'sandstone/arguments/generated/util/avatar'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block'
import type { NBTIntArray } from 'sandstone'

export type Properties = {
  textures?: Array<Texture>
}

export type Skull = (BlockEntity & {
  /**
     * Name of the owner, if exists will be converted to SkullOwner.
     */
  ExtraType?: string
  /**
     * Sound to play when played with a note block.
     * Only works on player head.
     */
  note_block_sound?: SymbolDataComponent['note_block_sound']
  /**
     * Only works on player head.
     */
  profile?: Profile
  custom_name?: SymbolDataComponent['custom_name']
})

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
     * If missing appears as a steve head.
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
