/**
 * Provides types matching closely the nodes of the commands tree
 */
declare type REDIRECTS = 'execute' | 'root';
export declare type NodeWithRedirect = {
    redirect: readonly [REDIRECTS] | readonly [REDIRECTS, REDIRECTS];
};
export declare type NodeWithChildren = {
    children: {
        [key: string]: CommandNode;
    };
};
export declare type NodeMaybeWithChildren = {
    children?: {
        [key: string]: CommandNode;
    };
};
export declare type RootNode = {
    type: 'root';
    children: {
        [key: string]: LiteralArgumentNode | LiteralNode;
    };
};
declare type AnyNode = (NodeMaybeWithChildren | NodeWithRedirect);
export declare type LiteralNode = {
    type: 'literal';
} & AnyNode;
declare type _Properties = {
    [key: string]: any;
} | undefined;
declare type ParserProperties = {
    parsers: readonly string[];
    executables?: readonly boolean[];
    parsersId: number;
    properties?: readonly _Properties[];
};
export declare type ArgumentNode = {
    type: 'argument';
} & ParserProperties & AnyNode;
export declare type LiteralArgumentNode = {
    type: 'literalArgument';
} & ParserProperties & AnyNode;
export declare type CommandNode = (ArgumentNode | LiteralNode | LiteralArgumentNode);
export {};
