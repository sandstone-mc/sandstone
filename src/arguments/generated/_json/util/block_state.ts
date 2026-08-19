import type { JsonSymbolMcdocBlockStates } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'

export type JsonBlockState = (JsonRegistry['minecraft:block'] | ({
  [S in Extract<Extract<JsonRegistry['minecraft:block'], string>, string>]?: {
    id: S,
    properties?: (S extends undefined
      ? JsonSymbolMcdocBlockStates<'%none'> :
      (S extends keyof JsonSymbolMcdocBlockStates
        ? JsonSymbolMcdocBlockStates[S]
        : JsonSymbolMcdocBlockStates<'%unknown'>)),
  }
}[Extract<JsonRegistry['minecraft:block'], string>]))
