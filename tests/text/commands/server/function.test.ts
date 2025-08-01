import { functionCmd } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Function Command', () => {
  it('should generate function command correctly', async () => {
    await compareSingleOutputText(() => {
      functionCmd('minecraft:my_function')
    }, ['function minecraft:my_function'])
  })

  it('should generate function command with NBT params', async () => {
    await compareSingleOutputText(() => {
      functionCmd('minecraft:test', { value: 42, name: 'test' })
    }, ["function minecraft:test {value:42,name:'test'}"])
  })

  it('should generate function command with data path', async () => {
    await compareSingleOutputText(() => {
      functionCmd('minecraft:test', 'with', 'storage', 'minecraft:temp', 'data')
    }, ['function minecraft:test with storage minecraft:temp data'])
  })
})
