import chalk from 'chalk-template'
import { NBT, NBTClass, NBTTypedArray } from './NBTs'
import { parseNBT } from './parser'
import util from 'util'

export function formatSnbt(snbt: string): string {
  if (snbt === '') return ''
  let parsed: ReturnType<typeof parseNBT>
  try {
    parsed = parseNBT(NBT, snbt)
  } catch (e) {
    console.error('[formatSnbt] parseNBT threw for', JSON.stringify(snbt), e)
    return chalk`{green ${snbt}}`
  }
  try {
    const out = chalkColorize(parsed)
    return out
  } catch (e) {
    console.error('[formatSnbt] chalkColorize threw:', e)
    return chalk`{green ${snbt}}`
  }
}

function chalkColorize(value: unknown): string {
  if (value === null || value === undefined) {
    return chalk`{blue null}`
  }
  if (value instanceof NBTTypedArray) {
    const renderedItems = value.values.map((it) => chalk`{green ${it}}`).join(chalk`, `)
    return chalk`[{blue ${value.unit}}; ${renderedItems}]`
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return chalk`[]`
    const items = value
      .map((v) => chalkColorize(v))
      .join(', ')
    return chalk`[${items}]`
  }
  if (typeof value === 'object' && !value.constructor.name.startsWith('NBT')) {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) return chalk`\{\}`
    const entries = keys
      .map((k) => chalk`{cyan ${k}}: ${chalkColorize(obj[k])}`)
      .join(chalk`, `)
    return chalk`\{${entries}\}`
  }
  if (typeof value === 'string') {
    return chalk`{yellow ${JSON.stringify(value)}}`
  }
  if (typeof value === 'number') {
    return chalk`{green ${value}d}`
  }
  return chalk`{green ${(value as NBTClass)[util.inspect.custom]()}}`
}