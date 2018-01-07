console.log("ButtonBar.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag;

export class ButtonBar extends Comp {

    constructor(initialButtons: Comp[] = null, justify: string = "center-justified") {
        super(null);
        (<any>this.attribs).class = "btn-group";
        (<any>this.attribs).role = "group"; //"horizontal " + justify + " layout vertical-layout-row";
        (<any>this.attribs).style = "margin-top: 12px";
        this.setChildren(initialButtons);
    }

    renderHtml = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
