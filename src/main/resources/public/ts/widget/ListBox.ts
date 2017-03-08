console.log("Div.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { DialogBase } from "../DialogBase";
import { ListBoxRow } from "./ListBoxRow";
import { util } from "../Util";

export class ListBox extends Comp {

    selectedRow: ListBoxRow = null;

    constructor(initialRows: ListBoxRow[] = null) {
        super(null);
        this.setClass("listBox");
        this.setChildren(initialRows);

        /* For each of the ListBoxRows we need to tell them all who their parent is */
        util.forEachArrElm(initialRows, (row: ListBoxRow, idx) => {
            if (row.selected) {
                this.selectedRow = row;
            }
            row.setListBox(this);
        });
    }

    rowClickNotify = (row: ListBoxRow): void => {
        /* Unselect any previously selected row */
        if (this.selectedRow) {
            this.selectedRow.setSelectedState(false);
        }

        /* Select the row that just got clicked */
        this.selectedRow = row;
        this.selectedRow.setSelectedState(true);
    }

    render = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
