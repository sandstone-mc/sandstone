// Shim for isbinaryfile - pulls in node:fs / node:fs/promises, which don't exist in the browser.
export function isBinaryFileSync(_file: unknown, _size?: number) {
  return false
}

export async function isBinaryFile(_file: unknown, _size?: number) {
  return false
}

export default { isBinaryFile, isBinaryFileSync }
