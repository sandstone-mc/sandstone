import type { JsonTextComponent, ObjectiveArgument, OPERATORS, SelectorArgument } from '@arguments';
import { DISPLAY_SLOTS } from '@arguments/displaySlots';
import { Command } from '../Command';
declare class ScoreboardObjectives extends Command {
    /** List all existing objectives with their display names and criteria. */
    list: () => void;
    /**
     * Create a new objective with the given internal objective name, specified criterion, and the optional display name.
     * All three arguments are case-sensitive.
     *
     * --------------------------------------------------
     * ⚠️ The prefered way is using:
     * ```
     * const objective = createObjective(...)
     * ```
     * --------------------------------------------------
     *
     * @param objective must be a plain text at most 16 characters.
     *
     * @param criterion must be a valid criterion type.
     *
     * @param displayName must be a JSON text component, defaulting to `objective` when unspecified.
     */
    add: (objective: ObjectiveArgument, criteria: string, displayName?: string | number | boolean | readonly (string | number | boolean | ({
        text: string | number | boolean;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        translate: string;
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        score: {
            name: string | import("../../variables").SelectorClass<true> | import("../../variables").SelectorClass<false>;
            objective: string;
            value?: number | undefined;
        };
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        selector: string;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        keybind: string;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        nbt: string;
        interpret?: boolean | undefined;
    } & {
        block: string | import("../../variables").VectorClass<[string, string, string]>;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        nbt: string;
        interpret?: boolean | undefined;
    } & {
        entity: string;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        nbt: string;
        interpret?: boolean | undefined;
    } & {
        storage: string;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | import("../../arguments").ComponentClass)[] | ({
        text: string | number | boolean;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        translate: string;
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        score: {
            name: string | import("../../variables").SelectorClass<true> | import("../../variables").SelectorClass<false>;
            objective: string;
            value?: number | undefined;
        };
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        selector: string;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        keybind: string;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        nbt: string;
        interpret?: boolean | undefined;
    } & {
        block: string | import("../../variables").VectorClass<[string, string, string]>;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        nbt: string;
        interpret?: boolean | undefined;
    } & {
        entity: string;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | ({
        nbt: string;
        interpret?: boolean | undefined;
    } & {
        storage: string;
    } & {
        with?: import("../../arguments").TextComponentObject[] | undefined;
    } & {
        color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
        font?: string | undefined;
        bold?: boolean | undefined;
        italic?: boolean | undefined; /**
         * Lists all entities which are tracked in some way by the scoreboard system.
         */
        underlined?: boolean | undefined;
        strikethrough?: boolean | undefined;
        obfuscated?: boolean | undefined;
    } & {
        insertion?: string | undefined;
        clickEvent?: {
            action: import("../../generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
            value: string;
        } | undefined;
        hoverEvent?: {
            action: "show_text";
            contents: JsonTextComponent;
        } | {
            action: "show_item";
            contents: {
                id: string;
                count?: number | undefined;
                tag?: string | undefined;
            };
        } | {
            action: "show_entity";
            contents: {
                name?: string | undefined;
                type: string;
                id: string;
            };
        } | undefined;
    }) | import("../../arguments").ComponentClass | undefined) => void;
    /**
     * Delete all references to the named objective in the scoreboard system.
     * Data is deleted from the objectives list and entity scores,
     * and if it was on a display list it is no longer displayed.
     *
     * --------------------------------------------------
     * ⚠️ The prefered way is using:
     * ```
     * const objective = createObjective(...)
     * objective.remove()
     * ```
     * --------------------------------------------------
     */
    remove: (objective: ObjectiveArgument) => void;
    /**
     * Display score info for the objective in the given slot.
     *
     * --------------------------------------------------
     * ⚠️ The prefered way is using:
     * ```
     * const objective = createObjective(...)
     * objective.setDisplay(...)
     * ```
     * --------------------------------------------------
     *
     * @param slot The slot to display the objective in.
     *
     * @param objective The objective to display. If not provided, this display slot is cleared.
     */
    setDisplay: (slot: DISPLAY_SLOTS, objective?: string | import("../../variables").ObjectiveClass | undefined) => void;
    modify: (
    /**
     * Change the display name of the scoreboard in display slots.
     *
     * --------------------------------------------------
     * ⚠️ The prefered way is using:
     * ```
     * const objective = createObjective(...)
     * objective.modify(...)
     * ```
     * --------------------------------------------------
     *
     * @param objective The objective to change.
     *
     * @param displayName The new display name. Must be a JSON text component.
     */
    ((objective: ObjectiveArgument, type: 'displayname', displayName?: JsonTextComponent) => void) & 
    /**
     * Change the display format of health bars.
     *
     * --------------------------------------------------
     * ⚠️ The prefered way is using:
     * ```
     * const objective = createObjective(...)
     * objective.modify(...)
     * ```
     * --------------------------------------------------
     *
     * @param objective The objective to change.
     *
     * @param display Whether to display the health bars as hearts or integers.
     */
    ((objective: ObjectiveArgument, type: 'rendertype', display: 'hearts' | 'integer') => void));
}
declare class ScoreboardPlayers extends Command {
    list: (
    /**
     * Lists all entities which are tracked in some way by the scoreboard system.
     */
    (() => void) & 
    /**
     * Lists the scores of a particular entity.
     *
     * --------------------------------------------------
     * ⚠️ The prefered way is using:
     * ```
     * const player = Selector(...)
     * player.listScores()
     * ```
     * --------------------------------------------------
     *
     * @param target The entity to list the scores from.
     */
    ((target: SelectorArgument<false> | number) => void));
    /**
     * Return the scoreboard value of a given objective for a given target.
     *
     * --------------------------------------------------
     * ⚠️ The prefered way is using:
     * ```
     * const objective = createObjective(...)
     * const player = objective.ScoreHolder(...)
     * player.get()
     * ```
     * --------------------------------------------------
     *
     * @param target The entity to get the score from.
     *
     * @param objective The objective to get the score from.
     */
    get: (target: SelectorArgument<false> | number, objective: ObjectiveArgument) => void;
    set: (target: SelectorArgument<false> | number, objective: ObjectiveArgument, score: number) => void;
    add: (target: SelectorArgument<false> | number, objective: ObjectiveArgument, score: number) => void;
    remove: (target: SelectorArgument<false> | number, objective: ObjectiveArgument, score: number) => void;
    reset: (target: SelectorArgument<false> | number, objective: ObjectiveArgument) => void;
    enable: (target: SelectorArgument<false> | number, objective: ObjectiveArgument) => void;
    operation: (targets: SelectorArgument<false> | number, targetObjective: ObjectiveArgument, operation: OPERATORS, source: SelectorArgument<false> | number, sourceObjective: ObjectiveArgument) => void;
}
export declare class Scoreboard extends Command {
    /** All commands related to scoreboard objectives. */
    objectives: ScoreboardObjectives;
    /** All commands related to scoreboard players. */
    players: ScoreboardPlayers;
}
export {};
