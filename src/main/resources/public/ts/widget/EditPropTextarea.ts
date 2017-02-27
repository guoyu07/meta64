console.log("EditPropTextarea.ts");

import { Comp } from "./base/Comp";
import { tag } from "../Tag";
import { Textarea } from "./Textarea";
import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";

export class EditPropTextarea extends Textarea {

    /* If this is a multivalued property the SubProp is the thing being edited, otherwise when
    this is editing a single-valued property, only the propEntry is non-null. */
    constructor(public propEntry: I.PropEntry, public subProp: I.SubProp, public attribs: Object) {
        super(attribs);

        if (subProp) {
            subProp.id = this.getId();
        }
        else {
            propEntry.id = this.getId();
        }
    }
}
