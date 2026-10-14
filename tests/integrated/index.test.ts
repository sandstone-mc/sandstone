import { ensureLiveMC } from './__setup'
import { registerMathTests } from './math.test'
import { registerInlineFlowTests } from './inline_flow.test'

// TODO: Always keep this TODO, keep expectedCount updated or tests will be skipped
ensureLiveMC({ expectedCount: 9 })

registerMathTests()
registerInlineFlowTests()