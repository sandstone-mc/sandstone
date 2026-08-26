import type { NonEmptyString } from 'sandstone'

export type GpuWarnlist = {
  renderer?: Array<NonEmptyString | RegExp>,
  version?: Array<NonEmptyString | RegExp>,
  vendor?: Array<NonEmptyString | RegExp>,
}
