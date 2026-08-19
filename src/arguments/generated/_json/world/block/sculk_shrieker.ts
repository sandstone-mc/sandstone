import type { JsonVibrationListener } from 'sandstone/arguments/generated/_json/util/game_event.ts'
import type { NBTInt } from 'sandstone'

export type JsonSculkShrieker = {
  warning_level?: (NBTInt | number),
  listener?: JsonVibrationListener,
}
