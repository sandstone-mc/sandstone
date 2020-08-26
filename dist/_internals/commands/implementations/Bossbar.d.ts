import { BASIC_COLORS, JsonTextComponent } from '@arguments';
import { LiteralUnion } from '@/generalTypes';
import { Command } from '../Command';
export declare class Bossbar extends Command {
    /**
     * Create a new boss bar.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     *
     * @param name The display name of the boss bar.
     */
    add: (id: string, name: JsonTextComponent) => void;
    /**
     * Return the requested setting as a result of the command.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     */
    get: (id: string, setting: 'max' | 'players' | 'value' | 'visible') => void;
    /**
     * Display a list of existing boss bars.
     */
    list: () => void;
    /**
     * Remove an existing bossbar.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     */
    remove: (id: string) => void;
    /**
     * Set the text color (if no color was specified as part of a text component) and bar color.
     * Defaults to `white` upon creation.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     *
     * @param color The new color.
     */
    setColor: (id: string, color: LiteralUnion<BASIC_COLORS>) => void;
    /**
     * Set the boss bar's maximum value.
     * Defaults to `100` upon creation.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     *
     * @param max The new maximum value.
     */
    setMax: (id: string, max: number) => void;
    /**
     * Set the boss bar's name.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     *
     * @param name The new name.
     */
    setName: (id: string, name: string) => void;
    /**
     * Change the set of players to whom the bar is visible.
     * Defaults to none upon creation.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     *
     * @param players The new players that will see the bossbar. If not specified, hide the bossbar to all players.
     */
    setPlayers: (id: string, players?: string | import("../../variables").SelectorClass<true> | import("../../variables").SelectorClass<false> | undefined) => void;
    /**
     * Set the boss bar's visual amount of segments: continuous, 6 segments, 10 segments, 12 segments, or 20 segments.
     * Defaults to `progress` upon creation.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     *
     * @param style The new style.
     */
    setStyle: (id: string, style: 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20') => void;
    /**
     * Set the boss bar's current value.
     * Defaults to `0` upon creation.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     *
     * @param value The new value.
     */
    setValue: (id: string, value: number) => void;
    /**
     * Set the boss bar's visibility.
     * Defaults to `true` upon creation.
     *
     * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
     *
     * @param visible Whether the bossbar is visible or not.
     */
    setVisible: (id: string, visible: number) => void;
}
