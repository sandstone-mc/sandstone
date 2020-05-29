/**
 * This file contains modifiers for the commands tree.
 * Each of this function changes the tree in a certain way.
 */

/**
 * This function executes the given callback on the children of the node
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

type ParserInfo = {
  parsers: string[][], arguments: string[]
}

type ExistingTypes = Map<string, number>
type CompoundTypesMap = Map<number, ParserInfo>

/**
 * Contracts literals with only 1 possibility (like "as", it only has the "targets" child)
 * to 1 node with the "literalArgument" type.
 *
 * Warning: this directly modifies the given object.
 */
export function setLiteralArguments(commandNode: any) {
  let childrenNames = Object.keys(commandNode.children ?? {})

  // While the node is a literal/literalArgument with only 1 children
  while (['literal', 'literalArgument'].includes(commandNode.type) && childrenNames.length === 1) {
    const childName = childrenNames[0]
    const child = commandNode.children[childName]

    /* If the current node is a literal argument BUT NOT an array, it means it's the 2nd iteration over this node.
     * Indeed, the 1st iteration keeps the parser as a string, to avoid having multiple nodes with parser: ['xx'],
     * which would be less compact and more complicated to work with.
     * If we're on the 2nd iteration, we know another parser is coming:
     * therefore, we need to transform it into an array, to be able to a new parser in it later. */
    if (commandNode.type === 'literalArgument' && !Array.isArray(commandNode.parser)) {
      commandNode.parser = [commandNode.parser]
      commandNode.executable = [commandNode.executable]
      commandNode.properties = [commandNode.properties]
      commandNode.arguments = [commandNode.arguments]
    }

    child.executable = child.executable ?? false
    child.properties = child.properties ?? undefined

    let newProperties: {} | undefined

    if (commandNode.type === 'literalArgument') {
      // Not the first iteration => push to the array
      newProperties = {
        parser: [...commandNode.parser, child.parser],
        executable: [...commandNode.executable, child.executable],
        properties: [...commandNode.properties, child.properties],
        arguments: [...commandNode.arguments, childName],
      }
    } else {
      // First iteration => we only put it as a string
      newProperties = {
        parser: child.parser,
        executable: child.executable,
        properties: child.properties,
        arguments: childName,
      }
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
 * Gives all nodes parsers a unique ID associated with their given parser.
 * Is used to give a Typescript type to all nodes.
 *
 * @returns the mapping from IDs to parsers.
 */
export function setCompoundParser(
  commandNode: any,
  compoundTypesMap: CompoundTypesMap = new Map(),
  existingTypes: ExistingTypes = new Map(),
  name: string | undefined = undefined,
): CompoundTypesMap {
  let parserInfo: ParserInfo | null = null

  let id = Math.max(-1, ...compoundTypesMap.keys()) + 1

  if (
    commandNode.type === 'literalArgument'
    && Array.isArray(commandNode.arguments)
    && Array.isArray(commandNode.parser)
    && commandNode.arguments.length > 1
  ) {
    // If we have a parser with multiple elements, register them
    // First, if some elements are optionals, we need to register all possible potentialParsers combinations
    const possibleParsers: string[][] = []

    for (let i = 0; i < commandNode.parser.length; i += 1) {
      // Basically, we stack arguments, and register once the command becomes executable.
      // The full parser (aka the last one) must always be registered.
      if (commandNode.executable[i] || i + 1 === commandNode.parser.length) {
        possibleParsers.push(commandNode.parser.slice(0, i + 1))
      }
    }


    parserInfo = {
      parsers: possibleParsers,
      arguments: commandNode.arguments,
    }

    commandNode.parsers = commandNode.parser
    commandNode.parser = 'compound'
  } else if (commandNode.parser) {
    parserInfo = {
      parsers: [[commandNode.parser]],
      arguments: [commandNode.arguments ?? name],
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

  executeOnChildren(commandNode, setCompoundParser, compoundTypesMap, existingTypes)

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
