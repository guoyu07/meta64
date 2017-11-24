import { Comp } from "./base/Comp";
import { PropTableCell } from "./PropTableCell";
import * as I from "../Interfaces";
export declare class PropTableRow extends Comp {
    propEntry: I.PropEntry;
    constructor(attribs?: Object, initialChildren?: PropTableCell[]);
    renderHtml: () => string;
}
