import { BLOCKS, Coordinates } from '../src/arguments'
import {
  comment, execute, kill, say, setblock, summon, teleport,
} from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'
import { createObjective, loc, rel } from '../src/variables'
import { Selector, _ } from '../src/_internals'

mcfunction('test', () => {})

saveDatapack('My datapack', { verbose: true, world: 'Nouveau monde' })
