import { bossbar } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Bossbar Command', () => {
  it('should generate bossbar add command', async () => {
    await compareSingleOutputText(() => {
      bossbar.add('test:bar', 'Test Boss Bar')
    }, ['bossbar add test:bar "Test Boss Bar"'])
  })

  it('should generate bossbar get command', async () => {
    await compareSingleOutputText(() => {
      bossbar.get('test:bar', 'value')
    }, ['bossbar get test:bar value'])
  })

  it('should generate bossbar list command', async () => {
    await compareSingleOutputText(() => {
      bossbar.list()
    }, ['bossbar list'])
  })

  it('should generate bossbar remove command', async () => {
    await compareSingleOutputText(() => {
      bossbar.remove('test:bar')
    }, ['bossbar remove test:bar'])
  })

  it('should generate bossbar set color command', async () => {
    await compareSingleOutputText(() => {
      bossbar.set('test:bar').color('red')
    }, ['bossbar set test:bar color red'])
  })

  it('should generate bossbar set max command', async () => {
    await compareSingleOutputText(() => {
      bossbar.set('test:bar').max(100)
    }, ['bossbar set test:bar max 100'])
  })

  it('should generate bossbar set name command', async () => {
    await compareSingleOutputText(() => {
      bossbar.set('test:bar').name('New Name')
    }, ['bossbar set test:bar name "New Name"'])
  })

  it('should generate bossbar set players command', async () => {
    await compareSingleOutputText(() => {
      bossbar.set('test:bar').players('@a')
    }, ['bossbar set test:bar players @a'])
  })

  it('should generate bossbar set style command', async () => {
    await compareSingleOutputText(() => {
      bossbar.set('test:bar').style('notched_10')
    }, ['bossbar set test:bar style notched_10'])
  })

  it('should generate bossbar set value command', async () => {
    await compareSingleOutputText(() => {
      bossbar.set('test:bar').value(50)
    }, ['bossbar set test:bar value 50'])
  })

  it('should generate bossbar set visible command', async () => {
    await compareSingleOutputText(() => {
      bossbar.set('test:bar').visible(true)
    }, ['bossbar set test:bar visible true'])
  })
})
