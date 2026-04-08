// Shim for path (non-node: prefixed)
export default {
  join(...parts: string[]) {
    const segments: string[] = []
    for (const part of parts) {
      segments.push(...part.split('/'))
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
  },
}
