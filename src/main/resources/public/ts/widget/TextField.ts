console.log("PasswordTextField.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { util } from "../Util";

export class TextField extends Comp {

    constructor(label: string) {
        super(null);

        (<any>this.attribs).label = label;
        (<any>this.attribs).name = this.getId();
        (<any>this.attribs).class = "meta64-input";
    }

    bindEnterKey = (func: Function) => {
        util.bindEnterKey(this.getId(), func);
    }

    setValue = (val: string): void => {
        util.setInputVal(this.getId(), val || "");
    }

    getValue = (): string => {
        let elm = this.getElement();
        if (elm) {
            return (<any>elm).value.trim();
        }
        return null;
    }

    focus = (): void => {
        util.delayedFocus(this.getId());
    }

    render = (): string => {
        return tag.input(this.attribs);
    }
}
