import type { UUIDClass } from 'sandstone/variables/UUID.js'
import type { _ShowAlias } from './basics.js'
import type { SelectorClass, SelectorPickClass } from 'sandstone/variables/index.js'

// Possible selectors.
type MultipleEntitiesSelector = SelectorClass<false, false> | SelectorPickClass<false, false>
type SingleEntitySelector = SelectorClass<true, false> | SelectorPickClass<true, false>

type MultiplePlayersSelector = SelectorClass<false, true> | SelectorPickClass<false, true>
type SinglePlayerSelector = SelectorClass<true, true> | SelectorPickClass<true, true>

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
export type SingleEntityArgument = SelectorArgument<true, false> | SinglePlayerArgument | UUIDClass<any, any> | _ShowAlias
export type MultipleEntitiesArgument = SelectorArgument<false, false> | SingleEntityArgument | MultiplePlayersArgument | _ShowAlias
