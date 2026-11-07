import { describe, expect, test } from 'bun:test'
import { Float, Integer, NBT } from '../dist/exports/index.js'
import { compile, mcfunctionBody } from './utils/index.js'

describe('Math output handles', () => {
  // A score holds an integer, so `score()` only makes sense on an
  // integer output — the float handle doesn't offer it at all (neither
  // in the types nor at runtime).
  test('score() exists on the integer handle only', () => {
    expect(Object.getOwnPropertyNames(Integer.prototype)).toContain('score')
    expect(Object.getOwnPropertyNames(Float.prototype)).not.toContain('score')
  })
})

describe('Math.toProvider', () => {
  const providerJson = (out: Map<string, string>, family: string): string => {
    const entry = [...out.entries()].find(([path]) => path.includes(`${family}/`))
    return entry?.[1] ?? ''
  }

  test('an integer math block becomes one int provider', () => {
    const out = compile('math_to_provider_int', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.multiply(math.integer(2)))
        }).toProvider(pack.DataVariable(undefined, 'dp_in').integer())
      })
    })

    const json = providerJson(out, 'context_int_provider')
    // The whole chain is ONE nested provider — no intermediate storage.
    expect(json).toContain('"type": "mul"')
    expect(json).toContain('"type": "storage"')
    expect(json).toContain('dp_in')
    expect(json).not.toContain('_h_')
  })

  test('a float math block becomes one float provider', () => {
    const out = compile('math_to_provider_float', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Float, (math, x: Float) => {
          math.return(x.multiply(math.float(2)))
        }).toProvider(pack.DataVariable(undefined, 'dp_in_float'))
      })
    })

    const json = providerJson(out, 'context_float_provider')
    expect(json).toContain('"type": "mul"')
    expect(json).toContain('"type": "storage"')
    expect(json).not.toContain('_h_')
  })

  test('a record output has no provider equivalent', () => {
    expect(() => compile('math_to_provider_record', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math({ x: Float, y: Float }, (math, x: Float) => {
          math.return({ x, y: x })
        }).toProvider()
      })
    })).toThrow(/single number provider/)
  })
})

describe('Math integer operands', () => {
  // A bare number operand is a real literal in the AST — it takes the
  // receiving chain's kind, so an integer chain gets an integer literal.
  test('a bare number is an integer operand', () => {
    const out = compile('int_bare_operand', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(2).multiply(3))
        })(NBT.int(5))
      })
    })

    const body = mcfunctionBody(out, 'f')
    // (5 + 2) * 3 — the bare numbers are real literals in the AST, and
    // the whole chain folds to an integer constant.
    expect(body).toContain('21i')
  })

  test('a fractional number is rejected in an integer chain', () => {
    expect(() => compile('int_fractional_operand', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(2.5))
        })(NBT.int(5))
      })
    })).toThrow(/not a whole number/)
  })
})

describe('Math numeric coalescing', () => {
  const providerJson = (out: Map<string, string>, family: string): string => {
    const entry = [...out.entries()].find(([path]) => path.includes(`${family}/`))
    return entry?.[1] ?? ''
  }

  // MC's two provider families are separate — `from_int` (float ←
  // int) and `from_float` (int ← float) are the only bridges. A
  // mismatched operand is bridged where it's consumed, so the chain
  // stays in one numeric context.
  test('a float chain bridges an integer operand with from_int', () => {
    const out = compile('coalesce_from_int', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Float, (math, x: Float) => {
          const y = math.integer(pack.DataVariable(undefined, 'dp_i'))
          math.return(x.add(y))
        })(pack.DataVariable(undefined, 'dp_f'))
      })
    })

    const json = providerJson(out, 'context_float_provider')
    expect(json).toContain('"type": "add"')
    expect(json).toContain('"type": "from_int"')
  })

  test('an integer chain bridges a float operand with from_float', () => {
    const out = compile('coalesce_from_float', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          const y = math.float(pack.DataVariable(undefined, 'dp_f'))
          math.return(x.add(y))
        })(pack.DataVariable(undefined, 'dp_i'))
      })
    })

    const json = providerJson(out, 'context_int_provider')
    expect(json).toContain('"type": "add"')
    expect(json).toContain('"type": "from_float"')
  })

  // MC's `from_float` truncates TOWARD ZERO — verified live against
  // the server: `from_float(-2.5)` is `-2`, not `-3`.
  test('a folded conversion truncates toward zero', () => {
    const out = compile('coalesce_fold', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(math.float(2.5)))
        })(NBT.int(5))
      })
    })

    // The tower makes the whole sum float: 5.0 + 2.5 = 7.5, and the
    // integer block's boundary truncates it to 7.
    expect(mcfunctionBody(out, 'f')).toContain('set value 7i')
  })

  test('a folded negative conversion truncates toward zero', () => {
    const out = compile('coalesce_fold_negative', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(math.float(-2.5)))
        })(NBT.int(5))
      })
    })

    // 5.0 + (-2.5) = 2.5, and the integer block's boundary truncates
    // toward zero: 2 — not 3 (which is what truncating the OPERAND
    // first would give).
    expect(mcfunctionBody(out, 'f')).toContain('set value 2i')
  })
})

describe('Math score coalescing', () => {
  const providerJson = (out: Map<string, string>, family: string): string => {
    const entry = [...out.entries()].find(([path]) => path.includes(`${family}/`))
    return entry?.[1] ?? ''
  }

  // A score holds an INTEGER, and MC's float provider family has no
  // `score` provider at all — so a score read in the float context
  // is bridged by `from_int`.
  test('a score read in a float chain is bridged with from_int', () => {
    const out = compile('coalesce_score', (pack) => {
      pack.MCFunction('f', () => {
        const score = pack.Variable(7, 'math_score')
        pack._.Math(Float, (math, x: Float) => {
          math.return(x.multiply(math.float(0.5)))
        })(score)
      })
    })

    const json = providerJson(out, 'context_float_provider')
    expect(json).toContain('"type": "mul"')
    expect(json).toContain('"type": "from_int"')
    expect(json).toContain('"type": "score"')
  })

  test('an integer chain reads the score natively', () => {
    const out = compile('coalesce_score_int', (pack) => {
      pack.MCFunction('f', () => {
        const score = pack.Variable(7, 'math_score_int')
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(math.integer(1)))
        })(score)
      })
    })

    const json = providerJson(out, 'context_int_provider')
    expect(json).toContain('"type": "score"')
    expect(json).not.toContain('"type": "from_int"')
  })
})

describe('Math integer range', () => {
  // Minecraft's integer number providers use Java's 32-bit `int`, and an
  // out-of-range integer silently evaluates to 0 at runtime — so
  // Sandstone rejects it at compile time instead of folding a value
  // that disagrees with what the runtime computes.
  test('an out-of-range integer literal is rejected', () => {
    expect(() => compile('int_overflow_literal', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math) => {
          math.return(math.integer(3000000000))
        })()
      })
    })).toThrow(/out of range/)
  })

  test('an integer computation that overflows is rejected', () => {
    expect(() => compile('int_overflow_fold', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(math.integer(2147483647)))
        })(NBT.int(1))
      })
    })).toThrow(/out of range/)
  })

  test('an out-of-range integer input is rejected', () => {
    expect(() => compile('int_overflow_input', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x)
        })(NBT.int(3000000000))
      })
    })).toThrow(/out of range/)
  })

  test('an in-range integer is accepted', () => {
    expect(() => compile('int_in_range', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(math.integer(2147483646)))
        })(NBT.int(1))
      })
    })).not.toThrow()
  })
})

describe('Math branch coverage', () => {
  // Every path through the block's control flow must produce a
  // value — the end of the block is not one. A branch that leaves a
  // path uncovered is a compile error, not a silent zero.
  test('an if with no else is rejected', () => {
    expect(() => compile('coverage_no_else', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_cov_1')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(1)), () => { math.return(math.integer(5)) })
        })(dp.integer())
      })
    })).toThrow(/leaves a path with no value/)
  })

  test('an elseIf chain with no final else is rejected', () => {
    expect(() => compile('coverage_no_final_else', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_cov_2')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(1)), () => { math.return(math.integer(5)) })
            .elseIf(x.equals(NBT.int(2)), () => { math.return(math.integer(6)) })
        })(dp.integer())
      })
    })).toThrow(/leaves a path with no value/)
  })

  test('a switch with no default is rejected', () => {
    expect(() => compile('coverage_no_default', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_cov_3')
        pack._.Math(Integer, (math, x: Integer) => {
          math.switch(x, [
            ['case', 1, () => { math.return(math.integer(5)) }],
          ])
        })(dp.integer())
      })
    })).toThrow(/leaves a path with no value/)
  })

  test('a branch with no return and no else is rejected', () => {
    expect(() => compile('coverage_no_return', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_cov_4')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(1)), () => { x.add(NBT.int(1)) })
        })(dp.integer())
      })
    })).toThrow(/leaves a path with no value/)
  })

  test('an else with no return is rejected', () => {
    expect(() => compile('coverage_else_no_return', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_cov_5')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(1)), () => { math.return(math.integer(5)) })
            .else(() => { x.add(NBT.int(1)) })
        })(dp.integer())
      })
    })).toThrow(/leaves a path with no value/)
  })

  test('straight-line code after a covered branch is accepted', () => {
    // The code after a branch can never affect the result — the
    // branch's `else` already covers the path that reaches the end.
    // The dead chain update is dropped by the dead-store pass.
    expect(() => compile('coverage_dead_code', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_cov_6')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(1)), () => { math.return(math.integer(5)) })
            .else(() => { math.return(math.integer(0)) })
          x.add(NBT.int(1))
        })(dp.integer())
      })
    })).not.toThrow()
  })

  test('a fully covered chain is accepted', () => {
    expect(() => compile('coverage_ok', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_cov_7')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(1)), () => { math.return(math.integer(5)) })
            .elseIf(x.equals(NBT.int(2)), () => { math.return(math.integer(6)) })
            .else(() => { math.return(math.integer(7)) })
        })(dp.integer())
      })
    })).not.toThrow()
  })

  test('a nested chain inherits the enclosing else', () => {
    // The inner chain's false path continues into the outer chain's
    // `else`, so it is covered.
    expect(() => compile('coverage_nested', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_cov_8')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(1)), () => {
            math.if(x.equals(NBT.int(2)), () => { math.return(math.integer(5)) })
          }).else(() => { math.return(math.integer(0)) })
        })(dp.integer())
      })
    })).not.toThrow()
  })
})

describe('Math dead stores', () => {
  const providerCount = (out: Map<string, string>): number =>
    [...out.keys()].filter((p) => p.includes('context_float_provider')).length

  // The branch provider inlines the whole chain from its root, so it
  // never reads a handle's intermediate storage. A chain update whose
  // storage nobody reads is a dead store — its command AND its
  // provider file are dropped.
  test('a chain update the branch never reads is dropped', () => {
    const out = compile('dead_store', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_dead')
        pack._.Math(Float, (math, x: Float) => {
          math.if(x.equals(NBT.float(4)), () => { math.return(x) })
            .else(() => { math.return(math.float(0)) })
          x.add(NBT.float(100))
        })(dp)
      })
    })

    // Only the branch provider survives — the `add` provider and the
    // command that writes it are gone.
    expect(providerCount(out)).toBe(1)
    expect(mcfunctionBody(out, 'f')).not.toContain('op_0')
    expect(mcfunctionBody(out, 'f')).not.toContain('h_h_0')
  })

  test('a chain update the result reads is kept', () => {
    const out = compile('live_store', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_live')
        pack._.Math(Float, (math, x: Float) => {
          x.add(NBT.float(5))
          math.return(x)
        })(dp)
      })
    })

    // The fold writes the result storage — it is the block's result.
    expect(providerCount(out)).toBe(1)
    expect(mcfunctionBody(out, 'f')).toContain('set compute default float')
  })
})

describe('Math scalar pass-through', () => {
  const providerJson = (out: Map<string, string>, family: string): string => {
    const entry = [...out.entries()].find(([path]) => path.includes(`${family}/`))
    return entry?.[1] ?? ''
  }

  // A block that returns its input without mutating a chain has no
  // chain update for the plan to fold into the result storage — the
  // returned expression IS the result, and it has to be emitted on
  // its own.
  test('a pass-through writes the result', () => {
    const out = compile('pass_through', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_pass_through')
        pack._.Math(Float, (math, v: Float) => {
          math.return(v)
        })(dp)
      })
    })

    const body = mcfunctionBody(out, 'f')
    expect(body).toContain('set compute default float')
    const json = providerJson(out, 'context_float_provider')
    expect(json).toContain('"type": "storage"')
    expect(json).toContain('dp_pass_through')
  })

  test('an integer pass-through is read in the integer context', () => {
    const out = compile('pass_through_int', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_pass_through_int')
        pack._.Math(Integer, (math, v: Integer) => {
          math.return(v)
        })(dp.integer())
      })
    })

    const body = mcfunctionBody(out, 'f')
    expect(body).toContain('set compute default integer')
    const json = providerJson(out, 'context_int_provider')
    expect(json).toContain('"type": "storage"')
    // An integer input read in the integer context needs no bridge.
    expect(json).not.toContain('from_int')
  })
})

describe('Math numeric assumptions', () => {
  const providerJson = (out: Map<string, string>, family: string): string => {
    const entry = [...out.entries()].find(([path]) => path.includes(`${family}/`))
    return entry?.[1] ?? ''
  }

  // The mixed-kind rules the whole tower rests on:
  //
  //   - `from_float` truncates TOWARD ZERO, and it truncates the SUM,
  //     not each operand.
  //   - `from_int` widens through single precision, so it is exact
  //     below 2^24 and rounds above it.
  //
  // One float operand can't tell "truncate the sum" from "truncate the
  // operands" — 2 + 2.5 gives 4 either way. Two of them can.
  test('a mixed-kind chain keeps the operands exact and truncates the sum', () => {
    const out = compile('assumption_mixed_sum', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_assume_sum')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(2)), () => {
            x.add(math.float(2.5)).add(math.float(2.5))
            math.return(x)
          }).else(() => {
            math.return(math.integer(0))
          })
        })(dp.integer())
      })
    })

    const json = providerJson(out, 'context_int_provider')
    // The operands keep their fraction — the truncation happens at the
    // integer boundary, on the sum.
    expect(json).toContain('2.5')
    expect(json).toContain('"type": "from_float"')
    expect(json).not.toContain('"value": 2,')
  })

  test('an integer computed bound is rewritten to an inclusive range', () => {
    const out = compile('assumption_int_bound', (pack) => {
      pack.MCFunction('f', () => {
        const x = pack.DataVariable(undefined, 'dp_assume_bound')
        const y = pack.DataVariable(undefined, 'dp_assume_bound_y')
        pack._.Math(Integer, (math, v: Integer) => {
          const bound = math.integer(y)
          math.if(v['<'](bound), () => { math.return(math.integer(1)) })
            .else(() => { math.return(math.integer(0)) })
        })(x.integer())
      })
    })

    const json = providerJson(out, 'context_int_provider')
    // `x < y` is `(-inf, y - 1]` — the bound becomes a provider
    // expression, so the comparison stays exact.
    expect(json).toContain('minecraft:int_value_check')
    expect(json).toContain('"type": "sub"')
  })

  test('an integer widened into the float context goes through from_int', () => {
    const out = compile('assumption_widen', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_assume_widen')
        pack._.Math(Float, (math, v: Float) => {
          math.return(math.multiply(v, math.float(2)))
        })(dp.integer())
      })
    })

    const json = providerJson(out, 'context_float_provider')
    expect(json).toContain('"type": "from_int"')
  })
})

describe('Math NBT operands', () => {
  const providerJson = (out: Map<string, string>, family: string): string => {
    const entry = [...out.entries()].find(([path]) => path.includes(`${family}/`))
    return entry?.[1] ?? ''
  }

  // An NBT primitive is a TYPED numeric operand — `NBT.int(3)` is an
  // integer, `NBT.float(2.5)` a float. Unlike a bare number (whose
  // kind comes from the receiving chain), it carries its own kind, and
  // the numeric tower bridges it where the contexts meet.
  test('an NBT int operand stays in the integer context', () => {
    const out = compile('nbt_operand_int', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_nbt_int')
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(NBT.int(3)))
        })(dp.integer())
      })
    })

    const json = providerJson(out, 'context_int_provider')
    expect(json).toContain('"type": "add"')
    expect(json).not.toContain('from_float')
  })

  test('an NBT float operand widens an integer chain', () => {
    const out = compile('nbt_operand_float', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_nbt_float')
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(NBT.float(2.5)))
        })(dp.integer())
      })
    })

    // The tower widens the chain to float (the sum is 4.5), and the
    // integer block's boundary truncates the RESULT.
    const json = providerJson(out, 'context_int_provider')
    expect(json).toContain('"type": "from_float"')
    expect(json).toContain('"type": "add"')
  })

  test('an NBT operand in a comparison keeps the comparison kind', () => {
    const out = compile('nbt_operand_compare', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_nbt_compare')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.int(3)), () => { math.return(math.integer(1)) })
            .else(() => { math.return(math.integer(0)) })
        })(dp.integer())
      })
    })

    const json = providerJson(out, 'context_int_provider')
    expect(json).toContain('minecraft:int_value_check')
  })

  test('an NBT float compared against an integer handle runs in the float context', () => {
    const out = compile('nbt_operand_compare_mixed', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_nbt_compare_mixed')
        pack._.Math(Integer, (math, x: Integer) => {
          math.if(x.equals(NBT.float(2)), () => { math.return(math.integer(1)) })
            .else(() => { math.return(math.integer(0)) })
        })(dp.integer())
      })
    })

    // The comparison's kind is the widest of its two operands — float —
    // so the integer side is bridged with `from_int`.
    const json = providerJson(out, 'context_int_provider')
    expect(json).toContain('minecraft:float_value_check')
    expect(json).toContain('"type": "from_int"')
  })

  test('math.float / math.integer read an NBT primitive in the target context', () => {
    const out = compile('nbt_operand_constructors', (pack) => {
      pack.MCFunction('f', () => {
        pack._.Math(Float, (math) => {
          math.return(math.add(math.float(NBT.int(3)), math.integer(NBT.float(2.5))))
        })(NBT.float(1))
      })
    })

    // 3.0 (widened from the int) + 2 (the float truncated toward zero
    // by `from_float`) = 5.0
    expect(mcfunctionBody(out, 'f')).toContain('set value 5f')
  })

  test('an out-of-range NBT int is rejected', () => {
    expect(() => compile('nbt_operand_overflow', (pack) => {
      pack.MCFunction('f', () => {
        const dp = pack.DataVariable(undefined, 'dp_nbt_overflow')
        pack._.Math(Integer, (math, x: Integer) => {
          math.return(x.add(NBT.int(3000000000)))
        })(dp.integer())
      })
    })).toThrow(/out of range/)
  })
})
