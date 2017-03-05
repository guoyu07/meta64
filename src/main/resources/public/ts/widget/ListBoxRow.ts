console.log("Div.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";
import { ListBox } from "./ListBox";
import { domBind } from "../DomBind";
import { util } from "../Util";

/* General Widget that doesn't fit any more reusable or specific category other than a plain Div, but inherits capability of Comp class */
export class ListBoxRow extends Comp {

    /* Each listbox row has a reference to its parent (containing) list box, and needs to ineract with it to coordinate selected items. */
    listBox: ListBox;

    constructor(public content: string, onclick: Function, public selected: boolean) {
        super(null);
        this.setClass("listItem");
        this.setSelectedState(selected);
        this.setOnClick(() => {
            if (this.listBox) {
                this.listBox.rowClickNotify(this);
            }
            if (typeof onclick == "function") {
                onclick();
            }
        });
    }

    setSelectedState = (selected: boolean) => {
        domBind.whenElm(this.getId(), (elm) => {
            if (selected) {
                util.addClassToElm(elm, "selectedListItem");
            }
            else {
                util.removeClassFromElm(elm, "selectedListItem");
            }
        });
    }

    setListBox(listBox: ListBox) {
        this.listBox = listBox;
    }

    render = (): string => {
        return tag.div(this.attribs, this.content);
    }
}
