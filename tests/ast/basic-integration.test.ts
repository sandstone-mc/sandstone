import { MCFunction, sandstonePack, say } from 'sandstone'
import { SayCommandNode } from 'sandstone/commands'
import type { CommandNode, Node } from 'sandstone/core'
import { describe, expect, it } from 'vitest'
import { compareSingleFunctionNodes, createCommandNode } from '../utils'

describe('Basic Command Tests', () => {
  it('should create a say command node with correct properties', async () => {
    compareSingleFunctionNodes(() => {
      say('Hello, world!')
    }, [createCommandNode(SayCommandNode, 'Hello, world!')])
  })

  it('should create multiple says command nodes with correct properties', async () => {
    compareSingleFunctionNodes(() => {
      say('Hello, world!')
      say('This is a test.')
    }, [createCommandNode(SayCommandNode, 'Hello, world!'), createCommandNode(SayCommandNode, 'This is a test.')])
  })
})
