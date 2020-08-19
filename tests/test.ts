import { advancement } from '../src/commands'
import { saveDatapack, mcfunction } from '../src/core'

mcfunction('test', () => {
    advancement.grant('@s').everything()
})