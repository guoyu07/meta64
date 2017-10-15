console.log("VerticalLayout.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class VerticalDivs extends Comp {

    constructor(initialComps: Comp[] = null) {
        super(null);
        this.setChildren(initialComps);
    }

    render = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
