console.log("ButtonBar.ts");

import { Comp } from "./Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class ButtonBar extends Comp {

    constructor(initialButtons: Comp[] = null) {
        super(null);
        (<any>this.attribs).class = "horizontal center-justified layout vertical-layout-row";
        if (initialButtons) {
            this.setChildren(initialButtons);
        }
    }

    render(): string {
        return tag.div(this.attribs, this.renderChildren());
    }
}
