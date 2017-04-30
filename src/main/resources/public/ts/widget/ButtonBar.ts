console.log("ButtonBar.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class ButtonBar extends Comp {

    constructor(initialButtons: Comp[] = null, justify: string = "center-justified") {
        super(null);
        (<any>this.attribs).class = "horizontal " + justify + " layout vertical-layout-row";
        this.setChildren(initialButtons);
    }

    render = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
