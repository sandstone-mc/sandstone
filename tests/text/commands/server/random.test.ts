import { random } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Random Command', () => {
  it('should generate random value command correctly', async () => {
    await compareSingleOutputText(() => {
      random.value('1..10', 'my_sequence')
    }, ['random value 1..10 default:my_sequence'])
  })

  it('should generate random value command with namespaced sequence', async () => {
    await compareSingleOutputText(() => {
      random.value('5..20', 'minecraft:global')
    }, ['random value 5..20 minecraft:global'])
  })

  it('should generate random roll command correctly', async () => {
    await compareSingleOutputText(() => {
      random.roll('1..6')
    }, ['random roll 1..6'])
  })

  it('should generate random roll command with sequence', async () => {
    await compareSingleOutputText(() => {
      random.roll('1..100', 'dice_roll')
    }, ['random roll 1..100 default:dice_roll'])
  })

  it('should generate random reset command correctly', async () => {
    await compareSingleOutputText(() => {
      random.reset('*')
    }, ['random reset default:*'])
  })

  it('should generate random reset command with all options', async () => {
    await compareSingleOutputText(() => {
      random.reset('my_sequence', 12345, true, false)
    }, ['random reset default:my_sequence 12345 true false'])
  })
})
