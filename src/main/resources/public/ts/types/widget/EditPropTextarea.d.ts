import { Textarea } from "./Textarea";
import * as I from "../Interfaces";
export declare class EditPropTextarea extends Textarea {
    propEntry: I.PropEntry;
    subProp: I.SubProp;
    attribs: Object;
    constructor(propEntry: I.PropEntry, subProp: I.SubProp, attribs: Object);
}
