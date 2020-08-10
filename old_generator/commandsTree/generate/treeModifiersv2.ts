import { toCamelCase } from './utils'

/**
 * This function executes the given callback on the children of the node.
 * It will always give, as the two lasts argument, the parent and the the child name (in that order).
 */
function executeOnChildren(commandNode: any, callback: (commandNode: any, ...args: any[]) => void, ...additionalArgs: any[]): void {
  // If the node has no children, stop here
  if (!Object.prototype.hasOwnProperty.call(commandNode, 'children')) {
    return
  }

  const { children } = commandNode

  for (const childName in children) {
    if (Object.prototype.hasOwnProperty.call(children, childName)) {
      const child: any = children[childName]
      callback(child, ...additionalArgs, commandNode, childName)
    }
  }
}

export function removeOpCommands(commandRoot: any): void {
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

export function argumentToArguments(node: any, parent: any = null, name = 'root'): void {
  if (node.type === 'argument') {
    node.type = 'arguments'
    node.arguments = [[
      {
        // Keep the parser & the name
        ...{ parser: node.parser, name },

        // Keep the properties, if the node has properties
        ...(node.properties ? { properties: node.properties } : {}),
      },
    ]]

    // We can delete the parser and the properties
    delete node.parser
    delete node.properties
  }

  executeOnChildren(node, argumentToArguments)
}

/**
 * Transform sibling nodes which all are literals and leafs, and have the same children themselves, into a single node.
 */
export function mergeLiteralSiblings(node: any, parentNode = null, name = 'root'): void {
  const childrenNames = Object.keys(node.children ?? {})

  // We only target nodes with more than 1 child
  if (childrenNames.length <= 1) {
    executeOnChildren(node, mergeLiteralSiblings)
    return
  }

  const children = childrenNames.map((childName) => node.children[childName])

  // If the 1st child is a not literal, or if it is not a leaf, we can already stop there
  if (children[0].type !== 'literal' || children[0].children) {
    executeOnChildren(node, mergeLiteralSiblings)
    return
  }

  // We will get the JSON representation of the 1st child, and check if all children have the same representation.
  const jsonRepresentation = JSON.stringify(children[0])

  const allEqual = children.every((child) => JSON.stringify(child) === jsonRepresentation)

  if (allEqual) {
    // All children are literal nodes with the same properties & children, we can merge them
    // To do that, we only keep the 1st child (since they're all identical), and set him a custom parser for later use.
    node.children = {
      option: {
        type: 'arguments',
        arguments: [
          [{ parser: 'sandstone:literals', name, properties: { values: Object.keys(node.children) } }],
        ],
        executable: children[0].executable ?? false,
        children: children[0].children,
      },
    }
  }

  executeOnChildren(node, mergeLiteralSiblings)
}

/**
 * Merge two 2D arrays of arguments. Acts like a full join.
 *
 * @example
 *
 * mergeArguments(
 *  [[{name: arg1}], [{name: arg1}, {name: arg2}]],
 *  [[{name: arg3}], [{name: arg3}, {name: arg4}]]
 * )
 * => [
 *  [{name: arg1}, {name: arg3}],
 *  [{name: arg1}, {name: arg3, name: arg4}],
 *  [{name: arg1}, {name arg2}, {name: arg3}],
 *  [{name: arg1}, {name arg2}, {name: arg3, name: arg4}],
 * ]
 */
function mergeArguments(args1: any[][], args2: any[][]): any[][] {
  if (!args1.length) {
    return args2
  }
  if (!args2.length) {
    return args1
  }

  return args1.flatMap(
    (firstArrayArgs) => args2.map(
      (secondArrayArgs) => [...firstArrayArgs, ...secondArrayArgs],
    ),
  )
}

/**
 * Concatenate consecutive arguments.
 */
export function concatenateArguments(node: any, p = null, n = 'root'): void {
  // We need to do this bottom-to-top, so we first run on the children.
  executeOnChildren(node, concatenateArguments)

  const childrenNames = Object.keys(node.children ?? {})
  const firstChild = node.children?.[childrenNames?.[0]]


  if (node.type === 'arguments' && childrenNames.length === 1 && firstChild.type === 'arguments') {
    // The current node only has 1 child, which is an arguments node with no children. We merge them.
    const newArguments = mergeArguments(node.arguments, firstChild.arguments)

    // If the node alone was executable, we add the arguments alone too
    if (node.executable) {
      newArguments.push(...node.arguments)
    }

    if (node.prefixes || firstChild.prefixes) {
      node.prefixes = [
        ...(node.prefixes ?? []),
        ...(firstChild.prefixes ?? []),
      ]
    }

    node.arguments = newArguments

    // Set the new children
    delete node.children

    if (firstChild.children) {
      node.children = firstChild.children
    }
  }

  executeOnChildren(node, concatenateArguments)
}

/**
 * For literal nodes with literal parent, only one arguments child, and arguments siblings, concatenate them with their child
 */
function concatenateLiteralWithArguments(node: any, parentNode: any = null, name = 'root'): void {
  const children: any[] = Object.values(node.children ?? {})

  const hasArgumentsSiblings = Object.values(parentNode?.children ?? {}).some((child: any) => child.type === 'arguments')
  const hasOneArgumentChild = children.length === 1 && children[0].type === 'arguments'

  if (node.type === 'literal' && parentNode.type === 'literal' && hasArgumentsSiblings && hasOneArgumentChild) {
    // The node is a literal with only childrens. Merge it.
    const newNode = { ...children[0], ...{ prefixes: [name] } }

    parentNode.children[name] = newNode
  }

  executeOnChildren(node, concatenateLiteralWithArguments)
}

/**
 * Split arguments & literal paths for literal nodes
 */
export function splitArgumentsPaths(node: any, parentNode: any = null, name = 'root'): void {
  // Bottom to top
  executeOnChildren(node, splitArgumentsPaths)

  // We only want arguments nodes with children.
  const children: [string, any][] = Object.entries(node.children ?? {})

  if (!children.length || node.type !== 'arguments') {
    return
  }

  const parentKeys = Object.keys(parentNode.children)

  // Generate random names for all children. We don't care about the name itself, it's not used for arguments.
  // So we add underscores at the end of the name, until we get a name that doesn't exist in the parent.
  let newNameBase = 'args'
  while (parentKeys.includes(newNameBase)) {
    newNameBase += '_'
  }

  const hasLiteralChildren = children.some(([_, child]) => child.type === 'literal')

  if (!hasLiteralChildren) {
    delete parentNode.children[name]
  }

  const argumentsChildren = children.filter(([_, child]) => child.type === 'arguments')

  // For each child, we're going to generate a whole new path.
  for (let i = 0; i < argumentsChildren.length; i += 1) {
    const [childName, child] = argumentsChildren[i]
    const newName = `${newNameBase}_${i}`

    // Remove from the current node
    delete node.children[childName]

    // The new node is just like the current one, but with only 1 child!
    parentNode.children[newName] = {
      ...node,
      executable: node.executable && !hasLiteralChildren,
      children: {},
    }

    parentNode.children[newName].children[childName] = child
  }
}

/**
 * Merge siblings final arguments nodes into one node.
 */
export function mergeFinalArgumentsSiblings(node: any, p = null, name = 'root'): void {
  // We're doing bottom to top, but it would work the other way around - it's just more convenient this way.
  executeOnChildren(node, mergeFinalArgumentsSiblings)


  const children: [string, any][] = Object.entries(node.children ?? {})

  const finalArguments = children.filter(([_, child]) => !child.children && child.type === 'arguments' && !child.prefixes)

  if (!finalArguments.length) {
    return
  }

  const mergedNode = { type: 'arguments', arguments: [], executable: true } as {arguments: any[][]}
  node.children.args_merged = mergedNode

  for (const [childName, child] of finalArguments) {
    delete node.children[childName]

    mergedNode.arguments = [...mergedNode.arguments, ...child.arguments]
  }
}


/*
 * To this point, most literal nodes have:
 * - Only arguments children (those nodes are functions)
 * - Only literal children (those nodes are objects)
 *
 * Some nodes will not fall in either of those categories (2 nodes as of 1.16).
 * Those are edge cases that are dealt with in this function, for them to become arguments.
 */
function handleEdgeCases(node: any, _ = null, name = 'root') {
  const children: [string, any][] = Object.entries(node.children ?? {})

  const argumentsChildren = children.filter(([_, child]) => child.type === 'arguments')
  const literalChildren = children.filter(([_, child]) => child.type === 'literal')


  // If all arguments are literals or arguments, we're good - no need to do anything
  if (argumentsChildren.length === children.length || literalChildren.length === children.length) {
    executeOnChildren(node, handleEdgeCases)
    return
  }

  // Else, we have a edge case. Let's verify it's an edge case we know.
  const noChildrenWithChildren = !children.some(([_, child]) => child.children)

  if (argumentsChildren.length === 1 && literalChildren.length > 0 && noChildrenWithChildren) {
    // Edge case. Basically, we have 1 arguments node in the children, and the other are literal nodes.
    // This is the case for commands like /time set {argument: any number } | 'day' | 'midnight' | 'night' | 'noon'.
    // We merge the literals together into a new argument, and we transform the current node into a function.
    const literalArguments = literalChildren.map(([childName, _]) => childName)
    const [_, onlyArgumentChild] = argumentsChildren[0]

    node.arguments = [
      [{ parser: 'sandstone:literals', name, properties: { values: literalArguments } }],
      ...onlyArgumentChild.arguments,
    ]

    delete node.children

    node.type = 'arguments'
  } else {
    // We don't know this edge case...
    throw new Error('Unexpected edge case.')
  }

  executeOnChildren(node, handleEdgeCases)
}


/**
 * Transform literal leafs into functions taking no arguments.
 */
function setLiteralLeafsAsFunctions(node: any): void {
  if (node.type === 'literal' && !node.children) {
    node.children = {
      args: {
        type: 'arguments',
        arguments: [],
      },
    }
  }

  executeOnChildren(node, setLiteralLeafsAsFunctions)
}

/**
 * Sets literal nodes with only arguments child as "function" nodes,
 * and literal nodes with only literal child as "object" nodes.
 */
function setFunctionAndObjectNodes(node: any, _ = null, name = 'root') {
  if (node.type !== 'literal') {
    executeOnChildren(node, setFunctionAndObjectNodes)
    return
  }

  const children: [string, any][] = Object.entries(node.children ?? {})

  const isObjectNode = children.every(([_, child]) => child.type === 'literal')
  const isFunctionNode = children.every(([_, child]) => child.type === 'arguments')

  if (isObjectNode) {
    node.type = 'object'
  } else if (isFunctionNode) {
    node.type = 'function'
  } else {
    throw new Error('Unexpected edge case.')
  }

  executeOnChildren(node, setFunctionAndObjectNodes)
}

function setParsersID(node: any, _ = null, name = 'root', parsersIDMap: Map<string, number> = new Map()) {
  if (node.type === 'arguments') {
    const jsonRepresentation = JSON.stringify(node.arguments)

    if (!parsersIDMap.has(jsonRepresentation)) {
      const newID = Math.max(...parsersIDMap.values(), 0) + 1
      parsersIDMap.set(jsonRepresentation, newID)
      node.id = newID
    } else {
      node.id = parsersIDMap.get(jsonRepresentation)
    }
  }

  executeOnChildren(node, setParsersID)
}


/**
 * Transform function nodes children into an array of children.
 *
 * Must be the last ran function.
 */
function transformFunctionChildrenIntoArray(node: any) {
  executeOnChildren(node, transformFunctionChildrenIntoArray)

  if (node.type === 'function') {
    node.children = Object.values(node.children)
  }
}


export function processCommandsTree(commandsTree: any): void {
  // Remove commands that are not usable by datapacks.
  removeOpCommands(commandsTree)

  // Change all commands to camel case
  commandsToCamelCase(commandsTree)

  mergeLiteralSiblings(commandsTree)

  // Transform argument nodes into arguments ones
  argumentToArguments(commandsTree)

  concatenateArguments(commandsTree)

  concatenateLiteralWithArguments(commandsTree)

  splitArgumentsPaths(commandsTree)

  concatenateArguments(commandsTree)

  mergeFinalArgumentsSiblings(commandsTree)

  setLiteralLeafsAsFunctions(commandsTree)

  handleEdgeCases(commandsTree)

  setFunctionAndObjectNodes(commandsTree)

  setParsersID(commandsTree)

  transformFunctionChildrenIntoArray(commandsTree)

  commandsTree.type = 'root'
}
