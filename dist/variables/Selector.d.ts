declare type ScoreArgument = {
    [objective: string]: number | [null, number] | [number, null] | [number, number];
};
declare type SelectorArguments = {
    score?: ScoreArgument;
    tag?: string | string[];
    name?: string;
};
export declare class Selector {
    target: string;
    arguments: SelectorArguments;
    constructor(target: string, selectorArguments?: SelectorArguments);
    private inArguments;
    toString(): void;
}
export {};
