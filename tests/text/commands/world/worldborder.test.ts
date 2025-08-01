import { abs, worldborder } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Worldborder Command', () => {
  it('should generate worldborder get command', async () => {
    await compareSingleOutputText(() => {
      worldborder.get()
    }, ['worldborder get'])
  })

  it('should generate worldborder set command', async () => {
    await compareSingleOutputText(() => {
      worldborder.set(100)
    }, ['worldborder set 100'])
  })

  it('should generate worldborder set with time command', async () => {
    await compareSingleOutputText(() => {
      worldborder.set(1000, 60)
    }, ['worldborder set 1000 60'])
  })

  it('should generate worldborder add command', async () => {
    await compareSingleOutputText(() => {
      worldborder.add(100)
    }, ['worldborder add 100'])
  })

  it('should generate worldborder add with time command', async () => {
    await compareSingleOutputText(() => {
      worldborder.add(100, 30)
    }, ['worldborder add 100 30'])
  })

  it('should generate worldborder center command', async () => {
    await compareSingleOutputText(() => {
      worldborder.center(abs(0, 0))
    }, ['worldborder center 0 0'])
  })

  it('should generate worldborder damage amount command', async () => {
    await compareSingleOutputText(() => {
      worldborder.damage.amount(2)
    }, ['worldborder damage amount 2'])
  })

  it('should generate worldborder damage buffer command', async () => {
    await compareSingleOutputText(() => {
      worldborder.damage.buffer(5)
    }, ['worldborder damage buffer 5'])
  })

  it('should generate worldborder warning distance command', async () => {
    await compareSingleOutputText(() => {
      worldborder.warning.distance(10)
    }, ['worldborder warning distance 10'])
  })

  it('should generate worldborder warning time command', async () => {
    await compareSingleOutputText(() => {
      worldborder.warning.time(15)
    }, ['worldborder warning time 15'])
  })
})
