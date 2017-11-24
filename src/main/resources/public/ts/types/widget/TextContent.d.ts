import { Comp } from "./base/Comp";
export declare class TextContent extends Comp {
    text: string;
    constructor(text: string, classes?: string);
    renderHtml: () => string;
}
