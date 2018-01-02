console.log("ListBox.ts");

import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import { ListBoxRow } from "./ListBoxRow";

declare var tag, util;
export class ListBox extends Comp {
    selectedRow: ListBoxRow = null;

    constructor(attribs: Object, initialRows: ListBoxRow[] = null) {
        super(attribs);
        this.setClass("list-group");
        this.setChildren(initialRows);

        /* For each of the ListBoxRows we need to tell them all who their parent is */
        util.forEachArrElm(initialRows, (row: ListBoxRow, idx) => {
            if (row) {
                if (row.selected) {
                    this.selectedRow = row;
                }
                row.setListBox(this);
            }
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

    renderHtml = (): string => {
        return tag.div(this.attribs, this.renderChildren());
    }
}
