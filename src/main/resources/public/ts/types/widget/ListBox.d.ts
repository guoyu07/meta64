import { Comp } from "./base/Comp";
import { ListBoxRow } from "./ListBoxRow";
export declare class ListBox extends Comp {
    selectedRow: ListBoxRow;
    constructor(attribs: Object, initialRows?: ListBoxRow[]);
    rowClickNotify: (row: ListBoxRow) => void;
    renderHtml: () => string;
}
