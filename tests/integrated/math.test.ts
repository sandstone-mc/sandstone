import { describe, expect } from 'bun:test'
import { test } from './__setup'
import { DataVariable, Float, Integer, NBT } from '../../dist/exports/index.js'
import chalk from 'chalk-template'

console.log(chalk`{blue [test]} Registered 32 Tests`)

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

  /**
   * Assert the generated mcfunction reads its provider through the
   * INTEGER context — `compute default integer <provider>` rather
   * than the float one. An integer math block must never route
   * through MC's float provider family.
   */
  const assertIntegerCompute = (r: unknown, name: string): void => {
    const raw = getRaw(r, name)
    expect(raw).toContain('compute')
    expect(raw).toContain('integer')
    expect(raw).not.toContain('float')
  }

  /**
   * Assert the generated mcfunction writes a folded constant with an
   * INT NBT tag — `set value 5i`, never `set value 5.0f`. A folded
   * integer computation must keep its integer kind all the way down
   * to the emitted tag.
   */
  const assertSetIntValue = (r: unknown, name: string, value: number): void => {
    expect(getRaw(r, name)).toContain(`set value ${value}i`)
  }

  /**
   * The body of the INTEGER number-provider resource the generated
   * mcfunction reads. Resolved from the command itself (the provider
   * id in `compute default integer <id>`) so the lookup picks THIS
   * test's provider rather than another test's.
   */
  const getIntProvider = (r: unknown, name: string): string => {
    const raw = getRaw(r, name)
    const id = raw.match(/compute default integer ([^\s]+)/)?.[1]
    if (!id) return ''
    const files = (r as { files?: Record<string, string> }).files ?? {}
    const entry = Object.entries(files).find(([path]) => path.endsWith(`/${id.split(':')[1]}.json`))
    return entry?.[1] ?? ''
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

  // ---------------------------------------------------------------------------
  // Integer math.
  //
  // An integer math block runs entirely in MC's INTEGER provider
  // context (`minecraft:context_int_provider`) — no float provider, no
  // float literal, no conversion. Its inputs are an `NBT.int(…)`
  // constant, an integer-typed DataPoint, or a Score.
  // ---------------------------------------------------------------------------

  test('IntegerBasic', 'math_integer_basic',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Integer, (math, x: Integer) => {
        x.add(math.integer(2))
        math.return(x)
      })(NBT.int(3)).data()

      _.if(out.equals(NBT.int(5)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_integer_basic')
      assertSetIntValue(r, 'math_integer_basic', 5)
    }
  )

  test('IntegerChain', 'math_integer_chain',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Integer, (math, x: Integer) => {
        x.add(math.integer(2)).multiply(math.integer(3))
        math.return(x)
      })(NBT.int(4)).data()

      _.if(out.equals(NBT.int(18)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_integer_chain')
      assertSetIntValue(r, 'math_integer_chain', 18)
    }
  )

  test('IntegerArithmetic', 'math_integer_arithmetic',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Integer, (math, x: Integer) => {
        // (20 - 2) = 18, then floored division 18 / 5 = 3.
        const eighteen = math.subtract(x, math.integer(2))
        math.return(math.divide(eighteen, math.integer(5)))
      })(NBT.int(20)).data()

      _.if(out.equals(NBT.int(3)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_integer_arithmetic')
      assertSetIntValue(r, 'math_integer_arithmetic', 3)
    }
  )

  test('IntegerDataPointInput', 'math_integer_datapoint_input',
    (create, { Test, _ }) => create(() => {
      const dp = DataVariable(undefined, 'math_int_dp_input').integer()
      dp.set(NBT.int(21))

      const out = _.Math(Integer, (math, x: Integer) => {
        math.return(x.multiply(math.integer(2)))
      })(dp).data()

      _.if(out.equals(NBT.int(42)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertIntegerCompute(r, 'math_integer_datapoint_input')
    }
  )

  test('IntegerScoreInput', 'math_integer_score_input',
    (create, pack) => create(() => {
      const score = pack.Variable(7, 'math_int_score')

      const out = pack._.Math(Integer, (math, x: Integer) => {
        math.return(x.add(math.integer(1)))
      })(score).data()

      pack._.if(out.equals(NBT.int(8)), () => pack.Test.succeed())
      .else(() => pack.Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertIntegerCompute(r, 'math_integer_score_input')
    }
  )

  test('IntegerRecordOutput', 'math_integer_record_output',
    (create, { Test, _ }) => create(() => {
      const out = _.Math({ x: Integer, y: Integer }, (math, v: Integer) => {
        math.return({ x: v, y: math.multiply(v, math.integer(2)) })
      })(NBT.int(7))

      _.if(
        _.and(out.x.data().equals(NBT.int(7)), out.y.data().equals(NBT.int(14))),
        () => Test.succeed(),
      ).else(() => Test.fail(out.x.data()))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_integer_record_output')
      assertSetIntValue(r, 'math_integer_record_output', 7)
      assertSetIntValue(r, 'math_integer_record_output', 14)
    }
  )

  test('IntegerRecordOutputDataPoint', 'math_integer_record_output_datapoint',
    (create, { Test, _ }) => create(() => {
      const dp = DataVariable(undefined, 'math_int_record_dp').integer()
      dp.set(NBT.int(11))

      const out = _.Math({ x: Integer, y: Integer }, (math, v: Integer) => {
        math.return({ x: v, y: math.multiply(v, math.integer(3)) })
      })(dp)

      _.if(
        _.and(out.x.data().equals(NBT.int(11)), out.y.data().equals(NBT.int(33))),
        () => Test.succeed(),
      ).else(() => Test.fail(out.x.data()))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertIntegerCompute(r, 'math_integer_record_output_datapoint')
    }
  )

  test('IntegerMultiCall', 'math_integer_multi_call',
    (create, { Test, _ }) => create(() => {
      const m = _.Math(Integer, (math, x: Integer) => {
        math.return(x.add(math.integer(10)))
      })

      const a = m(NBT.int(2)).data()
      const b = m(NBT.int(5)).data()

      _.if(
        _.and(a.equals(NBT.int(12)), b.equals(NBT.int(15))),
        () => Test.succeed(),
      ).else(() => Test.fail(a))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_integer_multi_call')
      assertSetIntValue(r, 'math_integer_multi_call', 12)
      assertSetIntValue(r, 'math_integer_multi_call', 15)
    }
  )

  test('IntegerAverage', 'math_integer_average',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Integer, (math, x: Integer) => {
        math.return(math.average(x, math.integer(4), math.integer(6)))
      })(NBT.int(2)).data()

      _.if(out.equals(NBT.int(4)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      // MC's integer `avg` truncates the sum by the count — 12 / 3
      // folds to 4.
      assertNoCompute(r, 'math_integer_average')
      assertSetIntValue(r, 'math_integer_average', 4)
    }
  )

  test('IntegerAverageDataPoint', 'math_integer_average_datapoint',
    (create, { Test, _ }) => create(() => {
      const dp = DataVariable(undefined, 'math_int_avg_dp').integer()
      dp.set(NBT.int(2))

      const out = _.Math(Integer, (math, x: Integer) => {
        math.return(math.average(x, math.integer(4), math.integer(6)))
      })(dp).data()

      _.if(out.equals(NBT.int(4)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      // Not foldable — MC's integer `avg` provider computes it.
      assertIntegerCompute(r, 'math_integer_average_datapoint')
      expect(getIntProvider(r, 'math_integer_average_datapoint')).toContain('"type": "avg"')
    }
  )

  test('IntegerDivideModes', 'math_integer_divide_modes',
    (create, { Test, _ }) => create(() => {
      // -7 / 2 and -7 % 2 are where the two modes differ:
      //   floored  → floor_div = -4, floor_mod =  1
      //   truncated → div      = -3, mod      = -1
      const out = _.Math({
        floor_div: Integer,
        trunc_div: Integer,
        floor_mod: Integer,
        trunc_mod: Integer,
      }, (math, x: Integer) => {
        math.return({
          floor_div: math.divide(x, math.integer(2)),
          trunc_div: math.divide(x, math.integer(2), false),
          floor_mod: math.modulo(x, math.integer(2)),
          trunc_mod: math.modulo(x, math.integer(2), false),
        })
      })(NBT.int(-7))

      _.if(
        _.and(
          out.floor_div.data().equals(NBT.int(-4)),
          _.and(
            out.trunc_div.data().equals(NBT.int(-3)),
            _.and(
              out.floor_mod.data().equals(NBT.int(1)),
              out.trunc_mod.data().equals(NBT.int(-1)),
            ),
          ),
        ),
        () => Test.succeed(),
      ).else(() => Test.fail(out.floor_div.data()))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertNoCompute(r, 'math_integer_divide_modes')
      assertSetIntValue(r, 'math_integer_divide_modes', -4)
      assertSetIntValue(r, 'math_integer_divide_modes', -3)
      assertSetIntValue(r, 'math_integer_divide_modes', 1)
      assertSetIntValue(r, 'math_integer_divide_modes', -1)
    }
  )

  test('IntegerDivideModesDataPoint', 'math_integer_divide_modes_datapoint',
    (create, { Test, _ }) => create(() => {
      const dp = DataVariable(undefined, 'math_int_div_dp').integer()
      dp.set(NBT.int(-7))

      const out = _.Math({
        floor_div: Integer,
        trunc_div: Integer,
        floor_mod: Integer,
        trunc_mod: Integer,
      }, (math, x: Integer) => {
        math.return({
          floor_div: math.divide(x, math.integer(2)),
          trunc_div: math.divide(x, math.integer(2), false),
          floor_mod: math.modulo(x, math.integer(2)),
          trunc_mod: math.modulo(x, math.integer(2), false),
        })
      })(dp)

      _.if(
        _.and(
          out.floor_div.data().equals(NBT.int(-4)),
          _.and(
            out.trunc_div.data().equals(NBT.int(-3)),
            _.and(
              out.floor_mod.data().equals(NBT.int(1)),
              out.trunc_mod.data().equals(NBT.int(-1)),
            ),
          ),
        ),
        () => Test.succeed(),
      ).else(() => Test.fail(out.floor_div.data()))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      // The runtime path — MC's own `floor_div` / `div` / `floor_mod`
      // / `mod` int providers compute the four results.
      assertIntegerCompute(r, 'math_integer_divide_modes_datapoint')
    }
  )

  test('IntegerScoreOutput', 'math_integer_score_output',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Integer, (math, x: Integer) => {
        x.add(math.integer(2))
        math.return(x)
      })(NBT.int(3))

      // The score is filled from the math block's result path, after
      // the math has run.
      const score = out.score()

      _.if(score.equals(5), () => Test.succeed())
      .else(() => Test.fail(out.data()))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
    }
  )

  test('IntegerRandom', 'math_integer_random',
    (create, { Test, _ }) => create(() => {
      const out = _.Math(Integer, (math, x: Integer) => {
        math.return(math.random({ min: math.integer(1), max: x }, 'integer'))
      })(NBT.int(6)).data()

      // The random's VALUE isn't deterministic — assert it landed in
      // the requested range by checking it isn't the out-of-range
      // zero the storage defaults to.
      _.if(out.equals(NBT.int(0)), () => Test.fail(out))
      .else(() => Test.succeed())
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      assertIntegerCompute(r, 'math_integer_random')
      // MC's `uniform` int provider, bounded by the requested range.
      expect(getIntProvider(r, 'math_integer_random')).toContain('"type": "uniform"')
      expect(getIntProvider(r, 'math_integer_random')).toContain('"min": 1')
      expect(getIntProvider(r, 'math_integer_random')).toContain('"max": 6')
    }
  )

  // ---------------------------------------------------------------------------
  // Numeric coalescing — `from_int` / `from_float`.
  //
  // MC's two provider families are separate; `from_int` (float ← int)
  // and `from_float` (int ← float) are the only bridges. A mismatched
  // operand is bridged where it's consumed, so the chain stays in one
  // numeric context.
  // ---------------------------------------------------------------------------

  test('IntegerFloatOperand', 'math_integer_float_operand',
    (create, { Test, _ }) => create(() => {
      const floatDp = DataVariable(undefined, 'math_int_float_operand')
      floatDp.set(NBT.float(2.5))
      const intDp = DataVariable(undefined, 'math_int_operand_base').integer()
      intDp.set(NBT.int(5))

      const out = _.Math(Integer, (math, x: Integer) => {
        const y = math.float(floatDp)
        math.return(x.add(y))
      })(intDp).data()

      // MC's `from_float` truncates toward zero: 2.5 → 2, so 5 + 2 = 7.
      _.if(out.equals(NBT.int(7)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      // The chain itself runs in the INTEGER context — the float
      // operand is bridged INSIDE the provider, so the compute
      // command is still `compute default integer`.
      expect(getRaw(r, 'math_integer_float_operand')).toContain('compute default integer')
      expect(getIntProvider(r, 'math_integer_float_operand')).toContain('"type": "from_float"')
    }
  )

  test('FloatIntegerOperand', 'math_float_integer_operand',
    (create, { Test, _ }) => create(() => {
      const intDp = DataVariable(undefined, 'math_float_int_operand').integer()
      intDp.set(NBT.int(7))
      const floatDp = DataVariable(undefined, 'math_float_operand_base')
      floatDp.set(NBT.float(1.5))

      const out = _.Math(Float, (math, x: Float) => {
        const y = math.integer(intDp)
        math.return(x.add(y))
      })(floatDp).data()

      // MC's `from_int` widens exactly: 7 → 7.0, so 1.5 + 7.0 = 8.5.
      _.if(out.equals(NBT.float(8.5)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      const raw = getRaw(r, 'math_float_integer_operand')
      expect(raw).toContain('compute')
      expect(raw).toContain('float')
      const files = (r as { files?: Record<string, string> }).files ?? {}
      const id = raw.match(/compute default float ([^\s]+)/)?.[1]
      const entry = Object.entries(files).find(([path]) => path.endsWith(`/${id?.split(':')[1]}.json`))
      expect(entry?.[1] ?? '').toContain('"type": "from_int"')
    }
  )

  test('FloatScoreInput', 'math_float_score_input',
    (create, pack) => create(() => {
      const score = pack.Variable(7, 'math_float_score')

      const out = pack._.Math(Float, (math, x: Float) => {
        math.return(x.multiply(math.float(0.5)))
      })(score).data()

      // The score holds an integer; the float chain bridges it with
      // `from_int` — 7 → 7.0, then 7.0 × 0.5 = 3.5.
      pack._.if(out.equals(NBT.float(3.5)), () => pack.Test.succeed())
      .else(() => pack.Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      const raw = getRaw(r, 'math_float_score_input')
      expect(raw).toContain('compute default float')
    }
  )

  test('IntegerFloatOperandTruncates', 'math_integer_float_operand_truncates',
    (create, { Test, _ }) => create(() => {
      const floatDp = DataVariable(undefined, 'math_int_float_trunc')
      floatDp.set(NBT.float(-2.5))
      const intDp = DataVariable(undefined, 'math_int_trunc_base').integer()
      intDp.set(NBT.int(5))

      const out = _.Math(Integer, (math, x: Integer) => {
        const y = math.float(floatDp)
        math.return(x.add(y))
      })(intDp).data()

      // The tower makes the sum float: 5.0 + (-2.5) = 2.5, and the
      // integer block's boundary truncates toward zero: 2 — not 3
      // (which is what truncating the OPERAND first would give).
      _.if(out.equals(NBT.int(2)), () => Test.succeed())
      .else(() => Test.fail(out))
    }),
    async (r) => {
      expect(r.passed).toBe(true)
      expect(getRaw(r, 'math_integer_float_operand_truncates')).toContain('compute default integer')
      expect(getIntProvider(r, 'math_integer_float_operand_truncates')).toContain('"type": "from_float"')
    }
  )
}
