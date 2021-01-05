/**
 * A MCFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
export type CommandArgs = any[]

export function toMCFunctionName(functionName: readonly string[]): string {
  const [namespace, ...folders] = functionName
  return `${namespace}:${folders.join('/')}`
}
