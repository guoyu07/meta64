export declare class PubSub {
    private static registry;
    private static lastFires;
    static pub: (name: string, ...args: any[]) => void;
    static sub: (name: string, fn: Function, retro?: boolean) => void;
}
