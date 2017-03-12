console.log("Dialog.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class Dialog extends Comp {

    constructor(public text: string) {
        super({
            "style": "margin: 0 auto; padding: 15px; max-width: 800px;border: 3px solid gray; with-backdrop: with-backdrop;"
        });
    }

    render = (): string => {
        return tag.dialog(this.attribs, this.renderChildren());
    }
}
