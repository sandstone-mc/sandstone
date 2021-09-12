export type CustomResourceData = {
  json: unknown
  raw: string
}

export type CustomResourceDataTypes = keyof CustomResourceData

export type CustomResourceSave = (properties: {
  packName: string,
} & ({
  saveType: 'root' | 'world',
  saveLocation: string
} | {
  saveType: 'custom-path'
  saveLocation: null
})) => string | Promise<string>

export type CustomResourceProperties<DATA_TYPE extends CustomResourceDataTypes> = {
  /** The kind of data this resource will take. */
  dataType: DATA_TYPE

  /** The extension of resulting files. */
  extension: string

  /** A function which returns the path a resource should be saved at. */
  save: CustomResourceSave
}