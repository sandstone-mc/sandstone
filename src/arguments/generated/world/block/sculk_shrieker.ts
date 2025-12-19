import type { VibrationListener } from 'sandstone/arguments/generated/util/game_event.js'
import type { NBTInt } from 'sandstone'

export type SculkShrieker = {
    warning_level?: NBTInt
    listener?: VibrationListener
}
