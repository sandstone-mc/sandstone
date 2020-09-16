import type { CommandArgs } from './minecraft'

export type ResourcePath = readonly [namespace: string, ...path: string[]]

/**
 * Represents either a folder or a resource file.
 *
 * A resource file can have children too.
 */
export type FolderOrFile<T extends Record<string, unknown>, P extends ResourcePath = ResourcePath> = {
  path: P
  children: Map<string, FolderOrFile<T>>
} & (
    // Either it is a resource, and has the resource properties, or it's a folder.
    ({ isResource: true } & T) | { isResource: false }
  )

export type FunctionResource = FolderOrFile<{ commands: CommandArgs[] }>

export type TagsResource = FolderOrFile<
  { values: (string | { id: string, required: boolean })[], replace?: boolean },
  readonly [
    namespace: string,
    type: 'blocks' | 'entity_types' | 'fluids' | 'functions' | 'items',
    ...path: string[]
  ]
>

/**
 * All the resources associated with a namespace.
 */
export type NamespaceResources = {
  functions: Map<string, FunctionResource>
  tags: Map<string, TagsResource>
}

/**
 * All the namespaces.
 */
export type Namespaces = Map<string, NamespaceResources>

/**
 * Given a resource names, returns the type of resource
 */
interface ResourceType {
  functions: FunctionResource
  tags: TagsResource
}

export class ResourcesTree {
  namespaces: Namespaces

  constructor() {
    this.namespaces = new Map()
  }

  /**
   * Initialize a new namespace.
   */
  protected createNamespace(name: string): NamespaceResources {
    const namespaceResource = {
      functions: new Map(),
      tags: new Map(),
    }

    this.namespaces.set(name, namespaceResource)
    return namespaceResource
  }

  /**
   * Get a resource or a folder from a given path, or undefined if the resource/folder if not found.
   * @param resourcePath the path of the resource/folder, in the format [namespace, folder, folder, resource]
   * @param resourceType the type of the resource/folder
   */
  getResourceOrFolder<T extends keyof NamespaceResources>(
    resourcePath: ResourceType[T]['path'],
    resourceType: T,
  ): ResourceType[T] | undefined {
    if (resourcePath.length < 2) {
      throw new Error(
        `Cannot access resource path with less than 1 arguments, namely "${resourcePath}". This is an internal error.`,
      )
    }
    // Get the namespace name, first folder and path
    const [namespaceName, firstFolder, ...path] = resourcePath

    // Get the namespace resource
    const namespace = this.namespaces.get(namespaceName)

    if (!namespace) {
      throw new Error(`Unknown namespace ${namespace}. This is an internal error.`)
    }

    // Find the resource
    const reversePath = path.reverse()

    const result = reversePath.reduce(
      (resource, folder) => (resource ? resource.children.get(folder) as typeof resource : undefined),
      namespace[resourceType].get(firstFolder),
    )

    return result as ResourceType[T]
  }

  /**
   * Get a resource from a given path.
   * Throws an error if the resource if not found, or if it is a folder and not a resource.
   * @param resourcePath the path of the resource, in the format [namespace, folder, subfolder, resource name]
   * @param resourceType the type of the resource
   * @throws An error if the resource is not found, or if it is a folder and not a resource.
   */
  getResource<T extends keyof NamespaceResources>(
    resourcePath: ResourceType[T]['path'],
    resourceType: T,
    errorMessage = `Impossible to find resource ${resourcePath}. This is an internal error.`,
  ): Exclude<ResourceType[T], { isResource: false }> {
    const resource = this.getResourceOrFolder(resourcePath, resourceType)

    if (!resource || !resource.isResource) {
      throw new Error(errorMessage)
    }

    return resource as any
  }

  /**
   * Deletes a given resource.
   *
   * @returns Whether the resource existed and was deleted.
   */
  deleteResource(
    resourcePath: ResourcePath,
    resourceType: keyof NamespaceResources,
  ): boolean {
    if (resourcePath.length > 2) {
      const parentResource = this.getResourceOrFolder(resourcePath.slice(0, -1) as unknown as ResourcePath, resourceType)
      return parentResource?.children.delete(resourcePath[resourcePath.length - 1]) ?? false
    }

    const namespace = this.namespaces.get(resourcePath[0])?.[resourceType]
    return namespace?.delete(resourcePath[1]) ?? false
  }

  /**
   * Get a folder from a given path.
   * Throws an error if the folder if not found, or if it is a resource and not a folder.
   * @param folderPath the path of the folder, in the format [namespace, folder, subfolder]
   * @param folderType the type of the folder
   * @throws An error if the folder is not found, or if it is a resource and not a folder.
   */
  getFolder(
    folderPath: ResourcePath,
    folderType: keyof NamespaceResources,
    errorMessage = `Impossible to find folder ${folderPath}. This is an internal error.`,
  ): Exclude<ResourceType[typeof folderType], { isResource: true }> {
    const resource = this.getResourceOrFolder(folderPath, folderType)

    if (!resource || resource.isResource) {
      throw new Error(errorMessage)
    }

    return resource
  }

  /**
   * Adds a new resource. Creates the namespace of the resource if it doesn't exists yet.
   *
   * @param resourceType the type of the resource
   * @param resource The resource to add.
   */
  addResource<T extends keyof NamespaceResources, U extends ResourceType[T]>(
    resourceType: T,
    resource: U,
  ): U & ResourceType[T] {
    const parentPath = resource.path.slice(0, -1)
    const namespace = parentPath[0]

    if (!this.namespaces.has(namespace)) {
      this.createNamespace(namespace)
    }

    if (parentPath.length >= 2) {
      let parent = this.getResourceOrFolder(parentPath as unknown as ResourcePath, resourceType)

      if (!parent) {
        this.addResource(resourceType, {
          children: new Map(),
          isResource: false,
          path: parentPath as any,
        })

        parent = this.getResourceOrFolder(parentPath as unknown as ResourcePath, resourceType)
      }

      parent!.children.set(resource.path[resource.path.length - 1], resource as any)
    } else {
      // Our parent path only has one component, the namespace. We need to add the resource like this.
      const namespaceResource = this.namespaces.get(namespace) as NamespaceResources
      namespaceResource[resourceType].set(resource.path[1], resource as any)
    }

    return resource
  }

  /**
   * Get a given resource, or add it if it already exists.
   *
   * @param resourceType the type of the resource
   * @param resource The resource to add, if it doesn't already exists.
   */
  getOrAddResource<T extends keyof NamespaceResources, U extends ResourceType[T]>(
    resourceType: T,
    resource: U,
  ): U & ResourceType[T] {
    try {
      return this.getResource(resource.path, resourceType) as unknown as U
    } catch (e) {
      return this.addResource(resourceType, resource)
    }
  }
}
