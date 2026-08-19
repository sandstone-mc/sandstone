import type { JsonSymbolMcdocFluidStates } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'

export type JsonFluidState = (JsonRegistry['minecraft:fluid'] | ({
  [S in Extract<Extract<JsonRegistry['minecraft:fluid'], string>, string>]?: {
    id: S,
    properties?: (S extends undefined
      ? JsonSymbolMcdocFluidStates<'%none'> :
      (S extends keyof JsonSymbolMcdocFluidStates
        ? JsonSymbolMcdocFluidStates[S]
        : JsonSymbolMcdocFluidStates<'%unknown'>)),
  }
}[Extract<JsonRegistry['minecraft:fluid'], string>]))
