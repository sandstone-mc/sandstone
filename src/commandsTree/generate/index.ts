import fs from 'fs/promises'
import util from 'util'
import path from 'path'

function getBasePath(filePath: string): string {
  return path.parse(filePath).dir
}


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

// Now, literals with only 1 possibility (like "as", it only has the "targets" child) should be collapsed
// to 1 node with the "literalArgument" type.
function setExecutableLiterals(commandNode: any, compoundTypesMap: CompoundTypesMap = new Map(), existingTypes: ExistingTypes = new Map(), name: string | undefined = undefined): CompoundTypesMap {
  // If the node is a literal with only 1 children, and this children is an argument
  let childrenNames = Object.keys(commandNode.children ?? {})
  while (['literal', 'literalArgument'].includes(commandNode.type) && childrenNames.length === 1) {
    const childName = childrenNames[0]
    const child = commandNode.children[childName]

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
      newProperties = {
        parser: [...commandNode.parser, child.parser],
        executable: [...commandNode.executable, child.executable],
        properties: [...commandNode.properties, child.properties],
        arguments: [...commandNode.arguments, childName],
      }
    } else {
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
    const jsonRepresentation = JSON.stringify(parserInfo)

    if (!existingTypes.has(jsonRepresentation)) {
      existingTypes.set(jsonRepresentation, id)

      // Push the new parser
      compoundTypesMap.set(id, parserInfo)
    } else {
      id = existingTypes.get(jsonRepresentation) as number
    }

    commandNode.parsersId = id
  }

  // Call the same method on all children
  executeOnChildren(commandNode, setExecutableLiterals, compoundTypesMap, existingTypes)

  return compoundTypesMap
}

function toJS(obj: any, compact = true): string {
  return util.inspect(
    obj,
    {
      depth: +Infinity,
      maxArrayLength: +Infinity,
      maxStringLength: +Infinity,
      breakLength: compact ? +Infinity : 80, // +Infinity,
      compact,
      colors: false,
    },
  )
}

export async function commandsJsonToJS(filePath: string) {
  console.log('Reading file', filePath, '...')

  const data = await fs.readFile(filePath)

  const commandsTree: any = JSON.parse(data.toString('utf-8'))

  // Delete the 'run' sub-command, to be able to directly call execute.as().at().say('Hello!')
  delete commandsTree.children.execute.children.run
  commandsTree.children.execute.children.run = {
    type: 'literal',
    children: {
      callback: {
        type: 'argument',
        executable: true,
        parser: 'sandstone:callback',
      },
    },
  }

  delete commandsTree.children.list
  delete commandsTree.children['save-all']

  // Now, literals with only 1 possibility (like "as", it only has the "targets" child) should be collapsed
  // to 1 node with the "literalArgument" type.
  const compoundTypesMap = setExecutableLiterals(commandsTree)

  const result = toJS(commandsTree, false)

  const newFilePath = path.join(getBasePath(filePath), 'commands.ts')

  console.log(`Saving to ${newFilePath} ...`)

  await fs.writeFile(
    newFilePath,
    '/* eslint-disable */\n'
      + '/** Auto-generated by jsonToTS.ts - '
      + 'Represents the Sandstone syntax tree, directly derived from COMMANDS_TREE data report. */\n'
      + `export default (${result}) as const\n`,
  )

  console.log(`Successfully wrote to ${newFilePath}`)

  /**
     * Returns a safe version of a name. Safe means "can be used as a parameter name".
     */
  function safeName(name: string): string {
    if (['function'].includes(name)) {
      return `${name}_`
    }
    return name
  }


  let typesMapResult = [...compoundTypesMap.entries()].map(
    ([id, parserInfo]) => {
      const { arguments: names, parsers } = parserInfo

      return `${id}:\n    ${parsers.map((types, parserIndex) => {
        const funcArgs: string = types.map((_, i) => `${safeName(names[i])}: typesMap['${types[i]}']`).join(', ')

        if (parserIndex + 1 === parsers.length) {
          return `((${funcArgs}) => rootNode)`
        }

        return `((${funcArgs}) => returnType)`
      }).join(' &\n    ')}`
    },
  ).join('\n  ')

  /**
     * This types map links multi-argument commands to their corresponding types.
     */
  typesMapResult = (
    '/* eslint-disable */\n'
      + `type CompoundTypesMapObject<typesMap extends {[p: string]: any}, returnType, rootNode> = ({\n  ${
        typesMapResult
      }\n})\n\n`
      + 'export type CompoundTypesMap<typesMap extends {[p: string]: any}, returnType, rootNode, k extends number>  = (\n'
      + '  k extends keyof CompoundTypesMapObject<typesMap, returnType, rootNode> ?\n'
      + '    CompoundTypesMapObject<typesMap, returnType, rootNode>[k] :\n'
      + '    never\n'
      + ')\n'
  )

  await fs.writeFile(
    path.join(getBasePath(filePath), 'compoundTypesMap.ts'),
    typesMapResult,
  )

  console.log('Successfully wrote types map')
}

if (require.main !== module) {
  throw Error('This script is not made to be imported, but used via CLI.')
}

if (process.argv.length <= 2) {
  throw Error('Missing COMMANDS_TREE.json path.')
}

commandsJsonToJS(process.argv[2])
