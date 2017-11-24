/// <reference types="react" />
import { Comp } from "./base/Comp";
import * as React from "react";
export declare class ButtonBarRe extends Comp {
    private justify;
    constructor(initialButtons?: Comp[], justify?: string);
    reactRender: () => React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
