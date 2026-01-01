import type { SymbolMcdocFluidStates } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'

export type FluidState = ({
  [S in Extract<Registry['minecraft:fluid'], string>]?: {
    Name: S
    Properties?: (S extends undefined
      ? SymbolMcdocFluidStates<'%none'> :
      (S extends keyof SymbolMcdocFluidStates ? SymbolMcdocFluidStates[S] : Record<string, unknown>))
  };
}[Registry['minecraft:fluid']])
