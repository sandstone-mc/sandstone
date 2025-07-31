import type { SelectorClass, SelectorPickClass } from 'sandstone/variables'
import type { UUIDClass } from 'sandstone/variables/UUID'
import type { _ShowAlias } from './basics.js'

// Possible selectors.
type MultipleEntitiesSelector<MACRO extends boolean> =
  | SelectorClass<MACRO, false, false>
  | SelectorPickClass<false, false>
type SingleEntitySelector<MACRO extends boolean> = SelectorClass<MACRO, true, false> | SelectorPickClass<true, false>

type MultiplePlayersSelector<MACRO extends boolean> = SelectorClass<MACRO, false, true> | SelectorPickClass<false, true>
type SinglePlayerSelector<MACRO extends boolean> = SelectorClass<MACRO, true, true> | SelectorPickClass<true, true>

export type SelectorArgument<
  MACRO extends boolean,
  MustBeSingle extends boolean,
  MustBePlayer extends boolean = false,
> =
  | string
  | (MustBePlayer extends true
      ? SinglePlayerSelector<MACRO> | (MustBeSingle extends false ? MultiplePlayersSelector<MACRO> : never)
      : SingleEntitySelector<MACRO> | (MustBeSingle extends false ? MultipleEntitiesSelector<MACRO> : never))

/*
 * The `| _ShowAlias` is to prevent Typescript from showing the ugly "SelectorClass<??, ??>",
 * and to instead show the given name (e.g. SinglePlayerArgument).
 */
export type SinglePlayerArgument<MACRO extends boolean> = SelectorArgument<MACRO, true, true> | _ShowAlias
export type MultiplePlayersArgument<MACRO extends boolean> =
  | SelectorArgument<MACRO, false, true>
  | SinglePlayerArgument<MACRO>
  | _ShowAlias
export type SingleEntityArgument<MACRO extends boolean> =
  | SelectorArgument<MACRO, true, false>
  | SinglePlayerArgument<MACRO>
  | UUIDClass<any>
  | _ShowAlias
export type MultipleEntitiesArgument<MACRO extends boolean> =
  | SelectorArgument<MACRO, false, false>
  | SingleEntityArgument<MACRO>
  | MultiplePlayersArgument<MACRO>
  | _ShowAlias
