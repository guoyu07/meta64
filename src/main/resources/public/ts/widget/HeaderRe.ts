console.log("Header2.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import * as React from "react";
import * as ReactDOM from "react-dom";
declare var tag;
/* HeaderRe is the React version of Header */
export class HeaderRe extends Comp {

    constructor(public text: string, public centered: boolean = false) {
        super(null, true);
    }

    reactRender = () => {
        //let className = (this.centered ? "horizontal center-justified layout" : "") + " dialog-header";
        return React.createElement("div", {
            //className : className
        }, this.text);
    }
}
