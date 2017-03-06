console.log("RadioButtonGroup.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";
import { util } from "../Util";
import { RadioButton } from "./RadioButton";

export class RadioButtonGroup extends Comp {

    constructor(initialButtons: RadioButton[] = null) {
        super(null);
        this.setChildren(initialButtons);

        util.forEachArrElm(initialButtons, (row: RadioButton, idx) => {
            if ((<any>row.attribs).checked == "checked") {
                (<any>this.attribs).selected = (<any>row.attribs).name;
            }
        });
    }

    render = (): string => {
        return tag.radioGroup(this.attribs, this.renderChildren());
    }
}
