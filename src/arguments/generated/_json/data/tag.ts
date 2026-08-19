import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'

export type JsonTag<E extends JsonNBTObject> = {
  replace?: boolean,
  values: Array<JsonTagEntry<E>>,
}

export type JsonTagEntry<E extends JsonNBTObject> = (E | {
  id: E,
  required?: boolean,
})
