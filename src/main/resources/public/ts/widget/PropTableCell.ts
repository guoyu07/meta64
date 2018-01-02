console.log("PropTableCell.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
declare var tag;
export class PropTableCell extends Comp {

    constructor(public content: string = "", attribs : Object = {}, initialChildren: Comp[] = null) {
        super(attribs);
        this.setChildren(initialChildren);
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return tag.td(this.attribs, (this.content || "") + this.renderChildren());
    }
}
