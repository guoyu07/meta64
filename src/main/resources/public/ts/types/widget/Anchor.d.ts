import { Comp } from "./base/Comp";
export declare class Anchor extends Comp {
    url: string;
    content: string;
    constructor(url: string, content: string, _attribs?: Object);
    renderHtml: () => string;
}
