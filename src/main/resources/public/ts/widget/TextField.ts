console.log("PasswordTextField.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { util } from "../Util";

export class TextField extends Comp {

    constructor(attribs: Object) {
        super(attribs);

        (<any>this.attribs).class = "meta64-input";
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
