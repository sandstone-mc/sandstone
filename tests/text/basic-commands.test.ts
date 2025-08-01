import { MCFunction, sandstonePack, say } from 'sandstone'
import { SayCommandNode } from 'sandstone/commands'
import type { CommandNode, Node } from 'sandstone/core'
import { describe, expect, it } from 'vitest'
import { compareOutputText, compareSingleOutputText } from '../utils'

describe('Basic Command Tests', () => {
  it('should create a proper say command', async () => {
    await compareSingleOutputText(() => {
      say('Hello, world!')
    }, ['say Hello, world!'])
  })

  it('should create multiple say commands', async () => {
    await compareSingleOutputText(() => {
      say('One')
      say('Two')
      say('Three')
    }, ['say One', 'say Two', 'say Three'])
  })
})
