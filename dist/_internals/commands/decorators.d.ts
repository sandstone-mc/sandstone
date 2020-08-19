declare type InnerFunctionType = (...args: unknown[]) => void;
declare type DecoratorFunction<T> = (commandsRoot: T, innerFunction: InnerFunctionType, ...innerArgs: unknown[]) => unknown;
declare function createPropertyDecorator<T>(thisField: string | null, decorator: DecoratorFunction<T>): (target: unknown, propertyKey: string | symbol) => any;
declare type RegisterConfig = {
    /**
     * Whether the given function has subcommands.
     * In this case, will not register the function,
     * but it will still add the arguments.
     *
     * @default false
     */
    hasSubcommands?: boolean;
    /**
     * Automatically add the method's arguments as command arguments.
     *
     * @default true
     */
    registerArguments?: boolean;
    /**
     * If the `this` object is not your root object,
     * you can provide the name of a property of `this` that is your root object.
     *
     * @default null
     */
    thisField?: string | null;
    /**
     * Whether this command/subcommand is executable.
     *
     * @default true
     */
    executable?: boolean;
    /**
     * Specify classes that must be applied to some arguments before being registered.
     *
     * Please note that the unparsed argument will be given to the function itself, to avoid types problems.
     *
     * @example
     * `@command`('tellraw', { parsers: { 1: JsonTextComponentClass } })
     * tellraw = (targets: string, textComponent: JsonTextComponent) => {}
     *
     * => The `textComponent` argument will be casted to a JsonTextComponentClass when registered.
     */
    parsers?: Record<number | string, (arg: any, innerArgs: unknown[]) => unknown>;
    /**
     * Whether the command is a root one (/say, /tellraw) or a subcommand.
     *
     * @default false
     */
    isRoot?: boolean;
    /**
     * Whether the command is an execute subcommand.
     *
     * @default false
     */
    isExecuteSubcommand?: boolean;
};
/**
 * Declares a new command or a subcommand.
 *
 * @param name The name of the command/subcommand to register.
 * Can provide an array of string for commands/subcommands with multiple words.
 *
 * @param config The configuration object
 */
export declare function command(name: string | string[], config?: RegisterConfig): ReturnType<typeof createPropertyDecorator>;
export {};
