/// <reference types="react" />
import { Comp } from "./base/Comp";
import * as React from "react";
export declare class HeaderRe extends Comp {
    text: string;
    centered: boolean;
    constructor(text: string, centered?: boolean);
    reactRender: () => React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
