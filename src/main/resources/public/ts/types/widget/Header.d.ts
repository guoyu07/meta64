import { Comp } from "./base/Comp";
export declare class Header extends Comp {
    text: string;
    constructor(text: string, centered?: boolean);
    renderHtml: () => string;
}
