import { execute, MCFunction, Objective, say } from 'sandstone'
import { ExecuteCommandNode, SayCommandNode, ScoreboardCommandNode } from 'sandstone/commands'
import { describe, expect, it } from 'vitest'
import { compareSingleFunctionNodes, createCommandNode } from '../utils'

describe('Score & Variable AST Integration Tests', () => {
  it('should create and use Score variables without errors', () => {
    const testObjective = Objective.get('test_objective')
    const playerScore = testObjective('@s')
    const otherScore = testObjective('@a[limit=1]')

    compareSingleFunctionNodes(() => {
      // Basic score operations
      playerScore.set(10)
      playerScore.add(5)
      playerScore.remove(3)

      // Score comparisons
      playerScore.set(otherScore)
    }, [
      createCommandNode(ScoreboardCommandNode, 'players', 'set', playerScore, 10),
      createCommandNode(ScoreboardCommandNode, 'players', 'add', playerScore, 5),
      createCommandNode(ScoreboardCommandNode, 'players', 'remove', playerScore, 3),
      createCommandNode(
        ScoreboardCommandNode,
        'players',
        'operation',
        playerScore.target,
        playerScore.objective,
        '=',
        otherScore.target,
        otherScore.objective,
      ),
    ])
  })
})
