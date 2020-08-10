
type InnerFunctionType = (...args: unknown[]) => void
type DecoratorFunction<T> = (commandsRoot: T, innerFunction: InnerFunctionType, ...innerArgs: unknown[]) => unknown

function getDefaultArguments(func: (...args: unknown[]) => unknown): unknown[] {
  const args = func.toString().replace(/[^(]*\(([^)]*)\).*/, '$1')
  const argsArray = args.split(',').map((str) => str.trim().split('='))

  const parsedArgsArray = argsArray.map(([_, defaultVal]) => (defaultVal === undefined ? null : eval(defaultVal)))

  return parsedArgsArray
}

function mergeArrays(arr1: unknown[], arr2: unknown[]) {
  const result = []

  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    const elem1 = arr1[i]
    const elem2 = arr2[i]

    result.push(elem1 ?? elem2)
  }

  return result
}

function createPropertyDecorator<T>(thisField: string | null, decorator: DecoratorFunction<T>) {
  return (target: unknown, propertyKey: string | symbol): any => {
    let innerFunction: InnerFunctionType

    return {
      configurable: false,
      enumerable: false,

      // Called when getting the value of the property
      get() {
        /** This is the decorator function. */
        let commandsRoot: T

        if (thisField !== null) {
          commandsRoot = this[thisField]
        } else {
          commandsRoot = this
        }

        return (...innerArgs: unknown[]) => decorator(commandsRoot, innerFunction, ...innerArgs)
      },

      // Called when setting the value of the property
      set(newValue: InnerFunctionType) {
        innerFunction = newValue
      },
    }
  }
}

type RegisterConfig = {
  /**
   * Whether the given function has subcommands.
   * In this case, will not register the function,
   * but it will still add the arguments.
   *
   * @default false
   */
  hasSubcommands?: boolean

  /**
   * Automatically add the method's arguments as command arguments.
   *
   * @default true
   */
  registerArguments?: boolean

  /**
   * If the `this` object is not your root object,
   * you can provide the name of a property of `this` that is your root object.
   *
   * @default null
   */
  thisField?: string | null

  /**
   * Whether this command/subcommand is executable.
   *
   * @default true
   */
  executable?: boolean

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
  parsers?: Record<number | string, new (arg: any) => unknown>
}

type RootObjectWithCommand = {
  arguments: unknown[]
  register: () => void
  executable: boolean
}

/**
 * Declares a new command or a subcommand.
 *
 * @param name The name of the command/subcommand to register.
 * Can provide an array of string for commands/subcommands with multiple words.
 *
 * @param config The configuration object
 */
export function command(name: string | string[], config: RegisterConfig = {}): ReturnType<typeof createPropertyDecorator> {
  // Apply default arguments
  config = {
    registerArguments: true,
    hasSubcommands: false,
    executable: true,
    ...config,
  }

  const parsers = config.parsers ?? {}

  const names = Array.isArray(name) ? name : [name]

  return createPropertyDecorator<RootObjectWithCommand>(config.thisField ?? null, (commandsRoot, innerFunction, ...innerArgs) => {
    if (config.registerArguments) {
      // Merge the default arguments with the given innerArgs
      const defaultArgs = getDefaultArguments(innerFunction)
      const finalRawArgs = mergeArrays(innerArgs, defaultArgs)

      const parsedArgs = finalRawArgs.map((arg, index) => {
        if (Object.prototype.hasOwnProperty.call(parsers, index)) {
          return new parsers[index](arg)
        }
        return arg
      })

      commandsRoot.arguments.push(...names, ...parsedArgs)
    }

    commandsRoot.executable = config.executable as boolean

    const result = innerFunction(...innerArgs)

    if (!config.hasSubcommands) {
      commandsRoot.register()
    }
    return result
  })
}