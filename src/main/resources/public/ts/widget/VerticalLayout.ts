console.log("VerticalLayout.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class VerticalLayout extends Comp {

    constructor(initialButtons: Comp[] = null, justify: string = "left-justified") {
        super(null);
        (<any>this.attribs).class = "vertical " + justify + " layout vertical-layout-row";
        this.setChildren(initialButtons);
    }

    render = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
