console.log("RadioButtonGroup.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { RadioButton } from "./RadioButton";
declare var tag, util;
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

    renderHtml = (): string => {
        return tag.radioGroup(this.attribs, this.renderChildren());
    }
}
