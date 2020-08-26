import type { McFunction } from '@datapack/Datapack';
import { Command } from '../Command';
export declare class FunctionCommand extends Command {
    function: (((functionName: string) => void) & ((mcFunction: McFunction<[]>) => void));
}
