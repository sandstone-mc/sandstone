import fs from 'fs/promises'
import path from 'path'

import { setExecutableLiterals, setCompoundParser } from './treeModifiers'
import { toJS, getBasePath, safeName } from './utils'


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
  setExecutableLiterals(commandsTree)

  // Map parsers to IDs. We're going to transform each parser into a TypeScript type later.
  const compoundTypesMap = setCompoundParser(commandsTree)

  const result = toJS(commandsTree, false)

  const newFilePath = path.join(getBasePath(filePath), 'commands.ts')

  console.log(`Saving to ${newFilePath} ...`)

  const commandsTemplate = await fs.readFile(path.join(__dirname, 'templateCommands'))
  await fs.writeFile(
    newFilePath,
    commandsTemplate.toString('utf-8').replace(/\$1/g, result),
  )

  /**
   * This types map links multi-argument commands to their corresponding TypeScript types.
   */
  const typesMapResult = [...compoundTypesMap.entries()].map(
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

  /** Read the template for types map */
  const typesMapTemplate = await fs.readFile(path.join(__dirname, 'templateTypesMap'))

  await fs.writeFile(
    path.join(getBasePath(filePath), 'typesMap.ts'),
    typesMapTemplate.toString('utf-8').replace(/\$1/g, typesMapResult),
  )

  console.log('Successfully wrote types map.')

  console.log('Auto-generation suceeded.')
}

if (require.main !== module) {
  throw Error('This script is not made to be imported, but used via CLI.')
}

if (process.argv.length <= 2) {
  throw Error('Missing COMMANDS_TREE.json path.')
}

commandsJsonToJS(process.argv[2])
