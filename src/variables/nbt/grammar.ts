/* eslint-disable */
/*
 * Generated automatically by nearley, version 2.20.1
 * http://github.com/Hardmath123/nearley
 * Bypasses TS6133. Allow declared but unused functions.
 * @ts-ignore
 */
function id(d: any[]): any {
  return d[0]
}

export const isCompoundSymbol = Symbol('isCompound')

type DataType<TYPE extends string, VALUE, PROPERTIES extends Record<string, unknown> | unknown = unknown> = {
  dataType: TYPE
  value: VALUE
} & PROPERTIES

export type NBTExpression =
  | NBTCompound
  | NBTArray
  | NBTLongArray
  | NBTByteArray
  | NBTIntArray
  | NBTString
  | NBTLong
  | NBTDouble
  | NBTFloat
  | NBTByte
  | NBTNumber
  | NBTShort
  | NBTBoolean

export type NBTCompound = { [k: string]: NBTExpression }
export type NBTArray = NBTExpression[]
export type NBTByteArray = DataType<'byteArray', NBTByte[]>
export type NBTLongArray = DataType<'longArray', NBTLong[]>
export type NBTIntArray = DataType<'intArray', NBTShort[]>

export type NBTString = DataType<'string', string>

export type NBTLong = DataType<'long', number>
export type NBTShort = DataType<'short', number>
export type NBTByte = DataType<'byte', number>

export type NBTNumber = DataType<'number', number>

export type NBTDouble = DataType<'double', number>
export type NBTFloat = DataType<'float', number>
export type NBTBoolean = DataType<'boolean', boolean>

interface NearleyToken {
  value: any
  [key: string]: any
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void
  next: () => NearleyToken | undefined
  save: () => any
  formatError: (token: never) => string
  has: (tokenType: string) => boolean
}

interface NearleyRule {
  name: string
  symbols: NearleySymbol[]
  postprocess?: (d: any[], loc?: number, reject?: any) => any
}

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean }

interface Grammar {
  Lexer: NearleyLexer | undefined
  ParserRules: NearleyRule[]
  ParserStart: string
}

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    { name: '_$ebnf$1', symbols: [] },
    { name: '_$ebnf$1', symbols: ['_$ebnf$1', 'wschar'], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: '_',
      symbols: ['_$ebnf$1'],
      postprocess(d) {
        return null
      },
    },
    { name: '__$ebnf$1', symbols: ['wschar'] },
    { name: '__$ebnf$1', symbols: ['__$ebnf$1', 'wschar'], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: '__',
      symbols: ['__$ebnf$1'],
      postprocess(d) {
        return null
      },
    },
    { name: 'wschar', symbols: [/[ \t\n\v\f]/], postprocess: id },
    { name: 'unsigned_int$ebnf$1', symbols: [/[0-9]/] },
    { name: 'unsigned_int$ebnf$1', symbols: ['unsigned_int$ebnf$1', /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: 'unsigned_int',
      symbols: ['unsigned_int$ebnf$1'],
      postprocess(d) {
        return Number.parseInt(d[0].join(''))
      },
    },
    { name: 'int$ebnf$1$subexpression$1', symbols: [{ literal: '-' }] },
    { name: 'int$ebnf$1$subexpression$1', symbols: [{ literal: '+' }] },
    { name: 'int$ebnf$1', symbols: ['int$ebnf$1$subexpression$1'], postprocess: id },
    { name: 'int$ebnf$1', symbols: [], postprocess: () => null },
    { name: 'int$ebnf$2', symbols: [/[0-9]/] },
    { name: 'int$ebnf$2', symbols: ['int$ebnf$2', /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: 'int',
      symbols: ['int$ebnf$1', 'int$ebnf$2'],
      postprocess(d) {
        if (d[0]) {
          return Number.parseInt(d[0][0] + d[1].join(''))
        }
        return Number.parseInt(d[1].join(''))
      },
    },
    { name: 'unsigned_decimal$ebnf$1', symbols: [/[0-9]/] },
    {
      name: 'unsigned_decimal$ebnf$1',
      symbols: ['unsigned_decimal$ebnf$1', /[0-9]/],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: 'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1', symbols: [/[0-9]/] },
    {
      name: 'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1',
      symbols: ['unsigned_decimal$ebnf$2$subexpression$1$ebnf$1', /[0-9]/],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    {
      name: 'unsigned_decimal$ebnf$2$subexpression$1',
      symbols: [{ literal: '.' }, 'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1'],
    },
    { name: 'unsigned_decimal$ebnf$2', symbols: ['unsigned_decimal$ebnf$2$subexpression$1'], postprocess: id },
    { name: 'unsigned_decimal$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'unsigned_decimal',
      symbols: ['unsigned_decimal$ebnf$1', 'unsigned_decimal$ebnf$2'],
      postprocess(d) {
        return Number.parseFloat(d[0].join('') + (d[1] ? `.${d[1][1].join('')}` : ''))
      },
    },
    { name: 'decimal$ebnf$1', symbols: [{ literal: '-' }], postprocess: id },
    { name: 'decimal$ebnf$1', symbols: [], postprocess: () => null },
    { name: 'decimal$ebnf$2', symbols: [/[0-9]/] },
    { name: 'decimal$ebnf$2', symbols: ['decimal$ebnf$2', /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
    { name: 'decimal$ebnf$3$subexpression$1$ebnf$1', symbols: [/[0-9]/] },
    {
      name: 'decimal$ebnf$3$subexpression$1$ebnf$1',
      symbols: ['decimal$ebnf$3$subexpression$1$ebnf$1', /[0-9]/],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: 'decimal$ebnf$3$subexpression$1', symbols: [{ literal: '.' }, 'decimal$ebnf$3$subexpression$1$ebnf$1'] },
    { name: 'decimal$ebnf$3', symbols: ['decimal$ebnf$3$subexpression$1'], postprocess: id },
    { name: 'decimal$ebnf$3', symbols: [], postprocess: () => null },
    {
      name: 'decimal',
      symbols: ['decimal$ebnf$1', 'decimal$ebnf$2', 'decimal$ebnf$3'],
      postprocess(d) {
        return Number.parseFloat((d[0] || '') + d[1].join('') + (d[2] ? `.${d[2][1].join('')}` : ''))
      },
    },
    {
      name: 'percentage',
      symbols: ['decimal', { literal: '%' }],
      postprocess(d) {
        return d[0] / 100
      },
    },
    { name: 'jsonfloat$ebnf$1', symbols: [{ literal: '-' }], postprocess: id },
    { name: 'jsonfloat$ebnf$1', symbols: [], postprocess: () => null },
    { name: 'jsonfloat$ebnf$2', symbols: [/[0-9]/] },
    { name: 'jsonfloat$ebnf$2', symbols: ['jsonfloat$ebnf$2', /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
    { name: 'jsonfloat$ebnf$3$subexpression$1$ebnf$1', symbols: [/[0-9]/] },
    {
      name: 'jsonfloat$ebnf$3$subexpression$1$ebnf$1',
      symbols: ['jsonfloat$ebnf$3$subexpression$1$ebnf$1', /[0-9]/],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    {
      name: 'jsonfloat$ebnf$3$subexpression$1',
      symbols: [{ literal: '.' }, 'jsonfloat$ebnf$3$subexpression$1$ebnf$1'],
    },
    { name: 'jsonfloat$ebnf$3', symbols: ['jsonfloat$ebnf$3$subexpression$1'], postprocess: id },
    { name: 'jsonfloat$ebnf$3', symbols: [], postprocess: () => null },
    { name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$1', symbols: [/[+-]/], postprocess: id },
    { name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$1', symbols: [], postprocess: () => null },
    { name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$2', symbols: [/[0-9]/] },
    {
      name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$2',
      symbols: ['jsonfloat$ebnf$4$subexpression$1$ebnf$2', /[0-9]/],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    {
      name: 'jsonfloat$ebnf$4$subexpression$1',
      symbols: [/[eE]/, 'jsonfloat$ebnf$4$subexpression$1$ebnf$1', 'jsonfloat$ebnf$4$subexpression$1$ebnf$2'],
    },
    { name: 'jsonfloat$ebnf$4', symbols: ['jsonfloat$ebnf$4$subexpression$1'], postprocess: id },
    { name: 'jsonfloat$ebnf$4', symbols: [], postprocess: () => null },
    {
      name: 'jsonfloat',
      symbols: ['jsonfloat$ebnf$1', 'jsonfloat$ebnf$2', 'jsonfloat$ebnf$3', 'jsonfloat$ebnf$4'],
      postprocess(d) {
        return Number.parseFloat(
          (d[0] || '') +
            d[1].join('') +
            (d[2] ? `.${d[2][1].join('')}` : '') +
            (d[3] ? `e${d[3][1] || '+'}${d[3][2].join('')}` : ''),
        )
      },
    },
    { name: 'dqstring$ebnf$1', symbols: [] },
    { name: 'dqstring$ebnf$1', symbols: ['dqstring$ebnf$1', 'dstrchar'], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: 'dqstring',
      symbols: [{ literal: '"' }, 'dqstring$ebnf$1', { literal: '"' }],
      postprocess(d) {
        return d[1].join('')
      },
    },
    { name: 'sqstring$ebnf$1', symbols: [] },
    { name: 'sqstring$ebnf$1', symbols: ['sqstring$ebnf$1', 'sstrchar'], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: 'sqstring',
      symbols: [{ literal: "'" }, 'sqstring$ebnf$1', { literal: "'" }],
      postprocess(d) {
        return d[1].join('')
      },
    },
    { name: 'btstring$ebnf$1', symbols: [] },
    { name: 'btstring$ebnf$1', symbols: ['btstring$ebnf$1', /[^`]/], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: 'btstring',
      symbols: [{ literal: '`' }, 'btstring$ebnf$1', { literal: '`' }],
      postprocess(d) {
        return d[1].join('')
      },
    },
    { name: 'dstrchar', symbols: [/[^\\"\n]/], postprocess: id },
    {
      name: 'dstrchar',
      symbols: [{ literal: '\\' }, 'strescape'],
      postprocess(d) {
        return JSON.parse(`"${d.join('')}"`)
      },
    },
    { name: 'sstrchar', symbols: [/[^\\'\n]/], postprocess: id },
    {
      name: 'sstrchar',
      symbols: [{ literal: '\\' }, 'strescape'],
      postprocess(d) {
        return JSON.parse(`"${d.join('')}"`)
      },
    },
    { name: 'sstrchar$string$1', symbols: [{ literal: '\\' }, { literal: "'" }], postprocess: (d) => d.join('') },
    {
      name: 'sstrchar',
      symbols: ['sstrchar$string$1'],
      postprocess(d) {
        return "'"
      },
    },
    { name: 'strescape', symbols: [/["\\/bfnrt]/], postprocess: id },
    {
      name: 'strescape',
      symbols: [{ literal: 'u' }, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/],
      postprocess(d) {
        return d.join('')
      },
    },
    { name: 'expression$subexpression$1', symbols: ['string'] },
    { name: 'expression$subexpression$1', symbols: ['typedNum'] },
    { name: 'expression$subexpression$1', symbols: ['number'] },
    { name: 'expression$subexpression$1', symbols: ['boolean'] },
    { name: 'expression$subexpression$1', symbols: ['byteArray'] },
    { name: 'expression$subexpression$1', symbols: ['intArray'] },
    { name: 'expression$subexpression$1', symbols: ['longArray'] },
    { name: 'expression$subexpression$1', symbols: ['array'] },
    { name: 'expression$subexpression$1', symbols: ['object'] },
    {
      name: 'expression',
      symbols: ['expression$subexpression$1'],
      postprocess: (data: NBTExpression[][]) => data[0][0],
    },
    {
      name: 'object',
      symbols: [{ literal: '{' }, 'objectInner', { literal: '}' }],
      postprocess: (data: any) =>
        Object.fromEntries([
          ...data[1].map(({ key, value }: { key: string; value: NBTExpression }) => [key, value]),
          [isCompoundSymbol, true],
        ]),
    },
    { name: 'objectInner', symbols: ['_'], postprocess: (data) => [] },
    { name: 'objectInner$ebnf$1', symbols: [] },
    { name: 'objectInner$ebnf$1$subexpression$1', symbols: ['objectKeyValue', '_', { literal: ',' }, '_'] },
    {
      name: 'objectInner$ebnf$1',
      symbols: ['objectInner$ebnf$1', 'objectInner$ebnf$1$subexpression$1'],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: 'objectInner$ebnf$2$subexpression$1', symbols: ['_', { literal: ',' }] },
    { name: 'objectInner$ebnf$2', symbols: ['objectInner$ebnf$2$subexpression$1'], postprocess: id },
    { name: 'objectInner$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'objectInner',
      symbols: ['_', 'objectInner$ebnf$1', 'objectKeyValue', 'objectInner$ebnf$2', '_'],
      postprocess: (data) => {
        const firstKeyValues = data[1].map(([keyValue]: [key: string, value: NBTExpression][]) => keyValue)
        const keyValues = [...firstKeyValues, data[2]]
        return keyValues
      },
    },
    { name: 'objectKeyValue$ebnf$1', symbols: [/[a-zA-Z]/] },
    {
      name: 'objectKeyValue$ebnf$1',
      symbols: ['objectKeyValue$ebnf$1', /[a-zA-Z]/],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    {
      name: 'objectKeyValue',
      symbols: ['objectKeyValue$ebnf$1', '_', { literal: ':' }, '_', 'expression'],
      postprocess: (data) => ({ key: data[0].join(''), value: data[4] }),
    },
    {
      name: 'objectKeyValue',
      symbols: ['string', '_', { literal: ':' }, '_', 'expression'],
      postprocess: (data) => ({ key: data[0].value, value: data[4] }),
    },
    { name: 'array$macrocall$2', symbols: ['expression'] },
    { name: 'array$macrocall$1', symbols: ['_'], postprocess: () => [] },
    { name: 'array$macrocall$1$ebnf$1', symbols: [] },
    { name: 'array$macrocall$1$ebnf$1$subexpression$1', symbols: ['array$macrocall$2', '_', { literal: ',' }, '_'] },
    {
      name: 'array$macrocall$1$ebnf$1',
      symbols: ['array$macrocall$1$ebnf$1', 'array$macrocall$1$ebnf$1$subexpression$1'],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: 'array$macrocall$1$ebnf$2$subexpression$1', symbols: ['_', { literal: ',' }] },
    { name: 'array$macrocall$1$ebnf$2', symbols: ['array$macrocall$1$ebnf$2$subexpression$1'], postprocess: id },
    { name: 'array$macrocall$1$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'array$macrocall$1',
      symbols: ['_', 'array$macrocall$1$ebnf$1', 'array$macrocall$2', 'array$macrocall$1$ebnf$2', '_'],
      postprocess: (data) => {
        const firstArray = data[1].map(([expression]: NBTExpression[][]) => expression[0])
        return [...firstArray, data[2][0]]
      },
    },
    {
      name: 'array',
      symbols: [{ literal: '[' }, 'array$macrocall$1', { literal: ']' }],
      postprocess: (data) => data[1],
    },
    { name: 'byteArray$macrocall$2', symbols: ['typedByte'] },
    { name: 'byteArray$macrocall$1', symbols: ['_'], postprocess: () => [] },
    { name: 'byteArray$macrocall$1$ebnf$1', symbols: [] },
    {
      name: 'byteArray$macrocall$1$ebnf$1$subexpression$1',
      symbols: ['byteArray$macrocall$2', '_', { literal: ',' }, '_'],
    },
    {
      name: 'byteArray$macrocall$1$ebnf$1',
      symbols: ['byteArray$macrocall$1$ebnf$1', 'byteArray$macrocall$1$ebnf$1$subexpression$1'],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: 'byteArray$macrocall$1$ebnf$2$subexpression$1', symbols: ['_', { literal: ',' }] },
    {
      name: 'byteArray$macrocall$1$ebnf$2',
      symbols: ['byteArray$macrocall$1$ebnf$2$subexpression$1'],
      postprocess: id,
    },
    { name: 'byteArray$macrocall$1$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'byteArray$macrocall$1',
      symbols: ['_', 'byteArray$macrocall$1$ebnf$1', 'byteArray$macrocall$2', 'byteArray$macrocall$1$ebnf$2', '_'],
      postprocess: (data) => {
        const firstArray = data[1].map(([expression]: NBTExpression[][]) => expression[0])
        return [...firstArray, data[2][0]]
      },
    },
    {
      name: 'byteArray',
      symbols: [
        { literal: '[' },
        '_',
        { literal: 'B' },
        '_',
        { literal: ';' },
        'byteArray$macrocall$1',
        { literal: ']' },
      ],
      postprocess: (data) => ({ dataType: 'byteArray', value: data[5] }),
    },
    { name: 'intArray$macrocall$2', symbols: ['number'] },
    { name: 'intArray$macrocall$1', symbols: ['_'], postprocess: () => [] },
    { name: 'intArray$macrocall$1$ebnf$1', symbols: [] },
    {
      name: 'intArray$macrocall$1$ebnf$1$subexpression$1',
      symbols: ['intArray$macrocall$2', '_', { literal: ',' }, '_'],
    },
    {
      name: 'intArray$macrocall$1$ebnf$1',
      symbols: ['intArray$macrocall$1$ebnf$1', 'intArray$macrocall$1$ebnf$1$subexpression$1'],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: 'intArray$macrocall$1$ebnf$2$subexpression$1', symbols: ['_', { literal: ',' }] },
    { name: 'intArray$macrocall$1$ebnf$2', symbols: ['intArray$macrocall$1$ebnf$2$subexpression$1'], postprocess: id },
    { name: 'intArray$macrocall$1$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'intArray$macrocall$1',
      symbols: ['_', 'intArray$macrocall$1$ebnf$1', 'intArray$macrocall$2', 'intArray$macrocall$1$ebnf$2', '_'],
      postprocess: (data) => {
        const firstArray = data[1].map(([expression]: NBTExpression[][]) => expression[0])
        return [...firstArray, data[2][0]]
      },
    },
    {
      name: 'intArray',
      symbols: [
        { literal: '[' },
        '_',
        { literal: 'I' },
        '_',
        { literal: ';' },
        'intArray$macrocall$1',
        { literal: ']' },
      ],
      postprocess: (data) => ({ dataType: 'intArray', value: data[5] }),
    },
    { name: 'longArray$macrocall$2', symbols: ['typedLong'] },
    { name: 'longArray$macrocall$1', symbols: ['_'], postprocess: () => [] },
    { name: 'longArray$macrocall$1$ebnf$1', symbols: [] },
    {
      name: 'longArray$macrocall$1$ebnf$1$subexpression$1',
      symbols: ['longArray$macrocall$2', '_', { literal: ',' }, '_'],
    },
    {
      name: 'longArray$macrocall$1$ebnf$1',
      symbols: ['longArray$macrocall$1$ebnf$1', 'longArray$macrocall$1$ebnf$1$subexpression$1'],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: 'longArray$macrocall$1$ebnf$2$subexpression$1', symbols: ['_', { literal: ',' }] },
    {
      name: 'longArray$macrocall$1$ebnf$2',
      symbols: ['longArray$macrocall$1$ebnf$2$subexpression$1'],
      postprocess: id,
    },
    { name: 'longArray$macrocall$1$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'longArray$macrocall$1',
      symbols: ['_', 'longArray$macrocall$1$ebnf$1', 'longArray$macrocall$2', 'longArray$macrocall$1$ebnf$2', '_'],
      postprocess: (data) => {
        const firstArray = data[1].map(([expression]: NBTExpression[][]) => expression[0])
        return [...firstArray, data[2][0]]
      },
    },
    {
      name: 'longArray',
      symbols: [
        { literal: '[' },
        '_',
        { literal: 'L' },
        '_',
        { literal: ';' },
        'longArray$macrocall$1',
        { literal: ']' },
      ],
      postprocess: (data) => ({ dataType: 'longArray', value: data[5] }),
    },
    { name: 'string$subexpression$1', symbols: ['dqstring'] },
    { name: 'string$subexpression$1', symbols: ['sqstring'] },
    {
      name: 'string',
      symbols: ['string$subexpression$1'],
      postprocess: (data) => ({ dataType: 'string', value: data[0][0] }),
    },
    { name: 'typedNum$subexpression$1', symbols: ['typedByte'] },
    { name: 'typedNum$subexpression$1', symbols: ['typedShort'] },
    { name: 'typedNum$subexpression$1', symbols: ['typedLong'] },
    { name: 'typedNum$subexpression$1', symbols: ['typedFloat'] },
    { name: 'typedNum', symbols: ['typedNum$subexpression$1'], postprocess: (data) => data[0][0] },
    {
      name: 'typedByte$subexpression$1',
      symbols: [/[bB]/],
      postprocess(d) {
        return d.join('')
      },
    },
    {
      name: 'typedByte',
      symbols: ['int', 'typedByte$subexpression$1'],
      postprocess: (data) => ({ dataType: 'byte', value: data[0] }),
    },
    {
      name: 'typedShort$subexpression$1',
      symbols: [/[sS]/],
      postprocess(d) {
        return d.join('')
      },
    },
    {
      name: 'typedShort',
      symbols: ['int', 'typedShort$subexpression$1'],
      postprocess: (data) => ({ dataType: 'short', value: data[0] }),
    },
    {
      name: 'typedLong$subexpression$1',
      symbols: [/[lL]/],
      postprocess(d) {
        return d.join('')
      },
    },
    {
      name: 'typedLong',
      symbols: ['int', 'typedLong$subexpression$1'],
      postprocess: (data) => ({ dataType: 'long', value: data[0] }),
    },
    {
      name: 'typedFloat$subexpression$1',
      symbols: [/[dD]/],
      postprocess(d) {
        return d.join('')
      },
    },
    {
      name: 'typedFloat',
      symbols: ['decimal', 'typedFloat$subexpression$1'],
      postprocess: (data) => ({ dataType: 'double', value: data[0] }),
    },
    {
      name: 'typedFloat$subexpression$2',
      symbols: [/[fF]/],
      postprocess(d) {
        return d.join('')
      },
    },
    {
      name: 'typedFloat',
      symbols: ['decimal', 'typedFloat$subexpression$2'],
      postprocess: (data) => ({ dataType: 'float', value: data[0] }),
    },
    { name: 'number$subexpression$1', symbols: ['decimal'] },
    {
      name: 'number',
      symbols: ['number$subexpression$1'],
      postprocess: (data) => ({ dataType: 'number', value: data[0][0] }),
    },
    {
      name: 'boolean$subexpression$1$string$1',
      symbols: [{ literal: 't' }, { literal: 'r' }, { literal: 'u' }, { literal: 'e' }],
      postprocess: (d) => d.join(''),
    },
    { name: 'boolean$subexpression$1', symbols: ['boolean$subexpression$1$string$1'] },
    {
      name: 'boolean$subexpression$1$string$2',
      symbols: [{ literal: 'f' }, { literal: 'a' }, { literal: 'l' }, { literal: 's' }, { literal: 'e' }],
      postprocess: (d) => d.join(''),
    },
    { name: 'boolean$subexpression$1', symbols: ['boolean$subexpression$1$string$2'] },
    {
      name: 'boolean',
      symbols: ['boolean$subexpression$1'],
      postprocess: (data) => ({ dataType: 'boolean', value: data[0].join('') === 'true' }),
    },
  ],
  ParserStart: 'expression',
}

export default grammar
