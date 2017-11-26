console.log("Checkbox.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var tag, domBind, util;

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

    renderHtml = (): string => {
        return tag.checkbox(this.attribs);
    }
}
