console.log("PropTable.ts");
import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

declare var tag;

export class PropTable extends Comp {

    constructor(attribs : Object = {}) {
        super(attribs);
        //(<any>this.attribs).style = "display:table; width:100%;";
        //(<any>this.attribs).sourceClass = "EditPropsTable";
    }

    /* Div element is a special case where it renders just its children if there are any, and if not it renders 'content' */
    renderHtml = (): string => {
        return tag.table(this.attribs, this.renderChildren());
    }
}
console.log("PropTable.ts ready");
