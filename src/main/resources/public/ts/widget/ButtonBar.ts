console.log("ButtonBar.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

export class ButtonBar extends Comp {

    constructor(initialButtons: Comp[] = null, justify: string = "center-justified") {
        super(null);
        (<any>this.attribs).class = "horizontal " + justify + " layout vertical-layout-row";
        this.setChildren(initialButtons);
    }

    renderHtml = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
