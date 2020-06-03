/**
 * The main Sandstone object, also called the commands resolver.
 */

import util from 'util'

import {
  RootNode, CommandNode, NodeWithChildren, NodeWithRedirect, ArgumentNode, LiteralArgumentNode,
} from './commandsTypes'
import Datapack from './Datapack'

function objectHasProperty(obj: any, property: string): property is Extract<keyof typeof obj, string> {
  return Object.prototype.hasOwnProperty.call(obj, property)
}

function isNodeWithArguments(obj: CommandNode | RootNode): obj is (ArgumentNode | LiteralArgumentNode) {
  return obj.type === 'argument' || obj.type === 'literalArgument'
}

function isNodeWithRedirect<T extends CommandNode | RootNode>(obj: T): obj is NodeWithRedirect & T {
  return objectHasProperty(obj, 'redirect')
}

function isNodeWithChildren<T extends CommandNode | RootNode>(obj: T): obj is NodeWithChildren & T {
  return objectHasProperty(obj, 'children')
}

function _hasChild(obj: NodeWithChildren, childName: string): childName is Extract<keyof (typeof obj)['children'], string> {
  return objectHasProperty(obj.children, childName)
}

function isNodeWithExecutables<T extends CommandNode | RootNode>(node: T): node is {executables: boolean[]} & T {
  return objectHasProperty(node, 'executables')
}

function hasChild<T extends CommandNode | RootNode>(obj: T, childName: string) {
  return isNodeWithChildren(obj) && _hasChild(obj, childName)
}

function isTerminalNode<T extends CommandNode | RootNode>(node: T): node is (NodeWithChildren | NodeWithRedirect) & T {
  return !isNodeWithChildren(node) && !isNodeWithRedirect(node)
}

const registeredCommands = new Map<number, CommandsResolver>()

export class CommandsResolver {
  protected readonly datapack: Datapack

  readonly commandsTree: RootNode

  readonly currentNode: CommandNode | RootNode

  protected readonly args: readonly any[]

  protected readonly executable: boolean

  protected readonly id: number

  protected static lastId = 0

  /**
   * A CommandResolver is the Javascript representation of a command. It is immutable.
   *
   * @param commandsTree the whole commands tree.
   * @param currentNode the current node of the tree.
   * @param args the arguments of the command.
   * @param executable Whether the current node is executable or not. Can be left 'undefined' for literal nodes.
   */
  constructor(datapack: Datapack, commandsTree: RootNode, currentNode: CommandNode | RootNode, args: readonly any[], executable: boolean | undefined = undefined) {
    this.datapack = datapack
    this.commandsTree = commandsTree
    this.currentNode = currentNode
    this.args = args

    CommandsResolver.lastId += 1
    this.id = CommandsResolver.lastId

    // We want to know if our command is executable. If it is, then we register it.
    if (currentNode.type === 'literal') {
      if (isNodeWithExecutables(currentNode)) {
        [this.executable] = currentNode.executables
      } else {
        this.executable = false
      }
    } else if (executable === undefined) {
      throw new Error(`Got undefined "executable" argument for a ${currentNode.type} node. You must specify whether the node is executable or not.`)
    } else {
      this.executable = executable

      if (executable) {
        this.register()
      }
    }
  }

  /**
   * Get the Commands Resolver for a child of the current node.
   */
  getChildNodeResolver(childName: string): CommandsResolver {
    if (isNodeWithChildren(this.currentNode)) {
      // Our node has children. We need to find the wanted subcommand between the children.
      const nextNode = this.currentNode.children[childName]

      if (!nextNode) {
        // If nextNode is undefined, it means there is no such child.
        throw new Error(`Command "${this.getCommand()}" has no "${childName}" subcommand.`)
      }

      return this.createChildResolver(nextNode, [...this.args, childName], false)
    }

    if (isNodeWithRedirect(this.currentNode)) {
      // Our node has redirects. We need to find the wanted subcommand between all possible redirects.
      let nextNode: CommandNode | RootNode

      for (const redirectionName of this.currentNode.redirect) {
        try {
          const newArgs = [...this.args]
          if (redirectionName === 'root') {
            nextNode = this.commandsTree
            newArgs.push('run')
          } else {
            nextNode = this.commandsTree.children[redirectionName]
          }

          const redirectedResolver = new CommandsResolver(this.datapack, this.commandsTree, nextNode, newArgs, false)

          return redirectedResolver.getChildNodeResolver(childName)
        } catch (e) {
          // Don't do anything - it just means the current had, in fact, no child of the given name. Maybe the next one will.
        }
      }

      // If we're here, it means none of the redirects had a child of the given name.
      throw new Error(`None of the ${this.currentNode.redirect} nodes had a "${childName}" subcommand.`)
    }

    throw new Error(`Command "${this.getCommand()}" has no subcommands.`)
  }

  /**
   * Gets the Command Resolver for the current node, but with the arguments specified.
   */
  getArgumentsResolver(...args: any[]): CommandsResolver {
    if (args.length === 1 && isNodeWithArguments(this.currentNode) && this.currentNode.parsers[0] === 'sandstone:callback') {
      // We're entering a callback

      // First, we enter a child function, in which the callback will be executed. We keep the name of the newly created function.
      const functionName = this.datapack.enterChildFunction('callback')

      // Call the callback
      args[0]()

      // Then we exit it
      this.datapack.exitChildFunction()

      // Finally, we register the command by adding the function call. We specify it's executable.
      const newResolver = new CommandsResolver(
        this.datapack,
        this.commandsTree,
        this.currentNode,
        this.args.concat(['function', functionName]),
        true,
      )

      return newResolver
    }

    let executable: boolean
    if (isNodeWithExecutables(this.currentNode)) {
      if (this.currentNode.executables.length) {
        executable = this.currentNode.executables[args.length - 1]
      } else {
        // If a node has no arguments, it's executable
        executable = true
      }
    } else {
      throw new Error('Node has no executables but was still called. This is not supposed to happen.')
    }

    return this.createChildResolver(
      this.currentNode,
      this.args.concat(args),
      executable,
    )
  }

  /**
   * Creates and returns a child resolver.
   * Unregisters the current command.
   */
  protected createChildResolver(
    currentNode: CommandNode | RootNode,
    args: readonly any[],
    executable: boolean,
  ): CommandsResolver {
    const newResolver = new CommandsResolver(this.datapack, this.commandsTree, currentNode, args, executable)

    if (this.executable) {
      this.unregister()
    }

    return newResolver
  }

  /**
   * Registers the current command (add it to the datapack).
   */
  protected register(): void {
    if (!this.executable) {
      throw new Error(`Invalid command: ${this.getCommand()}`)
    }

    this.datapack.registerNewCommand(this.args as [any, ...any[]])
  }

  /**
   * Unregisters the current command (remove it from the datapack).
   */
  protected unregister(): void {
    this.datapack.unregisterLastCommand()
  }

  /**
   * Get the command as a string.
   */
  getCommand(): string {
    return this.args.join(' ')
  }
}

export function createCommandsResolver(datapack: Datapack, commandsTree: RootNode) {
  const rootCommandsResolver = new CommandsResolver(datapack, commandsTree, commandsTree, [], false)

  function createProxy(resolver: CommandsResolver): CommandsResolver {
    return new Proxy(resolver, {
      get(target, prop) {
        if (typeof prop !== 'string') {
          throw new Error(`Incorrect property type: ${typeof prop} for prop ${prop.toString()}`)
        }

        const newResolver = resolver.getChildNodeResolver(prop)

        if (newResolver.currentNode.type === 'literal' || newResolver.currentNode.type === 'root') {
          return createProxy(newResolver)
        }

        return (...args: any[]): CommandsResolver => createProxy(newResolver.getArgumentsResolver(...args))
      },
    })
  }

  return createProxy(rootCommandsResolver)
}
