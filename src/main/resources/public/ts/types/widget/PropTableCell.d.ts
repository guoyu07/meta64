import { Comp } from "./base/Comp";
export declare class PropTableCell extends Comp {
    content: string;
    constructor(content?: string, attribs?: Object, initialChildren?: Comp[]);
    renderHtml: () => string;
}
