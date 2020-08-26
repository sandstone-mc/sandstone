/** A root class that can be used to defined a N-dimeension vector */
export declare class VectorClass<T extends readonly unknown[]> {
    protected values: T;
    constructor(values: T);
    toString(): string;
    toJSON(): string;
    [Symbol.iterator](): () => IterableIterator<unknown>;
}
declare type Tuple<T> = readonly [T, ...T[]];
declare type MappedArray<T, U> = {
    [key in keyof T]: U;
};
/**
 * Transforms a number into an absolute coordinate.
 *
 * @example
 *
 * absolute(0) => '0'
 *
 * absolute(5.5) => '5.5'
 *
 * @see `relative` for relative coordinates (e.g. ~10)
 * @see `local` for local coordinates (e.g. ^10)
 */
export declare function absolute(coordinate: number): string;
/**
 * Transforms numbers into absolute coordinates.
 *
 * @example
 *
 * relative(0, 0, 0) => ['0', '0', '0']
 *
 * relative(0, 180) => ['0', '180']
 *
 * relative(-1, 10, 5) => ['-1', '10', '5']
 *
 * @see `relative` for relative coordinates (e.g. ~10)
 * @see `local` for local coordinates (e.g. ^10)
 */
export declare function absolute<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, string>>;
/**
 * Transforms numbers into relative coordinates, using the tilde notation `~`.
 *
 * @example
 *
 * relative(0, 0, 0) => ['~', '~', '~']
 *
 * relative(0, 180) => ['~', '~180']
 *
 * relative(-1, 10, 5) => ['~-1', '~10', '~5']
 *
 * @see `absolute` for absolute coordinates (e.g. 10)
 * @see `local` for local coordinates (e.g. ^10)
 */
export declare function relative<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, string>>;
/**
 * Transforms a number into a local coordinate, using the caret notation `^`.
 *
 * @example
 *
 * local(0) => '~'
 *
 * local(5.5) => '^5.5'
 *
 * local(-1) => '^-1'
 *
 * @see `absolute` for absolute coordinates (e.g. 10)
 * @see `relative` for relative coordinates (e.g. ~10)
 */
export declare function local(coordinate: number): string;
/**
 * Transforms numbers into local coordinates, using the tilde notation `^`.
 *
 * @example
 *
 * relative(0, 0, 0) => ['^', '^', '^']
 *
 * relative(0, 180, 0) => ['^', '^180', '^']
 *
 * relative(-1, 10, 5) => ['^-1', '^10', '^5']
 *
 * @see `absolute` for absolute coordinates (e.g. 10)
 * @see `relative` for relative coordinates (e.g. ~10)
 */
export declare function local<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, string>>;
export {};
