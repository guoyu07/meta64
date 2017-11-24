console.log("PropTableRow.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { PropTableCell } from "./PropTableCell";
import * as I from "../Interfaces";
declare var tag;
export class PropTableRow extends Comp {

    propEntry: I.PropEntry;

    constructor(attribs: Object = {}, initialChildren: PropTableCell[] = null) {
        super(attribs);
        //(<any>this.attribs).style = "display: table-row;";
        //(<any>this.attribs).sourceClass = "EditPropsTableRow";
        this.setChildren(initialChildren);
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return tag.tr(this.attribs, this.renderChildren());
    }
}
