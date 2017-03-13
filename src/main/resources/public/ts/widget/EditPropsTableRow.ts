console.log("EditPropsTableRow.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";

export class EditPropsTableRow extends Comp {

    propEntry: I.PropEntry;

    constructor(attribs : Object = {}) {
        super(attribs);
        (<any>this.attribs).style = "display: table-row;";
        (<any>this.attribs).sourceClass = "EditPropsTableRow";
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    render = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
