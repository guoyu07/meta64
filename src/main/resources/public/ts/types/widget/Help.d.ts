import { Comp } from "./base/Comp";
export declare class Help extends Comp {
    text: string;
    constructor(text: string);
    renderHtml: () => string;
}
