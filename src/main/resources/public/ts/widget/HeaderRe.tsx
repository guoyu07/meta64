/// <reference path="../types.d.ts" />

console.log("Header2.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";
import React from "react";
import ReactDOM from "react-dom";

/* HeaderRe is the React version of Header */
export class HeaderRe extends Comp {

    constructor(public text: string, public centered: boolean = false) {
        super(null, true);
    }

    reactRender = () => {
        let className = (this.centered ? "horizontal center-justified layout" : "") + " dialog-header";
        return React.createElement("div", {
            className : className
        }, this.text);
    }

    // getJsx = () : JSX.Element => {
    //     let className = (this.centered ? "horizontal center-justified layout" : "") + " dialog-header";
    //     return <span className={className}>{this.text}</span>;
    // }
}
