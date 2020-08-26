import { LiteralUnion } from '@/generalTypes';
import { ENCHANTMENTS, SelectorArgument } from '@arguments';
import { Command } from '@commands/Command';
export declare class Enchant extends Command {
    enchant: (targets: SelectorArgument<false>, enchantment: LiteralUnion<ENCHANTMENTS>, level?: number | undefined) => void;
}
