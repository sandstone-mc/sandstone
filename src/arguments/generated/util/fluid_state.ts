import type { SymbolMcdocFluidStates } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTObject } from 'sandstone/arguments/nbt'

export type FluidState = ({
  [S in Extract<Registry['minecraft:fluid'], string>]?: {
    Name: S
    Properties?: (S extends undefined
      ? SymbolMcdocFluidStates<'%none'> :
      (S extends keyof SymbolMcdocFluidStates ? SymbolMcdocFluidStates[S] : NBTObject))
  };
}[Registry['minecraft:fluid']])
