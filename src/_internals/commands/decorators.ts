import type { CommandsRoot } from './CommandsRoot'

type InnerFunctionType = (...args: unknown[]) => void
type DecoratorFunction<T> = (commandsRoot: T, innerFunction: InnerFunctionType, ...innerArgs: unknown[]) => unknown

function getDefaultArguments(func: (...args: unknown[]) => unknown): unknown[] {
  const args = func.toString().match(/[^(]*\(([^)]*)\).*/)?.[1] ?? ''
  const argsArray = args.split(',').map((str) => str.trim().split('='))

  // eslint-disable-next-line no-eval
  const parsedArgsArray = argsArray.map(([_, defaultVal]) => (defaultVal === undefined ? undefined : eval(defaultVal)))

  return parsedArgsArray
}

function mergeArrays(arr1: unknown[], arr2: unknown[]) {
  const result = []

  for (let i = 0; i < Math.max(arr1.length, arr2.length); i += 1) {
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
  parsers?: Record<number | string, (arg: any, innerArgs: unknown[]) => unknown>

  /**
   * Whether the command is a root one (/say, /tellraw) or a subcommand.
   *
   * @default false
   */
  isRoot?: boolean

  /**
   * Whether the command is an execute subcommand.
   *
   * @default false
   */
  isExecuteSubcommand?: boolean
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
    thisField: 'commandsRoot',
    isRoot: false,
    isExecuteSubcommand: false,
    ...config,
  }

  const parsers = config.parsers ?? {}

  const names = Array.isArray(name) ? name : [name]

  return createPropertyDecorator<CommandsRoot>(config.thisField ?? null, (commandsRoot, innerFunction, ...innerArgs) => {
    /*
     * If the previous command was executable, register it.
     * It means it wasn't registered because it could have been extended with other arguments.
     */
    if (config.isExecuteSubcommand && commandsRoot.executeState === 'outside') {
      commandsRoot.register(true)
    }

    if (config.isRoot) {
      if (commandsRoot.executeState === 'after') {
        commandsRoot.arguments.push('run')
        commandsRoot.executeState = 'outside'
      } else {
        commandsRoot.register(true)
      }
    } else if (commandsRoot.executeState === 'outside' && config.isExecuteSubcommand) {
      commandsRoot.arguments.push('execute')
    } else if (commandsRoot.arguments.length === 0) {
      // Function is not root but has no previous command
      throw new Error(
        'Trying to call some command arguments with no registered root. Did you forgot {hasSubcommands:true}?'
      + `Args are: ${innerArgs}, function is ${innerFunction}`,
      )
    }

    if (config.registerArguments) {
      // Merge the default arguments with the given innerArgs
      const defaultArgs = getDefaultArguments(innerFunction)
      const finalRawArgs = mergeArrays(innerArgs, defaultArgs)

      const parsedArgs = finalRawArgs.map((arg, index) => {
        if (arg !== undefined && Object.prototype.hasOwnProperty.call(parsers, index)) {
          return parsers[index](arg, finalRawArgs)
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

    if (config.isExecuteSubcommand) {
      commandsRoot.executeState = 'inside'
    }

    return result
  })
}
