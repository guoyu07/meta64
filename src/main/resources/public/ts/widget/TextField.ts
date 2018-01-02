console.log("TextField.ts");

import { Comp } from "./base/Comp";

declare var tag, util;

export class TextField extends Comp {

    constructor(public label: string) {
        super(null);
        util.mergeProps(this.attribs, {
            "name": this.getId(),
            "type": "text",
            "class": "form-control"
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
        let ret = "";
        if (this.label) {
            ret += tag.label(this.label, {
                for: this.getId()
            });
        }
        ret += tag.input(this.attribs);
        return ret;
    }
}
