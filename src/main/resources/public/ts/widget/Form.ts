console.log("Form.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";

export class Form extends Comp {

    constructor(attribs : Object) {
        super(attribs);
    }

    render = (): string => {
        return tag.form(this.attribs, this.renderChildren());
    }
}
