console.log("PropTableCell.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class PropTableCell extends Comp {

    constructor(public content: string = "", attribs : Object = {}, initialChildren: Comp[] = null) {
        super(attribs);
        this.setChildren(initialChildren);
        //(<any>this.attribs).style = "display: table-cell;";
        //(<any>this.attribs).sourceClass = "EditPropsTableCell";
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return tag.td(this.attribs, (this.content || "") + this.renderChildren());
    }
}
