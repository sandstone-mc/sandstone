import type { SymbolMcdocBlockStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type BlockState = (Registry['minecraft:block'] | ({
  [S in Extract<Extract<Registry['minecraft:block'], string>, string>]?: {
    id: S,
    properties?: (S extends undefined
      ? SymbolMcdocBlockStates<'%none'> :
      (S extends keyof SymbolMcdocBlockStates ? SymbolMcdocBlockStates[S] : SymbolMcdocBlockStates<'%unknown'>)),
  }
}[Extract<Registry['minecraft:block'], string>]))
