declare type RegisterOptions = {
    /**
     * Whether the subcommand is an execute subcommand. If true, implies `subcommand` to be true.
     * @default false
     */
    execute?: boolean;
    /**
     * Whether the given function is a subcommand. In root case, will not register the function.
     * @default false
     */
    subcommand?: boolean;
    /**
     * Prevent the decorator to automatically register the method's arguments. You'll have to do it manually.
     * @default false
     */
    dontRegisterArguments?: boolean;
    /**
     * The object field corresponding to the Sandstone object, containing the arguments.
     * If not set, the object using the decorator will be the one used.
     *
     * @default undefined
     */
    thisField?: string;
};
export declare function register(options: RegisterOptions, ...commandArgs: string[]): MethodDecorator;
/**
 * A decorator used to register COMMANDS_TREE.
 * It:
 * - Adds the arguments to the instance `arguments` list
 * - Sets the `inExecute` to true if specified
 * - Prepends the `run` argument if currently in an execute
 *
 * After the function was called, if it is not a subcommand, it adds it to the datapack by calling the .register method.
 */
export declare function register(...commandArgs: string[]): MethodDecorator;
/**
 * A decorator used to create a nested command, like /title.
 * All it does is registering the given arguments.
 */
export declare function nested(...commandArguments: string[]): MethodDecorator;
export {};
