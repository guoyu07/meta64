console.log("RadioButton.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { RadioButtonGroup } from "./RadioButtonGroup";
declare var tag, domBind, util;
export class RadioButton extends Comp {

    constructor(public label: string, public checked: boolean, groupName: string) {
        super(null); 
    
        if (checked) {
            (<any>this.attribs).checked = "checked";
            //this.setChecked(true);
        }
        (<any>this.attribs).name = groupName; 
        (<any>this.attribs).type = "radio";
        //(<any>this.attribs).class = "form-check-input";
        (<any>this.attribs).label = label;
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

    renderHtml = (): string => {
        let ret = tag.input(this.attribs);
        if (this.label) {
            ret += tag.label(this.label, { "for": this.getId() });
        }
        return ret;
        //return tag.radioButton(this.attribs, this.label);
    }
}
