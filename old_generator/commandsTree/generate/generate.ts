import fs from 'fs/promises'
import path from 'path'

import {
  setLiteralArguments, setParserIds, redirectExecutesToRoot, changeBiomeSoundParser, commandsToCamelCase, removeOpCommands, normalizeNodes, mergeLiteralSiblings, cleanUselessProperties, setLeafLiteralsToArguments, test,
} from './treeModifiers'
import { toJS, getBasePath, safeName } from './utils'


export async function commandsJsonToJS(commandsJsonPath: string, registriesJsonPath: string) {
  console.log('Reading file', commandsJsonPath, '...')

  const data = await fs.readFile(commandsJsonPath)

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

  test(commandsTree)

  // Remove commands that are not usable by datapacks.
  removeOpCommands(commandsTree)

  // Change all commands to camel case
  commandsToCamelCase(commandsTree)

  // Normalize all nodes
  normalizeNodes(commandsTree)

  // Merge literal siblings
  mergeLiteralSiblings(commandsTree)

  // Now, literals with only 1 possibility (like "as", it only has the "targets" child) should be collapsed
  // to 1 node with the "literalArgument" type.
  setLiteralArguments(commandsTree)

  // Literal leafs should be literalArguments too
  setLeafLiteralsToArguments(commandsTree)

  // Change argument types of "biome" and "sound" to a custom type
  // (instead of the generic "resource_location" which can be used for nbts, functions, etc...),
  // so we can provide autocompletion.
  changeBiomeSoundParser(commandsTree)

  // Map parsers to IDs. We're going to transform each parser into a TypeScript type later.
  const compoundTypesMap = setParserIds(commandsTree)

  // Make all execute subcommands both redirect to execute & root
  redirectExecutesToRoot(commandsTree)

  // Remove all useless properties
  cleanUselessProperties(commandsTree)

  /** Output dir for our commands tree */
  const parentDir = path.join(__dirname, '..')

  /** Output dir for our generated types */
  const typesDir = path.join(parentDir, 'types/')

  const commandsTemplate = await fs.readFile(path.join(__dirname, 'templateCommands'))
  await fs.writeFile(
    path.join(parentDir, 'commands.ts'),
    commandsTemplate.toString('utf-8').replace(/\$1/g, toJS(commandsTree, false)),
  )

  console.log('Successfully wrote commands tree.')

  /**
   * This types map links multi-argument commands to their corresponding TypeScript types.
   */
  const typesMapResult = [...compoundTypesMap.entries()].map(
    ([id, parserInfo]) => {
      const { arguments: names, parsers, literalValues } = parserInfo

      if (parsers.length) {
        return `${id}:\n    ${parsers.map((types, parserIndex) => {
          function getResultingType(i: number) {
            if (types[i] === 'sandstone:literals') {
              return literalValues[i].map((v) => `'${v}'`).join(' | ')
            }
            return `ParsersMap['${types[i]}']`
          }

          const funcArgs: string = types.map((_, i) => `${safeName(names[i])}: ${getResultingType(i)}`).join(', ')

          return `((${funcArgs}) => returnType)`
        }).join(' &\n    ')}`
      }

      // Node with no arguments
      return `${id}:\n    () => returnType`
    },
  ).join('\n  ')

  /** Read the template for types map */
  const parsersMapTemplate = await fs.readFile(path.join(__dirname, 'templateParsersIdMap'))

  await fs.writeFile(
    path.join(typesDir, 'parsersIdMap.ts'),
    parsersMapTemplate.toString('utf-8').replace(/\$1/g, typesMapResult),
  )

  console.log('Successfully wrote types map.')

  // Now, we are going to generate all possibilities for the following types, from registries.json.
  // These possibilities are not restrictive, they are only here for autocomplete.
  const toGenerate = new Set(['block', 'sound_event', 'mob_effect', 'enchantment', 'entity_type', 'item', 'biome', 'particle_type', 'dimension_type', 'attributes'])

  const registries: any = JSON.parse((await fs.readFile(registriesJsonPath)).toString())

  const promises: Promise<void>[] = []
  for (const type of toGenerate) {
    const { entries } = registries[`minecraft:${type}`]
    const values: string[] = Object.keys(entries)

    // The name of the type will be uppercase, and pluzalized if not already
    const typeName = type.toUpperCase() + (type.endsWith('s') ? '' : 'S')

    const result = `/* eslint-disable */\n/* Auto-generated */\nexport type ${typeName} = ${values.map((v) => `'${v}'`).join(' | ')}`

    promises.push(
      fs.writeFile(path.join(typesDir, `${type}.ts`), result),
    )
  }

  await Promise.allSettled(promises)

  console.log('All types successfully generated:', ...toGenerate)

  console.log('Auto-generation suceeded.')
}

if (require.main !== module) {
  console.error('This script is not made to be imported, but used via CLI.')
} else if (process.argv.length !== 4) {
  console.error('Incorrect number of arguments.\nUsage: ts-node generate.ts path/to/commands.json path/to/registries.json')
} else {
  commandsJsonToJS(process.argv[2], process.argv[3])
}
