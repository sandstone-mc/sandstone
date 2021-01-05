/* eslint-disable camelcase */
import type {
  AdvancementType, LootTableType, PredicateType, RecipeType,
  TAG_TYPES,
} from '@arguments'
import type { CommandArgs } from './minecraft'

export type ResourcePath = readonly [namespace: string, ...path: string[]]

type FolderOrFileProperties<T extends Record<string, unknown>, P extends ResourcePath> = {
  path: P
  children: Map<string, FolderOrFile<T>>
}

/**
 * Represents either a folder or a resource file.
 *
 * A resource file can have children too.
 */
export type FolderOrFile<T extends Record<string, unknown>, P extends ResourcePath = ResourcePath> = FolderOrFileProperties<T, P> & (
  // Either it is a resource, and has the resource properties, or it's a folder.
  ({ isResource: true } & T) | { isResource: false }
)

export type File<T extends Record<string, unknown>, P extends ResourcePath = ResourcePath> = FolderOrFileProperties<T, P> & (
  // We know it's a resource
  { isResource: true } & T
)

type FunctionProperties = { commands: CommandArgs[] }
export type FunctionResource = FolderOrFile<FunctionProperties>

export type TagSingleValue<T> = T | { id: T, required: boolean }
type TagProperties = { values: TagSingleValue<string>[], replace?: boolean }
type TagPath = readonly [
  namespace: string,
  type: TAG_TYPES,
  ...path: string[]
]
export type TagsResource = FolderOrFile<TagProperties, TagPath>

// Here, the criteria names doesn't matter, so we put string
type AdvancementProperties = { advancement: AdvancementType<string> }
export type AdvancementResource = FolderOrFile<AdvancementProperties>

type PredicateProperties = { predicate: PredicateType }
export type PredicateResource = FolderOrFile<PredicateProperties>

type LootTableProperties = { lootTable: LootTableType }
export type LootTableResource = FolderOrFile<LootTableProperties>

type RecipeProperties = { recipe: RecipeType<string, string, string> }
export type RecipeResource = FolderOrFile<RecipeProperties>

/**
 * Given a resource names, returns the type of resource
 */
export type ResourceTypeMap = {
  functions: FunctionResource
  tags: TagsResource
  advancements: AdvancementResource
  predicates: PredicateResource
  loot_tables: LootTableResource
  recipes: RecipeResource
}

export type ResourceOnlyTypeMap = {
  functions: File<FunctionProperties>
  tags: File<TagProperties, TagPath>
  advancements: File<AdvancementProperties>
  predicates: File<PredicateProperties>
  loot_tables: File<LootTableProperties>
  recipes: File<RecipeProperties>
}

/**
 * All the resources associated with a namespace.
 */
export type NamespaceResources = {
  [key in keyof ResourceTypeMap]: Map<string, ResourceTypeMap[key]>
}

/**
 * All the namespaces.
 */
export type Namespaces = Map<string, NamespaceResources>

export type ResourceTypes = keyof NamespaceResources

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
      advancements: new Map(),
      predicates: new Map(),
      loot_tables: new Map(),
      recipes: new Map(),
    }

    this.namespaces.set(name, namespaceResource)
    return namespaceResource
  }

  /**
   * Get a resource or a folder from a given path, or undefined if the resource/folder if not found.
   * @param resourcePath the path of the resource/folder, in the format [namespace, folder, folder, resource]
   * @param resourceType the type of the resource/folder
   */
  getResourceOrFolder<T extends ResourceTypes>(
    resourcePath: ResourceTypeMap[T]['path'],
    resourceType: T,
  ): ResourceTypeMap[T] | undefined {
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
    const result = path.reduce(
      (resource, folder) => (resource ? resource.children.get(folder) as typeof resource : undefined),
      namespace[resourceType].get(firstFolder),
    )

    return result as ResourceTypeMap[T]
  }

  /**
   * Get a resource from a given path.
   * Throws an error if the resource if not found, or if it is a folder and not a resource.
   * @param resourcePath the path of the resource, in the format [namespace, folder, subfolder, resource name]
   * @param resourceType the type of the resource
   * @throws An error if the resource is not found, or if it is a folder and not a resource.
   */
  getResource<T extends ResourceTypes>(
    resourcePath: ResourceTypeMap[T]['path'],
    resourceType: T,
    errorMessage = `Impossible to find resource ${resourcePath}. This is an internal error.`,
  ): Exclude<ResourceTypeMap[T], { isResource: false }> {
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
    resourceType: ResourceTypes,
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
    folderType: ResourceTypes,
    errorMessage = `Impossible to find folder ${folderPath}. This is an internal error.`,
  ): Exclude<ResourceTypeMap[typeof folderType], { isResource: true }> {
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
  addResource<T extends ResourceTypes, U extends ResourceTypeMap[T]>(
    resourceType: T,
    resource: U,
  ): U & ResourceTypeMap[T] {
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
  getOrAddResource<T extends ResourceTypes, U extends ResourceTypeMap[T]>(
    resourceType: T,
    resource: U,
  ): U & ResourceTypeMap[T] {
    try {
      return this.getResource(resource.path, resourceType) as unknown as U
    } catch (e) {
      return this.addResource(resourceType, resource)
    }
  }
}
