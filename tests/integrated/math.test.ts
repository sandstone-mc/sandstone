import { describe, expect } from 'bun:test'
import { test } from './__setup'
import { Float, NBT } from '../../dist/exports/index.js'
import chalk from 'chalk-template'

console.log(chalk`{blue [test]} Registered 1 Test`)

export function registerMathTests() {
  /** Main */
  describe.concurrent('math.test.ts @ main', () => {
    test('Basic', 'math_main_basic',
      (create, { Test, _ }) => create(() => {
        const foo = _.Math(Float, (_, funny: Float) => {
          funny.add(_.float(2))
          _.return(funny)
        })(2).data()

        _.if(foo.equals(NBT.float(4)), () => Test.succeed())
        .else(() => Test.fail(foo))
      }),
      async (r) => {
        expect(r.passed).toBe(true)
      }
    )
  })
}