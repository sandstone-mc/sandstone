import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Weather extends Command {
    /**
     * Set the weather to clear.
     *
     * @param duration Specifies the time in seconds for the clear weather to last.
     * If not specified, the duration defaults to 5 minutes.
     * If 0, resets to random weather duration.
     */
    @command(['weather', 'clear'], { isRoot: true })
    clear = (duration: number) => {}

    /**
     * Set the weather to rain (or snow in cold biomes).
     *
     * @param duration Specifies the time in seconds for the rainy weather to last.
     * If not specified, the duration defaults to 5 minutes.
     * If 0, resets to random weather duration.
     */
    @command(['weather', 'rain'], { isRoot: true })
    rain = (duration: number) => {}

    /**
     * Set the weather to a thunderstorm (or blizzard cold biomes).
     *
     * @param duration Specifies the time in seconds for the thunderstorm to last.
     * If not specified, the duration defaults to 5 minutes.
     * If 0, resets to random weather duration.
     */
    @command(['weather', 'thunder'], { isRoot: true })
    thunder = (duration: number) => {}
}
