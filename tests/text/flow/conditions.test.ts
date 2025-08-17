import { _, abs, Data, execute, MCFunction, Objective, Predicate, rel, say } from 'sandstone'
import { describe, it } from 'vitest'
import { compareOutputText, compareSingleOutputText } from '../../utils'

describe('Conditions tests', () => {
  const obj = Objective.get('test')

  describe('Score Conditions', () => {
    it('should compare scores correctly in execute.if', async () => {
      await compareSingleOutputText(() => {
        execute.if.score(obj('@s'), '=', obj('@s')).run.say('test')
      }, ['execute if score @s test = @s test run say test'])
    })

    it('should compare scores correctly in execute.unless', async () => {
      await compareSingleOutputText(() => {
        execute.unless.score(obj('@s'), '=', obj('@s')).run.say('test')
      }, ['execute unless score @s test = @s test run say test'])
    })

    it('should compare scores correctly in _.if', async () => {
      await compareSingleOutputText(() => {
        _.if(obj('@s').equalTo(obj('@s')), () => {
          say('test')
        })
      }, ['execute if score @s test = @s test run say test'])
    })
  })

  describe('Block Conditions', () => {
    it('should check block with _.if(_.block)', async () => {
      await compareSingleOutputText(() => {
        _.if(_.block(rel(0, 0, 0), 'stone'), () => {
          say('Stone found!')
        })
      }, ['execute if block ~ ~ ~ stone run say Stone found!'])
    })

    it('should check block with execute.if.block', async () => {
      await compareSingleOutputText(() => {
        execute.if.block(rel(0, 0, 0), 'stone').run.say('Stone found!')
      }, ['execute if block ~ ~ ~ stone run say Stone found!'])
    })

    it('should check block with absolute coordinates', async () => {
      await compareSingleOutputText(() => {
        _.if(_.block(abs(0, 64, 0), 'minecraft:diamond_ore'), () => {
          say('Diamond ore found!')
        })
      }, ['execute if block 0 64 0 minecraft:diamond_ore run say Diamond ore found!'])
    })
  })

  describe('Blocks Conditions', () => {
    it('should compare blocks with _.if(_.blocks)', async () => {
      await compareSingleOutputText(() => {
        _.if(_.blocks(rel(0, 0, 0), rel(2, 2, 2), rel(0, 5, 0), 'all'), () => {
          say('Blocks match!')
        })
      }, ['execute if blocks ~ ~ ~ ~2 ~2 ~2 ~ ~5 ~ all run say Blocks match!'])
    })

    it('should compare blocks with execute.if.blocks', async () => {
      await compareSingleOutputText(() => {
        execute.if.blocks(rel(0, 0, 0), rel(2, 2, 2), rel(0, 5, 0), 'all').run.say('Blocks match!')
      }, ['execute if blocks ~ ~ ~ ~2 ~2 ~2 ~ ~5 ~ all run say Blocks match!'])
    })

    it('should compare blocks with masked scan mode', async () => {
      await compareSingleOutputText(() => {
        _.if(_.blocks(abs(0, 64, 0), abs(10, 70, 10), abs(20, 64, 20), 'masked'), () => {
          say('Blocks match (masked)!')
        })
      }, ['execute if blocks 0 64 0 10 70 10 20 64 20 masked run say Blocks match (masked)!'])
    })
  })

  describe('Data Conditions', () => {
    it('should check data exists with _.if(_.data)', async () => {
      await compareSingleOutputText(() => {
        _.if(_.data(Data('block', rel(0, 0, 0), 'Inventory[0]')), () => {
          say('Data exists!')
        })
        _.if(_.data(Data('entity', '@s', 'Health')), () => {
          say('Entity has health data!')
        })

        _.if(_.data(Data('storage', 'mypack:storage', 'myData')), () => {
          say('Storage has data!')
        })
      }, [
        'execute if data block ~ ~ ~ Inventory[0] run say Data exists!',
        'execute if data entity @s Health run say Entity has health data!',
        'execute if data storage mypack:storage myData run say Storage has data!',
      ])
    })

    it('should check data exists with DataPointClass instance directly used as a condition', async () => {
      await compareSingleOutputText(() => {
        _.if(Data('block', rel(0, 0, 0), 'Inventory[0]'), () => {
          say('Data exists!')
        })
        _.if(Data('entity', '@s', 'Health'), () => {
          say('Entity has health data!')
        })
        _.if(Data('storage', 'mypack:storage', 'myData'), () => {
          say('Storage has data!')
        })
      }, [
        'execute if data block ~ ~ ~ Inventory[0] run say Data exists!',
        'execute if data entity @s Health run say Entity has health data!',
        'execute if data storage mypack:storage myData run say Storage has data!',
      ])
    })

    it('should check data exists with execute.if.data(DataPointClass)', async () => {
      await compareSingleOutputText(() => {
        execute.if.data(Data('block', rel(0, 0, 0), 'Inventory[0]')).run.say('Data exists!')
        execute.if.data(Data('entity', '@s', 'Health')).run.say('Entity has health data!')
        execute.if.data(Data('storage', 'mypack:storage', 'myData')).run.say('Storage has data!')
      }, [
        'execute if data block ~ ~ ~ Inventory[0] run say Data exists!',
        'execute if data entity @s Health run say Entity has health data!',
        'execute if data storage mypack:storage myData run say Storage has data!',
      ])
    })

    it('should check data exists with execute.if.data.block/entity/storage', async () => {
      await compareSingleOutputText(() => {
        execute.if.data.block(rel(0, 0, 0), 'Inventory[0]').run.say('Data exists!')
        execute.if.data.entity('@s', 'Health').run.say('Entity has health data!')
        execute.if.data.storage('mypack:storage', 'myData').run.say('Storage has data!')
      }, [
        'execute if data block ~ ~ ~ Inventory[0] run say Data exists!',
        'execute if data entity @s Health run say Entity has health data!',
        'execute if data storage mypack:storage myData run say Storage has data!',
      ])
    })
  })

  describe('Dimension Conditions', () => {
    it('should check dimension with _.if(_.dimension)', async () => {
      await compareSingleOutputText(() => {
        _.if(_.dimension('minecraft:overworld'), () => {
          say('In overworld!')
        })
      }, ['execute if dimension minecraft:overworld run say In overworld!'])
    })

    it('should check dimension with execute.if.dimension', async () => {
      await compareSingleOutputText(() => {
        execute.if.dimension('minecraft:the_nether').run.say('In nether!')
      }, ['execute if dimension minecraft:the_nether run say In nether!'])
    })

    it('should check dimension with custom dimension', async () => {
      await compareSingleOutputText(() => {
        _.if(_.dimension('mypack:custom_dimension'), () => {
          say('In custom dimension!')
        })
      }, ['execute if dimension mypack:custom_dimension run say In custom dimension!'])
    })
  })

  describe('Function Conditions', () => {
    it('should check function with _.if(_.function_)', async () => {
      await compareSingleOutputText(() => {
        _.if(_.function_('mypack:my_function'), () => {
          say('Function succeeded!')
        })
      }, ['execute if function mypack:my_function run say Function succeeded!'])
    })

    it('should check function with execute.if.function', async () => {
      await compareSingleOutputText(() => {
        execute.if.function('mypack:my_function').run.say('Function succeeded!')
      }, ['execute if function mypack:my_function run say Function succeeded!'])
    })

    it('should check function with MCFunction instance', async () => {
      await compareSingleOutputText(() => {
        const myFunc = MCFunction('test_func', () => {
          say('Test function')
        })
        _.if(_.function_(myFunc), () => {
          say('MCFunction succeeded!')
        })
      }, ['execute if function default:test_func run say MCFunction succeeded!'])
    })
  })

  describe('Loaded Conditions', () => {
    it('should check if chunk is loaded with _.if(_.chunksLoaded)', async () => {
      await compareSingleOutputText(() => {
        _.if(_.chunksLoaded(rel(0, 0, 0)), () => {
          say('Chunk is loaded!')
        })
      }, ['execute if loaded ~ ~ ~ run say Chunk is loaded!'])
    })

    it('should check if chunk is loaded with execute.if.loaded', async () => {
      await compareSingleOutputText(() => {
        execute.if.loaded(rel(0, 0, 0)).run.say('Chunk is loaded!')
      }, ['execute if loaded ~ ~ ~ run say Chunk is loaded!'])
    })

    it('should check if chunk is loaded with absolute coordinates', async () => {
      await compareSingleOutputText(() => {
        _.if(_.chunksLoaded(abs(100, 64, 200)), () => {
          say('Chunk at 100,64,200 is loaded!')
        })
      }, ['execute if loaded 100 64 200 run say Chunk at 100,64,200 is loaded!'])
    })
  })

  describe('Predicate Conditions', () => {
    it('should check predicate with _.if(_.predicate)', async () => {
      await compareSingleOutputText(() => {
        _.if(_.predicate('mypack:my_predicate'), () => {
          say('Predicate succeeded!')
        })
      }, ['execute if predicate mypack:my_predicate run say Predicate succeeded!'])
    })

    it('should check predicate with execute.if.predicate', async () => {
      await compareSingleOutputText(() => {
        execute.if.predicate('mypack:my_predicate').run.say('Predicate succeeded!')
      }, ['execute if predicate mypack:my_predicate run say Predicate succeeded!'])
    })

    it('should check predicate with Predicate instance', async () => {
      await compareSingleOutputText(() => {
        const myPredicate = Predicate('test_predicate', {
          condition: 'minecraft:random_chance',
          chance: 0.5,
        })
        _.if(_.predicate(myPredicate), () => {
          say('Predicate instance succeeded!')
        })
      }, ['execute if predicate default:test_predicate run say Predicate instance succeeded!'])
    })

    it('should check predicate with Predicate instance directly used as a condition', async () => {
      await compareSingleOutputText(() => {
        const myPredicate = Predicate('test_predicate', {
          condition: 'minecraft:random_chance',
          chance: 0.5,
        })
        _.if(myPredicate, () => {
          say('Predicate instance succeeded!')
        })
      }, ['execute if predicate default:test_predicate run say Predicate instance succeeded!'])
    })
  })
})
