console.log("ButtonBarRe.ts");

import { Comp } from "./base/Comp";
import * as React from "react";
import * as ReactDOM from "react-dom";

declare var tag;

/* React version of ButtonBar class */
export class ButtonBarRe extends Comp {

    constructor(initialButtons: Comp[] = null, private justify: string = "center-justified") {
        super(null, true);
        this.setChildren(initialButtons);
    }

    reactRender = () => {
        let className =  "horizontal " + this.justify + " layout vertical-layout-row";
        return React.createElement("div", {
            className
        }, this.reactRenderChildren());
    }
}
