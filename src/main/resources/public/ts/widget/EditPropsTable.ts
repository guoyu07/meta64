console.log("EditPropsTable.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class EditPropsTable extends Comp {

    constructor(public content: string = "", attribs : Object = {}) {
        super(attribs);
        (<any>this.attribs).style = "display:table; width:100%;";
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    render = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
