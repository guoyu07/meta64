console.log("Header.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class TextContent extends Comp {

    constructor(public text: string, centered: boolean = false, attribs: Object = null) {
        super(null);
        (<any>this.attribs).class = (centered ? "horizontal center-justified layout" : "");
    }

    render = (): string => {
        return tag.div(this.attribs, this.text);
    }
}
