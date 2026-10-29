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

    // 5 + from_float(2.5) = 5 + 2 = 7
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

    // 5 + from_float(-2.5) = 5 + (-2) = 3 — not 2.
    expect(mcfunctionBody(out, 'f')).toContain('set value 3i')
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
