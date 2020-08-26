/**
 * A McFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
import type { ResourcePath } from './resourcesTree';
export declare type CommandArgs = any[];
export declare function toMcFunctionName(functionName: ResourcePath): string;
