export { absolute, relative, local, absolute as abs, relative as rel, local as loc, } from './_internals';
export declare const createObjective: (name: string, criterion: string, display?: string | number | boolean | readonly (string | number | boolean | ({
    text: string | number | boolean;
} & {
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
        name: string | import("./_internals").SelectorClass<true> | import("./_internals").SelectorClass<false>;
        objective: string;
        value?: number | undefined;
    };
} & {
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    block: string | import("./_internals").VectorClass<[string, string, string]>;
} & {
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
}) | import("./_internals/arguments").ComponentClass)[] | ({
    text: string | number | boolean;
} & {
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
        name: string | import("./_internals").SelectorClass<true> | import("./_internals").SelectorClass<false>;
        objective: string;
        value?: number | undefined;
    };
} & {
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    block: string | import("./_internals").VectorClass<[string, string, string]>;
} & {
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
    with?: import("./_internals/arguments").TextComponentObject[] | undefined;
} & {
    color?: (string & {}) | "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | "reset" | undefined;
    font?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underlined?: boolean | undefined;
    strikethrough?: boolean | undefined;
    obfuscated?: boolean | undefined;
} & {
    insertion?: string | undefined;
    clickEvent?: {
        action: import("./_internals/generalTypes").LiteralUnion<"open_url" | "open_file" | "run_command" | "suggest_command" | "change_page" | "copy_to_clipboard", string>;
        value: string;
    } | undefined;
    hoverEvent?: {
        action: "show_text";
        contents: import("./_internals/arguments").JsonTextComponent;
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
}) | import("./_internals/arguments").ComponentClass | undefined) => import("./_internals").ObjectiveClass, Selector: typeof import("./_internals").Selector;
export declare const self: import("./_internals").SelectorClass<true>;
