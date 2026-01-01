import type { SymbolMcdocBlockStates } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'

export type BlockState = ({
  [S in Extract<Registry['minecraft:block'], string>]?: {
    Name: S
    Properties?: (S extends undefined
      ? SymbolMcdocBlockStates<'%none'> :
      (S extends keyof SymbolMcdocBlockStates ? SymbolMcdocBlockStates[S] : Record<string, unknown>))
  };
}[Registry['minecraft:block']])
