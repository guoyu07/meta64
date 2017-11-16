/// <reference path="../types.d.ts" />

console.log("ButtonBarRe.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import React from "react";
import ReactDOM from "react-dom";

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
