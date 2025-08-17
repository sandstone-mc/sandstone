import { title } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Title Command', () => {
  it('should generate title command', async () => {
    await compareSingleOutputText(() => {
      title('@a').title('Game Started!')
    }, ['title @a title "Game Started!"'])
  })

  it('should generate title subtitle command', async () => {
    await compareSingleOutputText(() => {
      title('@p').subtitle('Subtitle Text')
    }, ['title @p subtitle "Subtitle Text"'])
  })

  it('should generate title actionbar command', async () => {
    await compareSingleOutputText(() => {
      title('@p').actionbar('Action Bar Text')
    }, ['title @p actionbar "Action Bar Text"'])
  })

  it('should generate title clear command', async () => {
    await compareSingleOutputText(() => {
      title('@p').clear()
    }, ['title @p clear'])
  })

  it('should generate title reset command', async () => {
    await compareSingleOutputText(() => {
      title('@p').reset()
    }, ['title @p reset'])
  })

  it('should generate title times command', async () => {
    await compareSingleOutputText(() => {
      title('@p').times(10, 70, 20)
    }, ['title @p times 10 70 20'])
  })
})
