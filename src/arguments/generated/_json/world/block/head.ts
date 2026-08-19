import type { JsonSymbolDataComponent } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonProfile } from 'sandstone/arguments/generated/_json/util/avatar.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTIntArray } from 'sandstone'

export type JsonProperties = {
  textures?: Array<JsonTexture>,
}

export type JsonSkull = (JsonBlockEntity & {
  /**
   * Name of the owner, if exists will be converted to SkullOwner.
   */
  ExtraType?: string,
  /**
   * Sound to play when played with a note block.
   * Only works on player head.
   */
  note_block_sound?: JsonSymbolDataComponent['note_block_sound'],
  /**
   * Only works on player head.
   */
  profile?: JsonProfile,
  custom_name?: JsonSymbolDataComponent['custom_name'],
})

export type JsonSkullOwner = {
  /**
   * Optional.
   *
   * Value:
   * Array length range: 4
   */
  Id?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Name of the owner, if missing appears as a steve head.
   */
  Name?: string,
  Properties?: JsonProperties,
}

export type JsonTexture = {
  Signature?: string,
  /**
   * Base64 encoded JSON value of the texture index.
   */
  Value?: string,
}
