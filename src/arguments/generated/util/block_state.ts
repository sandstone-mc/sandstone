import type { SymbolMcdocBlockStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type BlockState = NonNullable<({
  [S in Extract<Registry['minecraft:block'], string>]?: {
    Name: S,
    Properties?: (S extends undefined
      ? SymbolMcdocBlockStates<'%none'> :
      (S extends keyof SymbolMcdocBlockStates ? SymbolMcdocBlockStates[S] : SymbolMcdocBlockStates<'%unknown'>)),
  }
}[Registry['minecraft:block']])>
