import * as fs from 'fs'

import fetch from 'node-fetch'

const registries = [
  'attribute',
  'banner_pattern',
  'block',
  'cat_variant',
  'dimension',
  'enchantment',
  'entity_type',
  'fluid',
  'game_event',
  'item',
  'mob_effect',
  'painting_variant',
  'particle_type',
  'point_of_interest_type',
  'sound_event',
  'structure',
  ['worldgen/biome'],
  ['worldgen/configured_feature'],
  ['worldgen/template_pool'],
  ['worldgen/structure']
]
const last = list => list[list.length - 1]

async function generate() {
  // need to fix fetch somehow
  const allRegistries = await (await fetch('https://raw.githubusercontent.com/misode/mcmeta/summary/registries/data.min.json')).json()

  for (const registry of registries) {
    fs.writeFileSync(
      `src/arguments/generated/${registry}.ts`,

      `/* eslint-disable */\n` +
      `/* Auto-generated */\n` +
      `export type ${`${Array.isArray(registry) ? last(registry[0].split('/')) : registry}`.toUpperCase()}S = (\n` +
      `  '${allRegistries[`${registry}`].join('\' |\n  \'')}'\n` +
      `)`,
      () => {}
    )
  }

  const stats = [
    ['block', ['broken', 'mined']],
    ['entity_type', ['killed', 'killed_by']],
    ['custom_stat', ['custom']],
    ['item', ['crafted', 'dropped', 'picked_up', 'used']],
  ]

  let criterion = [
    `/* eslint-disable */`,
    `/* Auto-generated */`,
    `export type OBJECTIVE_CRITERION = (`,
    `  'air' |`,
    `  'armor' |`,
    `  'deathCount' |`,
    `  'dummy' |`,
    `  'food' |`,
    `  'health' |`,
    `  'level' |`,
    `  'killedByTeam.aqua' |`,
    `  'killedByTeam.black' |`,
    `  'killedByTeam.blue' |`,
    `  'killedByTeam.dark_aqua' |`,
    `  'killedByTeam.dark_blue' |`,
    `  'killedByTeam.dark_gray' |`,
    `  'killedByTeam.dark_green' |`,
    `  'killedByTeam.dark_purple' |`,
    `  'killedByTeam.dark_red' |`,
    `  'killedByTeam.gold' |`,
    `  'killedByTeam.gray' |`,
    `  'killedByTeam.green' |`,
    `  'killedByTeam.light_purple' |`,
    `  'killedByTeam.red' |`,
    `  'killedByTeam.white' |`,
    `  'killedByTeam.yellow' |`
  ]

  for (const stat of stats) {
    for (const entry of allRegistries[stat[0]]) {
      for(const type of stat[1]) {
        criterion.push(`  'minecraft.${type}:minecraft.${entry}' |`);
      }
    }
  }

  fs.writeFileSync('src/arguments/generated/criterion.ts', `${criterion.join('\n').slice(0, -2)}\n)\n`, () => {})

  const exports = registries
  exports.splice(4, 0, 'criterion')
  fs.writeFileSync(`src/arguments/generated/index.ts`, exports.map(registry => `export * from './${Array.isArray(registry) ? registry[0] : registry}'\n`).join(''), () => {})
}

generate()
