import { say } from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'

mcfunction('hello', () => {
  say('Hello world!')
})

saveDatapack('My datapack', { verbose: true })
