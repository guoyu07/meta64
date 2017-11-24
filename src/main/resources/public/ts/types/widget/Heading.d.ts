import { Comp } from "./base/Comp";
export declare class Heading extends Comp {
    level: number;
    content: string;
    constructor(level: number, content: string);
    renderHtml: () => string;
}
