console.log("Header.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
declare var tag;
export class TextContent extends Comp {

    constructor(public text: string, classes: string = null) {
        super(null);

        if (classes) {
            (<any>this.attribs).class = classes;
        }
        //(<any>this.attribs).class = (centered ? "horizontal center-justified layout" : "");
    }

    renderHtml = (): string => {
        return tag.div(this.attribs, this.text);
    }
}
