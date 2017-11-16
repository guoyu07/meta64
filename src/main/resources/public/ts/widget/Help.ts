console.log("Help.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class Help extends Comp {

    constructor(public text: string) {
        super(null);
    }

    renderHtml = (): string => {
        return tag.div(this.attribs, this.text);
    }
}
