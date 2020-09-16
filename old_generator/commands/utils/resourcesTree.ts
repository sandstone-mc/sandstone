import { CommandArgs } from './minecraft'

export type ResourcePath = string[]

/**
 * Represents either a folder or a resource file.
 *
 * A resource file can have children too.
 */
export type FolderOrFile<T extends Record<string, unknown>> = {
  path: string[]
  children: Map<string, FolderOrFile<T>>
} & (
  // Either it is a resource, and has the resource properties, or it's a folder.
  ({ isResource: true} & T) | { isResource: false }
)

export type FunctionResource = FolderOrFile<{commands: CommandArgs[]}>

/**
 * All the resources associated with a namespace.
 */
export type NamespaceResources = {
  functions: Map<string, FunctionResource>
}

/**
 * All the namespaces.
 */
export type Namespaces = Map<string, NamespaceResources>

/**
 * Given a resource names, returns the type of resource
 */
type ResourceType<resourceName extends keyof NamespaceResources> = Exclude<ReturnType<NamespaceResources[resourceName]['get']>, undefined>

export class ResourcesTree {
  namespaces: Namespaces

  constructor() {
    this.namespaces = new Map()
  }

  /**
   * Get the resources of a namespace. Initialize the namespace if required.
   */
  protected getSetNamespaces(namespace: string): NamespaceResources {
    let resources = this.namespaces.get(namespace)

    // If the namespace if already there, return it
    if (resources !== undefined) {
      return resources
    }

    // Else, create a new resource and set it
    resources = {
      functions: new Map(),
    }

    this.namespaces.set(namespace, resources)
    return resources
  }

  /**
   * Get a resource or a folder from a given path, or undefined if the resource/folder if not found.
   * @param resourcePath the path of the resource/folder, in the format [namespace, folder, folder, resource]
   * @param resourceType the type of the resource/folder
   */
  getResourceOrFolder(
    resourcePath: ResourcePath,
    resourceType: keyof NamespaceResources,
  ): ResourceType<typeof resourceType> | undefined {
    if (resourcePath.length < 2) {
      throw new Error('Cannot access resource path with less than 2 arguments. This is an internal error.')
    }
    // Get the namespace name, first folder and path
    const [namespaceName, firstFolder, ...path] = resourcePath

    // Get the real namespace
    const namespace = this.namespaces.get(namespaceName)

    if (!namespace) {
      throw new Error(`Unknown namespace ${namespace}. This is an internal error.`)
    }

    // Find the resource
    const reversePath = path.reverse()

    const result = reversePath.reduce(
      (resource, folder) => (resource ? resource.children.get(folder) : undefined),
      namespace[resourceType].get(firstFolder),
    )

    return result
  }

  /**
   * Get a resource from a given path.
   * Throws an error if the resource if not found, or if it is a folder and not a resource.
   * @param resourcePath the path of the resource, in the format [namespace, folder, subfolder, resource name]
   * @param resourceType the type of the resource
   * @throws An error if the resource is not found, or if it is a folder and not a resource.
   */
  getResource(
    resourcePath: ResourcePath,
    resourceType: keyof NamespaceResources,
    errorMessage = `Impossible to find resource ${resourcePath}. This is an internal error.`,
  ): Exclude<ResourceType<typeof resourceType>, undefined | { isResource: false }> {
    const resource = this.getResourceOrFolder(resourcePath, resourceType)

    if (!resource || !resource.isResource) {
      throw new Error(errorMessage)
    }

    return resource
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
  ): Exclude<ResourceType<typeof folderType>, undefined | { isResource: true }> {
    const resource = this.getResourceOrFolder(folderPath, folderType)

    if (!resource || resource.isResource) {
      throw new Error(errorMessage)
    }

    return resource as any
  }

  /**
   * Adds a new resource. Throws an error if parent folder/resource does not exist.
   *
   * @param resourcePath the path of the resource, in the format [namespace, folder, subfolder, resource name]
   * @param resourceType the type of the resource
   * @param resource The resource to add.
   * @throws An error if parent folder/resource does not exist.
   */
  addResource(resourcePath: ResourcePath, resourceType: keyof NamespaceResources, resource: ResourceType<typeof resourceType>): typeof resource {
    const parentPath = resourcePath.slice(0, -1)

    if (parentPath.length >= 2) {
      const parent = this.getResourceOrFolder(parentPath, resourceType)

      if (!parent) {
        throw new Error(`Cannot add resource of type "${resourceType}" to non-existent parent resource ${parentPath}.`)
      }

      parent.children.set(resourcePath[resourcePath.length - 1], resource)
    } else {
      console.log("Adding", parentPath[0])
      const namespace = this.getSetNamespaces(parentPath[0])
      namespace[resourceType].set(resourcePath[1], resource)
    }

    return resource
  }
}
