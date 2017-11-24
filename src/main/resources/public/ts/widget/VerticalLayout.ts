console.log("VerticalLayout.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
declare var tag;
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
