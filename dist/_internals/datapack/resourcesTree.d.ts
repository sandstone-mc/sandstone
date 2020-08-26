import { CommandArgs } from './minecraft';
export declare type ResourcePath = readonly string[];
/**
 * Represents either a folder or a resource file.
 *
 * A resource file can have children too.
 */
export declare type FolderOrFile<T extends Record<string, unknown>> = {
    path: ResourcePath;
    children: Map<string, FolderOrFile<T>>;
} & (({
    isResource: true;
} & T) | {
    isResource: false;
});
export declare type FunctionResource = FolderOrFile<{
    commands: CommandArgs[];
}>;
/**
 * All the resources associated with a namespace.
 */
export declare type NamespaceResources = {
    functions: Map<string, FunctionResource>;
};
/**
 * All the namespaces.
 */
export declare type Namespaces = Map<string, NamespaceResources>;
/**
 * Given a resource names, returns the type of resource
 */
declare type ResourceType<resourceName extends keyof NamespaceResources> = Exclude<ReturnType<NamespaceResources[resourceName]['get']>, undefined>;
export declare class ResourcesTree {
    namespaces: Namespaces;
    constructor();
    /**
     * Get the resources of a namespace. Initialize the namespace if required.
     */
    protected getSetNamespaces(namespace: string): NamespaceResources;
    /**
     * Get a resource or a folder from a given path, or undefined if the resource/folder if not found.
     * @param resourcePath the path of the resource/folder, in the format [namespace, folder, folder, resource]
     * @param resourceType the type of the resource/folder
     */
    getResourceOrFolder(resourcePath: ResourcePath, resourceType: keyof NamespaceResources): ResourceType<typeof resourceType> | undefined;
    /**
     * Get a resource from a given path.
     * Throws an error if the resource if not found, or if it is a folder and not a resource.
     * @param resourcePath the path of the resource, in the format [namespace, folder, subfolder, resource name]
     * @param resourceType the type of the resource
     * @throws An error if the resource is not found, or if it is a folder and not a resource.
     */
    getResource(resourcePath: ResourcePath, resourceType: keyof NamespaceResources, errorMessage?: string): Exclude<ResourceType<typeof resourceType>, undefined | {
        isResource: false;
    }>;
    /**
     * Get a folder from a given path.
     * Throws an error if the folder if not found, or if it is a resource and not a folder.
     * @param folderPath the path of the folder, in the format [namespace, folder, subfolder]
     * @param folderType the type of the folder
     * @throws An error if the folder is not found, or if it is a resource and not a folder.
     */
    getFolder(folderPath: ResourcePath, folderType: keyof NamespaceResources, errorMessage?: string): Exclude<ResourceType<typeof folderType>, undefined | {
        isResource: true;
    }>;
    /**
     * Adds a new resource. Throws an error if parent folder/resource does not exist.
     *
     * @param resourcePath the path of the resource, in the format [namespace, folder, subfolder, resource name]
     * @param resourceType the type of the resource
     * @param resource The resource to add.
     * @throws An error if parent folder/resource does not exist.
     */
    addResource<T extends keyof NamespaceResources>(resourceType: T, resource: ResourceType<T>): ResourceType<T>;
}
export {};
