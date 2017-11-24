import { Comp } from "./base/Comp";
import { ListBox } from "./ListBox";
export declare class ListBoxRow extends Comp {
    content: string;
    selected: boolean;
    listBox: ListBox;
    constructor(content: string, onclick: Function, selected: boolean);
    setSelectedState: (selected: boolean) => void;
    setListBox(listBox: ListBox): void;
    renderHtml: () => string;
}
