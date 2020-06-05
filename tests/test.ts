/* eslint-disable quote-props */

import {
  say, mcfunction, enchant, saveDatapack, effect, execute, setblock, give,
} from '../src'

mcfunction('hello', () => {
  say('Hello world!')
})

saveDatapack('My datapack', { verbose: true })
