console.log("Dialog.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class Dialog extends Comp {

    constructor(public text: string) {
        //Note: we end up seeing ugly scrollbar overlap if we have less than 50px (significantly less) on the padding-right value.
        super({
            "style": "margin:0 auto; padding-left:15px; padding-right:50px; max-width:900px; border:3px solid gray; with-backdrop:with-backdrop;",
            "sourceClass" : "Dialog"
        });
    }

    render = (): string => {
        return tag.dialog(this.attribs, this.renderChildren());
    }
}
