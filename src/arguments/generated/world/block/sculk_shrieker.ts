import type { VibrationListener } from 'sandstone/generated/util/game_event'
import type { NBTInt } from 'sandstone'

export type SculkShrieker = {
    warning_level?: NBTInt
    listener?: VibrationListener
}
