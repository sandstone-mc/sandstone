import { SelectorClass } from '@variables';
export declare type SelectorArgument<MustBeSingle extends boolean> = (MustBeSingle extends true ? string | SelectorClass<true> : string | SelectorClass<true> | SelectorClass<false>);
