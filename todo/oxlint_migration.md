# Migrate from Biome to OxLint

This document tracks the migration from Biome to OxLint for linting and formatting.

## Tasks

- [ ] Install oxlint (`bun add -d oxlint`)
- [ ] Create oxlint configuration file
- [ ] Update package.json scripts to use oxlint
- [ ] Verify all existing lint rules are covered or intentionally dropped
- [ ] Remove biome dependencies and configuration
- [ ] Run oxlint on codebase and fix any new issues

## Configuration Requirements

### Type Parentheses

OxLint must be configured to **preserve parentheses in type expressions**. Do not auto-remove parentheses from types.

Example - these parentheses should be kept:
```typescript
type Example = (string | number)[]
type Callback = (fn: () => void) => void
```

## mcdoc-ts-generator Migration

The `mcdoc-ts-generator` tool also needs to be migrated to use oxlint:

- [ ] Update mcdoc-ts-generator to use oxlint for generated code formatting
- [ ] Ensure generated types maintain consistent style with oxlint rules
- [ ] Verify type parentheses are preserved in generated output

## Files to Update

- `package.json` - Update scripts and dependencies
- `biome.json` - Remove after migration
- Create `oxlint.json` or equivalent config file
- `CLAUDE.md` - Update build commands section

## Current Biome Commands

```json
{
  "lint": "biome lint src",
  "format": "biome format --write src",
  "check": "biome check --write src"
}
```

## Target OxLint Commands

```json
{
  "lint": "oxlint src",
  "format": "TBD",
  "check": "TBD"
}
```

**Note**: OxLint is primarily a linter. May need a separate formatter (e.g., dprint, prettier) or oxlint's formatting capabilities if available.
