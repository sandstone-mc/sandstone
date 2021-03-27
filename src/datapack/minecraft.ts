export type CommandArgs = any[]

export function toMCFunctionName(functionName: readonly string[]): string {
  const [namespace, ...folders] = functionName
  return `${namespace}:${folders.join('/')}`
}
