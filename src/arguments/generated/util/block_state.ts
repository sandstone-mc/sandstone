import type { SymbolMcdocBlockStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type BlockState = ({
  [S in Extract<Extract<Registry['minecraft:block'], string>, string>]?: {
    Name: S,
    Properties?: (S extends undefined
      ? SymbolMcdocBlockStates<'%none'> :
      (S extends keyof SymbolMcdocBlockStates ? SymbolMcdocBlockStates[S] : SymbolMcdocBlockStates<'%unknown'>)),
  }
}[Extract<Registry['minecraft:block'], string>])
