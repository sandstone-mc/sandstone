import { describe, expect, test } from 'bun:test'
import {
  _,
  DataVariable,
  execute,
  Label,
  Macro as $,
  MCFunction,
  Objective,
  say,
  tellraw,
} from '../dist/exports/index.js'
import { compile, mcfunctionBody, snapshotAll } from './utils/index.js'


describe('Flow snapshots', () => {
  describe('_.if / _.elseIf / _.else', () => {
    test('single execute.if with single-command body', () => {
      const out = compile('if_single', () => {
        say('before execute.if.run.say')
        execute.if.entity('@s').run.say('inside')
        say('after execute.if.run.say')
      })
      snapshotAll(out)
    })

    test('single execute.if with multi-command body', () => {
      const out = compile('if_multi', () => {
        say('before execute.if')
        execute.if.entity('@s').run(() => {
          say('a')
          say('b')
        })
        say('after execute.if')
      })
      snapshotAll(out)
    })

    test('Flow _.if with entity condition', () => {
      const out = compile('flow_if_entity', () => {
        say('before _.if')
        _.if(_.entity('@a'), () => {
          say('entity exists')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('Flow _.if with score range condition', () => {
      const out = compile('flow_if_score', () => {
        say('before _.if')
        const counter = Objective.create('counter')
        _.if(counter('@s').greaterThan(5), () => {
          say('big')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('Flow _.if / _.elseIf / _.else', () => {
      const out = compile('flow_if_elseif_else', () => {
        say('before if/elseif/else')
        const score = Objective.create('mode')
        _.if(score('@s').equalTo(0), () => {
          say('zero')
        }).elseIf(score('@s').equalTo(1), () => {
          say('one')
        }).else(() => {
          say('other')
        })
        say('after if/elseif/else')
      })
      snapshotAll(out)
    })

    test('nested Flow _.if', () => {
      const out = compile('flow_nested_if', () => {
        say('before outer _.if')
        _.if(_.entity('@a'), () => {
          say('before inner _.if')
          _.if(_.entity('@s'), () => {
            say('inside inner _.if')
          })
          say('after inner _.if')
        })
        say('after outer _.if')
      })
      snapshotAll(out)
    })

    test('Flow _.if body in middle of function (not tail)', () => {
      const out = compile('flow_if_mid', () => {
        say('before if')
        _.if(_.entity('@s'), () => {
          say('inside if')
        })
        say('after if')
      })
      snapshotAll(out)
    })

    test('Flow _.if with empty body', () => {
      const out = compile('flow_if_empty', () => {
        _.if(_.entity('@s'), () => {
          // intentionally empty
        })
      })
      snapshotAll(out)
    })

    test('Flow _.if with .run.<command> body', () => {
      const out = compile('flow_if_run_only', () => {
        say('before if')
        _.if(Label('test')('@s')).run.say('inside via run')
        say('after if')
      })
      snapshotAll(out)
    })

    test('Flow _.if(cb).elseIf(...).run.<command> chain (chain ends at elseIf.run)', () => {
      const out = compile('flow_if_elseIf_run', () => {
        const counter = Objective.create('counter')
        say('before chain')
        _.if(counter('@s').matches([0, 0]), () => {
          say('zero via cb')
        })
          .elseIf(counter('@s').matches([1, 1])).run
          .say('one via run')
        say('after chain')
      })
      snapshotAll(out)
    })

    test('Flow _.if(cb).elseIf(cb).else.run.<command> chain (chain ends at else.run)', () => {
      const out = compile('flow_if_else_else_run', () => {
        const counter = Objective.create('counter')
        say('before chain')
        _.if(counter('@s').matches([0, 0]), () => {
          say('zero via cb')
        })
          .elseIf(counter('@s').matches([1, 1]), () => {
            say('one via cb')
          })
          .else
          .run.say('fallback via run')
        say('after chain')
      })
      snapshotAll(out)
    })
  })

  describe('_.while / _.doWhile', () => {
    test('while loop with score range condition', () => {
      const out = compile('flow_while', () => {
        say('before _.while')
        const i = Objective.create('i')
        _.while(i('@s').matches([0, 5]), () => {
          say('looping')
          i('@s').add(1)
        })
        say('after _.while')
      })
      snapshotAll(out)
    })

    test('doWhile loop', () => {
      const out = compile('flow_dowhile', () => {
        say('before _.doWhile')
        const i = Objective.create('i')
        _.doWhile(i('@s').matches([0, 3]), () => {
          say('once at least')
          i('@s').add(1)
        })
        say('after _.doWhile')
      })
      snapshotAll(out)
    })

    test('nested while loop', () => {
      const out = compile('flow_while_nested', () => {
        say('before outer _.while')
        const i = Objective.create('i')
        const j = Objective.create('j')
        _.while(i('@s').matches([0, 2]), () => {
          say('before inner _.while')
          _.while(j('@s').matches([0, 2]), () => {
            say('inner')
            j('@s').add(1)
          })
          say('after inner _.while')
          j('@s').set(0)
          i('@s').add(1)
        })
        say('after outer _.while')
      })
      snapshotAll(out)
    })

    test('while loop with break via _.throw', () => {
      const out = compile('flow_while_break', () => {
        say('before _.while')
        const i = Objective.create('i')
        _.while(i('@s').matches([0, 10]), () => {
          say('before inner _.if')
          _.if(i('@s').equalTo(3), () => {
            _.throw('exiting')
          })
          say('after inner _.if')
          i('@s').add(1)
        })
        say('after _.while')
      })
      snapshotAll(out)
    })
  })

  describe('_.for', () => {
    test('for range (i from 0 to 5)', () => {
      const out = compile('flow_for_range', () => {
        say('before _.for')
        _.for([0, 5], 'iterate', (i) => {
          say(`step ${i}`)
        })
        say('after _.for')
      })
      snapshotAll(out)
    })

    test('for (init; cond; step) form', () => {
      const out = compile('flow_for_i', () => {
        say('before _.for')
        _.for(0, (i) => i.lessThan(3), (i) => i.add(1), (i) => {
          say(`num ${i}`)
        })
        say('after _.for')
      })
      snapshotAll(out)
    })

    test('for-of over a Data array', () => {
      const out = compile('flow_for_of', (pack) => {
        say('before _.for')
        const list = pack.DataArray([1, 2, 3])
        _.for('entry', 'of', list, (entry) => {
          tellraw('@a', ['got', entry])
        })
        say('after _.for')
      })
      snapshotAll(out)
    })

    test('for-of with [i, entry]', () => {
      const out = compile('flow_for_of_indexed', (pack) => {
        say('before _.for')
        const list = pack.DataArray(['a', 'b'])
        _.for(['i', 'entry'], 'of', list, (i, entry) => {
          tellraw('@a', ['i', i, 'entry', entry])
        })
        say('after _.for')
      })
      snapshotAll(out)
    })

    test('nested for loops', () => {
      const out = compile('flow_for_nested', () => {
        say('before outer _.for')
        _.for([0, 2], 'iterate', (i) => {
          say('before inner _.for')
          _.for([0, 2], 'iterate', (j) => {
            say(`${i},${j}`)
          })
          say('after inner _.for')
        })
        say('after outer _.for')
      })
      snapshotAll(out)
    })
  })

  describe('_.switch', () => {
    test('switch on score with static cases', () => {
      const out = compile('flow_switch_score', () => {
        say('before switch')
        const mode = Objective.create('mode')
        _.switch(mode('@s'), [
          ['case', 0, () => say('zero')],
          ['case', 1, () => say('one')],
          ['case', 2, () => say('two')],
        ])
        say('after switch')
      })
      snapshotAll(out)
    })

    test('switch on score with default', () => {
      const out = compile('flow_switch_score_default', () => {
        say('before switch')
        const mode = Objective.create('mode')
        _.switch(mode('@s'), [
          ['case', 0, () => say('zero')],
          ['case', 1, () => say('one')],
          ['default', () => say('fallback')],
        ])
        say('after switch')
      })
      snapshotAll(out)
    })

    test('switch on NBT data', () => {
      const out = compile('flow_switch_nbt', () => {
        say('before switch')
        const item = DataVariable({ id: 'a' }, 'item')
        _.switch(item, [
          ['case', { id: 'a' }, () => say('matched a')],
          ['case', { id: 'b' }, () => say('matched b')],
        ])
        say('after switch')
      })
      snapshotAll(out)
    })

    test('switch with condition cases', () => {
      const out = compile('flow_switch_conditions', () => {
        say('before switch')
        const score = Objective.create('s')
        _.switch(score('@s'), [
          ['case', (s: any) => s.greaterThan(10), () => say('big')],
          ['case', (s: any) => s.equalTo(0), () => say('zero')],
          ['default', () => say('other')],
        ])
        say('after switch')
      })
      snapshotAll(out)
    })

    test('switch as last node in function', () => {
      const out = compile('flow_switch_tail', () => {
        say('before switch')
        const mode = Objective.create('mode')
        _.switch(mode('@s'), [
          ['case', 0, () => say('zero')],
          ['default', () => say('other')],
        ])
        say('after switch')
      })
      snapshotAll(out)
    })
  })

  describe('_.and / _.or', () => {
    test('_.if with _.and of two entity conditions', () => {
      const out = compile('if_with_and_entities', () => {
        say('before _.if')
        _.if(_.and(_.entity('@a'), _.entity('@s')), () => {
          say('inside _.if with _.and')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.or of two entity conditions', () => {
      const out = compile('if_with_or_entities', () => {
        say('before _.if')
        _.if(_.or(_.entity('@a'), _.entity('@s')), () => {
          say('inside _.if with _.or')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.and of two score conditions', () => {
      const out = compile('if_with_and_scores', () => {
        say('before _.if')
        const a = Objective.create('a')
        const b = Objective.create('b')
        _.if(_.and(a('@s').greaterThan(0), b('@s').lessThan(10)), () => {
          say('inside _.if with score _.and')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.or of two score conditions', () => {
      const out = compile('if_with_or_scores', () => {
        say('before _.if')
        const a = Objective.create('a')
        const b = Objective.create('b')
        _.if(_.or(a('@s').equalTo(0), b('@s').equalTo(1)), () => {
          say('inside _.if with score _.or')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with DataPointExists condition', () => {
      const out = compile('if_data_exists', () => {
        const storage = DataVariable({ foo: 1 }, 'storage')
        say('before _.if')
        _.if(storage, () => {
          say('storage exists')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.and including a DataPointExists', () => {
      const out = compile('if_and_data_exists', () => {
        const storage = DataVariable({ foo: 1 }, 'storage')
        say('before _.if')
        _.if(_.and(_.entity('@s'), storage), () => {
          say('storage and entity exist')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.or including a DataPointExists', () => {
      const out = compile('if_or_data_exists', () => {
        const storage = DataVariable({ foo: 1 }, 'storage')
        say('before _.if')
        _.if(_.or(_.entity('@s'), storage), () => {
          say('storage or entity exists')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.and mixing score + DataPoint + entity', () => {
      const out = compile('if_and_mixed', () => {
        say('before _.if')
        const counter = Objective.create('counter')
        const storage = DataVariable({ foo: 1 }, 'storage')
        _.if(_.and(_.entity('@s'), counter('@s').greaterThan(0), storage), () => {
          say('all three true')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.or mixing score + DataPoint + entity', () => {
      const out = compile('if_or_mixed', () => {
        say('before _.if')
        const counter = Objective.create('counter')
        const storage = DataVariable({ foo: 1 }, 'storage')
        _.if(_.or(_.entity('@s'), counter('@s').equalTo(0), storage), () => {
          say('any of three')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.and via Array form', () => {
      const out = compile('if_and_array_form', () => {
        say('before _.if')
        const a = Objective.create('a')
        const b = Objective.create('b')
        _.if(_.and([a('@s').greaterThan(0), b('@s').lessThan(10)]), () => {
          say('and from array')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.if with _.or via Array form', () => {
      const out = compile('if_or_array_form', () => {
        say('before _.if')
        const a = Objective.create('a')
        const b = Objective.create('b')
        _.if(_.or([a('@s').equalTo(0), b('@s').equalTo(1)]), () => {
          say('or from array')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('_.await.until with _.and condition (in asyncContext)', () => {
      const out = compile('await_until_and', () => {
        say('before MCFunction(async_until_and_fn)')
        const ready = Objective.create('ready')
        const flag = DataVariable({ ok: true }, 'flag')
        MCFunction('async_until_and_fn', () => {
          _.await.until(_.and(ready('@s').equalTo(1), flag), '1s')
          say('after _.await.until (and)')
        }, { asyncContext: true })
        say('after MCFunction(async_until_and_fn)')
      })
      snapshotAll(out)
    })

    test('_.await.until with _.or condition (in asyncContext)', () => {
      const out = compile('await_until_or', () => {
        say('before MCFunction(async_until_or_fn)')
        const ready = Objective.create('ready')
        const flag = DataVariable({ ok: true }, 'flag')
        MCFunction('async_until_or_fn', () => {
          _.await.until(_.or(ready('@s').equalTo(1), flag), '1s')
          say('after _.await.until (or)')
        }, { asyncContext: true })
        say('after MCFunction(async_until_or_fn)')
      })
      snapshotAll(out)
    })

    test('_.await.until with DataPointExists condition (in asyncContext)', () => {
      const out = compile('await_until_data', () => {
        say('before MCFunction(async_until_data_fn)')
        const ready = DataVariable({ go: true }, 'ready')
        MCFunction('async_until_data_fn', () => {
          _.await.until(ready, '1s')
          say('after _.await.until (data exists)')
        }, { asyncContext: true })
        say('after MCFunction(async_until_data_fn)')
      })
      snapshotAll(out)
    })

    test('_.and with variadic (Array) form', () => {
      const out = compile('and_variadic_array', () => {
        const a = Objective.create('a')
        const b = Objective.create('b')
        _.and([a('@s').greaterThan(0), b('@s').lessThan(10)])
      })
      snapshotAll(out)
    })

    test('_.or with variadic (Array) form', () => {
      const out = compile('or_variadic_array', () => {
        const a = Objective.create('a')
        const b = Objective.create('b')
        _.or([a('@s').equalTo(0), b('@s').equalTo(1)])
      })
      snapshotAll(out)
    })
  })

  describe('_.throw', () => {
    test('throw with string error in _.if', () => {
      const out = compile('throw_basic', () => {
        say('before _.if')
        _.if(_.entity('@s'), () => {
          _.throw('something broke')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('throw with broadcast=false', () => {
      const out = compile('throw_no_broadcast', () => {
        say('before _.if')
        _.if(_.entity('@s'), () => {
          _.throw('quiet error', false)
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('throw with JSON component', () => {
      const out = compile('throw_component', () => {
        say('before _.if')
        _.if(_.entity('@s'), () => {
          _.throw({ text: 'oops', color: 'red' })
        })
        say('after _.if')
      })
      snapshotAll(out)
    })
  })

  describe('async flow', () => {
    test('sleep in asyncContext MCFunction', () => {
      const out = compile('async_sleep', () => {
        say('before MCFunction(async_sleep_fn)')
        MCFunction('async_sleep_fn', () => {
          say('before _.await.sleep')
          _.await.sleep('1s')
          say('after _.await.sleep')
        }, { asyncContext: true })
        say('after MCFunction(async_sleep_fn)')
      })
      snapshotAll(out)
    })

    test('sleep with logPath', () => {
      const out = compile('async_sleep_logpath', () => {
        say('before MCFunction(async_sleep_logpath_fn)')
        MCFunction('async_sleep_logpath_fn', () => {
          _.await.sleep('1s', true)
        }, { asyncContext: true })
        say('after MCFunction(async_sleep_logpath_fn)')
      })
      snapshotAll(out)
    })

    test('sleep inside execute.run', () => {
      const out = compile('async_sleep_in_execute', () => {
        say('before MCFunction(async_in_execute)')
        MCFunction('async_in_execute', () => {
          say('before execute.run')
          execute.as('@a').at('@s').run(() => {
            say('before _.await.sleep')
            _.await.sleep('1s')
            say('after _.await.sleep')
          })
          say('after execute.run')
        }, { asyncContext: true })
        say('after MCFunction(async_in_execute)')
      })
      snapshotAll(out)
    })

    test('sleep inside execute.run with asyncContext', () => {
      const out = compile('async_sleep_asynccontext', () => {
        say('before MCFunction(async_asynccontext)')
        MCFunction('async_asynccontext', () => {
          say('before execute.run')
          execute.as('@a').at('@s').run(() => {
            say('before _.await.sleep')
            _.await.sleep('1s')
            say('after _.await.sleep')
          })
          say('after execute.run')
        }, { asyncContext: true })
        say('after MCFunction(async_asynccontext)')
      })
      snapshotAll(out)
    })

    test('until with a score condition', () => {
      const out = compile('async_until', () => {
        say('before MCFunction(async_until_fn)')
        const ready = Objective.create('ready')
        MCFunction('async_until_fn', () => {
          _.await.until(ready('@s').equalTo(1), '1s')
          say('after _.await.until')
        }, { asyncContext: true })
        say('after MCFunction(async_until_fn)')
      })
      snapshotAll(out)
    })

    test('multiple sequential sleeps', () => {
      const out = compile('async_multi_sleep', () => {
        say('before MCFunction(async_multi)')
        MCFunction('async_multi', () => {
          say('before first _.await.sleep')
          _.await.sleep('1s')
          say('before second _.await.sleep')
          _.await.sleep('2s')
          say('after second _.await.sleep')
        }, { asyncContext: true })
        say('after MCFunction(async_multi)')
      })
      snapshotAll(out)
    })

    test('sleep inside a _.while', () => {
      const out = compile('async_sleep_in_while', () => {
        say('before MCFunction(async_in_while_fn)')
        const i = Objective.create('i')
        MCFunction('async_in_while_fn', () => {
          say('before _.while')
          _.while(i('@s').matches([0, 3]), () => {
            say('before _.await.sleep')
            _.await.sleep('1s')
            say('after _.await.sleep')
            i('@s').add(1)
          })
          say('after _.while')
        }, { asyncContext: true })
        say('after MCFunction(async_in_while_fn)')
      })
      snapshotAll(out)
    })

    test('sleep inside a _.if', () => {
      const out = compile('async_sleep_in_if', () => {
        say('before MCFunction(async_sleep_in_if_fn)')
        MCFunction('async_sleep_in_if_fn', () => {
          say('before _.if')
          _.if(_.entity('@s'), () => {
            say('before _.await.sleep')
            _.await.sleep('1s')
            say('after _.await.sleep')
          })
          say('after _.if')
        }, { asyncContext: true })
        say('after MCFunction(async_sleep_in_if_fn)')
      })
      snapshotAll(out)
    })
  })

  describe('combined / nested', () => {
    test('for loop with if inside', () => {
      const out = compile('nested_for_if', () => {
        say('before _.for')
        _.for([0, 3], 'iterate', (i) => {
          say('before _.if')
          _.if(_.entity('@s'), () => {
            say(`step ${i}`)
          })
          say('after _.if')
        })
        say('after _.for')
      })
      snapshotAll(out)
    })

    test('switch with non-return cases', () => {
      const out = compile('switch_no_return', () => {
        say('before _.switch')
        const mode = Objective.create('mode')
        _.switch(mode('@s'), [
          ['case', 0, () => say('case 0')],
          ['case', 1, () => say('case 1')],
        ])
        say('after _.switch')
      })
      snapshotAll(out)
    })

    test('Flow if/elseIf/else without return', () => {
      const out = compile('if_elseif_no_return', () => {
        const mode = Objective.create('mode')
        _.if(mode('@s').equalTo(0), () => {
          say('zero')
        }).elseIf(mode('@s').equalTo(1), () => {
          say('one')
        }).else(() => {
          say('other')
        })
      })
      snapshotAll(out)
    })

    test('execute.if with a callback body that uses Flow _.if', () => {
      const out = compile('execute_if_with_flow_if', () => {
        execute.if.entity('@a').run(() => {
          say('before inner if')
          _.if(_.entity('@s'), () => {
            say('inside inner if')
          })
          say('after inner if')
        })
      })
      snapshotAll(out)
    })

    test('throw inside a loop', () => {
      const out = compile('throw_in_loop', () => {
        _.for([0, 3], 'iterate', () => {
          _.throw('loop broke')
        })
      })
      snapshotAll(out)
    })

    test('multi-command execute body with mixed Flow + commands', () => {
      const out = compile('mixed_body', () => {
        say('before execute.if')
        execute.if.entity('@s').run(() => {
          say('first')
          say('before inner _.if')
          _.if(_.entity('@a'), () => {
            say('inside inner _.if')
          })
          say('after inner _.if')
          say('last')
        })
        say('after execute.if')
      })
      snapshotAll(out)
    })

    test('function call followed by Flow control', () => {
      const out = compile('call_then_flow', () => {
        say('before helper()')
        const helper = MCFunction('helper', () => say('helper'))
        helper()
        say('before _.if')
        _.if(_.entity('@s'), () => {
          say('after call')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('Flow _.if followed by function call', () => {
      const out = compile('flow_then_call', () => {
        say('before _.if')
        const helper = MCFunction('helper_b', () => say('helper b'))
        _.if(_.entity('@s'), () => {
          say('inside')
        })
        say('before helper()')
        helper()
        say('after helper()')
      })
      snapshotAll(out)
    })

    test('_.switch inside _.if', () => {
      const out = compile('switch_in_if', () => {
        say('before _.if')
        _.if(_.entity('@s'), () => {
          say('before _.switch')
          const mode = Objective.create('mode')
          _.switch(mode('@s'), [
            ['case', 0, () => say('zero')],
            ['default', () => say('other')],
          ])
          say('after _.switch')
        })
        say('after _.if')
      })
      snapshotAll(out)
    })

    test('execute.if.run.then chained (no return)', () => {
      const out = compile('execute_if_then', () => {
        say('before execute.if.run')
        execute.if.entity('@s').run(() => say('inside execute'))
        say('after execute.if.run')
      })
      snapshotAll(out)
    })
  })

  describe('misc commands touched by Flow visitors', () => {
    test('execute with chained subcommands and a Flow body', () => {
      const out = compile('execute_chained_flow', () => {
        say('before execute.as')
        execute.as('@a').at('@s').run(() => {
          say('before _.if')
          _.if(_.entity('@s'), () => {
            say('chained')
          })
          say('after _.if')
        })
        say('after execute.as')
      })
      snapshotAll(out)
    })

    test('macro-style variable with Flow control', () => {
      const out = compile('macro_with_flow', () => {
        say('before MCFunction(macro_flow)')
        const x = DataVariable(5)
        MCFunction('macro_flow', [x], () => {
          say('before _.if')
          _.if(_.entity('@s'), () => {
            $.give('@s', 'diamond', {}, x)
          })
          say('after _.if')
        })()
        say('after MCFunction(macro_flow)')
      })
      snapshotAll(out)
    })

    test('deeply nested if / while / for', () => {
      const out = compile('deep_nested', () => {
        say('before outer _.for')
        const i = Objective.create('i')
        _.for([0, 2], 'iterate', (n) => {
          say('before inner _.while')
          _.while(i('@s').matches([0, 1]), () => {
            say('before inner _.if')
            _.if(_.entity('@s'), () => {
              say(`step ${n}`)
            })
            say('after inner _.if')
            i('@s').add(1)
          })
          say('after inner _.while')
          i('@s').set(0)
        })
        say('after outer _.for')
      })
      snapshotAll(out)
    })

    test('_.with wraps Macro commands in a child macro mcfunction', () => {
      const out = compile('with_macro', () => {
        say('before _.with')
        const foo = DataVariable(20)
        _.with([foo], () => {
          $.give('@s', 'minecraft:diamond', {}, foo)
        })
        say('after _.with')
      })
      snapshotAll(out)
    })

    test('_.with with multiple env vars', () => {
      const out = compile('with_multi_env', () => {
        const foo = DataVariable(20)
        const bar = DataVariable('hello')
        _.with([foo, bar], () => {
          $.give('@s', 'minecraft:diamond', {}, foo)
          $.say(bar)
        })
      })
      snapshotAll(out)
    })

    test('_.with with two sequential calls share the parent mcfunction context', () => {
      const out = compile('with_sequential', () => {
        const foo = DataVariable(20)
        _.with([foo], () => {
          $.give('@s', 'minecraft:diamond', {}, foo)
        })
        say('between _.with calls')
        _.with([foo], () => {
          $.give('@s', 'minecraft:emerald', {}, foo)
        })
      })
      snapshotAll(out)
    })

    test('_.with hoists single execute prefix onto the function call', () => {
      const out = compile('with_hoist_execute', () => {
        const volume = DataVariable(20)
        _.with([volume], () => execute.as('@a').at('@s').run(() =>
          $.playsound('block.ancient_debris.break', 'block', '@s', '~ ~ ~', volume),
        ))
      })
      snapshotAll(out)
    })

    test('_.with body without execute wrapper keeps nested $-prefixed commands', () => {
      const out = compile('with_no_hoist', () => {
        const foo = DataVariable(20)
        _.with([foo], () => {
          say('hi')
          $.give('@s', 'minecraft:diamond', {}, foo)
          $.give('@s', 'minecraft:emerald', {}, foo)
        })
      })
      snapshotAll(out)
    })
  })
})
