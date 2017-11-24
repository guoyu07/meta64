import { Comp } from "./base/Comp";
import * as I from "../Interfaces";
export declare class EditPropsTableRow extends Comp {
    propEntry: I.PropEntry;
    constructor(attribs?: Object);
    renderHtml: () => string;
}
