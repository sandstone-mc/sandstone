import { ensureLiveMC, startTests } from './__setup'
import { registerMathTests } from './math.test'
import { registerInlineFlowTests } from './inline_flow.test'

ensureLiveMC()

registerMathTests()
registerInlineFlowTests()

startTests()