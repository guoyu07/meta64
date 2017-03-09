console.log("Legend.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class Legend extends Comp {

    constructor(public text: string, centered: boolean = false, attribs: Object = null) {
        super(null);
    }

    render = (): string => {
        return tag.legend(this.attribs, this.text);
    }
}
