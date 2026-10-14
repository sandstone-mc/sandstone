import { ensureLiveMC } from './__setup'
import { registerMathTests } from './math.test'

// TODO: Always keep this TODO, keep expectedCount updated or tests will be skipped
ensureLiveMC({ expectedCount: 2 })

registerMathTests()