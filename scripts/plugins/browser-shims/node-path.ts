// Shim for node:path
export function join(...parts: string[]) {
  const segments: string[] = []
  for (const part of parts) {
    segments.push(...part.split(/[/\\]/))
  }
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === '..') {
      segments.splice(i - 1, 2)
      i -= 2
    } else if (segments[i] === '.') {
      segments.splice(i, 1)
      i--
    }
  }
  return segments.join('/')
}

export function resolve(...parts: string[]) {
  return join(...parts)
}

export function dirname(p: string) {
  const parts = p.split(/[/\\]/)
  parts.pop()
  return parts.join('/') || '/'
}

export function basename(p: string, ext?: string) {
  const parts = p.split(/[/\\]/)
  let base = parts.pop() || ''
  if (ext && base.endsWith(ext)) {
    base = base.slice(0, -ext.length)
  }
  return base
}

export function extname(p: string) {
  const base = basename(p)
  const idx = base.lastIndexOf('.')
  return idx > 0 ? base.slice(idx) : ''
}

export function relative(_from: string, to: string) {
  return to // Simplified for browser
}

export function isAbsolute(p: string) {
  return p.startsWith('/')
}

export const sep = '/'
export const delimiter = ':'

export default {
  join,
  resolve,
  dirname,
  basename,
  extname,
  relative,
  isAbsolute,
  sep,
  delimiter,
}
