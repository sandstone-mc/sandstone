import util from 'util'
import fs from 'fs/promises'
import path from 'path'
import { processCommandsTree } from '../src/old_generator/commandsTree/generate/treeModifiersv2'
import { toJS } from '../src/old_generator/commandsTree/generate/utils'

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

  processCommandsTree(commandsTree)

  const commandsTemplate = await fs.readFile(path.join(__dirname, '../src/commandsTree/generate', 'templateCommands'))
  await fs.writeFile(
    path.join(__dirname, 'commands.ts'),
    commandsTemplate.toString('utf-8').replace(/\$1/g, toJS(commandsTree, false)),
  )

  console.log('success')
}

commandsJsonToJS('./src/commandsTree/_commands.json', './src/commandsTree/_registries.json')
