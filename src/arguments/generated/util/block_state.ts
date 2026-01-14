import type { SymbolMcdocBlockStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'

export type BlockState = ({
  [S in Extract<Registry['minecraft:block'], string>]?: {
    Name: S
    Properties?: (S extends undefined
      ? SymbolMcdocBlockStates<'%none'> :
      (S extends keyof SymbolMcdocBlockStates ? SymbolMcdocBlockStates[S] : NBTObject))
  };
}[Registry['minecraft:block']])
