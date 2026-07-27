/**
 * Resolve a named export from the built sandstone package to the fully-expanded
 * TypeScript type string the editor hover would show.
 *
 * Implementation: delegates to `scripts/resolve-type-lib.ts` which packs
 * sandstone into a tarball, installs it into a fresh project under `.temp/`,
 * and asks the TS LanguageService for hover info. The tarball + install are
 * memoized across calls in the same process, so a test file with many
 * `resolveExportType` calls only pays the cost once.
 *
 * The tarball itself is cached across runs via a git fingerprint
 * (HEAD + working tree + staged diff) — see `scripts/resolve-type-lib.ts`.
 */

export {
  resolveSymbolMemoized as resolveExportType,
} from '../../scripts/resolve-type-lib.ts'