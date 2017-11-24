import { Comp } from "./base/Comp";
export declare class Span extends Comp {
    content: string;
    constructor(content?: string, attribs?: Object, initialChildren?: Comp[]);
    renderHtml: () => string;
}
