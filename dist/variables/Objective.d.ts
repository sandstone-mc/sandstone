export declare class Objective {
    name: string;
    criterion: string;
    display: object | undefined;
    constructor(name: string, criterion: string, display?: object);
    toString(): string;
}
