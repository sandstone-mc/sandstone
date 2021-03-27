import type { SelectorClass } from '@variables'
import type { _ShowAlias } from './basics'

// Possible selectors.
type MultipleEntitiesSelector = SelectorClass<false, false>
type SingleEntitySelector = SelectorClass<true, false>

type MultiplePlayersSelector = SelectorClass<false, true>
type SinglePlayerSelector = SelectorClass<true, true>

export type SelectorArgument<MustBeSingle extends boolean, MustBePlayer extends boolean = false> = string | (
    MustBePlayer extends true ? (
      SinglePlayerSelector | (MustBeSingle extends false ? MultiplePlayersSelector : never)
    ) : (
      SingleEntitySelector | (MustBeSingle extends false ? MultipleEntitiesSelector : never)
    )
)

/*
 * The `| _ShowAlias` is to prevent Typescript from showing the ugly "SelectorClass<??, ??>",
 * and to instead show the given name (e.g. SinglePlayerArgument).
 */
export type SinglePlayerArgument = SelectorArgument<true, true> | _ShowAlias
export type MultiplePlayersArgument = SelectorArgument<false, true> | SinglePlayerArgument | _ShowAlias
export type SingleEntityArgument = SelectorArgument<true, false> | SinglePlayerArgument | _ShowAlias
export type MultipleEntitiesArgument = SelectorArgument<false, false> | SingleEntityArgument | MultiplePlayersArgument | _ShowAlias
