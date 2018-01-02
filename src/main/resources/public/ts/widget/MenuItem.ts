console.log("MenuItem.ts");

import { Comp } from "./base/Comp";
import { Li } from "./Li";
import { Anchor } from "./Anchor";
import { Div } from "./Div";
import { DialogBase } from "../DialogBase";
declare var tag;
export class MenuItem extends Comp {

    constructor(public name: string, public clickFunc: Function, isEnabledFunc?: Function, isVisibleFunc?: Function, bottomSeparator?: boolean) {
        super(bottomSeparator ? { "style": "border-bottom: 3px dotted lightGray;" } : null);
        if (!this.getId()) {
            throw "no id set";
        }

        this.setIsEnabledFunc(isEnabledFunc);
        this.setIsVisibleFunc(isVisibleFunc);
        (<any>this.attribs).selectable = "";
    }

    renderHtml = (): string => {
        let menuItem = new Div(this.name, {
            "class": "list-group-item list-group-item-action",
            //"role" : "button" //<--makes mouse cursor correct (didn't work. stackoverflow was wrong)
        });

        menuItem.setOnClick(this.clickFunc);
        return menuItem.renderHtml();
    }
}
