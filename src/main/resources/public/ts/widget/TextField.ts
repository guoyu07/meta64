console.log("PasswordTextField.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { util } from "../Util";

export class TextField extends Comp {

    constructor(label: string) {
        super(null);
        util.mergeProps(this.attribs, {
            "label": label,
            "name": this.getId(),
            "class": "meta64-input"
        });
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

    renderHtml = (): string => {
        return tag.input(this.attribs);
    }
}
