import fs from 'fs'
import path from 'path'
import { DATA_TYPES } from '@variables/Data'

import { ResourceInstance } from './Resource'

import type { CustomResourceData, CustomResourceDataTypes, CustomResourceProperties } from '@arguments'
import type { Datapack } from '@datapack'

export class CustomResourceInstance<TYPE extends string, DATA_TYPE extends CustomResourceDataTypes> extends ResourceInstance {
  type: TYPE

  data: Promise<CustomResourceData[DATA_TYPE]>

  properties: CustomResourceProperties<DATA_TYPE>

  constructor(datapack: Datapack, type: TYPE, properties: CustomResourceProperties<DATA_TYPE>, name: string, data: Promise<CustomResourceData[DATA_TYPE]>) {
    super(datapack, name)
    this.type = type
    this.data = data
    this.properties = properties

    datapack.customResources.add(this)
  }

  generate = async () => {
    const data = await this.data
    const stringifiedData = (this.properties.dataType === 'json' ? JSON.stringify(data) : data) as string

    this.datapack.addResource(this.name, 'customs', {
      data: stringifiedData,
      dataType: this.properties.dataType,
      save: this.properties.save,
      extension: this.properties.extension,
      type: this.type,
    }, 'throw')
  }
}

export class CustomResourceFactory<TYPE extends string, DATA_TYPE extends CustomResourceDataTypes> {
  datapack: Datapack

  type: TYPE

  properties: CustomResourceProperties<DATA_TYPE>

  constructor(datapack: Datapack, resourceType: TYPE, properties: CustomResourceProperties<DATA_TYPE>) {
    this.type = resourceType
    this.datapack = datapack
    this.properties = properties
  }

  private createResource(name: string, data: Promise<CustomResourceData[DATA_TYPE]>): CustomResourceInstance<TYPE, DATA_TYPE> {
    const { datapack } = this

    return new CustomResourceInstance(
      this.datapack, this.type, this.properties, name, data,
    )
  }

  create = (name: string, data: CustomResourceData[DATA_TYPE]): CustomResourceInstance<TYPE, DATA_TYPE> => {
    const dataPromise = new Promise<typeof data>((resolve) => resolve(data))
    return this.createResource(name, dataPromise)
  }

  copy = (from: string, to?: string) => {
    const name = to ?? path.posix.basename(from)

    const dataPromise = fs.promises.readFile(from)
      .then((d) => d.toString('utf-8'))
      .then((d) => (this.properties.dataType === 'json' ? JSON.parse(d) : d))

    return this.createResource(name, dataPromise)
  }
}
