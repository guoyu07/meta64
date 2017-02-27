console.log("Textarea.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class Textarea extends Comp {

    constructor(public attribs: Object) {
        super(attribs);
    }

    render(): string {
        return tag.textarea(this.attribs);
    }
}
