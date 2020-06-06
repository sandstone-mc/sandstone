import { ArgumentNode, CommandNode, LiteralArgumentNode, LiteralNode, NodeWithChildren, RootNode, NodeWithRedirect } from './commandsTypes';
import { ParsersIdMap } from '../commandsTree/types';
export declare type _SandstoneRedirectNode<rootNode extends RootNode, redirect extends string> = (redirect extends 'root' ? SandstoneRootNoExecute<rootNode> : SandstoneNode<rootNode, rootNode['children'][redirect]>);
export declare type SandstoneRedirectNode<rootNode extends RootNode, cmdNode extends CommandNode & NodeWithRedirect> = _SandstoneRedirectNode<rootNode, cmdNode['redirect'][0]> & (cmdNode['redirect'] extends {
    '1': any;
} ? _SandstoneRedirectNode<rootNode, cmdNode['redirect'][1]> : {});
export declare type SandstoneObjectNode<rootNode extends RootNode, cmdNode extends CommandNode> = (cmdNode extends NodeWithChildren ? {
    [key in keyof cmdNode['children']]: SandstoneNode<rootNode, cmdNode['children'][key]>;
} : (cmdNode extends (NodeWithRedirect & LiteralArgumentNode) ? (SandstoneRedirectNode<rootNode, cmdNode>) : (cmdNode extends LiteralNode ? () => void : void)));
export declare type SandstoneFunctionNode<rootNode extends RootNode, cmdNode extends LiteralArgumentNode | ArgumentNode> = (ParsersIdMap<SandstoneObjectNode<rootNode, cmdNode>, cmdNode['parsersId']>);
export interface SandstoneNode_<rootNode extends RootNode, cmdNode extends CommandNode> {
    'root': SandstoneRootNoExecute<rootNode>;
    'argument': (cmdNode extends ArgumentNode ? SandstoneFunctionNode<rootNode, cmdNode> : never);
    'literal': (cmdNode extends LiteralNode ? SandstoneObjectNode<rootNode, cmdNode> : never);
    'literalArgument': (cmdNode extends LiteralArgumentNode ? SandstoneFunctionNode<rootNode, cmdNode> : never);
}
export declare type SandstoneNode<rootNode extends RootNode, cmdNode extends CommandNode> = SandstoneNode_<rootNode, cmdNode>[cmdNode['type']];
export declare type SandstoneRootNoExecute<rootNode extends RootNode> = {
    [key in (Exclude<keyof rootNode['children'], 'execute'>)]: SandstoneNode<rootNode, rootNode['children'][key]>;
};
export declare type SandstoneRoot<rootNode extends RootNode> = {
    [key in keyof rootNode['children']]: SandstoneNode<rootNode, rootNode['children'][key]>;
};
