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
        (<any>this.attribs).class ="alert alert-info";
        (<any>this.attribs).role="alert";
    }

    renderHtml = (): string => {
        if (!this.text) return "";
        return tag.div(this.attribs, this.text);
    }
}
