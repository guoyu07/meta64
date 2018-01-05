console.log("MenuItem.ts");

import { Comp } from "./base/Comp";
import { Li } from "./Li";
import { Anchor } from "./Anchor";
import { Div } from "./Div";
import { DialogBase } from "../DialogBase";
declare var tag, domBind, $;
export class MenuItem extends Comp {

    menuItem: Div;

    constructor(public name: string, public clickFunc: Function, isEnabledFunc?: Function, isVisibleFunc?: Function, bottomSeparator?: boolean) {
        super(bottomSeparator ? { "style": "border-bottom: 3px dotted lightGray;" } : null);
        this.setIsEnabledFunc(isEnabledFunc);
        this.setIsVisibleFunc(isVisibleFunc);
        (<any>this.attribs).selectable = "";
    }

    renderHtml = (): string => {
        this.menuItem = new Div(this.name, {
            "class": "list-group-item list-group-item-action",
            //"role" : "button" //<--makes mouse cursor correct (didn't work. stackoverflow was wrong)
        });
        this.menuItem.setIsEnabledFunc(this.isEnabledFunc);
        this.menuItem.setIsVisibleFunc(this.isVisibleFunc);

        this.menuItem.setOnClick(this.clickFunc);
        return this.menuItem.renderHtml();
    }
}
