import { describe, expect } from 'bun:test'
import { test } from './__setup'
import { Objective } from '../../dist/exports/index.js'
import chalk from 'chalk-template'

console.log(chalk`{blue [test]} Registered 8 inline_flow tests`)

export function registerInlineFlowTests() {
  test('Basic', 'inline_flow_basic',
      (create, { Test, _ }) => create(() => {
        const o = Objective.create('if_else_score')
        const s = o('#if_else_player')['='](4)
        _.if(s['=='](4), () => Test.succeed())
        .else(() => Test.fail('else'))
      }),
      async (r) => expect(r.passed).toBe(true)
    )

    test('OrMatches-1', 'inline_flow_or_matches',
      (create, { Test, _ }) => create(() => {
        const o = Objective.create('or_score_1')
        const s = o('#or_player_1')
        s['='](4)
        _.if(
          _.or(s['=='](4), s['=='](99)),
          () => Test.succeed(),
        ).else(() => Test.fail('else'))
      }),
      async (r) => expect(r.passed).toBe(true)
    )

    test('OrMatches-2', 'inline_flow_or_falls_through',
      (create, { Test, _ }) => create(() => {
        const o = Objective.create('or_score_2')
        const s = o('#or_player_2')['='](4)
        _.if(
          _.or(s['=='](3), s['=='](99)),
          () => Test.fail('or'),
        ).else(() => Test.succeed())
      }),
      async (r) => expect(r.passed).toBe(true)
    )

    test('AndMatches', 'inline_flow_and_matches',
      (create, { Test, _ }) => create(() => {
        const o = Objective.create('and_score_1')
        const s = o('#and_player_1')['='](4)
        _.if(
          _.and(s['=='](4), s['>'](0)),
          () => Test.succeed(),
        ).else(() => Test.fail('else'))
      }),
      async (r) => expect(r.passed).toBe(true)
    )

    test('AndFails', 'inline_flow_and_fails',
      (create, { Test, _ }) => create(() => {
        const o = Objective.create('and_score_2')
        const s = o('#and_player_2')['='](4)
        _.if(
          _.and(s['=='](4), s['>'](99)),
          () => Test.fail('and'),
        ).else(() => Test.succeed())
      }),
      async (r) => expect(r.passed).toBe(true)
    )

    test('SwitchStatic', 'inline_flow_switch_static',
      (create, { Test, _ }) => create(() => {
        const mode = Objective.create('switch_mode_1')
        const s = mode('#switch_player_1')['='](0)
        _.switch(s, [
          ['case', 0, () => Test.succeed()],
          ['case', 1, () => Test.fail('one')],
          ['default', () => Test.fail('fallback')],
        ])
      }),
      async (r) => expect(r.passed).toBe(true)
    )

    test('SwitchDefault', 'inline_flow_switch_default',
      (create, { Test, _ }) => create(() => {
        // score = 1 → no case matches → default fires.
        const mode = Objective.create('switch_mode_2')
        _.switch(mode('#switch_player_2'), [
          ['case', 0, () => Test.fail('zero')],
          ['case', 2, () => Test.fail('two')],
          ['default', () => Test.succeed()],
        ])
      }),
      async (r) => expect(r.passed).toBe(true)
    )

    test('NotOr', 'inline_flow_not_or',
      (create, { Test, _ }) => create(() => {
        const o = Objective.create('not_or_score')
        const s = o('#not_or_player')['='](4)
        _.if(
          _.not(_.or(s['=='](3), s['=='](5))),
          () => Test.succeed(),
        ).else(() => Test.fail('else'))
      }),
      async (r) => expect(r.passed).toBe(true)
    )
}