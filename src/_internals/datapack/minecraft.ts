/**
 * A McFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
import type { ResourcePath } from './resourcesTree'

export type CommandArgs = any[]

export function toMcFunctionName(functionName: ResourcePath): string {
  const [namespace, ...folders] = functionName
  return `${namespace}:${folders.join('/')}`
}
