import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'

export type BlockState = ({
  [S in Extract<Registry['minecraft:block'], string>]?: {
    Name: S
    Properties?: (S extends undefined ? Dispatcher<'mcdoc:block_states', [
      '%none',
    ]> : (S extends keyof Dispatcher<'mcdoc:block_states'>
      ? Dispatcher<'mcdoc:block_states'>[S]
      : Record<string, unknown>))
  };
}[Registry['minecraft:block']])
