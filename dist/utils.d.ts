declare type RegisterOptions = {
    /**
     * Whether the subcommand is an execute subcommand. If true, implies `subcommand` to be true.
     */
    execute?: boolean;
    /**
     * Whether the given function is a subcommand. In root case, will not register the function.
     */
    subcommand?: boolean;
    /**
     * Prevent the decorator to automatically register the method's arguments. You'll have to do it manually.
     */
    dontRegisterArguments?: boolean;
    /**
     * The object field corresponding to the Sandstone object, containing the arguments.
     * If not set, the object using the decorator will be the one used.
     */
    thisField?: string;
};
export declare function register(options: RegisterOptions, ...commandArgs: string[]): MethodDecorator;
export declare function register(...commandArgs: string[]): MethodDecorator;
/**
 * A decorator used to create a nested command, like /title.
 * All it does is registering the given arguments.
 */
export declare function nested(...commandArguments: string[]): MethodDecorator;
export {};
