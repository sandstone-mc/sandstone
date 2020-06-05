/**
 * A McFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
export type McFunctionName = string[]

export type CommandArgs = readonly [any, ...any[]]

export function toMcFunctionName(functionName: McFunctionName | string[]): string {
  const [namespace, ...folders] = functionName
  return `${namespace}:${folders.join('/')}`
}
