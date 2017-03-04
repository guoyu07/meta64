console.log("Header.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class Header extends Comp {

    constructor(public text: string, centered:boolean = false) {
        super(null);
        (<any>this.attribs).class = (centered ? "horizontal center-justified layout" : "") + " dialog-header";
    }

    render = (): string => {
        return tag.div(this.attribs, this.text);
    }
}
