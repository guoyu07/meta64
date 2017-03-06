console.log("RadioButton.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { domBind } from "../DomBind";
import { util } from "../Util";
import { DialogBase } from "../DialogBase";
import { RadioButtonGroup } from "./RadioButtonGroup";

export class RadioButton extends Comp {

    constructor(public label: string, public checked: boolean) {
        super(null);
        if (checked) {
            (<any>this.attribs).checked = "checked";
        }
        (<any>this.attribs).name = this.getId();
    }

    setChecked(checked: boolean) {
        domBind.whenElm(this.getId(), (elm) => {
            (<any>elm).checked = checked;
        });
    }

    getChecked(): boolean {
        let elm: HTMLElement = util.domElm(this.getId());
        return elm && (<any>elm).checked;
    }

    render = (): string => {
        return tag.radioButton(this.attribs, this.label);
    }
}
