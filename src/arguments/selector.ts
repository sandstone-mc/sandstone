import { SelectorClass } from "../variables";

export type SelectorArgument<MustBeSingle extends boolean> = (
    MustBeSingle extends true ?
    string | SelectorClass<true> :
    string | SelectorClass<true> | SelectorClass<false>
)