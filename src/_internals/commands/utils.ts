
type RegisterOptions = {
  /**
   * Whether the subcommand is an execute subcommand. If true, implies `subcommand` to be true.
   * @default false
   */
  execute?: boolean

  /**
   * Whether the given function is a subcommand. In root case, will not register the function.
   * @default false
   */
  subcommand?: boolean

  /**
   * Prevent the decorator to automatically register the method's arguments. You'll have to do it manually.
   * @default false
   */
  dontRegisterArguments?: boolean

  /**
   * The object field corresponding to the Sandstone object, containing the arguments.
   * If not set, the object using the decorator will be the one used.
   *
   * @default undefined
   */
  thisField?: string
}

// Overload 1
export function register(options: RegisterOptions, ...commandArgs: string[]): MethodDecorator;
// Overload 2 (no options)

/**
 * A decorator used to register COMMANDS_TREE.
 * It:
 * - Adds the arguments to the instance `arguments` list
 * - Sets the `inExecute` to true if specified
 * - Prepends the `run` argument if currently in an execute
 *
 * After the function was called, if it is not a subcommand, it adds it to the datapack by calling the .register method.
 */
export function register(...commandArgs: string[]): MethodDecorator;

export function register(optionsOrCommandArg1: RegisterOptions | string, ...commandArgs: string[]): MethodDecorator {
  let options: RegisterOptions = {
    dontRegisterArguments: false,
    execute: false,
    subcommand: false,
    thisField: undefined,
  }

  if (typeof optionsOrCommandArg1 === 'object') {
    // User gave an options object
    options = { ...options, ...optionsOrCommandArg1 }
  } else {
    // User didn't give any options, just arguments
    commandArgs = [optionsOrCommandArg1, ...commandArgs]
  }

  if (options.execute) {
    options.subcommand = true
  }

  return (target, propertyName, propertyDescriptor) => {
    const method = propertyDescriptor.value

    if (!method) {
      throw Error('No method given')
    }

    if (typeof method !== 'function') {
      throw new SyntaxError(`@register can only be used on functions, not: ${method}`)
    }

    return Object.create({
      ...propertyDescriptor,
      value(...args: any[]) {
        let sandObj = (this as unknown) as any
        if (options?.thisField) {
          sandObj = sandObj[options.thisField]
        }

        if (!('register' in sandObj)) {
          throw Error(
            'This decorator can only be used on Sandstone objects. If the root Sandstone object is a property'
            + ' of your class, you can use the { thisField: "" } option.',
          )
        }

        // If we're register an execute subcommand, set inExecute to true
        if (options?.execute) {
          // If we're not already in an execute, prepend "execute"
          if (!sandObj.inExecute) {
            sandObj.arguments.push('execute')
          }

          sandObj.inExecute = true
        }

        // If we're not registering an execute subcommand, and we were in an execute before, add the `run` argument
        if (!options?.execute && sandObj.inExecute) {
          sandObj.arguments.push('run')
        }

        // Add the command arguments
        sandObj.arguments.push(...commandArgs)

        // Add all arguments to the object
        if (!options?.dontRegisterArguments) {
          sandObj.arguments.push(...args)
        }

        /*
         * Here, we MUST use 'this' because the method is owned by the decorated class - not by Sandstone !!
         */
        const result = method.apply(this, args)

        if (!options?.subcommand) {
          sandObj.register()
        }

        return result
      },
    })
  }
}

/**
 * A decorator used to create a nested command, like /title.
 * All it does is registering the given arguments.
 */
export function nested(...commandArguments: string[]): MethodDecorator {
  return (target, propertyName, propertyDescriptor) => {
    const getter = propertyDescriptor.get
    const method = propertyDescriptor.value

    if (!getter && !method) {
      throw Error('No getter nor function given')
    }

    if (typeof getter !== 'function' && typeof method !== 'function') {
      throw new SyntaxError(`@nested can only be used on functions or getters, not: ${getter} / ${method}`)
    }

    const value = getter ?? method

    function decorated(this: any, func: (..._: any[]) => any, ...args: any[]) {
      const self = (this as unknown) as any

      if (!('arguments' in self)) {
        throw Error('This decorator can only be used on subclasses of Sandstone')
      }


      // If currently in execute, leave the execute
      if (self?.inExecute) {
        self.arguments.push('run')
        self.inExecute = false
      }

      // Push the arguments
      self.arguments.push(...commandArguments, ...args)

      return func.apply(self)
    }

    let object: object
    if (getter) {
      object = {
        get(...args: any[]): ReturnType<typeof getter> {
          return decorated.apply(this, [getter, ...args])
        },
      }
    } else if (method) {
      object = {
        value(...args: any[]) {
          return decorated.apply(this, [method as unknown as (() => any), ...args])
        },
      }
    } else {
      throw Error('?')
    }

    return Object.create({
      ...propertyDescriptor,
      ...object,
    })
  }
}
