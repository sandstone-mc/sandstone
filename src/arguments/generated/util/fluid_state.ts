import type { SymbolMcdocFluidStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type FluidState = NonNullable<({
  [S in Extract<Registry['minecraft:fluid'], string>]?: {
    Name: S,
    Properties?: (S extends undefined
      ? SymbolMcdocFluidStates<'%none'> :
      (S extends keyof SymbolMcdocFluidStates ? SymbolMcdocFluidStates[S] : SymbolMcdocFluidStates<'%unknown'>)),
  }
}[Registry['minecraft:fluid']])>
