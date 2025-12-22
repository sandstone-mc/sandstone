import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'

export type FluidState = ({
  [S in Extract<Registry['minecraft:fluid'], string>]?: {
    Name: S
    Properties?: (S extends undefined ? Dispatcher<'mcdoc:fluid_states', [
      '%none',
    ]> : (S extends keyof Dispatcher<'mcdoc:fluid_states'>
      ? Dispatcher<'mcdoc:fluid_states'>[S]
      : Record<string, unknown>))
  };
}[Registry['minecraft:fluid']])
