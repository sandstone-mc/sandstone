import { COMMANDS_TREE_TYPE, COMMANDS_TREE } from './commands'

// Parsers ID map //
interface PARSERS_ID_MAP<returnType> {
  1:
    ((destination: 'entity') => void) &
    ((location: 'vec3') => void) &
    ((targets: 'entity', destination: 'entity') => void) &
    ((targets: 'entity', location: 'vec3', rotation: 'rotation') => void)

  2:
   ((targets: 'entity', location: 'vec3') => returnType)

  3:
    ((location: 'vec3') => void)
  4:
    ((entity: 'entity') => void) &
    ((entity: 'entity', anchor: 'anchor') => void)
  5:
    ((targets: 'entity', effect: 'effect') => void)
}

type PARSERS_ID<returnType, k extends number> = (
  k extends keyof PARSERS_ID_MAP<returnType> ?
    PARSERS_ID_MAP<returnType>[k] :
    never
)

// Generic types //

type ROOT_NODE = {
  type: 'root',
  children: {
    [command: string]: FUNCTION_NODE | OBJECT_NODE
  }
}

type FUNCTION_NODE = {
  type: 'function',
  children: ARGUMENTS_NODE[]
}

type OBJECT_NODE = {
  type: 'object',
  children: {
    [command: string]: FUNCTION_NODE | OBJECT_NODE
  }
}

type ARGUMENTS_NODE = {
  type: 'arguments',
  prefixes?: string[],
  arguments: {parser: string, name: string, properties?: Record<string, unknown>}[][],
  children?: {
    [command: string]: FUNCTION_NODE | OBJECT_NODE
  },
  id: number
}

// Sandstone types //

type SANDSTONE_OBJECT<node extends Pick<ARGUMENTS_NODE, 'children'>> = (
  node extends {children: unknown} ? {
    [subcommand in keyof node['children']]: SANDSTONE_NODE<node['children'][subcommand]>
  } : never
)

type SANDSTONE_FUNCTION_NODE<node extends FUNCTION_NODE> = (
  (
    node['children'] extends {'0': unknown} ?
      PARSERS_ID<SANDSTONE_OBJECT<node['children'][0]>, node['children'][0]['id']> :
      unknown
  ) &
  (
    node['children'] extends {'1': unknown} ?
      PARSERS_ID<SANDSTONE_OBJECT<node['children'][1]>, node['children'][1]['id']> :
      unknown
  )
)

type SANDSTONE_OBJECT_NODE<node extends OBJECT_NODE> = {
  [command in keyof node['children']]: SANDSTONE_NODE<node['children'][command]>
}

type SANDSTONE_NODE<node extends FUNCTION_NODE | OBJECT_NODE> = (
  (node extends FUNCTION_NODE ? SANDSTONE_FUNCTION_NODE<node> : unknown) &
  (node extends OBJECT_NODE ? SANDSTONE_OBJECT_NODE<node> : unknown)
)

type SANDSTONE_ROOT<root extends ROOT_NODE> = {
  [command in keyof root['children']]: SANDSTONE_NODE<root['children'][command]>
}

const sandstone: SANDSTONE_ROOT<COMMANDS_TREE_TYPE> = 0 as any

sandstone.teleport('entity', 'vec3').facing()

sandstone.effect.clear('entity', 'effect')
