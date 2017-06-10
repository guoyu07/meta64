console.log("Header.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";

export class MenuItem extends Comp {

    constructor(public name: string, public clickFunc: Function, isEnabledFunc?: Function, isVisibleFunc?: Function, bottomSeparator?: boolean) {
        super(bottomSeparator ? {"style" : "border-bottom: 3px dotted lightGray;"} : null);
        if (!this.getId()) {
            throw "no id set";
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
