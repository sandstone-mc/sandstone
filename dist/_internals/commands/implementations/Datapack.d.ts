import { Command } from '@commands/Command';
declare class DatapackEnable extends Command {
    first: () => void;
    last: () => void;
    before: (name: string) => void;
    after: (name: string) => void;
}
export declare class DatapackCommand extends Command {
    disable: (name: string) => void;
    enable: (name: string) => DatapackEnable;
    list: (type: 'available' | 'enabled') => void;
}
export {};
