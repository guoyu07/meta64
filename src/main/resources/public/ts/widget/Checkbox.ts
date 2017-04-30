console.log("Checkbox.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { domBind } from "../DomBind";
import { util } from "../Util";
import { DialogBase } from "../DialogBase";

export class Checkbox extends Comp {

    constructor(label: string = null, checked: boolean = false, _attribs: Object = null) {
        super(_attribs);
        (<any>this.attribs).label = label;
        if (checked) {
            (<any>this.attribs).checked = "checked";
        }
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
        return tag.checkbox(this.attribs);
    }
}
