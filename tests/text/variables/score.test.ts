import { _, abs, Data, execute, MCFunction, Objective, say } from 'sandstone'
import { describe, expect, it } from 'vitest'
import { compareOutputText, getGeneratedFunctionsText } from '../../utils'

describe('Variable tests', () => {
  describe('Objective creation', () => {
    it('should create objectives correctly', async () => {
      const generated = await getGeneratedFunctionsText(() => {
        Objective.create('test', 'dummy')

        MCFunction('default:test', () => {})
      })

      expect(generated['default:__init__']).to.include('scoreboard objectives add default.test dummy')
    })

    it('should create objectives with custom display text', async () => {
      const generated = await getGeneratedFunctionsText(() => {
        Objective.create('test', 'dummy', 'Test Objective')

        MCFunction('default:test', () => {})
      })

      expect(generated['default:__init__']).to.include('scoreboard objectives add default.test dummy "Test Objective"')
    })

    it('should create objectives without namespacing if specified', async () => {
      const generated = await getGeneratedFunctionsText(() => {
        Objective.create('test', 'dummy', 'Test Objective', {
          useDefaultNamespace: false,
        })

        MCFunction('default:test', () => {})
      })

      expect(generated['default:__init__']).to.include('scoreboard objectives add test dummy "Test Objective"')
    })

    describe('Already-namespaced objective creation', async () => {
      it('should accept already-namespaced objective names with a dot .', async () => {
        const generated = await getGeneratedFunctionsText(() => {
          Objective.create('foo.test', 'dummy')

          MCFunction('default:test', () => {})
        })

        expect(generated['default:__init__']).to.include('scoreboard objectives add foo.test dummy')
      })
      it('should accept already-namespaced objective names with a double underscore __', async () => {
        const generated = await getGeneratedFunctionsText(() => {
          Objective.create('foo__test', 'dummy')

          MCFunction('default:test', () => {})
        })

        expect(generated['default:__init__']).to.include('scoreboard objectives add foo__test dummy')
      })
    })
  })

  it('should handle score selection', async () => {
    await compareOutputText(
      () => {
        const myScore = Objective.get('test')('@s')

        MCFunction('default:test', () => {
          execute.if.score(myScore, 'matches', 0).run.say('Hi')
        })
      },
      {
        'default:test': ['execute if score @s test matches 0 run say Hi'],
      },
    )
  })

  it('should handle constant score operations', async () => {
    await compareOutputText(
      () => {
        const obj = Objective.get('test')
        const myScore = obj('@s')

        MCFunction('default:test', () => {
          myScore.set(5)
          myScore.add(3)
          myScore.remove(2)
          myScore.multiply(2)
          myScore.divide(2)
          myScore.modulo(3)
          myScore.swap('@p')
          myScore.swap('@p', 'otherObjective')
          myScore.reset()
        })
      },
      {
        'default:test': [
          'scoreboard players set @s test 5',
          'scoreboard players add @s test 3',
          'scoreboard players remove @s test 2',
          'scoreboard players operation @s test *= 2 sandstone_const',
          'scoreboard players operation @s test /= 2 sandstone_const',
          'scoreboard players operation @s test %= 3 sandstone_const',
          'scoreboard players operation @s test >< @p test',
          'scoreboard players operation @s test >< @p otherObjective',
          'scoreboard players reset @s test',
        ],
      },
    )
  })

  it('should handle score operations with other Scores', async () => {
    await compareOutputText(
      () => {
        const obj = Objective.get('test')
        const myScore = obj('@s')
        const otherScore = obj('@r')

        MCFunction('default:test', () => {
          myScore.set(otherScore)
          myScore.add(otherScore)
          myScore.remove(otherScore)
          myScore.multiply(otherScore)
          myScore.divide(otherScore)
          myScore.modulo(otherScore)
          myScore.swap(otherScore)
        })
      },
      {
        'default:test': [
          'scoreboard players operation @s test = @r test',
          'scoreboard players operation @s test += @r test',
          'scoreboard players operation @s test -= @r test',
          'scoreboard players operation @s test *= @r test',
          'scoreboard players operation @s test /= @r test',
          'scoreboard players operation @s test %= @r test',
          'scoreboard players operation @s test >< @r test',
        ],
      },
    )
  })

  it('Should handle assigning a Data value to a score', async () => {
    await compareOutputText(
      () => {
        const myScore = Objective.get('test')('@s')

        MCFunction('default:test', () => {
          myScore.set(Data('block', abs(0, 0, 0), 'Inventory[0]'))
        })
      },
      {
        'default:test': ['execute store result score @s test run data get block 0 0 0 Inventory[0]'],
      },
    )
  })

  it('should handle score being used as a comparison value', async () => {
    await compareOutputText(
      () => {
        const myScore = Objective.get('test')('@s')

        MCFunction('default:test', () => {
          _.if(myScore, () => {
            say('Score is not zero')
          })
          _.if(myScore.greaterThan(10), () => {
            say('Score is greater than 10')
          })
          _.if(myScore.lessThan(5), () => {
            say('Score is less than 5')
          })
          _.if(myScore.equalTo(3), () => {
            say('Score is exactly 3')
          })
          _.if(myScore.notEqualTo(7), () => {
            say('Score is not equal to 7')
          })
          _.if(myScore.greaterOrEqualThan(2), () => {
            say('Score is greater or equal than 2')
          })
          _.if(myScore.lessOrEqualThan(8), () => {
            say('Score is less or equal than 8')
          })
          _.if(myScore.matches('0..10'), () => {
            say('Score is between 0 and 10')
          })
        })
      },
      {
        'default:test': [
          'execute unless score @s test matches 0 run say Score is not zero',
          'execute if score @s test matches 11.. run say Score is greater than 10',
          'execute if score @s test matches ..4 run say Score is less than 5',
          'execute if score @s test matches 3 run say Score is exactly 3',
          'execute unless score @s test matches 7 run say Score is not equal to 7',
          'execute if score @s test matches 2.. run say Score is greater or equal than 2',
          'execute if score @s test matches ..8 run say Score is less or equal than 8',
          'execute if score @s test matches 0..10 run say Score is between 0 and 10',
        ],
      },
    )
  })
})
