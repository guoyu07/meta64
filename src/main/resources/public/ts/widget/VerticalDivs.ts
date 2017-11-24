console.log("VerticalLayout.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
declare var tag;
export class VerticalDivs extends Comp {

    constructor(initialComps: Comp[] = null) {
        super(null);
        this.setChildren(initialComps);
    }

    renderHtml = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
