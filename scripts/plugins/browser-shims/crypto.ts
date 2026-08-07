// Shim for crypto - Node's sync hashing has no browser equivalent (WebCrypto is async).
// Only used for Buffer debug labels, so the digest is stubbed.

class Hash {
  update(_value: unknown) {
    return this
  }

  digest(_encoding?: string) {
    return '<unavailable in browser>'
  }
}

export function createHash(_algorithm: string) {
  return new Hash()
}

export default { createHash }
