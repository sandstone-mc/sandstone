export type Tag<E> = {
  replace?: boolean
  values: Array<TagEntry<E>>
}

export type TagEntry<E> = (E | {
  id: E
  required?: boolean
})
