import type { SymbolMcdocFluidStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type FluidState = (Registry['minecraft:fluid'] | ({
  [S in Extract<Extract<Registry['minecraft:fluid'], string>, string>]?: {
    id: S,
    properties?: (S extends undefined
      ? SymbolMcdocFluidStates<'%none'> :
      (S extends keyof SymbolMcdocFluidStates ? SymbolMcdocFluidStates[S] : SymbolMcdocFluidStates<'%unknown'>)),
  }
}[Extract<Registry['minecraft:fluid'], string>]))
