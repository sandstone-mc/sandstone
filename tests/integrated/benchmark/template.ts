import type { BenchmarkSpec } from './types.js'

export default {
  setup: (pack) => {
    pack.Objective.create('bench', 'dummy', undefined, { useDefaultNamespace: false })
    return pack.MCFunction('bench_setup', () => {
      pack.commands.scoreboard.players.set('#bench', 'bench', 0)
    })
  },

  a: (pack) => pack.MCFunction('bench_add', () => {
    for (let i = 0; i < 50; i++) {
      pack.commands.scoreboard.players.add('#bench', 'bench', 1)
    }
  }),

  b: (pack) => pack.MCFunction('bench_set', () => {
    for (let i = 0; i < 50; i++) {
      pack.commands.scoreboard.players.set('#bench', 'bench', 1)
    }
  }),

  iterationsPerTick: 10,
} as BenchmarkSpec
