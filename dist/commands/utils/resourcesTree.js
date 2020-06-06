"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesTree = void 0;
class ResourcesTree {
    constructor() {
        this.namespaces = new Map();
    }
    /**
     * Get the resources of a namespace. Initialize the namespace if required.
     */
    getSetNamespaces(namespace) {
        let resources = this.namespaces.get(namespace);
        // If the namespace if already there, return it
        if (resources !== undefined) {
            return resources;
        }
        // Else, create a new resource and set it
        resources = {
            functions: new Map(),
        };
        this.namespaces.set(namespace, resources);
        return resources;
    }
    /**
     * Get a resource or a folder from a given path, or undefined if the resource/folder if not found.
     * @param resourcePath the path of the resource/folder, in the format [namespace, folder, folder, resource]
     * @param resourceType the type of the resource/folder
     */
    getResourceOrFolder(resourcePath, resourceType) {
        if (resourcePath.length < 2) {
            throw new Error('Cannot access resource path with less than 2 arguments. This is an internal error.');
        }
        // Get the namespace name, first folder and path
        const [namespaceName, firstFolder, ...path] = resourcePath;
        // Get the real namespace
        const namespace = this.namespaces.get(namespaceName);
        if (!namespace) {
            throw new Error(`Unknown namespace ${namespace}. This is an internal error.`);
        }
        // Find the resource
        const reversePath = path.reverse();
        const result = reversePath.reduce((resource, folder) => (resource ? resource.children.get(folder) : undefined), namespace[resourceType].get(firstFolder));
        return result;
    }
    /**
     * Get a resource from a given path.
     * Throws an error if the resource if not found, or if it is a folder and not a resource.
     * @param resourcePath the path of the resource, in the format [namespace, folder, subfolder, resource name]
     * @param resourceType the type of the resource
     * @throws An error if the resource is not found, or if it is a folder and not a resource.
     */
    getResource(resourcePath, resourceType, errorMessage = `Impossible to find resource ${resourcePath}. This is an internal error.`) {
        const resource = this.getResourceOrFolder(resourcePath, resourceType);
        if (!resource || !resource.isResource) {
            throw new Error(errorMessage);
        }
        return resource;
    }
    /**
     * Get a folder from a given path.
     * Throws an error if the folder if not found, or if it is a resource and not a folder.
     * @param folderPath the path of the folder, in the format [namespace, folder, subfolder]
     * @param folderType the type of the folder
     * @throws An error if the folder is not found, or if it is a resource and not a folder.
     */
    getFolder(folderPath, folderType, errorMessage = `Impossible to find folder ${folderPath}. This is an internal error.`) {
        const resource = this.getResourceOrFolder(folderPath, folderType);
        if (!resource || resource.isResource) {
            throw new Error(errorMessage);
        }
        return resource;
    }
    /**
     * Adds a new resource. Throws an error if parent folder/resource does not exist.
     *
     * @param resourcePath the path of the resource, in the format [namespace, folder, subfolder, resource name]
     * @param resourceType the type of the resource
     * @param resource The resource to add.
     * @throws An error if parent folder/resource does not exist.
     */
    addResource(resourcePath, resourceType, resource) {
        const parentPath = resourcePath.slice(0, -1);
        if (parentPath.length >= 2) {
            const parent = this.getResourceOrFolder(parentPath, resourceType);
            if (!parent) {
                throw new Error(`Cannot add resource of type "${resourceType}" to non-existent parent resource ${parentPath}.`);
            }
            parent.children.set(resourcePath[resourcePath.length - 1], resource);
        }
        else {
            const namespace = this.getSetNamespaces(parentPath[0]);
            namespace[resourceType].set(resourcePath[1], resource);
        }
        return resource;
    }
}
exports.ResourcesTree = ResourcesTree;
//# sourceMappingURL=resourcesTree.js.map