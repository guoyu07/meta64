console.log("Header.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class MenuItem extends Comp {

    constructor(public name: string, clickFunc: Function, isEnabledFunc?: Function, isVisibleFunc?: Function) {
        super(null);
        if (!this.getId()) {
            throw "wtf no id set?";
        }
        this.setOnClick(clickFunc);
        this.setIsEnabledFunc(isEnabledFunc);
        this.setIsVisibleFunc(isVisibleFunc);
        (<any>this.attribs).selectable = "";
    }

    render = (): string => {
        return tag.menuItem(this.attribs, this.name);
    }
}
