console.log("EditPropsTableCell.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

declare var tag;

export class EditPropsTableCell extends Comp {

    constructor(attribs : Object = {}) {
        super(attribs);
        (<any>this.attribs).sourceClass = "EditPropsTableCell";
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
