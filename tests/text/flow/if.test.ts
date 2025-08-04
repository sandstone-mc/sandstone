import { _, Data, execute, MCFunction, Objective, say } from 'sandstone'
import { describe, expect, it } from 'vitest'
import { compareOutputText, getGeneratedFunctionsText } from '../../utils'

describe('If/Else tests', () => {
  const objective = Objective.get('test')
  const test = objective('@s')

  it('should generate if callbacks correctly', async () => {
    await compareOutputText(
      () => {
        MCFunction('default:test', () => {
          _.if(test, () => {
            say('wow!')
            say('wow!')
          })
        })
      },
      {
        'default:test': ['execute unless score @s test matches 0 run function default:test/if'],
        'default:test/if': ['say wow!', 'say wow!'],
      },
    )
  })

  it('should simplify 1-command if callbacks', async () => {
    await compareOutputText(
      () => {
        MCFunction('default:test', () => {
          _.if(test, () => say('wow!'))
        })
      },
      {
        'default:test': ['execute unless score @s test matches 0 run say wow!'],
      },
    )
  })

  it('should not simplify 1-command if callbacks with execute, as execute should never be simplified', async () => {
    await compareOutputText(
      () => {
        MCFunction('default:test', () => {
          _.if(test, () => execute.as('@a').run.say('wow!'))
        })
      },
      {
        'default:test': ['execute unless score @s test matches 0 run function default:test/if'],
        'default:test/if': ['execute as @a run say wow!'],
      },
    )
  })

  it('should generate if-else callbacks correctly', async () => {
    await compareOutputText(
      () => {
        MCFunction('default:test', () => {
          _.if(test, () => {
            say('wow!')
          }).else(() => {
            say('not wow!')
          })
        })
      },
      {
        'default:test': ['function default:test/if'],
        'default:test/if': ['execute unless score @s test matches 0 run return run say wow!', 'say not wow!'],
      },
    )
  })

  it('should generate if,else if,else callbacks correctly', async () => {
    await compareOutputText(
      () => {
        MCFunction('default:test', () => {
          _.if(test.equalTo(1), () => {
            say('if!')
          })
            .elseIf(test.equalTo(2), () => {
              say('else if!')
            })
            .else(() => {
              say('else!')
            })
        })
      },
      {
        'default:test': ['function default:test/if'],
        'default:test/if': [
          'execute if score @s test matches 1 run return run say if!',
          'execute if score @s test matches 2 run return run say else if!',
          'say else!',
        ],
      },
    )
  })

  it('should generate if,else if,else if,else callbacks correctly', async () => {
    await compareOutputText(
      () => {
        MCFunction('default:test', () => {
          _.if(test.equalTo(1), () => {
            say('if!')
          })
            .elseIf(test.equalTo(2), () => {
              say('else if n°1!')
            })
            .elseIf(test.equalTo(3), () => {
              say('else if n°2!')
            })
            .else(() => {
              say('else!')
            })
        })
      },
      {
        'default:test': ['function default:test/if'],
        'default:test/if': [
          'execute if score @s test matches 1 run return run say if!',
          'execute if score @s test matches 2 run return run say else if n°1!',
          'execute if score @s test matches 3 run return run say else if n°2!',
          'say else!',
        ],
      },
    )
  })

  it('should generate nested if callbacks correctly', async () => {
    await compareOutputText(
      () => {
        MCFunction('default:test', () => {
          _.if(test, () => {
            say('inside simple if!')
            _.if(test.equalTo(1), () => {
              say('inside nested if!')
            }).else(() => {
              say('inside nested else!')
            })
          })
        })
      },
      {
        'default:test': ['execute unless score @s test matches 0 run function default:test/if'],
        'default:test/if': ['say inside simple if!', 'function default:test/if/if2'],
        'default:test/if/if2': [
          'execute if score @s test matches 1 run return run say inside nested if!',
          'say inside nested else!',
        ],
      },
    )
  })

  it('should generate nested if/else callbacks correctly', async () => {
    await compareOutputText(
      () => {
        MCFunction('default:test', () => {
          _.if(test, () => {
            say('inside simple if!')
            _.if(test.equalTo(1), () => {
              say('inside nested if!')
            }).else(() => {
              say('inside nested else!')
            })
          }).else(() => {
            say('inside simple else!')
          })
        })
      },
      {
        'default:test': ['function default:test/if'],
        'default:test/if': [
          'execute unless score @s test matches 0 run return run function default:test/if/0_if/return_run2',
          'say inside simple else!',
        ],
        'default:test/if/0_if/return_run2': ['say inside simple if!', 'function default:test/if/0_if/return_run/if2'],
        'default:test/if/0_if/return_run/if2': [
          'execute if score @s test matches 1 run return run say inside nested if!',
          'say inside nested else!',
        ],
      },
    )
  })

  it('Should be fast to compile iteratively', async () => {
    getGeneratedFunctionsText(() => {
      MCFunction(
        'default:test',
        () => {
          for (let i = 0; i < 1_000; i++) {
            _.if(_.block('~ ~ ~', 'acacia_button'), () => {
              say('wow!')
            })
          }
        },
        {
          onConflict: 'replace',
        },
      )
    })
  }, 2_000) // Should compile in less than 2s

  it('Should be fast to compile recursively', async () => {
    function createIf(i: number): void {
      if (i >= 500) return
      _.if(_.block('~ ~ ~', 'acacia_button'), () => {
        say('wow!')
        createIf(i + 1)
      })
    }

    getGeneratedFunctionsText(() => {
      MCFunction(
        'default:test',
        () => {
          createIf(0)
        },
        {
          onConflict: 'replace',
        },
      )
    })
  }, 2_000) // Should compile in less than 2 seconds
})
