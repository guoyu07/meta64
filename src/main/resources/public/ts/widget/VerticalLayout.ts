console.log("VerticalLayout.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class VerticalLayout extends Comp {

    constructor(initialComps: Comp[] = null, justify: string = "left-justified") {
        super(null);
        (<any>this.attribs).class = "vertical " + justify + " layout vertical-layout-row";
        this.setChildren(initialComps);
    }

    renderHtml = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
