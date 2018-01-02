console.log("ListBoxRow.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { ListBox } from "./ListBox";

declare var tag, domBind, util;

export class ListBoxRow extends Comp {

    /* Each listbox row has a reference to its parent (containing) list box, and needs to ineract with it to coordinate selected items. */
    listBox: ListBox;

    constructor(public content: string, onclick: Function, public selected: boolean) {
        super(null);
        this.setClass("list-group-item list-group-item-action");
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

    renderHtml = (): string => {
        return tag.div(this.attribs, this.content);
    }
}
