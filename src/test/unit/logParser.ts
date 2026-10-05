/**
 * Parses lines from a Minecraft server log reporting a single test/function failure.
 *
 * Lines look like one of:
 *
 *   [Server thread/WARN]:  (optional) default:funny failed at 8, -60, 11. On line 3: Oh no! on tick 5
 *   [Server thread/ERROR]: default:funny failed at 8, -60, 11! On line 1: Fail command invoked on tick 0
 *   [Server thread/ERROR]: default:funny failed at 8, -60, 11! On line 3: Exceeded timeout on tick 2
 *   [Server thread/ERROR]: default:not_funny failed at 14, -60, 11! Cannot invoke "..." because the return value of "..." is null
 *
 * The text after `On line N: ` is the failure message (e.g. what the user passed to `fail "..."`),
 * optionally followed by ` on tick T`. The message is preserved verbatim.
 *
 * The `On line N: ` prefix is optional — when PackTest's failure handler itself throws
 * a Java exception, the line ends with the exception text directly after the coords
 * separator. In that case `line` is `0` and the entire remainder is the message.
 */

export type ParsedFailureLog = {
  /** Log level, e.g. `WARN`, `ERROR`. */
  level: string
  /** `true` for `(optional)` / `WARN` lines (non-required test), `false` for required. */
  optional: boolean
  /** Failure source, e.g. `default:funny`. */
  source: string
  /** Failure x-coordinate. */
  x: number
  /** Failure y-coordinate. */
  y: number
  /** Failure z-coordinate. */
  z: number
  /** Line number the failure occurred on. */
  line: number
  /** Verbatim failure message (text after `On line N: `, before any ` on tick T` suffix). */
  message: string
  /** Tick the failure occurred on, if reported. */
  tick: number | null
}

const LEVEL_END = ']:'
const OPTIONAL_PREFIX = '(optional) '
const FAILED_AT = ' failed at '
const ON_LINE = ' On line '
const TICK_SUFFIX = ' on tick '

/**
 * Returns `true` iff `s` is non-empty and every code unit is `A..Z`.
 *
 * Replaces `^[A-Z]+$` so the parser is regex-free. Used to validate the
 * log-level token (e.g. `WARN`, `ERROR`) parsed out of `[thread/LEVEL]:`.
 */
const isAllUpperAlpha = (s: string): boolean => {
  if (s.length === 0) return false
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    if (c < 65 /* A */ || c > 90 /* Z */) return false
  }
  return true
}

/**
 * Read a base-10 integer from `s` starting at `start`. Returns `null`
 * if no digits are present or the integer is empty.
 */
const readInt = (s: string, start: number): { value: number; end: number } | null => {
  let i = start
  if (s.charCodeAt(i) === 45 /* - */) i++
  const digitStart = i
  while (i < s.length) {
    const c = s.charCodeAt(i)
    if (c < 48 /* 0 */ || c > 57 /* 9 */) break
    i++
  }
  if (i === digitStart) return null
  const value = Number.parseInt(s.substring(start, i), 10)
  if (!Number.isFinite(value)) return null
  return { value, end: i }
}

/**
 * Read a coordinate (signed integer or decimal) from `s` starting at
 * `start`. Accepts `-?\d+(\.\d+)?`. The `.` only triggers the
 * fractional branch if followed by a digit; otherwise the coord is
 * just the integer and the `.` belongs to a following separator.
 *
 * Distinct from `readInt` because coords in failure logs may be
 * fractional (e.g. `~8.5`) — line numbers and ticks must remain
 * strictly integer.
 */
const readCoord = (s: string, start: number): { value: number; end: number } | null => {
  let i = start
  if (s.charCodeAt(i) === 45 /* - */) i++
  const digitStart = i
  while (i < s.length) {
    const c = s.charCodeAt(i)
    if (c < 48 /* 0 */ || c > 57 /* 9 */) break
    i++
  }
  if (i === digitStart) return null
  // Lookahead: `.` counts as a fractional-point only if a digit follows.
  if (
    s.charCodeAt(i) === 46 /* . */
    && s.charCodeAt(i + 1) >= 48
    && s.charCodeAt(i + 1) <= 57
  ) {
    i++
    while (i < s.length) {
      const c = s.charCodeAt(i)
      if (c < 48 || c > 57) break
      i++
    }
  }
  const value = Number.parseFloat(s.substring(start, i))
  if (!Number.isFinite(value)) return null
  return { value, end: i }
}

export const parseFailureLog = (line: string): ParsedFailureLog | null => {
  // Skip past the first `[...]`: the timestamp is irrelevant. Find the
  // level token between the last `/` and `]:` of that header.
  const headerEnd = line.indexOf(LEVEL_END)
  if (headerEnd < 0) return null
  const slashIdx = line.lastIndexOf('/', headerEnd)
  if (slashIdx < 0) return null
  const level = line.substring(slashIdx + 1, headerEnd)
  if (!isAllUpperAlpha(level)) return null

  // After the header comes `]:`, then arbitrary ASCII whitespace, then
  // the body. MC logs inconsistently emit one or two spaces here, so
  // skip any run of spaces (and tabs, just in case).
  let cursor = headerEnd + LEVEL_END.length
  while (cursor < line.length) {
    const c = line.charCodeAt(cursor)
    if (c !== 32 /* space */ && c !== 9 /* tab */) break
    cursor++
  }

  // Optional prefix: `(optional) `.
  let optional = false
  if (line.startsWith(OPTIONAL_PREFIX, cursor)) {
    optional = true
    cursor += OPTIONAL_PREFIX.length
  }

  // Source: the token up to ` failed at `.
  const failedAtIdx = line.indexOf(FAILED_AT, cursor)
  if (failedAtIdx < 0) return null
  const source = line.substring(cursor, failedAtIdx)
  if (source.length === 0) return null
  cursor = failedAtIdx + FAILED_AT.length

  // Coords: signed int or decimal, `, `, signed int or decimal, `, `, signed int or decimal, sep, ` On line `, digits, `:`.
  const x = readCoord(line, cursor)
  if (!x) return null
  const sepX1 = line.indexOf(', ', x.end)
  if (sepX1 < 0) return null
  const y = readCoord(line, sepX1 + 2)
  if (!y) return null
  const sepX2 = line.indexOf(', ', y.end)
  if (sepX2 < 0) return null
  const z = readCoord(line, sepX2 + 2)
  if (!z) return null

  // Expect `<sep>` where sep is `!` or `.`, abutting z — no space
  // between digits and sep.
  const sepIdx = z.end
  const sepChar = line.charCodeAt(sepIdx)
  if (sepChar !== 33 /* ! */ && sepChar !== 46 /* . */) return null

  // Two message shapes follow:
  //   - Normal: `<sep> On line N: <msg>[ on tick T]`
  //   - Java exception from PackTest's failure handler:
  //     `<sep> <exception message>` — no `On line N: ` prefix. Treat
  //     the whole remainder as the message with `line = 0` so the
  //     runner still registers this as a failure.
  let lineNumber = 0
  let rest: string
  if (line.startsWith(ON_LINE, sepIdx + 1)) {
    cursor = sepIdx + 1 + ON_LINE.length
    const colonIdx = line.indexOf(': ', cursor)
    if (colonIdx < 0) return null
    const parsedLine = readInt(line, cursor)
    if (!parsedLine || parsedLine.end !== colonIdx) return null
    lineNumber = parsedLine.value
    rest = line.substring(colonIdx + 2)
  } else {
    rest = line.substring(sepIdx + 1).trimStart()
  }

  // Rest = message, optionally terminated by ` on tick N`.
  let message = rest
  let tick: number | null = null
  // Use lastIndex: the text inside a `fail "..."` may itself contain the
  // substring ` on tick `, so we anchor on the trailing occurrence.
  // If the substring appears anywhere but isn't cleanly terminated at
  // end-of-rest, the line is malformed — reject it.
  const tickIdx = rest.lastIndexOf(TICK_SUFFIX)
  if (tickIdx >= 0) {
    const tickStart = tickIdx + TICK_SUFFIX.length
    const parsedTick = readInt(rest, tickStart)
    if (parsedTick && parsedTick.end === rest.length) {
      message = rest.substring(0, tickIdx)
      tick = parsedTick.value
    } else {
      return null
    }
  }

  return {
    level,
    optional,
    source,
    x: x.value,
    y: y.value,
    z: z.value,
    line: lineNumber,
    message,
    tick,
  }
}