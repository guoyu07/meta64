console.log("Checkbox.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class Checkbox extends Comp {

    constructor() {
        super(null);
    }

    render = (): string => {
        return tag.checkbox(this.attribs);
    }
}
