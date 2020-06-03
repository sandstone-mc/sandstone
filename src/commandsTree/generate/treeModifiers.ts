/**
 * This file contains modifiers for the commands tree.
 * Each of this function changes the tree in a certain way.
 */

import { toCamelCase } from './utils'

/**
 * This function executes the given callback on the children of the node. It will always give, as the last argument, the child name.
 */
function executeOnChildren(commandNode: any, callback: (commandNode: any, ...args: any[]) => void, ...additionalArgs: any[]) {
  // If the node has no children, stop here
  if (!Object.prototype.hasOwnProperty.call(commandNode, 'children')) {
    return
  }

  const { children } = commandNode

  for (const childName in children) {
    if (Object.prototype.hasOwnProperty.call(children, childName)) {
      const child: any = children[childName]
      callback(child, ...additionalArgs, childName)
    }
  }
}

export function removeOpCommands(commandRoot: any) {
  // Remove commands that are not usable by datapacks.
  // Taken from: https://minecraft.gamepedia.com/Commands#List_and_summary_of_commands
  delete commandRoot.children.publish
  delete commandRoot.children['save-all']
  delete commandRoot.children['save-on']
  delete commandRoot.children['save-off']
  delete commandRoot.children.stop
  delete commandRoot.children.ban
  delete commandRoot.children['ban-ip']
  delete commandRoot.children.banlist
  delete commandRoot.children.debug
  delete commandRoot.children.deop
  delete commandRoot.children.kick
  delete commandRoot.children.op
  delete commandRoot.children.pardon
  delete commandRoot.children['pardon-ip']
  delete commandRoot.children.setidletimeout
  delete commandRoot.children.whitelist
}

/**
 * Transforms all nodes properties into arrays, which are more convenient to use (because later on, nodes will be merged together).
 * It means `executable` becomes `executables`, and `parser` becomes `parsers`.
 * For argument nodes, it will default their `executable` to false, and their properties to `undefined`
 */
export function normalizeNodes(commandNode: any, name = 'root') {
  commandNode.parsers = commandNode.parser ? [commandNode.parser] : []

  if (commandNode.type === 'argument') {
    commandNode.executables = [commandNode.executable ?? false]
    commandNode.properties = [commandNode.properties]
  } else {
    commandNode.executables = commandNode.executable ? [commandNode.executable] : []
    commandNode.properties = []
  }

  delete commandNode.parser
  delete commandNode.executable

  executeOnChildren(commandNode, normalizeNodes)
}

/**
 * Transform sibling nodes which all are literals, and have the same children themselves, into a single node.
 */
export function mergeLiteralSiblings(commandNode: any) {
  const childrenNames = Object.keys(commandNode.children ?? {})

  if (!childrenNames.length) {
    return
  }

  const children = childrenNames.map((name) => commandNode.children[name])

  // We check if the 1st node is a literal
  if (children[0].type !== 'literal' || children[0].children) {
    executeOnChildren(commandNode, mergeLiteralSiblings)
    return
  }

  // We will get the JSON representation of the 1st child, and check if all children have the same representation.
  const jsonRepresentation = JSON.stringify(children[0])

  let allEqual = true
  for (const child of children) {
    const { arguments: _, ...childWithoutName } = child
    if (JSON.stringify(childWithoutName) !== jsonRepresentation) {
      allEqual = false
    }
  }

  if (allEqual) {
    // All children are literal nodes with the same properties & children, we can merge them
    // To do that, we only keep the 1st child (since they're all identical), and set him a custom parser for later use.
    commandNode.children = {
      option: {
        ...children[0],
        parsers: ['sandstone:literals'],
        literalValues: [childrenNames],
        executables: children[0].executables.length ? children[0].executables : [false],
      },
    }
  }

  executeOnChildren(commandNode, mergeLiteralSiblings)
}

/**
 * Contracts literals with only 1 possibility (like "as", it only has the "targets" child)
 * to 1 node with the "literalArgument" type.
 *
 * Warning: this directly modifies the given object.
 */
export function setLiteralArguments(commandNode: any) {
  let childrenNames = Object.keys(commandNode.children ?? {})

  if (commandNode.type === 'literal') {

  }

  // While the node is a literal/literalArgument with only 1 children
  while (['literal', 'literalArgument'].includes(commandNode.type) && childrenNames.length === 1) {
    const childName = childrenNames[0]
    const child = commandNode.children[childName]

    const newProperties = {
      parsers: [...commandNode.parsers, ...child.parsers],
      executables: [...commandNode.executables, ...child.executables],
      properties: [...commandNode.properties, ...child.properties],
      arguments: [...(commandNode.arguments ?? []), ...(child.arguments ?? [childName])],
      literalValues: [...(commandNode.literalValues ?? []), ...(child.literalValues ?? [undefined])],
    }

    // Remove all children
    delete commandNode.children

    // Assign all properties of the only child to this node
    Object.assign(commandNode, child, newProperties)

    // Set the new type
    commandNode.type = 'literalArgument'

    childrenNames = Object.keys(commandNode.children ?? {})
  }

  // Call the same method on all children
  executeOnChildren(commandNode, setLiteralArguments)
}

/**
 * Add a 'root' redirect in all execute nodes.
 */
export function redirectExecutesToRoot(commandNode: any): void {
  if (commandNode.type === 'root') {
    redirectExecutesToRoot(commandNode.children.execute)
    return
  }

  if (commandNode.redirect && commandNode.redirect[0] === 'execute') {
    commandNode.redirect.push('root')
  }

  executeOnChildren(commandNode, redirectExecutesToRoot)
}

/**
 * All leaf "literal" nodes should be called like functions.
 * Therefore, they should become literalArguments, with an empty arguments list.
 */
export function setLeafLiteralsToArguments(commandNode: any, name = 'root') {
  if (commandNode.type === 'literal' && !commandNode.children) {
    // The node is a literal with no children, therefore a leaf literal node.
    Object.assign(commandNode, {
      type: 'literalArgument',
      parsers: [],
      executables: [],
      arguments: [],
      properties: [],
    })
  }

  executeOnChildren(commandNode, setLeafLiteralsToArguments)
}

type ParserInfo = {
  parsers: string[][], arguments: string[], literalValues: string[][]
}

type ExistingTypes = Map<string, number>
type CompoundTypesMap = Map<number, ParserInfo>

/**
 * Gives all nodes parsers a unique ID associated with their given parser.
 * Is used to give a Typescript type to all nodes.
 *
 * @returns the mapping from IDs to parsers.
 */
export function setParserIds(
  commandNode: any,
  compoundTypesMap: CompoundTypesMap = new Map(),
  existingTypes: ExistingTypes = new Map(),
  name = 'root',
): CompoundTypesMap {
  let parserInfo: ParserInfo | null = null

  let id = Math.max(-1, ...compoundTypesMap.keys()) + 1

  if (
    commandNode.type === 'literalArgument'
  ) {
    // If we have a parser with multiple elements, register them
    // First, if some elements are optionals, we need to register all possible potentialParsers combinations
    const possibleParsers: string[][] = []

    for (let i = 0; i < commandNode.parsers.length; i += 1) {
      // Basically, we stack arguments, and register once the command becomes executable.
      // The full parser (aka the last one) must always be registered.
      if (commandNode.executables[i] || i + 1 === commandNode.parsers.length) {
        possibleParsers.push(commandNode.parsers.slice(0, i + 1))
      }
    }


    parserInfo = {
      parsers: possibleParsers,
      arguments: commandNode.arguments,
      literalValues: commandNode.literalValues,
    }
  } else if (commandNode.parsers.length) {
    parserInfo = {
      parsers: [commandNode.parsers],
      arguments: commandNode.arguments ?? [name],
      literalValues: commandNode.literalValues,
    }
  }

  if (parserInfo) {
    // If we have a parser, check if we don't already have an identical parser (no need to duplicate identical parsers)
    const jsonRepresentation = JSON.stringify(parserInfo)

    if (!existingTypes.has(jsonRepresentation)) {
      // If we don't already have it, create a new ID
      existingTypes.set(jsonRepresentation, id)

      // Push the new parser
      compoundTypesMap.set(id, parserInfo)
    } else {
      // If we already have this parser registered, get its ID
      id = existingTypes.get(jsonRepresentation) as number
    }

    commandNode.parsersId = id
  }

  executeOnChildren(commandNode, setParserIds, compoundTypesMap, existingTypes)

  return compoundTypesMap
}

export function changeBiomeSoundParser(commandNode: any) {
  const newParsers = new Map([
    ['biome', 'sandstone:biome'],
    ['sound', 'sandstone:sound'],
  ])

  const newParser = newParsers.get(commandNode.arguments)

  if (newParser) {
    commandNode.parser = newParser
  } else if (Array.isArray(commandNode.parser)) {
    // If we have an array of parsers & arguments, get where arguments are biome/sound, and replace corresponding parser
    commandNode.arguments.forEach((arg: string, i: number) => {
      const parser = newParsers.get(arg)

      if (parser) {
        commandNode.parsers[i] = parser
      }
    })
  }

  executeOnChildren(commandNode, changeBiomeSoundParser)
}

/**
 * Transforms all commands names into camelCase
 */
export function commandsToCamelCase(commandsNode: any): void {
  for (const command in commandsNode.children) {
    if (Object.prototype.hasOwnProperty.call(commandsNode, command)) {
      const camelCasedCommand = toCamelCase(command)

      if (camelCasedCommand !== command) {
        commandsNode.children[camelCasedCommand] = commandsNode.children[command]

        delete commandsNode.children.command
      }
    }
  }

  executeOnChildren(commandsNode, commandsToCamelCase)
}

export function cleanUselessProperties(commandNode: any) {
  // If `properties` or `literalArguments` are only made of `undefined` (or empty), remove them
  if (commandNode.properties && (
    commandNode.properties.every((value: any) => value === undefined) || !commandNode.properties.length
  )) {
    delete commandNode.properties
  }

  if (commandNode.literalValues && (
    !commandNode.literalValues.find((_: any, value: any) => value !== undefined) || !commandNode.literalValues.length
  )) {
    delete commandNode.literalValues
  }

  if (commandNode.type === 'literal') {
    delete commandNode.executables
    delete commandNode.arguments
    delete commandNode.parsers
  }


  executeOnChildren(commandNode, cleanUselessProperties)
}
