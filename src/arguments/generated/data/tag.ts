import type { NBTObject } from 'sandstone/arguments/nbt.ts'

export type Tag<E extends NBTObject> = {
  replace?: boolean,
  values: Array<TagEntry<E>>,
}

export type TagEntry<E extends NBTObject> = (E | {
  id: E,
  required?: boolean,
})
