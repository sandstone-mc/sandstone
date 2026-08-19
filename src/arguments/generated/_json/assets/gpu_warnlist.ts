import type { JsonNBTList, NonEmptyString } from 'sandstone'

export type JsonGpuWarnlist = {
  renderer?: Array<NonEmptyString | RegExp>,
  version?: Array<NonEmptyString | RegExp>,
  vendor?: Array<NonEmptyString | RegExp>,
}
