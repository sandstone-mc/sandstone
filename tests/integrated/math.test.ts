import { describe, expect } from 'bun:test'
import { test } from './__setup'
import { DataVariable, Float, NBT } from '../../dist/exports/index.js'
import chalk from 'chalk-template'

console.log(chalk`{blue [test]} Registered 20 Tests`)

export function registerMathTests() {
  /**
   * Get the raw mcfunction body for a test result. Returns '' if not
   * found (lets the assertion fail with a readable message).
   */
  const getRaw = (r: unknown, name: string): string => {
    const raw = (r as { raw?: Record<string, string> }).raw
    return raw?.[`integrated_tests:${name}`] ?? ''
  }

  /**
   * Assert the generated mcfunction contains `compute` (i.e. a runtime
   * number provider was emitted). Use for tests where the input
   * can't be folded at compile time (DataPoint, Score, etc.).
   */
  const assertHasCompute = (r: unknown, name: string): void => {
    const raw = getRaw(r, name)
    expect(raw).toContain('compute')
  }

  /**
   * Assert the generated mcfunction does NOT contain `compute` — the
   * whole chain folded to a constant at compile time, so the
   * compiler emitted `set value` instead. Use for tests with
   * all-literal inputs.
   */
  const assertNoCompute = (r: unknown, name: string): void => {
    const raw = getRaw(r, name)
    expect(raw).not.toContain('compute')
  }

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
      assertNoCompute(r, 'math_main_basic')
    }
  )

  test('HandleChainAddMul', 'math_handle_chain_add_mul',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        x.add(_.float(1)).multiply(_.float(2))
        _.return(x)
      })(3).data()

      _.if(out.equals(NBT.float(8)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_handle_chain_add_mul')
    }
  )

  test('HandleSugar', 'math_handle_sugar',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        x['-='](1)
        x['*='](2)
        x['/='](3)
        x['%='](3)
        x['+='](10)
        _.return(x)
      })(4).data()

      _.if(out.equals(NBT.float(12)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_handle_sugar')
    }
  )

  test('HandleUnary', 'math_handle_unary',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        x.negate()
        x.abs()
        x.sqrt()
        _.return(x)
      })(4).data()

      _.if(out.equals(NBT.float(2)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_handle_unary')
    }
  )

  test('CopySemantics', 'math_copy_semantics',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        const orig = _.float(x)
        const copy = _.float(x)
        copy['+='](100)
        _.return(orig)
      })(5).data()

      _.if(out.equals(NBT.float(5)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_copy_semantics')
    }
  )

  test('DSLBinops', 'math_dsl_binops',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_) => {
        _.return(_.modulo(_.divide(_.subtract(_.float(20), _.float(2)), _.float(3)), _.float(4)))
      })().data()

      _.if(out.equals(NBT.float(2)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_dsl_binops')
    }
  )

  test('DSLAggregates', 'math_dsl_aggregates',
    (create, { Test, _ }) => create(() => {
      const sum = _.Math(Float, (_) => {
        _.return(_.sum(_.float(1), _.float(2), _.float(3)))
      })().data()

      const prod = _.Math(Float, (_) => {
        _.return(_.product(_.float(2), _.float(3), _.float(4)))
      })().data()

      const avg = _.Math(Float, (_) => {
        _.return(_.average(_.float(2), _.float(4), _.float(6)))
      })().data()

      _.if(
        _.and(
          sum.equals(NBT.float(6)),
          _.and(prod.equals(NBT.float(24)), avg.equals(NBT.float(4))),
        ),
        () => Test.succeed(),
      ).else(() => Test.fail(sum))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_dsl_aggregates')
    }
  )

  test('DSLPowSqrtAbs', 'math_dsl_pow_sqrt_abs',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_) => {
        _.return(_.abs(_.sqrt(_.exponentiate(_.float(2), _.float(4)))))
      })().data()

      _.if(out.equals(NBT.float(4)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_dsl_pow_sqrt_abs')
    }
  )

  test('DSLRounding', 'math_dsl_rounding',
    (create, { Test, _ }) => create(() => {
      const c = _.Math(Float, (_) => { _.return(_.ceil(_.float(1.2))) })().data()
      const f = _.Math(Float, (_) => { _.return(_.floor(_.float(1.8))) })().data()
      const r = _.Math(Float, (_) => { _.return(_.round(_.float(1.6))) })().data()
      const t = _.Math(Float, (_) => { _.return(_.truncate(_.float(1.9))) })().data()

      _.if(
        _.and(
          c.equals(NBT.float(2)),
          _.and(
            f.equals(NBT.float(1)),
            _.and(r.equals(NBT.float(2)), t.equals(NBT.float(1))),
          ),
        ),
        () => Test.succeed(),
      ).else(() => Test.fail(c))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_dsl_rounding')
    }
  )

  test('DSLTrig', 'math_dsl_trig',
    (create, { Test, _ }) => create(() => {
      const s = _.Math(Float, (_) => { _.return(_.sine(_.float(0))) })().data()
      const c = _.Math(Float, (_) => { _.return(_.cosine(_.float(0))) })().data()

      _.if(
        _.and(s.equals(NBT.float(0)), c.equals(NBT.float(1))),
        () => Test.succeed(),
      ).else(() => Test.fail(s))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_dsl_trig')
    }
  )

  test('ComparisonOps', 'math_comparison_ops',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        _.if(
          _.and(
            _.and(x['<'](5), x['<='](3)),
            _.and(_.and(x['>'](1), x['>='](3)), x['!='](99)),
          ),
          () => { _.return(_.float(1)) },
        ).else(() => { _.return(_.float(0)) })
      })(3).data()

      _.if(out.equals(NBT.float(1)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_comparison_ops')
    }
  )

  test('ConditionCombinators', 'math_condition_combinators',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        _.if(
          _.and(
            _.and(x['>'](1), x['<'](5)),
            _.or(x['<='](0), x['=='](3)),
          ),
          () => { _.return(_.float(1)) },
        ).else(() => { _.return(_.float(0)) })
      })(3).data()

      _.if(out.equals(NBT.float(1)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_condition_combinators')
    }
  )

  test('NotCondition', 'math_not_condition',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        _.if(_.not(x['<'](0)), () => { _.return(_.float(1)) })
          .else(() => { _.return(_.float(0)) })
      })(3).data()

      _.if(out.equals(NBT.float(1)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_not_condition')
    }
  )

  test('MultiCall', 'math_multi_call',
    (create, { Test, _ }) => create(() => {
      const m = _.Math(Float, (_, x: Float) => {
        _.return(x['+='](10))
      })

      const a = m(2).data()
      const b = m(5).data()

      _.if(
        _.and(a.equals(NBT.float(12)), b.equals(NBT.float(15))),
        () => Test.succeed(),
      ).else(() => Test.fail(a))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_multi_call')
    }
  )

  test('MultiInput', 'math_multi_input',
    (create, { Test, _ }) => create(() => {
      const m = _.Math(Float, (_, a: Float, b: Float) => {
        _.return(_.multiply(a, b)['+='](a))
      })

      const out = m(3, 4).data()

      _.if(out.equals(NBT.float(15)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_multi_input')
    }
  )

  test('RecordOutput', 'math_record_output',
    (create, { Test, _ }) => create(() => {
      const m = _.Math({ x: Float, y: Float }, (_, v: Float) => {
        _.return({ x: v, y: _.multiply(v, _.float(2)) })
      })

      const out = m(7)
      const x = out.x.data()
      const y = out.y.data()

      _.if(
        _.and(x.equals(NBT.float(7)), y.equals(NBT.float(14))),
        () => Test.succeed(),
      ).else(() => Test.fail(x))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_record_output')
    }
  )

  test('RecordOutputDataPoint', 'math_record_output_datapoint',
    (create, { Test, _ }) => create(() => {
      const dp = DataVariable(undefined, 'math_record_dp_input')
      dp.set(NBT.float(11))

      const m = _.Math({ x: Float, y: Float }, (_, v: Float) => {
        _.return({ x: v, y: _.multiply(v, _.float(3)) })
      })

      const out = m(dp)
      const x = out.x.data()
      const y = out.y.data()

      _.if(
        _.and(x.equals(NBT.float(11)), y.equals(NBT.float(33))),
        () => Test.succeed(),
      ).else(() => Test.fail(x))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertHasCompute(r, 'math_record_output_datapoint')
    }
  )

  test('MultiInputRecordOutput', 'math_multi_input_record_output',
    (create, { Test, _ }) => create(() => {
      const m = _.Math({ sum: Float, prod: Float }, (_, a: Float, b: Float) => {
        _.return({ sum: _.add(a, b), prod: _.multiply(a, b) })
      })

      const out = m(3, 4)
      const sum = out.sum.data()
      const prod = out.prod.data()

      _.if(
        _.and(sum.equals(NBT.float(7)), prod.equals(NBT.float(12))),
        () => Test.succeed(),
      ).else(() => Test.fail(sum))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_multi_input_record_output')
    }
  )

  test('MultiInputRecordOutputDataPoint', 'math_multi_input_record_output_datapoint',
    (create, { Test, _ }) => create(() => {
      const dpA = DataVariable(undefined, 'math_mir_dp_a')
      dpA.set(NBT.float(5))
      const dpB = DataVariable(undefined, 'math_mir_dp_b')
      dpB.set(NBT.float(6))

      const m = _.Math({ sum: Float, extra: Float }, (_, a: Float, b: Float) => {
        const sum = _.add(a, b)
        const extra = _.multiply(sum, _.multiply(b, _.float(0.1)))
        _.return({ sum, extra })
      })

      const out = m(dpA, dpB)
      const sum = out.sum.data()
      const extra = out.extra.data()

      _.if(
        _.and(sum.equals(NBT.float(11)), extra.equals(NBT.float(6.6))),
        () => Test.succeed(),
      ).else(() => Test.fail([sum, extra]))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertHasCompute(r, 'math_multi_input_record_output_datapoint')
    }
  )

  test('DataPointInput', 'math_datapoint_input',
    (create, { Test, _ }) => create(() => {
      const dp = DataVariable(undefined, 'math_dp_input')
      dp.set(NBT.float(21))

      const m = _.Math(Float, (_, x: Float) => {
        _.return(x.multiply(_.float(2)))
      })

      const out = m(dp).data()

      _.if(out.equals(NBT.float(42)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertHasCompute(r, 'math_datapoint_input')
    }
  )

  test('IfElseIfElse', 'math_if_elseif_else',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        _.if(x['<'](0), () => { _.return(_.float(1)) })
          .elseIf(x['=='](0), () => { _.return(_.float(2)) })
          .else(() => { _.return(_.float(3)) })
      })(5).data()

      _.if(out.equals(NBT.float(3)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_if_elseif_else')
    }
  )

  test('IfEarlyReturn', 'math_if_early_return',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Float, (_, x: Float) => {
        _.if(x['>'](10), () => { _.return(_.float(100)) })
          .else(() => { _.return(_.float(0)) })
      })(20).data()

      _.if(out.equals(NBT.float(100)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_if_early_return')
    }
  )
}
