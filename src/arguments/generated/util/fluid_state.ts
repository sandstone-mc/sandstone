import type { SymbolMcdocFluidStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'

export type FluidState = ({
  [S in Extract<Registry['minecraft:fluid'], string>]?: {
    Name: S
    Properties?: (S extends undefined
      ? SymbolMcdocFluidStates<'%none'> :
      (S extends keyof SymbolMcdocFluidStates ? SymbolMcdocFluidStates[S] : NBTObject))
  };
}[Registry['minecraft:fluid']])
