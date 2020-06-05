/**
 * This file contains utilities functions to auto-generate the commands tree.
 */
/**
 * Returns the string version of a Javascript object.
 * The representation will be valid Javascript, but invalid JSON.
 */
export declare function toJS(obj: any, compact?: boolean): string;
/**
 * Get the folder of a path.
 */
export declare function getBasePath(filePath: string): string;
/**
 * Returns a safe version of a name. Safe means "can be used as a parameter name".
 */
export declare function safeName(name: string): string;
/**
 * Transforms a dash-cased string into a camelCase one.
 */
export declare function toCamelCase(input: string): string;
